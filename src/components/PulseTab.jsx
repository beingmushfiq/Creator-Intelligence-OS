import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, TrendingUp, TrendingDown, Minus, Zap, Target, 
  MessageCircle, AlertCircle, RefreshCw, HeartPulse, Brain,
  Sparkles, Info, Users, BarChart3, ChevronRight, Magnet,
  ArrowUpRight, ArrowDownRight, Activity as ActivityIcon
} from 'lucide-react';
import { useCreator } from '../context/CreatorContext.jsx';
import { RegenerateButton } from './ui/RegenerateButton.jsx';

export default function PulseTab() {
  const { data, loading, regenerateSection } = useCreator();
  const pulse = data?.pulse || {};

  const getDriftColor = (drift) => {
    if (drift > 0) return 'var(--accent-success)';
    if (drift < 0) return 'var(--accent-danger)';
    return 'var(--text-tertiary)';
  };

  if (!pulse || Object.keys(pulse).length === 0) return <EmptyState />;

  return (
    <div className="tab-content animate-slide-up">
      <div className="tab-header" style={{ marginBottom: 40 }}>
        <div className="stagger-children">
          <h2 className="tab-title text-gradient-aurora" style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.04em' }}>Neural Pulse</h2>
          <p className="tab-subtitle" style={{ fontSize: '1.1rem' }}>Real-time market drift diagnostics & audience resonance telemetry</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
           <button onClick={() => regenerateSection('pulse')} className="btn-secondary" disabled={loading} style={{ padding: '12px' }}>
              {loading ? <RefreshCw className="animate-spin" size={18} /> : <RefreshCw size={18} />}
           </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 28, marginBottom: 48 }}>
         
         {/* Resilience Card */}
         <div className="glass glass-hover" style={{ padding: 40, borderRadius: 32, position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div className="glow-border" style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--bg-tertiary)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     <HeartPulse size={22} className="heartbeat" />
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 900 }}>Ecosystem Health</h3>
               </div>
               <div className="glass" style={{ padding: '6px 14px', borderRadius: 100, fontSize: '0.65rem', fontWeight: 950, color: 'var(--accent-success)' }}>OPTIMAL</div>
            </div>
            
            <div style={{ fontSize: '3.5rem', fontWeight: 950, color: 'var(--text-primary)', marginBottom: 12 }}>92%</div>
            <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Retention Resilience Index</p>
         </div>

         {/* Market Alignment */}
         <div className="glass glass-hover" style={{ padding: 40, borderRadius: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 32 }}>
               <div className="glow-border" style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--bg-tertiary)', color: 'var(--accent-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Target size={22} />
               </div>
               <h3 style={{ fontSize: '1.25rem', fontWeight: 900 }}>Market Resonance</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
               <div className="glass" style={{ padding: '16px 20px', borderRadius: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>Sentiment Alignment</span>
                  <span style={{ fontWeight: 950, color: 'var(--accent-success)' }}>+14% High</span>
               </div>
               <div className="glass" style={{ padding: '16px 20px', borderRadius: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>Viral Velocity</span>
                  <span style={{ fontWeight: 950, color: 'var(--accent-primary)' }}>0.94 Pacing</span>
               </div>
            </div>
         </div>

         {/* Momentum Card */}
         <div className="glass glass-hover" style={{ padding: 40, borderRadius: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 32 }}>
               <div className="glow-border" style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--bg-tertiary)', color: 'var(--accent-warning)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ActivityIcon size={22} />
               </div>
               <h3 style={{ fontSize: '1.25rem', fontWeight: 900 }}>Growth Momentum</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
               <div style={{ height: 60, background: 'var(--bg-tertiary)', borderRadius: 12, display: 'flex', alignItems: 'flex-end', gap: 4, padding: 8 }}>
                  {[40, 60, 45, 70, 85, 65, 90, 75, 95].map((h, i) => (
                     <div key={i} style={{ flex: 1, height: `${h}%`, borderRadius: 4, background: h > 80 ? 'var(--accent-primary)' : 'var(--border-subtle)' }} />
                  ))}
               </div>
               <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', fontWeight: 900, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                  <span>Alpha Interval</span>
                  <span>Active</span>
               </div>
            </div>
         </div>

      </div>

      {/* Narrative Alerts */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
         <h3 style={{ fontSize: '1.3rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: 12 }}>
            <Zap size={22} color="var(--accent-warning)" /> Critical Alignment Alerts
         </h3>
         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
            {pulse.alerts?.map((alert, i) => (
               <motion.div key={i} whileHover={{ y: -6 }} className="glass glass-hover" style={{ padding: 28, borderRadius: 24, borderLeft: '4px solid var(--accent-warning)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                     <div className="glass" style={{ padding: '6px 12px', borderRadius: 8, fontSize: '0.65rem', fontWeight: 950, color: 'var(--accent-warning)' }}>ALERT</div>
                     <Info size={16} style={{ opacity: 0.3 }} />
                  </div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 12 }}>{alert.title}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>{alert.impact}</p>
               </motion.div>
            )) || <div className="glass" style={{ padding: 32, gridColumn: '1 / -1', textAlign: 'center', opacity: 0.5 }}>No active alerts. Operational status optimal.</div>}
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
          <HeartPulse size={40} />
        </div>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: 16 }}>Neural Pulse</h3>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>Initialize a strategic foundation to synchronize with real-time market drift and engagement pulse diagnostics.</p>
      </div>
    </div>
  );
}
