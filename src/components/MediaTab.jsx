import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Film, Music, Search, Camera, Play, 
  Layers, Zap, Wand2, RefreshCw, 
  Volume2, Image as ImageIcon, Copy,
  Check, ArrowRight, Video, List, FileText,
  ChevronRight, HeartPulse, Sparkles
} from 'lucide-react';
import { useCreator } from '../context/CreatorContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { generateMediaPlan } from '../engine/aiService.js';

export default function MediaTab() {
  const { data, setData, topic } = useCreator();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [copyId, setCopyId] = useState(null);

  const plan = data?.mediaPlan;

  const fetchMediaPlan = async () => {
    if (!topic) {
      addToast('error', 'Start a project first!');
      return;
    }
    setLoading(true);
    try {
      const scriptText = data?.script?.scenes ? JSON.stringify(data.script.scenes) : '';
      const result = await generateMediaPlan(topic, scriptText);
      setData(prev => ({
        ...prev,
        mediaPlan: result
      }));
      addToast('success', 'Aural & visual assets mapped');
    } catch (err) {
      addToast('error', 'Media map failed');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopyId(id);
    addToast('success', 'Asset cue copied');
    setTimeout(() => setCopyId(null), 2000);
  };

  if (!plan) return (
    <div className="tab-content center-content" style={{ minHeight: '60vh' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass glass-hover" style={{ maxWidth: 540, padding: 48, textAlign: 'center', borderRadius: 32 }}>
        <div className="glow-border" style={{ width: 80, height: 80, borderRadius: 24, background: 'var(--bg-tertiary)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <Layers size={40} />
        </div>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: 16 }}>Atmospheric Intelligence</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6, marginBottom: 32 }}>Map cinematic soundscapes, visual overlays, and B-roll sequences designed to maximize retention tension.</p>
        <button onClick={fetchMediaPlan} className="btn-primary" style={{ padding: '16px 32px' }}>
          <Sparkles size={18} /> Materialize Media Map
        </button>
      </motion.div>
    </div>
  );

  return (
    <div className="tab-content animate-slide-up">
      <div className="tab-header" style={{ marginBottom: 40 }}>
        <div className="stagger-children">
          <h2 className="tab-title text-gradient-aurora" style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.04em' }}>Atmosphere Core</h2>
          <p className="tab-subtitle" style={{ fontSize: '1.1rem' }}>Cinematic asset mapping, soundscapes & visual textures</p>
        </div>
        <button onClick={fetchMediaPlan} className="btn-secondary" style={{ padding: '12px 20px' }}>
          {loading ? <RefreshCw className="animate-spin" size={18} /> : <RefreshCw size={18} />}
        </button>
      </div>

      <div className="stagger-children" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 28 }}>
        
        {/* Visual Assets */}
        <div className="glass" style={{ padding: 40, borderRadius: 32 }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 32 }}>
              <div className="glow-border" style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--bg-tertiary)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <Video size={20} />
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 900 }}>Visual Textures</h3>
           </div>
           
           <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {plan.visuals?.map((v, i) => (
                 <motion.div 
                    key={i} 
                    whileHover={{ scale: 1.01, x: 4 }}
                    className="glass glass-hover" 
                    style={{ padding: 24, borderRadius: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                 >
                    <div>
                       <div style={{ fontSize: '0.65rem', fontWeight: 950, color: 'var(--accent-primary)', textTransform: 'uppercase', marginBottom: 4 }}>{v.type} Overlay</div>
                       <p style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>{v.description}</p>
                    </div>
                    <button 
                       onClick={() => copyToClipboard(v.description, `v-${i}`)}
                       className="glass-hover"
                       style={{ background: 'transparent', border: 'none', color: 'var(--text-tertiary)', padding: 10, borderRadius: 10, cursor: 'pointer' }}
                    >
                       {copyId === `v-${i}` ? <Check size={16} color="var(--accent-success)" /> : <Copy size={16} />}
                    </button>
                 </motion.div>
              ))}
           </div>
        </div>

        {/* Audio Assets */}
        <div className="glass" style={{ padding: 40, borderRadius: 32 }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 32 }}>
              <div className="glow-border" style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--bg-tertiary)', color: 'var(--accent-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <Music size={20} />
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 900 }}>Aural Soundscape</h3>
           </div>
           
           <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {plan.audio?.map((a, i) => (
                 <motion.div 
                    key={i} 
                    whileHover={{ scale: 1.01, x: 4 }}
                    className="glass glass-hover" 
                    style={{ padding: 24, borderRadius: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                 >
                    <div>
                       <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                          <span style={{ fontSize: '0.65rem', fontWeight: 950, color: 'var(--accent-secondary)', textTransform: 'uppercase' }}>{a.type}</span>
                          <Volume2 size={12} color="var(--accent-secondary)" />
                       </div>
                       <p style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>{a.description}</p>
                    </div>
                    <button 
                       onClick={() => copyToClipboard(a.description, `a-${i}`)}
                       className="glass-hover"
                       style={{ background: 'transparent', border: 'none', color: 'var(--text-tertiary)', padding: 10, borderRadius: 10, cursor: 'pointer' }}
                    >
                       {copyId === `a-${i}` ? <Check size={16} color="var(--accent-success)" /> : <Copy size={16} />}
                    </button>
                 </motion.div>
              ))}
           </div>
        </div>

        {/* Media Intelligence */}
        <div className="glass" style={{ gridColumn: '1 / -1', padding: 40, borderRadius: 32, position: 'relative', overflow: 'hidden' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
              <div className="glow-border" style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--bg-tertiary)', color: 'var(--accent-warning)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <HeartPulse size={20} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 900 }}>Atmosphere Verdict</h3>
           </div>
           
           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 40 }}>
              <div className="glass" style={{ padding: 32, borderRadius: 24, background: 'rgba(255,165,0,0.03)', borderLeft: '4px solid var(--accent-warning)' }}>
                 <p style={{ fontSize: '1.1rem', color: 'var(--text-primary)', fontWeight: 600, lineHeight: 1.7, margin: 0 }}>
                    "{plan.rationale || "The combination of high-bpm background pulse with frequent low-pass filter sweeps will maintain 18% higher attention during technical breakdowns."}"
                 </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                 <div className="glass" style={{ padding: 24, borderRadius: 20 }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Suggested Gear</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                       <Camera size={20} color="var(--accent-primary)" />
                       <span style={{ fontSize: '1rem', fontWeight: 700 }}>Cinematic 24fps with ND filter</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
