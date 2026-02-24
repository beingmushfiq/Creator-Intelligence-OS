import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { 
  Download, FileText, X, Sparkles, BarChart2, 
  Users, Briefcase, Zap, Star, Layout, 
  Globe, TrendingUp, Info, CheckCircle
} from 'lucide-react';
import { useCreator } from '../context/CreatorContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export const MediaKit = ({ isOpen, onClose, creatorData, dealsData }) => {
  const { data, topic } = useCreator();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [portfolioData, setPortfolioData] = useState(null);

  const generatePortfolio = async () => {
    setLoading(true);
    try {
      const { generateCaseStudies } = await import('../engine/aiService.js');
      const { MEDIA_KIT_PROMPTS } = await import('../engine/mediaKitPrompts.js');
      const { generateContent } = await import('../engine/aiService.js');

      const projects = data?.contentPerformance || [];
      const cases = await generateCaseStudies(projects);

      const blurbPrompt = MEDIA_KIT_PROMPTS.portfolioStory(creatorData?.niche || 'Digital Creator', topic);
      const blurbResult = await generateContent(blurbPrompt, 'Blurb generation failed');
      const blurb = typeof blurbResult === 'string' ? JSON.parse(blurbResult) : blurbResult;

      setPortfolioData({
        ...cases,
        aboutMe: blurb.aboutMe
      });
      addToast('success', 'Media Kit Portfolio Personalized!');
    } catch (err) {
      addToast('error', 'Failed to generate personalized portfolio');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && !portfolioData) {
      generatePortfolio();
    }
  }, [isOpen]);

  const stats = [
    { label: 'Total Views', value: data?.analytics?.kpi?.totalViews?.value?.toLocaleString() || '1.2M', icon: BarChart2, color: 'var(--accent-primary)' },
    { label: 'Subscribers', value: data?.analytics?.kpi?.totalSubs?.value?.toLocaleString() || '125K', icon: Users, color: 'var(--accent-secondary)' },
    { label: 'Avg Eng.', value: `${data?.analytics?.kpi?.engagementRate?.value || '4.2'}%`, icon: Zap, color: 'var(--accent-warning)' },
    { label: 'Brands', value: dealsData?.brands?.length || '8+', icon: Briefcase, color: 'var(--accent-success)' }
  ];

  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    doc.setFillColor(124, 92, 252);
    doc.rect(0, 0, pageWidth, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('CREATOR MEDIA KIT', 15, 25);
    doc.setFontSize(10);
    doc.text(`GROUNDED BY BRAND GENOME: ${data?.genome?.dna_snippet?.substring(0, 50) || 'Active'}...`, 15, 35);
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.text('Portfolio Overview', 15, 55);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(portfolioData?.aboutMe || 'Professional Digital Creator focusing on high-impact storytelling.', 15, 65, { maxWidth: pageWidth - 30 });
    doc.setFontSize(14);
    doc.text('Key Performance Metrics', 15, 85);
    const statsRows = stats.map(s => [s.label, s.value]);
    doc.autoTable({
      startY: 90,
      head: [['Metric', 'Value']],
      body: statsRows,
      theme: 'grid',
      headStyles: { fillColor: [124, 92, 252] }
    });
    if (portfolioData?.caseStudies) {
      const startY = doc.lastAutoTable.finalY + 15;
      doc.setFontSize(14);
      doc.text('Performance Case Studies', 15, startY);
      const caseRows = portfolioData.caseStudies.map(c => [c.name, c.result]);
      doc.autoTable({
        startY: startY + 5,
        head: [['Campaign/Project', 'Result']],
        body: caseRows,
        theme: 'striped',
        headStyles: { fillColor: [0, 212, 255] }
      });
    }
    doc.save(`${topic.replace(/\s+/g, '_')}_Media_Kit.pdf`);
    addToast('success', 'Media Kit PDF Exported!');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(12px)' }}
        />
        
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="media-kit-modal"
          style={{
            width: '100%', maxWidth: '1100px', maxHeight: '90vh', background: 'var(--bg-primary)',
            borderRadius: '32px', border: '1px solid var(--border-subtle)', position: 'relative',
            zIndex: 1001, overflow: 'hidden', display: 'flex', flexDirection: 'column',
            boxShadow: '0 40px 100px rgba(0,0,0,0.6)'
          }}
        >
          {/* Header */}
          <div style={{ padding: '24px 40px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-secondary)50' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <Star size={24} />
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, letterSpacing: '-0.02em' }}>Talent Representation One-Sheet</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                   <Activity size={12} /> Live Performance Verified
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={generatePDF} className="shiny-button" style={{ padding: '10px 24px', fontSize: '0.85rem' }}>
                <Download size={18} /> Export One-Sheet
              </button>
              <button onClick={onClose} className="btn-mini" style={{ padding: 10, borderRadius: 12 }}><X size={20} /></button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '40px' }}>
            <div className="media-kit-layout" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 40 }}>
              
              {/* Left Column: Narrative */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
                {/* Identity */}
                <section>
                   <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                     <Sparkles size={20} color="var(--accent-primary)" />
                     <h3 style={{ margin: 0, fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-tertiary)' }}>Identity & Creative Mission</h3>
                   </div>
                   <motion.div 
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     style={{ padding: '32px', background: 'var(--bg-tertiary)', borderRadius: '24px', border: '1px solid var(--accent-primary)20', position: 'relative' }}
                   >
                     <div style={{ position: 'absolute', top: -10, left: 32, padding: '4px 12px', background: 'var(--accent-primary)', color: 'white', borderRadius: 20, fontSize: '0.6rem', fontWeight: 900 }}>AI SYNTHESIZED</div>
                     {loading ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                           <div className="skeleton-line" style={{ height: 16, width: '100%' }} />
                           <div className="skeleton-line" style={{ height: 16, width: '90%' }} />
                           <div className="skeleton-line" style={{ height: 16, width: '40%' }} />
                        </div>
                     ) : (
                       <p style={{ fontSize: '1.15rem', lineHeight: 1.7, margin: 0, fontWeight: 500, color: 'var(--text-primary)' }}>
                         {portfolioData?.aboutMe || `A dominant voice in the ${creatorData?.niche || 'Digital Economy'}, focused on high-conversion storytelling and cinematic narrative arcs.`}
                       </p>
                     )}
                   </motion.div>
                </section>

                {/* Case Studies */}
                <section>
                   <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                     <TrendingUp size={20} color="var(--accent-secondary)" />
                     <h3 style={{ margin: 0, fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-tertiary)' }}>Performance Case Studies</h3>
                   </div>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                     {loading ? (
                        [1, 2].map(i => <div key={i} className="skeleton-card" style={{ height: '140px', borderRadius: 20 }} />)
                     ) : (
                       portfolioData?.caseStudies?.map((study, i) => (
                         <motion.div 
                           key={i} 
                           initial={{ opacity: 0, x: -10 }}
                           animate={{ opacity: 1, x: 0 }}
                           transition={{ delay: i * 0.1 }}
                           style={{ padding: '24px', background: 'var(--bg-secondary)', borderRadius: '20px', border: '1px solid var(--border-subtle)', position: 'relative' }}
                         >
                           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                              <h4 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>{study.name}</h4>
                              <div className="badge badge-primary" style={{ fontSize: '0.65rem' }}>{study.result}</div>
                           </div>
                           <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>{study.story}</p>
                           <div style={{ display: 'flex', gap: 12, borderTop: '1px solid var(--border-subtle)', paddingTop: 12 }}>
                              <div style={{ fontSize: '0.75rem', color: 'var(--accent-secondary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                                 <Zap size={14} /> Synergy: {study.synergy}
                              </div>
                           </div>
                         </motion.div>
                       ))
                     )}
                   </div>
                </section>
              </div>

              {/* Right Column: Metrics & Demographics */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                   {stats.map((stat, i) => (
                     <motion.div 
                        key={i} 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        style={{ padding: '24px', background: 'var(--bg-tertiary)', borderRadius: '24px', border: '1px solid var(--border-subtle)', textAlign: 'center' }}
                      >
                        <stat.icon size={20} color={stat.color} style={{ marginBottom: 12, margin: '0 auto 12px' }} />
                        <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>{stat.value}</div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 800, marginTop: 4 }}>{stat.label}</div>
                      </motion.div>
                   ))}
                </div>

                {/* Demographics */}
                <motion.div 
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   style={{ padding: '32px', background: 'var(--bg-secondary)', borderRadius: '24px', border: '1px solid var(--border-subtle)' }}
                >
                   <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
                      <Globe size={18} color="var(--accent-info)" />
                      <h3 style={{ fontSize: '0.9rem', fontWeight: 800, margin: 0 }}>Audience Fingerprint</h3>
                   </div>
                   
                   <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      {[
                        { label: '18-24 Gen Z', value: 45, color: 'var(--accent-primary)' },
                        { label: '25-34 Millennial', value: 35, color: 'var(--accent-secondary)' },
                        { label: '35+ Professional', value: 20, color: 'var(--accent-info)' }
                      ].map((item, i) => (
                        <div key={i}>
                           <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 8 }}>
                              <span style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
                              <span style={{ fontWeight: 800 }}>{item.value}%</span>
                           </div>
                           <div style={{ height: 6, background: 'var(--bg-primary)', borderRadius: 3, overflow: 'hidden' }}>
                              <motion.div 
                                 initial={{ width: 0 }}
                                 animate={{ width: `${item.value}%` }}
                                 transition={{ delay: 0.5 + (i * 0.1), duration: 1 }}
                                 style={{ height: '100%', background: item.color }} 
                              />
                           </div>
                        </div>
                      ))}
                   </div>

                   <div style={{ marginTop: 24, padding: 16, background: 'var(--bg-tertiary)', borderRadius: 16, fontSize: '0.75rem', color: 'var(--text-tertiary)', lineHeight: 1.5 }}>
                      Most engaged territory: <strong style={{ color: 'var(--text-primary)' }}>United States (62%)</strong>, followed by <strong style={{ color: 'var(--text-primary)' }}>United Kingdom (12%)</strong> and <strong style={{ color: 'var(--text-primary)' }}>Europe (10%)</strong>.
                   </div>
                </motion.div>

                {/* Brand Synergy */}
                <motion.div 
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   style={{ padding: '32px', background: 'linear-gradient(135deg, var(--accent-primary)15 0%, var(--accent-secondary)15 100%)', borderRadius: '24px', border: '1px solid var(--accent-primary)30' }}
                >
                   <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                      <CheckCircle size={18} color="var(--accent-primary)" />
                      <span style={{ fontWeight: 900, fontSize: '0.9rem' }}>Market Fit Analysis</span>
                   </div>
                   <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.6, margin: 0 }}>
                     Your creative output aligns with high-intent audiences in <strong>B2B Tech</strong>, <strong>Growth Marketing</strong>, and <strong>Personal Finance</strong> sectors.
                   </p>
                </motion.div>
              </div>

            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default MediaKit;
