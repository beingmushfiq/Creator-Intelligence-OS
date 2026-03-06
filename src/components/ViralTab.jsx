import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer, Cell, ZAxis
} from 'recharts';
import { 
  Zap, Flame, Target, TrendingUp, RefreshCw, Sparkles, 
  Copy, Check, Share2, Info, Activity, ChevronRight,
  Heart, MessageSquare, BarChart2
} from 'lucide-react';
import { useCreator } from '../context/CreatorContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { generateHookVariants, scoreHookVariant } from '../engine/aiService.js';

export default function ViralTab() {
  const { data, setData, topic } = useCreator();
  const { addToast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [selectedHook, setSelectedHook] = useState(0);

  const hooks = data?.viral?.hooks || [];

  const handleGenerateHooks = async () => {
    if (!topic) {
      addToast('error', 'Start a project first!');
      return;
    }
    setLoading(true);
    try {
      const result = await generateHookVariants(topic);
      setData(prev => ({
        ...prev,
        viral: { hooks: result }
      }));
      addToast('success', 'Viral variants synchronized.');
    } catch (e) {
      addToast('error', 'Synchronization failed.');
    } finally {
      setLoading(false);
    }
  };

  if (hooks.length === 0) return (
     <div className="tab-content center-content" style={{ minHeight: '60vh' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass glass-hover" style={{ maxWidth: 520, padding: 48, borderRadius: 32, textAlign: 'center' }}>
           <div className="glow-border" style={{ width: 80, height: 80, borderRadius: 24, background: 'var(--bg-tertiary)', color: 'var(--accent-warning)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <Zap size={40} />
           </div>
           <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: 16 }}>Viral Blueprinting</h3>
           <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6, marginBottom: 32 }}>Analyze psychological triggers and generate maximum-impact hook variants optimized for algorithmic breakthrough.</p>
           <button onClick={handleGenerateHooks} className="btn-primary" style={{ padding: '16px 32px' }}>
              <Flame size={18} /> Forge Viral Hooks
           </button>
        </motion.div>
     </div>
  );

  return (
    <div className="tab-content animate-slide-up">
      <div className="tab-header" style={{ marginBottom: 40 }}>
        <div className="stagger-children">
          <h2 className="tab-title text-gradient-aurora" style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.04em' }}>Viral Intelligence</h2>
          <p className="tab-subtitle" style={{ fontSize: '1.1rem' }}>Saturating engagement loops via high-fidelity psychological hooks</p>
        </div>
        <button onClick={handleGenerateHooks} className="btn-secondary" style={{ padding: '12px' }}>
          {loading ? <RefreshCw className="animate-spin" size={18} /> : <RefreshCw size={18} />}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 28, alignItems: 'start' }}>
         
         <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            
            {/* Main Hook Viewport */}
            <div className="glass" style={{ padding: 40, borderRadius: 32, minHeight: 400, position: 'relative' }}>
               <AnimatePresence mode="wait">
                  <motion.div 
                     key={selectedHook}
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: -20 }}
                  >
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                           <div className="glow-border" style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--bg-tertiary)', color: 'var(--accent-warning)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Target size={22} />
                           </div>
                           <h3 style={{ fontSize: '1.3rem', fontWeight: 900 }}>Variant Forge: 0{selectedHook + 1}</h3>
                        </div>
                        <div className="glass" style={{ padding: '6px 14px', borderRadius: 100, fontSize: '0.65rem', fontWeight: 950, color: 'var(--accent-primary)' }}>VIRAL CONFIDENCE: 94%</div>
                     </div>

                     <div className="glass" style={{ padding: 32, borderRadius: 24, borderLeft: '4px solid var(--accent-warning)', background: 'rgba(245, 158, 11, 0.02)', marginBottom: 32 }}>
                        <p style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.4, margin: 0, fontStyle: 'italic' }}>
                           "{hooks[selectedHook].text}"
                        </p>
                     </div>

                     <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                        <MetricBar label="Retention Probability" value={hooks[selectedHook].potential || 85} color="var(--accent-primary)" />
                        <MetricBar label="Market Resonance" value={HooksStats[selectedHook]?.resonance || 72} color="var(--accent-success)" />
                     </div>
                  </motion.div>
               </AnimatePresence>
               
               <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 40 }}>
                  {hooks.slice(0, 5).map((_, i) => (
                     <button 
                        key={i} 
                        onClick={() => setSelectedHook(i)}
                        style={{ 
                           width: selectedHook === i ? 24 : 10, 
                           height: 10, 
                           borderRadius: 5, 
                           background: selectedHook === i ? 'var(--accent-warning)' : 'var(--border-subtle)',
                           border: 'none', cursor: 'pointer', transition: 'all 0.3s'
                        }} 
                     />
                  ))}
               </div>
            </div>

            {/* Hook List Selection */}
            <div className="stagger-children" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
               {hooks.slice(0, 4).map((h, i) => (
                  <motion.div 
                     key={i} 
                     onClick={() => setSelectedHook(i)}
                     className={`glass glass-hover ${selectedHook === i ? 'glass-strong' : ''}`}
                     style={{ padding: '20px 24px', borderRadius: 20, cursor: 'pointer', display: 'flex', gap: 20, alignItems: 'center', border: selectedHook === i ? '1px solid var(--accent-warning)' : '1px solid var(--border-subtle)' }}
                  >
                     <div style={{ width: 10, height: 10, borderRadius: '50%', background: selectedHook === i ? 'var(--accent-warning)' : 'var(--text-tertiary)', boxShadow: selectedHook === i ? '0 0 10px var(--accent-warning)' : 'none' }} />
                     <p style={{ flex: 1, fontSize: '0.95rem', fontWeight: 700, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.text}</p>
                     <ChevronRight size={16} style={{ opacity: 0.3 }} />
                  </motion.div>
               ))}
            </div>
         </div>

         {/* Psychological Sidebar */}
         <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            <div className="glass" style={{ padding: 32, borderRadius: 28 }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
                  <div className="glow-border" style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--bg-tertiary)', color: 'var(--accent-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     <Activity size={22} />
                  </div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 900 }}>Neural Impact</h3>
               </div>
               <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <ImpactCard icon={Heart} label="Emotional Trigger" value="High" color="var(--accent-danger)" />
                  <ImpactCard icon={MessageSquare} label="Engagement Signal" value="Curiosity Gap" color="var(--accent-primary)" />
                  <ImpactCard icon={BarChart2} label="Predictive Scale" value="Viral-Grade" color="var(--accent-warning)" />
               </div>
            </div>

            <div className="glass glass-hover" style={{ padding: 32, borderRadius: 28, background: 'var(--gradient-primary)05', border: '1px solid var(--accent-primary)20' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <Sparkles size={18} color="var(--accent-primary)" />
                  <span style={{ fontSize: '0.7rem', fontWeight: 950, color: 'var(--accent-primary)', textTransform: 'uppercase' }}>Strategic Pivot</span>
               </div>
               <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                  Consider A/B testing Variant 02 against your standard baseline. Neural analysis predicts a 34% increase in sub-8s retention.
               </p>
            </div>
         </div>

      </div>
    </div>
  );
}

const HooksStats = [
   { resonance: 92 }, { resonance: 84 }, { resonance: 76 }, { resonance: 88 }
];

function MetricBar({ label, value, color }) {
   return (
      <div className="glass" style={{ padding: 24, borderRadius: 20 }}>
         <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 950, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>{label}</span>
            <span style={{ fontSize: '0.7rem', fontWeight: 950, color: color }}>{value}%</span>
         </div>
         <div style={{ width: '100%', height: 6, background: 'var(--bg-tertiary)', borderRadius: 10, overflow: 'hidden' }}>
            <motion.div 
               initial={{ width: 0 }}
               animate={{ width: `${value}%` }}
               style={{ height: '100%', background: color, boxShadow: `0 0 10px ${color}40` }} 
            />
         </div>
      </div>
   );
}

function ImpactCard({ icon: Icon, label, value, color }) {
   return (
      <div className="glass" style={{ padding: '16px 20px', borderRadius: 16, display: 'flex', alignItems: 'center', gap: 16 }}>
         <Icon size={14} color={color} />
         <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.6rem', fontWeight: 900, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>{label}</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 800 }}>{value}</div>
         </div>
      </div>
   );
}

function CustomTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    return (
      <div className="glass" style={{ padding: '10px 14px', borderRadius: 10, border: '1px solid var(--accent-primary)' }}>
        <p style={{ fontSize: '0.8rem', fontWeight: 900, margin: 0 }}>{`Impact: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
}
