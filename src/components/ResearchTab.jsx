import React from 'react';
import { 
  Search, Users, Brain, Radio, Sparkles, Target, Activity, 
  ChevronRight, ArrowRight, Activity as ActivityIcon, Compass,
  Layers, Zap, Globe, MessageSquare
} from 'lucide-react';
import { useCreator } from '../context/CreatorContext.jsx';
import { RegenerateButton } from './ui/RegenerateButton.jsx';
import { ExportButton } from './ui/ExportButton.jsx';
import { motion } from 'framer-motion';

export default function ResearchTab() {
  const { data, loading, regenerateSection, topic } = useCreator();
  const r = data?.research;

  if (!r) return <EmptyState />;

  return (
    <div className="tab-content animate-slide-up">
      <div className="tab-header" style={{ marginBottom: 40 }}>
        <div className="stagger-children">
          <h2 className="tab-title text-gradient-aurora" style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.04em' }}>Narrative Intelligence</h2>
          <p className="tab-subtitle" style={{ fontSize: '1.1rem' }}>Psychometric mapping & predictive market drift analysis</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <ExportButton section="research" data={r} />
          <RegenerateButton onClick={() => regenerateSection('research')} loading={loading} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: 28, marginBottom: 48 }}>
        
        {/* Core Narrative Hero */}
        <motion.div whileHover={{ y: -6 }} className="glass glass-hover" style={{ padding: 60, borderRadius: 40, border: '1px solid var(--accent-primary)30', position: 'relative', overflow: 'hidden' }}>
           <div style={{ position: 'absolute', right: -40, top: -40, opacity: 0.1, transform: 'rotate(15deg)' }}>
              <Brain size={320} color="var(--accent-primary)" />
           </div>
           
           <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 32 }}>
                 <div className="glow-border" style={{ width: 44, height: 44, background: 'var(--bg-tertiary)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)' }}>
                    <Target size={24} />
                 </div>
                 <span style={{ fontSize: '0.85rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--text-tertiary)' }}>Primary Narrative Arc</span>
              </div>
              <h3 style={{ fontSize: '3rem', fontWeight: 950, marginBottom: 24, lineHeight: 1.1, letterSpacing: '-0.04em', color: 'var(--text-primary)' }}>{r.narrativeTitle || topic}</h3>
              <p style={{ fontSize: '1.4rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0, maxWidth: 840, fontWeight: 500 }}>{r.coreNarrative}</p>
              
              <div style={{ display: 'flex', gap: 16, marginTop: 40 }}>
                 <div className="glass" style={{ padding: '8px 20px', borderRadius: 100, fontSize: '0.8rem', fontWeight: 900, color: 'var(--accent-success)', background: 'rgba(34, 197, 94, 0.05)' }}>RESONANCE: 94%</div>
                 <div className="glass" style={{ padding: '8px 20px', borderRadius: 100, fontSize: '0.8rem', fontWeight: 900, color: 'var(--accent-primary)', background: 'rgba(124, 92, 252, 0.05)' }}>VELOCITY: HIGH</div>
              </div>
           </div>
        </motion.div>

        {/* Sidebar Diagnostics */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
           <div className="glass" style={{ padding: 40, borderRadius: 32 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
                 <Compass size={22} color="var(--accent-secondary)" />
                 <h3 style={{ fontSize: '1.2rem', fontWeight: 900 }}>Market Signals</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                 {r.marketDrift?.map((d, i) => (
                    <div key={i} className="glass glass-hover" style={{ padding: 20, borderRadius: 16, borderLeft: '3px solid var(--accent-primary)' }}>
                       <div style={{ fontSize: '0.65rem', fontWeight: 950, color: 'var(--accent-primary)', marginBottom: 6 }}>SIGNAL 0{i+1}</div>
                       <div style={{ fontSize: '0.95rem', fontWeight: 800 }}>{d.signal}</div>
                    </div>
                 ))}
              </div>
           </div>

           <div className="glass glass-hover" style={{ padding: 32, borderRadius: 28, background: 'var(--gradient-primary)05', border: '1px solid var(--accent-primary)20', marginTop: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                 <Sparkles size={18} color="var(--accent-primary)" />
                 <span style={{ fontSize: '0.7rem', fontWeight: 950, color: 'var(--accent-primary)', textTransform: 'uppercase' }}>Research Tip</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                 Current psychometric mapping suggests a high curiosity gap resonance for your primary narrative title. Optimal for sub-15s retention loops.
              </p>
           </div>
        </div>
      </div>

      {/* Psychographic Segments */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
         <h3 style={{ fontSize: '1.4rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: 12 }}>
            <Users size={24} color="var(--accent-secondary)" /> Targeted Psychographics
         </h3>
         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 28 }}>
            {r.psychographics?.map((p, i) => (
               <motion.div key={i} whileHover={{ y: -8 }} className="glass glass-hover" style={{ padding: 40, borderRadius: 32 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                     <div className="glass" style={{ padding: '6px 14px', borderRadius: 8, fontSize: '0.65rem', fontWeight: 950, color: 'var(--accent-secondary)' }}>SEGMENT 0{i+1}</div>
                     <ActivityIcon size={18} style={{ opacity: 0.2 }} />
                  </div>
                  <h4 style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: 12 }}>{p.segment}</h4>
                  <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>{p.description}</p>
                  
                  <div style={{ marginTop: 28, paddingTop: 28, borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <HeartPulse size={14} color="var(--accent-success)" />
                        <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>Resonance Lock: {p.resonance}%</span>
                     </div>
                     <ChevronRight size={18} style={{ opacity: 0.3 }} />
                  </div>
               </motion.div>
            ))}
         </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="tab-content center-content" style={{ minHeight: '60vh' }}>
      <div className="glass glass-hover" style={{ maxWidth: 480, padding: 48, borderRadius: 32, textAlign: 'center' }}>
        <div className="glow-border" style={{ width: 80, height: 80, borderRadius: 24, background: 'var(--bg-tertiary)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <Search size={40} />
        </div>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: 16 }}>Narrative Research</h3>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>Initialize your topic node above to unlock high-fidelity psychometric mapping and market trajectory diagnostics.</p>
      </div>
    </div>
  );
}
