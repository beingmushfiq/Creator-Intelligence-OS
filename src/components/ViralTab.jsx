import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer, Cell, ScatterChart, Scatter, ZAxis
} from 'recharts';
import { 
  Zap, Flame, MousePointer2, TrendingUp, Sparkles, 
  Wand2, Target, Shield, AlertCircle, RefreshCw, 
  ChevronRight, Brain, Timer, History, Save, Trash2,
  Trophy, Activity, Percent, ArrowUpRight, Magnet, Info
} from 'lucide-react';
import { useCreator } from '../context/CreatorContext';
import { useToast } from '../context/ToastContext';
import { generateHookVariants, scoreHookVariant } from '../engine/aiService';

export default function ViralTab() {
  const { data, setData, topic } = useCreator();
  const { addToast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(0);
  
  const hooks = data?.viralLab?.variants || [];
  const dnaSnippet = data?.genome?.dna_snippet;

  const handleGenerateHooks = async () => {
    if (!topic) {
      addToast('error', 'Start a project first!');
      return;
    }

    setIsLoading(true);
    try {
      const scriptText = data?.script?.scenes ? JSON.stringify(data.script.scenes) : '';
      const result = await generateHookVariants(topic, scriptText, dnaSnippet);
      
      setData(prev => ({
        ...prev,
        viralLab: {
          ...prev.viralLab,
          variants: result.variants
        }
      }));
      addToast('success', '5 high-tension hooks generated!');
    } catch (err) {
      addToast('error', 'Generation failed. Check AI Service.');
    } finally {
      setIsLoading(false);
    }
  };

  const heatmapData = useMemo(() => {
    return hooks.map(h => ({
      x: h.clickAbility,
      y: h.retentionTension,
      z: h.predictedViralScore,
      name: h.type,
      text: h.hookText
    }));
  }, [hooks]);

  if (isLoading) return (
     <div className="tab-content center-content">
        <div style={{ textAlign: 'center' }}>
           <RefreshCw size={48} className="spin" color="var(--accent-primary)" style={{ marginBottom: 24 }} />
           <h3 className="text-gradient" style={{ fontSize: '1.5rem', fontWeight: 800 }}>Engineering Virality</h3>
           <p style={{ color: 'var(--text-tertiary)' }}>Simulating retention tension and psychological hooks...</p>
        </div>
     </div>
  );

  if (hooks.length === 0) {
    return (
      <div className="tab-content center-content">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="empty-state" 
          style={{ maxWidth: 600 }}
        >
          <div className="empty-state-icon" style={{ background: 'var(--accent-warning)15', color: 'var(--accent-warning)' }}>
            <Zap size={32} />
          </div>
          <h3>The Viral Laboratory</h3>
          <p>The first 5 seconds determine your content's fate. Generate psychologically engineered hook variants optimized for algorithmic breakout.</p>
          <button onClick={handleGenerateHooks} className="shiny-button" style={{ marginTop: 24, padding: '16px 32px' }}>
            <Sparkles size={18} /> Initialize Viral Mapping
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="tab-content">
      <div className="tab-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20 }}>
        <div>
          <h2 className="tab-title text-gradient">Viral Architecture</h2>
          <p className="tab-subtitle">Psychological tension mapping & predictive performance scoring</p>
        </div>
        <button onClick={handleGenerateHooks} className="btn-secondary" style={{ padding: '8px 16px' }}>
          <RefreshCw size={18} /> Regenerate Lab
        </button>
      </div>

      <div className="stagger-children" style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 24, alignItems: 'start' }}>
        
        {/* Specimen Console */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
           <motion.div 
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             className="card" 
             style={{ padding: 0, overflow: 'hidden' }}
           >
              <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', gap: 12 }}>
                 <Brain size={18} color="var(--accent-primary)" />
                 <h3 style={{ fontSize: '1rem', fontWeight: 900 }}>Hook Specimen Analysis</h3>
              </div>
              <div>
                 {hooks.map((h, i) => (
                    <motion.div 
                      key={i}
                      onClick={() => setSelectedVariant(i)}
                      whileHover={{ background: 'var(--bg-tertiary)' }}
                      style={{ 
                        padding: 24, borderBottom: i < hooks.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                        cursor: 'pointer', transition: 'all 0.2s',
                        background: selectedVariant === i ? 'var(--bg-tertiary)' : 'transparent',
                        position: 'relative', borderLeft: selectedVariant === i ? '4px solid var(--accent-primary)' : '4px solid transparent'
                      }}
                    >
                       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                          <div className="badge badge-purple" style={{ fontSize: '0.65rem', fontWeight: 900 }}>{h.type.toUpperCase()} HOOK</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                             <TrendingUp size={12} color="var(--accent-success)" />
                             <span style={{ fontSize: '0.85rem', fontWeight: 900, color: 'var(--accent-success)' }}>{h.predictedViralScore}% ROI</span>
                          </div>
                       </div>
                       <p style={{ fontSize: '1.1rem', color: 'var(--text-primary)', fontWeight: 700, lineHeight: 1.5, margin: 0 }}>
                          "{h.hookText}"
                       </p>
                       <AnimatePresence>
                          {selectedVariant === i && (
                             <motion.div 
                               initial={{ height: 0, opacity: 0 }}
                               animate={{ height: 'auto', opacity: 1 }}
                               exit={{ height: 0, opacity: 0 }}
                               style={{ overflow: 'hidden' }}
                             >
                                <div style={{ marginTop: 20, padding: 20, background: 'var(--bg-primary)', borderRadius: 16, border: '1px solid var(--accent-primary)20' }}>
                                   <div style={{ fontSize: '0.65rem', fontWeight: 900, color: 'var(--accent-primary)', textTransform: 'uppercase', marginBottom: 8, letterSpacing: '0.05em' }}>Psychological Mechanism</div>
                                   <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>{h.psychology}</p>
                                </div>
                             </motion.div>
                          )}
                       </AnimatePresence>
                    </motion.div>
                 ))}
              </div>
           </motion.div>

           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="card" 
             style={{ padding: 32 }}
           >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                 <Activity size={18} color="var(--accent-danger)" />
                 <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Retention Tension Heatmap</h3>
              </div>
              <div style={{ width: '100%', height: 320 }}>
                 <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                       <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                       <XAxis type="number" dataKey="x" name="Click Potential" unit="%" stroke="var(--text-tertiary)" fontSize={10} axisLine={false} tickLine={false} />
                       <YAxis type="number" dataKey="y" name="Retention Tension" unit="%" stroke="var(--text-tertiary)" fontSize={10} axisLine={false} tickLine={false} />
                       <ZAxis type="number" dataKey="z" range={[100, 1000]} />
                       <RechartsTooltip 
                         cursor={{ strokeDasharray: '3 3' }} 
                         content={<CustomTooltip />}
                       />
                       <Scatter name="Hooks" data={heatmapData}>
                          {heatmapData.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={index === selectedVariant ? 'var(--accent-primary)' : 'var(--bg-tertiary)'} stroke={index === selectedVariant ? 'var(--accent-primary)' : 'var(--border-subtle)'} />
                          ))}
                       </Scatter>
                    </ScatterChart>
                 </ResponsiveContainer>
              </div>
           </motion.div>
        </div>

        {/* Intelligence Sidear */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
           <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="card" 
              style={{ padding: 32 }}
           >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                 <Trophy size={20} color="var(--accent-warning)" />
                 <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Viral Potential Profile</h3>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                 <MetricBar label="Click-ability Potential" value={hooks[selectedVariant]?.clickAbility} color="var(--accent-primary)" />
                 <MetricBar label="Retention Tension" value={hooks[selectedVariant]?.retentionTension} color="var(--accent-secondary)" />
                 <MetricBar label="Psychological Resonance" value={hooks[selectedVariant]?.predictedViralScore} color="var(--accent-warning)" />
                 
                 <div style={{ marginTop: 12, padding: 24, background: 'var(--accent-warning)05', borderRadius: 20, border: '1px solid var(--accent-warning)20' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                       <AlertCircle size={16} color="var(--accent-warning)" />
                       <span style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', color: 'var(--accent-warning)' }}>AI Lab Verdict</span>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
                       The <strong>{hooks[selectedVariant]?.type}</strong> specimen is currently tracking with the highest retention probability. Its psychological arc matches the current community drift.
                    </p>
                 </div>
              </div>
           </motion.div>

           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="card card-full" 
             style={{ padding: 32, textAlign: 'center', background: 'var(--accent-primary)', color: '#fff', border: 'none' }}
           >
              <Magnet size={40} style={{ marginBottom: 16, opacity: 0.8 }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: 8 }}>Initialize Breakout</h3>
              <p style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: 24, lineHeight: 1.5 }}>
                 Lock this hook variant into your master script to begin high-fidelity production.
              </p>
              <button className="shiny-button" style={{ width: '100%', background: '#fff', color: 'var(--accent-primary)', fontWeight: 900, border: 'none' }}>
                 Apply to Project Pipeline
              </button>
           </motion.div>
        </div>

      </div>
    </div>
  );
}

function MetricBar({ label, value, color }) {
   return (
      <div>
         <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.75rem', fontWeight: 800 }}>
            <span style={{ color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>{label}</span>
            <span style={{ color: 'var(--text-primary)' }}>{value}%</span>
         </div>
         <div style={{ height: 6, background: 'var(--bg-tertiary)', borderRadius: 3, overflow: 'hidden' }}>
            <motion.div initial={{ width: 0 }} animate={{ width: `${value}%` }} style={{ height: '100%', background: color }} />
         </div>
      </div>
   );
}

function CustomTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', padding: 16, borderRadius: 16, boxShadow: '0 10px 30px rgba(0,0,0,0.5)', maxWidth: 280 }}>
        <p style={{ margin: 0, fontWeight: 800, color: 'var(--accent-primary)', fontSize: '0.65rem', marginBottom: 8, textTransform: 'uppercase' }}>{data.name} HOOK</p>
        <p style={{ margin: 0, color: 'var(--text-primary)', fontSize: '0.85rem', fontWeight: 600, lineHeight: 1.4 }}>"{data.text}"</p>
      </div>
    );
  }
  return null;
}
