import React from 'react';
import { GitBranch, Calendar, TrendingUp, Crown, Layers, Sparkles, ChevronRight, Target, Activity, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCreator } from '../context/CreatorContext.jsx';
import { RegenerateButton } from './ui/RegenerateButton.jsx';
import { ExportButton } from './ui/ExportButton.jsx';

export default function SeriesTab() {
  const { data, loading, regenerateSection } = useCreator();
  const s = data?.series;

  if (!s) return <EmptyState />;

  return (
    <div className="tab-content animate-slide-up">
      <div className="tab-header" style={{ marginBottom: 40 }}>
        <div className="stagger-children">
          <h2 className="tab-title text-gradient-aurora" style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.04em' }}>Series Roadmap</h2>
          <p className="tab-subtitle" style={{ fontSize: '1.1rem' }}>Content arcs, authority positioning & multi-episode escalation strategy</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <ExportButton section="series" data={s} />
          <RegenerateButton onClick={() => regenerateSection('series')} loading={loading} />
        </div>
      </div>

      <div className="stagger-children" style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
        
        {/* Sequel Topics */}
        <section>
           <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <div className="glow-border" style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--bg-tertiary)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <GitBranch size={22} />
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 900 }}>Production Sequel Horizon</h3>
           </div>
           
           <div style={{ position: 'relative', paddingLeft: 40 }}>
              <div style={{ position: 'absolute', left: 19, top: 0, bottom: 0, width: 2, background: 'var(--gradient-primary)', opacity: 0.2 }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                 {s.sequels.map((seq, i) => (
                    <motion.div 
                       key={i} 
                       initial={{ opacity: 0, x: -20 }}
                       animate={{ opacity: 1, x: 0 }}
                       transition={{ delay: i * 0.1 }}
                       className="glass glass-hover" 
                       style={{ padding: 28, borderRadius: 24, position: 'relative' }}
                    >
                       <div style={{ position: 'absolute', left: -26, top: 32, width: 12, height: 12, borderRadius: '50%', background: 'var(--accent-primary)', boxShadow: `0 0 10px var(--accent-primary)` }} />
                       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                          <h4 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>{seq.title}</h4>
                          <div className="glass" style={{ padding: '6px 14px', borderRadius: 100, fontSize: '0.65rem', fontWeight: 950, color: 'var(--accent-secondary)', background: 'rgba(0,0,0,0.1)' }}>
                             {seq.timing.toUpperCase()}
                          </div>
                       </div>
                       <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>{seq.description}</p>
                    </motion.div>
                 ))}
              </div>
           </div>
        </section>

        {/* Brand Positioning & Roadmap */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 28, alignItems: 'start' }}>
           <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
              <div className="glass" style={{ padding: 40, borderRadius: 32 }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
                    <div className="glow-border" style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--bg-tertiary)', color: 'var(--accent-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                       <Target size={22} />
                    </div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 900 }}>Escalation Roadmap</h3>
                 </div>
                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                    {s.escalationRoadmap.map((phase, i) => (
                       <div key={i} className="glass glass-hover" style={{ padding: 24, borderRadius: 20 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                             <span style={{ fontSize: '0.65rem', fontWeight: 950, color: 'var(--text-tertiary)' }}>PHASE 0{i+1}</span>
                             <div className="glass" style={{ width: 32, height: 32, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)' }}>
                                <Activity size={16} />
                             </div>
                          </div>
                          <h4 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: 8 }}>{phase.phase}</h4>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>{phase.goal}</p>
                          <div style={{ marginTop: 16, fontSize: '0.7rem', fontWeight: 900, color: 'var(--accent-secondary)' }}>EPISODES {phase.episodes}</div>
                       </div>
                    ))}
                 </div>
              </div>

              <div className="glass" style={{ padding: 40, borderRadius: 32 }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
                    <Layers size={22} color="var(--accent-primary)" />
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 900 }}>Narrative Arc structures</h3>
                 </div>
                 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                    {s.contentArcs.map((arc, i) => (
                       <div key={i} className="glass" style={{ padding: '16px 20px', borderRadius: 16, borderLeft: '3px solid var(--accent-primary)', fontSize: '0.9rem', fontWeight: 700 }}>
                          {arc}
                       </div>
                    ))}
                 </div>
              </div>
           </div>

           <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
              <div className="glass" style={{ padding: 32, borderRadius: 28, background: 'rgba(245, 158, 11, 0.03)', border: '1px solid var(--accent-warning)20' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
                    <div className="glow-border" style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--bg-tertiary)', color: 'var(--accent-warning)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                       <Crown size={22} />
                    </div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 900 }}>Authority Core</h3>
                 </div>
                 <p style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: 600, lineHeight: 1.7, margin: 0 }}>
                    "{s.authorityPositioning}"
                 </p>
              </div>

              <div className="glass glass-hover" style={{ padding: 32, borderRadius: 28, background: 'var(--gradient-primary)', color: '#fff', border: 'none' }}>
                 <Share2 size={40} style={{ marginBottom: 16, opacity: 0.8 }} />
                 <h3 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: 12 }}>Strategy Sync</h3>
                 <p style={{ fontSize: '0.85rem', opacity: 0.9, marginBottom: 24, lineHeight: 1.6 }}>Push this roadmap to your executive dashboard for cross-team alignment.</p>
                 <button style={{ width: '100%', padding: '14px', borderRadius: 12, border: 'none', background: '#fff', color: 'var(--accent-primary)', fontWeight: 900, cursor: 'pointer' }}>
                    Finalize Roadmap
                 </button>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="tab-content center-content" style={{ minHeight: '60vh' }}>
      <div className="glass glass-hover" style={{ padding: 48, borderRadius: 32, textAlign: 'center', maxWidth: 480 }}>
        <div className="glow-border" style={{ width: 80, height: 80, borderRadius: 24, background: 'var(--bg-tertiary)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
           <GitBranch size={32} />
        </div>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: 16 }}>No Series Plan</h3>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>Generate a topic to build a content series roadmap with sequels, arcs, escalation, and authority positioning.</p>
      </div>
    </div>
  );
}
