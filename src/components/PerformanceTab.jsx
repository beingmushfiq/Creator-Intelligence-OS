import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  Zap, 
  AlertTriangle, 
  RefreshCw, 
  Flame, 
  Gauge, 
  ArrowUp, 
  ArrowDown, 
  Target, 
  Compass,
  ShieldCheck,
  Rocket
} from 'lucide-react';
import { useCreator } from '../context/CreatorContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { ExportButton } from './ui/ExportButton.jsx';

export default function PerformanceTab() {
  const { topic, data, setData, currentProjectId } = useCreator();
  const { addToast } = useToast();
  
  const [isGenerating, setIsGenerating] = useState(false);
  const performance = data?.performance;

  const fetchPerformanceMetadata = async () => {
    if (!topic || isGenerating) {
      addToast('info', 'Topic is required to run performance lab');
      return;
    }
    setIsGenerating(true);
    try {
      const { getPerformanceProjection } = await import('../engine/aiService.js');
      const result = await getPerformanceProjection(topic, data);
      setData(prev => ({ ...prev, performance: result }));
      addToast('success', 'Performance simulation complete');
    } catch (err) {
      addToast('error', 'Simulation failed');
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (topic && !performance) {
      fetchPerformanceMetadata();
    }
  }, [topic, performance]);

  if (!currentProjectId) {
    return (
      <div className="tab-content center-content" style={{ height: '60vh' }}>
        <div className="glass glass-hover" style={{ maxWidth: 440, padding: 48, textAlign: 'center', borderRadius: 32 }}>
          <TrendingUp size={48} color="var(--accent-primary)" style={{ marginBottom: 20, margin: '0 auto' }} />
          <h2 style={{ marginBottom: 12 }}>Initialize Project</h2>
          <p style={{ color: 'var(--text-tertiary)', marginBottom: 24 }}>
            Please select or create a project to access the Performance Intelligence Hub.
          </p>
        </div>
      </div>
    );
  }

  if (isGenerating) return (
     <div className="tab-content center-content" style={{ height: '60vh' }}>
        <div style={{ textAlign: 'center' }} className="stagger-children">
           <motion.div 
             animate={{ rotate: 360 }}
             transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
             style={{ width: 64, height: 64, margin: '0 auto 24px', borderRadius: '20px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
           >
             <Gauge size={32} color="var(--accent-primary)" />
           </motion.div>
           <h3 className="text-gradient-aurora" style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: 8 }}>Analyzing Velocity</h3>
           <p style={{ color: 'var(--text-tertiary)', fontSize: '1rem' }}>Processing historical engagement and strategic hazards...</p>
        </div>
     </div>
  );

  if (!performance) return (
    <div className="tab-content center-content" style={{ height: '60vh' }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass glass-hover" 
        style={{ maxWidth: 540, padding: 48, textAlign: 'center', borderRadius: 32 }}
      >
        <div className="glow-border" style={{ width: 80, height: 80, borderRadius: 24, background: 'var(--bg-tertiary)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <Gauge size={40} />
        </div>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: 16 }}>Performance Engine</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 32, fontSize: '1rem', lineHeight: 1.6 }}>Optimize your creative output. Measure strategy velocity, map hazardous trends, and unlock elite moves for market dominance.</p>
        <button onClick={fetchPerformanceMetadata} className="btn-primary" style={{ padding: '16px 32px', fontSize: '1rem' }}>
          <Zap size={20} /> <span>Ignite Performance Hub</span>
        </button>
      </motion.div>
    </div>
  );

  return (
    <div className="tab-content animate-slide-up">
      <div className="tab-header" style={{ marginBottom: 40 }}>
        <div className="stagger-children">
          <h2 className="tab-title text-gradient-aurora" style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.04em' }}>Performance Intelligence</h2>
          <p className="tab-subtitle" style={{ fontSize: '1.1rem' }}>Analyzing output efficiency & strategic hazards for {topic}</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <ExportButton section="performance" data={performance} />
          <button onClick={fetchPerformanceMetadata} className="btn-secondary" style={{ width: 48, height: 48, padding: 0 }}><RefreshCw size={18} /></button>
        </div>
      </div>

      <div className="stagger-children" style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        
        {/* Metric Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32 }}>
          
           {/* Velocity Meter */}
           <div className="glass" style={{ padding: 40, borderRadius: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32, alignSelf: 'flex-start' }}>
                 <div className="glow-border" style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--bg-tertiary)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Gauge size={20} />
                 </div>
                 <h3 style={{ fontSize: '1.25rem', fontWeight: 900 }}>Market Velocity</h3>
              </div>
              
              <div style={{ position: 'relative', width: 220, height: 110, marginBottom: 24 }}>
                 {/* Meter Background */}
                 <div style={{ position: 'absolute', bottom: 0, width: '100%', height: 220, borderRadius: '110px 110px 0 0', background: 'var(--bg-tertiary)', border: '1px solid var(--border-medium)', overflow: 'hidden' }}>
                    <motion.div 
                       initial={{ rotate: -90 }}
                       animate={{ rotate: (performance.velocity.current / 100) * 180 - 90 }}
                       transition={{ duration: 1.5, ease: 'backOut' }}
                       style={{ 
                          position: 'absolute', bottom: 0, width: '100%', height: '100%', 
                          background: 'var(--gradient-primary)', originY: '100%',
                          maskImage: 'radial-gradient(circle at 50% 100%, transparent 60%, black 61%)'
                       }}
                    />
                 </div>
                 {/* Value Overlay */}
                 <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: 900, lineHeight: 1, letterSpacing: '-0.05em' }} className="text-gradient">
                       {performance.velocity.current}
                    </div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>SCORE</div>
                 </div>
              </div>

              <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', padding: '0 20px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><ArrowDown size={14} color="var(--accent-danger)" /> Low</div>
                 <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><ArrowUp size={14} color="var(--accent-success)" /> High</div>
              </div>

              <p style={{ marginTop: 24, fontSize: '0.9rem', color: 'var(--text-tertiary)', lineHeight: 1.6 }}>
                 Target Velocity: <span style={{ color: 'var(--accent-primary)', fontWeight: 800 }}>{performance.velocity.target}</span>. 
                 {performance.velocity.current >= performance.velocity.target ? ' Surplus efficiency detected.' : ' Opportunity for acceleration.'}
              </p>
           </div>

           {/* Hazard Maps */}
           <div className="glass" style={{ padding: 40, borderRadius: 32 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
                 <div className="glow-border" style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--bg-tertiary)', color: 'var(--accent-danger)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <AlertTriangle size={20} />
                 </div>
                 <h3 style={{ fontSize: '1.25rem', fontWeight: 900 }}>Hazard Protocol</h3>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                 {performance.hazards.map((hazard, i) => (
                    <div key={i} className="glass glass-hover" style={{ padding: 20, borderRadius: 20, background: 'rgba(244, 63, 94, 0.03)', border: '1px solid rgba(244, 63, 94, 0.1)' }}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                          <span style={{ fontSize: '0.65rem', fontWeight: 900, color: 'var(--accent-danger)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{hazard.risk} RISK</span>
                          <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>{hazard.title}</h4>
                       </div>
                       <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>{hazard.mitigation}</p>
                    </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Elite Strategic Moves */}
        <div className="glass" style={{ padding: 56, borderRadius: 32, position: 'relative' }}>
           <div style={{ position: 'absolute', top: 40, right: 40 }}>
              <Zap size={64} style={{ color: 'var(--accent-primary)', opacity: 0.05 }} />
           </div>
           
           <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 48 }}>
              <div className="glow-border" style={{ width: 56, height: 56, borderRadius: 16, background: 'var(--bg-tertiary)', color: 'var(--accent-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <Compass size={28} />
              </div>
              <div>
                 <h3 style={{ fontSize: '1.75rem', fontWeight: 900 }}>Elite Strategic Protocol</h3>
                 <p style={{ fontSize: '0.9rem', color: 'var(--text-tertiary)' }}>Advanced tactical maneuvers for market dominance</p>
              </div>
           </div>

           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32 }}>
              {performance.strategicMoves.map((move, i) => (
                 <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="glass glass-hover"
                    style={{ padding: 32, borderRadius: 24, border: '1px solid var(--border-medium)' }}
                 >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                       <div style={{ width: 10, height: 10, borderRadius: '50%', background: i % 2 === 0 ? 'var(--accent-primary)' : 'var(--accent-secondary)', boxShadow: `0 0 10px ${i % 2 === 0 ? 'var(--accent-primary)' : 'var(--accent-secondary)'}` }} />
                       <h4 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{move.move}</h4>
                    </div>
                    <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 24 }}>{move.impact}</p>
                    <div style={{ padding: '16px 20px', background: 'var(--bg-tertiary)', borderRadius: 16, border: '1px solid var(--border-medium)' }}>
                       <span style={{ fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', color: 'var(--accent-success)', letterSpacing: '0.1em', display: 'block', marginBottom: 6 }}>Implementation</span>
                       <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>{move.impl}</span>
                    </div>
                 </motion.div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
