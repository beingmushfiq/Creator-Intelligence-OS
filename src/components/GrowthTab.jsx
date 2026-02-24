import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, Users, RefreshCw, Layers, MessageCircle, 
  Sparkles, Target, Zap, ArrowRight, ShieldCheck, 
  CheckCircle2, AlertCircle, XCircle, Info, Rocket, 
  Share2, MousePointer2, Heart, Repeat
} from 'lucide-react';
import { useCreator } from '../context/CreatorContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { RegenerateButton } from './ui/RegenerateButton.jsx';
import { ExportButton } from './ui/ExportButton.jsx';

export default function GrowthTab() {
  const { data, loading, regenerateSection, topic, setData } = useCreator();
  const { addToast } = useToast();
  const growth = data?.growth;
  const [isGenerating, setIsGenerating] = useState(false);

  const fetchGrowthMetadata = async () => {
    if (!topic || isGenerating) return;
    setIsGenerating(true);
    try {
      const { generateGrowthStrategy } = await import('../engine/aiService.js');
      const result = await generateGrowthStrategy(topic, data?.niche || 'Digital Creator', data?.genome?.dna_snippet);
      setData(prev => ({
        ...prev,
        growth: result
      }));
      addToast('success', 'Growth Flywheel mapping complete!');
    } catch (err) {
      addToast('error', 'Failed to generate growth strategy.');
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (topic && !growth && !loading) {
      fetchGrowthMetadata();
    }
  }, [topic, growth, loading]);

  if (isGenerating) return (
     <div className="tab-content center-content">
        <div style={{ textAlign: 'center' }}>
           <RefreshCw size={48} className="spin" color="var(--accent-primary)" style={{ marginBottom: 24 }} />
           <h3 className="text-gradient" style={{ fontSize: '1.5rem', fontWeight: 800 }}>Engaging Flywheels</h3>
           <p style={{ color: 'var(--text-tertiary)' }}>Calculating retention loops and audience virality loops...</p>
        </div>
     </div>
  );

  if (!growth) return (
    <div className="tab-content center-content">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="empty-state" 
        style={{ maxWidth: 600 }}
      >
        <div className="empty-state-icon" style={{ background: 'var(--accent-success)15', color: 'var(--accent-success)' }}>
          <TrendingUp size={32} />
        </div>
        <h3>Growth Architect</h3>
        <p>Go beyond the algorithm. Design a self-sustaining community flywheel and retention loops that turn casual viewers into loyal advocates.</p>
        <button onClick={fetchGrowthMetadata} className="shiny-button" style={{ marginTop: 24, padding: '16px 32px' }}>
          <Rocket size={18} /> Initialize Growth Hub
        </button>
      </motion.div>
    </div>
  );

  return (
    <div className="tab-content">
      <div className="tab-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20 }}>
        <div>
          <h2 className="tab-title text-gradient">Growth Architecture</h2>
          <p className="tab-subtitle">Mapping the community flywheel & audience loops for {topic}</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <ExportButton section="growth" data={growth} />
          <button onClick={fetchGrowthMetadata} className="btn-secondary" style={{ padding: '8px 16px' }}><RefreshCw size={18} /></button>
        </div>
      </div>

      <div className="stagger-children" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        
        {/* Flywheel Circle */}
        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="card card-full" 
           style={{ padding: 40, background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%)', position: 'relative', overflow: 'hidden' }}
        >
           <div style={{ position: 'absolute', top: -40, right: -40, opacity: 0.03 }}>
              <RefreshCw size={300} strokeWidth={1} />
           </div>

           <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
                 <div style={{ padding: 10, borderRadius: 12, background: 'var(--accent-primary)15', color: 'var(--accent-primary)' }}>
                    <RefreshCw size={24} className="spin-slow" />
                 </div>
                 <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 900 }}>Community Flywheel</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>Self-sustaining audience retention cycle</p>
                 </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 24, flexWrap: 'wrap', padding: '20px 0' }}>
                 {growth.flywheel.phases.map((phase, i) => (
                    <React.Fragment key={i}>
                       <motion.div 
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: i * 0.1 }}
                          whileHover={{ y: -5, borderColor: 'var(--accent-primary)40' }}
                          style={{ 
                             padding: '24px 32px', background: 'var(--bg-primary)', borderRadius: 20, 
                             border: '1px solid var(--border-subtle)', boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                             textAlign: 'center', minWidth: 160, position: 'relative'
                          }}
                       >
                          <div style={{ fontSize: '0.65rem', fontWeight: 900, color: 'var(--text-tertiary)', marginBottom: 8, textTransform: 'uppercase' }}>PHASE {i+1}</div>
                          <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>{phase}</div>
                       </motion.div>
                       {i < growth.flywheel.phases.length - 1 && (
                          <motion.div animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                             <ArrowRight size={24} color="var(--accent-primary)" opacity={0.6} />
                          </motion.div>
                       )}
                    </React.Fragment>
                 ))}
                 <div style={{ width: '100%', marginTop: 32, textAlign: 'center' }}>
                    <div className="badge badge-purple" style={{ padding: '8px 20px', fontSize: '0.9rem', fontWeight: 800 }}>Core Engine: {growth.flywheel.core}</div>
                 </div>
              </div>
           </div>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 24 }}>
           {/* Engagement Loops */}
           <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="card" 
              style={{ padding: 32 }}
           >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                 <div style={{ padding: 8, borderRadius: 10, background: 'var(--bg-tertiary)', color: 'var(--accent-secondary)' }}>
                    <MessageCircle size={20} />
                 </div>
                 <h3 style={{ fontSize: '1.2rem', fontWeight: 900 }}>Engagement Loops</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                 {growth.engagementLoops.map((loop, i) => (
                    <div key={i} style={{ padding: 20, background: 'var(--bg-secondary)', borderRadius: 16, borderLeft: '4px solid var(--accent-primary)' }}>
                       <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                          <h4 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{loop.name}</h4>
                          <span className="badge badge-primary" style={{ fontSize: '0.6rem' }}>LOOP TYPE</span>
                       </div>
                       <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: 12 }}>{loop.mechanic}</p>
                       <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-secondary)' }}>
                          <Target size={14} /> Loop Goal: {loop.goal}
                       </div>
                    </div>
                 ))}
              </div>
           </motion.div>

           {/* Ecosystem Pillars */}
           <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="card" 
              style={{ padding: 32 }}
           >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                 <div style={{ padding: 8, borderRadius: 10, background: 'var(--bg-tertiary)', color: 'var(--accent-info)' }}>
                    <Layers size={20} />
                 </div>
                 <h3 style={{ fontSize: '1.2rem', fontWeight: 900 }}>Ecosystem Pillars</h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
                 {growth.ecosystem.map((eco, i) => (
                    <div key={i} style={{ padding: 16, background: 'var(--bg-tertiary)50', borderRadius: 16, border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                       <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--accent-info)', margin: '0 auto 12px', boxShadow: '0 0 10px var(--accent-info)40' }} />
                       <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: 8 }}>{eco.pillar}</h4>
                       <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', margin: 0 }}>{eco.connection}</p>
                    </div>
                 ))}
              </div>
           </motion.div>
        </div>

        {/* Style Guide */}
        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="card card-full" 
           style={{ padding: 32 }}
        >
           <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <div style={{ padding: 10, borderRadius: 12, background: 'var(--accent-success)05', color: 'var(--accent-success)' }}>
                 <ShieldCheck size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 900 }}>Community Voice Lab</h3>
           </div>
           
           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 40 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                 <label style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>Engagement DNA</label>
                 <p style={{ fontSize: '1.1rem', color: 'var(--text-primary)', fontWeight: 600, lineHeight: 1.6, padding: 24, background: 'var(--bg-secondary)', borderRadius: 20, border: '1px solid var(--border-subtle)' }}>
                    {growth.styleGuide.voice}
                 </p>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                 <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, color: 'var(--accent-success)', opacity: 0.8 }}>
                       <CheckCircle2 size={18} />
                       <span style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase' }}>Active Approval</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                       {growth.styleGuide.do.map((item, i) => (
                          <div key={i} style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', padding: '12px 16px', background: 'var(--bg-tertiary)', borderRadius: 12, border: '1px solid var(--accent-success)20' }}>{item}</div>
                       ))}
                    </div>
                 </div>
                 <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, color: 'var(--accent-danger)', opacity: 0.8 }}>
                       <XCircle size={18} />
                       <span style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase' }}>Strict Avoidance</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                       {growth.styleGuide.dont.map((item, i) => (
                          <div key={i} style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', padding: '12px 16px', background: 'var(--bg-tertiary)', borderRadius: 12, border: '1px solid var(--accent-danger)20' }}>{item}</div>
                       ))}
                    </div>
                 </div>
              </div>
           </div>
        </motion.div>
      </div>
    </div>
  );
}
