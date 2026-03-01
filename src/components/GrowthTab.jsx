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
     <div className="tab-content center-content" style={{ height: '60vh' }}>
        <div style={{ textAlign: 'center' }} className="stagger-children">
           <motion.div 
             animate={{ rotate: 360 }}
             transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
             style={{ width: 64, height: 64, margin: '0 auto 24px', borderRadius: '20px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
           >
             <RefreshCw size={32} color="var(--accent-primary)" />
           </motion.div>
           <h3 className="text-gradient-aurora" style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: 8 }}>Engaging Flywheels</h3>
           <p style={{ color: 'var(--text-tertiary)', fontSize: '1rem' }}>Calculating retention loops and audience virality DNA...</p>
        </div>
     </div>
  );

  if (!growth) return (
    <div className="tab-content center-content" style={{ height: '60vh' }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass glass-hover" 
        style={{ maxWidth: 540, padding: 48, textAlign: 'center', borderRadius: 32 }}
      >
        <div className="glow-border" style={{ width: 80, height: 80, borderRadius: 24, background: 'var(--bg-tertiary)', color: 'var(--accent-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <TrendingUp size={40} />
        </div>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: 16 }}>Growth Architect</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 32, fontSize: '1rem', lineHeight: 1.6 }}>Go beyond the algorithm. Design a self-sustaining community flywheel and retention loops that turn casual viewers into loyal advocates.</p>
        <button onClick={fetchGrowthMetadata} className="btn-primary" style={{ padding: '16px 32px', fontSize: '1rem' }}>
          <Rocket size={20} /> <span>Initialize Growth Hub</span>
        </button>
      </motion.div>
    </div>
  );

  return (
    <div className="tab-content animate-slide-up">
      <div className="tab-header" style={{ marginBottom: 40 }}>
        <div className="stagger-children">
          <h2 className="tab-title text-gradient-aurora" style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.04em' }}>Growth Architecture</h2>
          <p className="tab-subtitle" style={{ fontSize: '1.1rem' }}>Mapping the community flywheel & audience loops for {topic}</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <ExportButton section="growth" data={growth} />
          <button onClick={fetchGrowthMetadata} className="btn-secondary" style={{ width: 48, height: 48, padding: 0 }}><RefreshCw size={18} /></button>
        </div>
      </div>

      <div className="stagger-children" style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        
        {/* Flywheel Visualization */}
        <div className="glass" style={{ padding: '64px 40px', borderRadius: 32, position: 'relative', overflow: 'hidden' }}>
           <div style={{ position: 'absolute', top: -100, right: -100, opacity: 0.05, color: 'var(--accent-primary)' }}>
              <RefreshCw size={400} strokeWidth={1} />
           </div>

           <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 48 }}>
                 <div className="glow-border" style={{ width: 56, height: 56, borderRadius: 16, background: 'var(--bg-tertiary)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <RefreshCw size={28} className="animate-spin" style={{ animationDuration: '10s' }} />
                 </div>
                 <div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 900 }}>Community Flywheel</h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-tertiary)' }}>Self-sustaining audience retention cycle</p>
                 </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
                 {growth.flywheel.phases.map((phase, i) => (
                    <React.Fragment key={i}>
                       <motion.div 
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: i * 0.1 }}
                          className="glass glass-hover"
                          style={{ 
                             padding: '24px 32px', borderRadius: 24, 
                             textAlign: 'center', minWidth: 200, border: '1px solid var(--border-medium)'
                          }}
                       >
                          <div style={{ fontSize: '0.65rem', fontWeight: 900, color: 'var(--accent-primary)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.1em' }}>PHASE {i+1}</div>
                          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>{phase}</div>
                       </motion.div>
                       {i < growth.flywheel.phases.length - 1 && (
                          <motion.div animate={{ x: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}>
                             <ArrowRight size={24} color="var(--accent-primary)" style={{ opacity: 0.5 }} />
                          </motion.div>
                       )}
                    </React.Fragment>
                 ))}
                 <div style={{ width: '100%', marginTop: 40, textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', padding: '12px 28px', background: 'var(--gradient-aurora)', borderRadius: 100, fontSize: '1rem', fontWeight: 900, color: '#fff', boxShadow: 'var(--shadow-glow)' }}>
                      Core Engine: {growth.flywheel.core}
                    </div>
                 </div>
              </div>
           </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 32 }}>
           {/* Engagement Loops */}
           <div className="glass" style={{ padding: 40, borderRadius: 32 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
                 <div className="glow-border" style={{ width: 48, height: 48, borderRadius: 14, background: 'var(--bg-tertiary)', color: 'var(--accent-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <MessageCircle size={24} />
                 </div>
                 <h3 style={{ fontSize: '1.5rem', fontWeight: 900 }}>Engagement Loops</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                 {growth.engagementLoops.map((loop, i) => (
                    <div key={i} className="glass glass-hover" style={{ padding: 24, borderRadius: 20, borderLeft: '4px solid var(--accent-primary)' }}>
                       <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                          <h4 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{loop.name}</h4>
                          <span style={{ fontSize: '0.6rem', fontWeight: 900, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Loop Mechanism</span>
                       </div>
                       <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.6 }}>{loop.mechanic}</p>
                       <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-secondary)' }}>
                          <Target size={16} /> Loop Goal: {loop.goal}
                       </div>
                    </div>
                 ))}
              </div>
           </div>

           {/* Ecosystem Pillars */}
           <div className="glass" style={{ padding: 40, borderRadius: 32 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
                 <div className="glow-border" style={{ width: 48, height: 48, borderRadius: 14, background: 'var(--bg-tertiary)', color: 'var(--accent-info)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Layers size={24} />
                 </div>
                 <h3 style={{ fontSize: '1.5rem', fontWeight: 900 }}>Ecosystem Pillars</h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 20 }}>
                 {growth.ecosystem.map((eco, i) => (
                    <div key={i} className="glass glass-hover" style={{ padding: 20, borderRadius: 20, textAlign: 'center' }}>
                       <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--accent-info)', margin: '0 auto 16px', boxShadow: '0 0 15px var(--accent-info)' }} />
                       <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 8 }}>{eco.pillar}</h4>
                       <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', margin: 0 }}>{eco.connection}</p>
                    </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Voice Lab */}
        <div className="glass" style={{ padding: 40, borderRadius: 32 }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
              <div className="glow-border" style={{ width: 56, height: 56, borderRadius: 16, background: 'var(--bg-tertiary)', color: 'var(--accent-success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <ShieldCheck size={28} />
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 900 }}>Community Voice Lab</h3>
           </div>
           
           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 48 }}>
              <div className="stagger-children">
                 <label style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', color: 'var(--accent-primary)', letterSpacing: '0.1em', display: 'block', marginBottom: 12 }}>Engagement DNA</label>
                 <div style={{ fontSize: '1.2rem', color: 'var(--text-primary)', fontWeight: 600, lineHeight: 1.6, padding: 32, background: 'var(--bg-tertiary)', borderRadius: 24, border: '1px solid var(--border-medium)', boxShadow: 'var(--shadow-inner)' }}>
                    “{growth.styleGuide.voice}”
                 </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
                 <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, color: 'var(--accent-success)' }}>
                       <CheckCircle2 size={20} />
                       <span style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Active Approval</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                       {growth.styleGuide.do.map((item, i) => (
                          <div key={i} style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', padding: '14px 20px', background: 'rgba(45, 212, 191, 0.05)', borderRadius: 16, border: '1px solid rgba(45, 212, 191, 0.15)' }}>{item}</div>
                       ))}
                    </div>
                 </div>
                 <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, color: 'var(--accent-danger)' }}>
                       <XCircle size={20} />
                       <span style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Strict Avoidance</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                       {growth.styleGuide.dont.map((item, i) => (
                          <div key={i} style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', padding: '14px 20px', background: 'rgba(244, 63, 94, 0.05)', borderRadius: 16, border: '1px solid rgba(244, 63, 94, 0.15)' }}>{item}</div>
                       ))}
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
