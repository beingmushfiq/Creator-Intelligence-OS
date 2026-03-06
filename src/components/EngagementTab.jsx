import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, Wand2, Copy, Check, 
  MessageCircle, AlertCircle, Smile, Shield, Zap,
  Activity, BarChart3, TrendingUp, RefreshCw,
  Sparkles, ChevronRight, Share2, CornerDownRight,
  ShieldCheck, Brain
} from 'lucide-react';
import { useCreator } from '../context/CreatorContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

const STRATEGIES = [
  { id: 'Empathetic', label: 'Empathetic', icon: Smile, color: 'var(--accent-success)' },
  { id: 'Provocative', label: 'Provocative', icon: Zap, color: 'var(--accent-warning)' },
  { id: 'Professional', label: 'Professional', icon: Shield, color: 'var(--accent-secondary)' },
  { id: 'Debunking', label: 'Debunking', icon: AlertCircle, color: 'var(--accent-danger)' }
];

export default function EngagementTab() {
  const { data, regenerateSection, loading } = useCreator();
  const { addToast } = useToast();
  const [activeStrategy, setActiveStrategy] = useState('Empathetic');

  const engagement = data?.engagement || {};

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    addToast('success', 'Response blueprint captured.');
  };

  if (!engagement || Object.keys(engagement).length === 0) return <EmptyState />;

  return (
    <div className="tab-content animate-slide-up">
      <div className="tab-header" style={{ marginBottom: 40 }}>
        <div className="stagger-children">
          <h2 className="tab-title text-gradient-aurora" style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.04em' }}>Engagement Logic</h2>
          <p className="tab-subtitle" style={{ fontSize: '1.1rem' }}>Saturating interaction loops via high-fidelity response architectures</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
           <button onClick={() => regenerateSection('engagement')} className="btn-secondary" disabled={loading} style={{ padding: '12px' }}>
              {loading ? <RefreshCw className="animate-spin" size={18} /> : <RefreshCw size={18} />}
           </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 28 }}>
         
         <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            
            {/* Strategy Selection */}
            <div className="glass" style={{ padding: '8px', borderRadius: 16, display: 'flex', gap: 8 }}>
               {STRATEGIES.map(s => (
                  <button 
                     key={s.id}
                     onClick={() => setActiveStrategy(s.id)}
                     className={`glass glass-hover ${activeStrategy === s.id ? 'glass-strong' : ''}`}
                     style={{ 
                        flex: 1, padding: '12px', borderRadius: 12, border: activeStrategy === s.id ? `1px solid ${s.color}` : '1px solid transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, cursor: 'pointer',
                        color: activeStrategy === s.id ? s.color : 'var(--text-tertiary)',
                        fontWeight: 850, fontSize: '0.85rem', background: 'transparent'
                     }}
                  >
                     <s.icon size={16} />
                     <span>{s.label}</span>
                  </button>
               ))}
            </div>

            {/* Response Blueprints */}
            <div className="stagger-children" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
               {engagement.responses?.[activeStrategy]?.map((res, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass glass-hover" style={{ padding: 32, borderRadius: 28 }}>
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                           <div className="glass" style={{ width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: STRATEGIES.find(s=>s.id === activeStrategy)?.color }}>
                              <MessageSquare size={16} />
                           </div>
                           <span style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Blueprint 0{i + 1}</span>
                        </div>
                        <button onClick={() => copyToClipboard(res)} className="glass-hover" style={{ background: 'transparent', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', padding: 8, borderRadius: 8 }}><Copy size={16} /></button>
                     </div>
                     <p style={{ fontSize: '1.2rem', color: 'var(--text-primary)', fontWeight: 700, lineHeight: 1.5, margin: 0, fontStyle: 'italic' }}>
                        "{res}"
                     </p>
                  </motion.div>
               )) || <div className="glass" style={{ padding: 48, textAlign: 'center', color: 'var(--text-tertiary)', fontWeight: 800 }}>Strategy node uninitialized.</div>}
            </div>
         </div>

         {/* Interaction Sidebar */}
         <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            <div className="glass" style={{ padding: 32, borderRadius: 28 }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
                  <div className="glow-border" style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--bg-tertiary)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     <Activity size={22} />
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 900 }}>Interaction Telemetry</h3>
               </div>
               <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div className="glass" style={{ padding: '16px 20px', borderRadius: 16, display: 'flex', justifyContent: 'space-between' }}>
                     <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-tertiary)' }}>Viral Saturation</span>
                     <span style={{ fontWeight: 900, color: 'var(--accent-primary)' }}>84%</span>
                  </div>
                  <div className="glass" style={{ padding: '16px 20px', borderRadius: 16, display: 'flex', justifyContent: 'space-between' }}>
                     <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-tertiary)' }}>Response Depth</span>
                     <span style={{ fontWeight: 900, color: 'var(--accent-success)' }}>High</span>
                  </div>
                  <div className="glass" style={{ padding: '16px 20px', borderRadius: 16, display: 'flex', justifyContent: 'space-between' }}>
                     <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-tertiary)' }}>Conversion Lift</span>
                     <span style={{ fontWeight: 900, color: 'var(--accent-warning)' }}>+12%</span>
                  </div>
               </div>
            </div>

            <div className="glass glass-hover" style={{ padding: 32, borderRadius: 28, background: 'var(--gradient-primary)05', border: '1px solid var(--accent-primary)20' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <Brain size={18} color="var(--accent-primary)" />
                  <span style={{ fontSize: '0.7rem', fontWeight: 950, color: 'var(--accent-primary)', textTransform: 'uppercase' }}>Vibe Check</span>
               </div>
               <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                  High resonance detected for "Self-Deprecating Humor" within the "Viral Variants" module. Recommend applying to active response blueprints.
               </p>
            </div>
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
          <MessageCircle size={40} />
        </div>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: 16 }}>Engagement Logic</h3>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>Generate interaction protocols and high-fidelity response architectures focus on recursive audience retention.</p>
      </div>
    </div>
  );
}
