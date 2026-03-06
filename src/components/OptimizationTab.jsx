import React from 'react';
import { 
  Settings, AlertTriangle, Clock, Scale, TrendingUp, Image,
  ChevronRight, RefreshCw, Sparkles, CheckCircle2, Info,
  Zap, Target, HeartPulse, Activity
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useCreator } from '../context/CreatorContext.jsx';
import { RegenerateButton } from './ui/RegenerateButton.jsx';
import { ExportButton } from './ui/ExportButton.jsx';

export default function OptimizationTab() {
  const { data, loading, regenerateSection } = useCreator();
  const opt = data?.optimization;

  if (!opt) return <EmptyState />;

  return (
    <div className="tab-content animate-slide-up">
      <div className="tab-header" style={{ marginBottom: 40 }}>
        <div className="stagger-children">
          <h2 className="tab-title text-gradient-aurora" style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.04em' }}>Self-Critique</h2>
          <p className="tab-subtitle" style={{ fontSize: '1.1rem' }}>Automated quality analysis & algorithmic performance refinements</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <ExportButton section="optimization" data={opt} />
          <RegenerateButton onClick={() => regenerateSection('optimization')} loading={loading} />
        </div>
      </div>

      <div className="stagger-children" style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
        
        {/* Weak Tension Zones */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
             <div className="glow-border" style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--bg-tertiary)', color: 'var(--accent-warning)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Zap size={22} />
             </div>
             <h3 style={{ fontSize: '1.3rem', fontWeight: 900 }}>Weak Tension Zones</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 20 }}>
            {opt.weakTensionZones.map((zone, i) => (
              <motion.div key={i} whileHover={{ y: -4 }} className="glass glass-hover" style={{ padding: 28, borderRadius: 24, borderLeft: '4px solid var(--accent-warning)' }}>
                <div style={{ fontSize: '0.65rem', fontWeight: 950, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: 10 }}>Section: {zone.section}</div>
                <p style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>{zone.issue}</p>
                <div className="glass" style={{ padding: 16, borderRadius: 12, background: 'rgba(34, 197, 94, 0.05)', display: 'flex', gap: 10 }}>
                  <Sparkles size={16} color="var(--accent-success)" style={{ flexShrink: 0, marginTop: 2 }} />
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0 }}>{zone.suggestion}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Pacing Risks */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
             <div className="glow-border" style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--bg-tertiary)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={22} />
             </div>
             <h3 style={{ fontSize: '1.3rem', fontWeight: 900 }}>Pacing Diagnostics</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 20 }}>
            {opt.pacingRisks.map((risk, i) => (
              <motion.div key={i} whileHover={{ y: -4 }} className="glass glass-hover" style={{ padding: 24, borderRadius: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800 }}>{risk.section}</h4>
                  <div className="glass" style={{ padding: '4px 12px', borderRadius: 100, fontSize: '0.65rem', fontWeight: 950, color: risk.risk === 'High' ? 'var(--accent-danger)' : 'var(--accent-warning)', background: 'rgba(0,0,0,0.1)' }}>
                    {risk.risk.toUpperCase()} RISK
                  </div>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>{risk.detail}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTR & Thumbnails */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>
           <div className="glass" style={{ padding: 40, borderRadius: 32 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
                 <TrendingUp size={22} color="var(--accent-success)" />
                 <h3 style={{ fontSize: '1.2rem', fontWeight: 900 }}>CTR Optimization</h3>
              </div>
              <ul style={{ padding: 0, margin: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 16 }}>
                 {opt.ctrImprovements.map((item, i) => (
                    <li key={i} style={{ display: 'flex', gap: 12 }}>
                       <div style={{ padding: 4, borderRadius: 10, background: 'rgba(34,197,94,0.1)', color: 'var(--accent-success)', flexShrink: 0 }}>
                          <CheckCircle2 size={14} />
                       </div>
                       <span style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{item}</span>
                    </li>
                 ))}
              </ul>
           </div>

           <div className="glass" style={{ padding: 40, borderRadius: 32 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
                 <Image size={22} color="var(--accent-secondary)" />
                 <h3 style={{ fontSize: '1.2rem', fontWeight: 900 }}>Visual Interest Refinement</h3>
              </div>
              <ul style={{ padding: 0, margin: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 16 }}>
                 {opt.thumbnailRefinements.map((item, i) => (
                    <li key={i} style={{ display: 'flex', gap: 12 }}>
                       <div style={{ padding: 4, borderRadius: 10, background: 'rgba(0,212,255,0.1)', color: 'var(--accent-secondary)', flexShrink: 0 }}>
                          <Target size={14} />
                       </div>
                       <span style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{item}</span>
                    </li>
                 ))}
              </ul>
           </div>
        </div>

        {/* Legal Flags */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
             <div className="glow-border" style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--bg-tertiary)', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Scale size={22} />
             </div>
             <h3 style={{ fontSize: '1.3rem', fontWeight: 900 }}>Legal Integrity Audit</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {opt.legalFlags.map((flag, i) => (
              <div key={i} className="glass" style={{ padding: 24, borderRadius: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                   <div style={{ padding: 8, borderRadius: 10, background: 'var(--bg-tertiary)', color: 'var(--text-tertiary)' }}>
                      <AlertTriangle size={18} />
                   </div>
                   <div>
                      <h4 style={{ fontSize: '1rem', fontWeight: 800, margin: 0 }}>{flag.concern}</h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>{flag.detail}</p>
                   </div>
                </div>
                <div className="glass" style={{ padding: '6px 16px', borderRadius: 100, fontSize: '0.65rem', fontWeight: 950, color: 'var(--text-tertiary)' }}>
                   {flag.severity.toUpperCase()}
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="tab-content center-content" style={{ minHeight: '60vh' }}>
      <div className="glass glass-hover" style={{ padding: 48, borderRadius: 32, textAlign: 'center', maxWidth: 480 }}>
        <div className="glow-border" style={{ width: 80, height: 80, borderRadius: 24, background: 'var(--bg-tertiary)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
           <Settings size={32} />
        </div>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: 16 }}>No Optimization Data</h3>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>Generate a topic to receive automated self-critique — identifying weak zones, pacing risks, and improvement suggestions.</p>
      </div>
    </div>
  );
}
