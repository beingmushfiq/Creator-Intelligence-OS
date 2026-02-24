import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Video, Camera, Sun, Zap, Play, 
  RefreshCw, Wand2, Maximize2, Palette,
  Copy, Check, Share2, Info, Activity
} from 'lucide-react';
import { useCreator } from '../context/CreatorContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { generateMotionPlan } from '../engine/aiService.js';

export default function MotionPromptsTab() {
  const { data, loading, topic, script, setData } = useCreator();
  const { addToast } = useToast();
  const motionPlan = data?.motionPlan;
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeView, setActiveView] = useState('sequence');
  const [copied, setCopied] = useState(null);

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    addToast('success', 'Prompt copied to clipboard!');
    setTimeout(() => setCopied(null), 2000);
  };

  const fetchMotionPlan = async () => {
    if (!topic || !script || isGenerating) return;
    setIsGenerating(true);
    try {
      const result = await generateMotionPlan(topic, script);
      setData(prev => ({ ...prev, motionPlan: result }));
      addToast('success', 'Cinematic motion sequence mapped!');
    } catch (err) {
      addToast('error', 'Failed to design cinematic sequence.');
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (topic && script && !motionPlan && !loading) {
      fetchMotionPlan();
    }
  }, [topic, script, motionPlan, loading]);

  if (isGenerating) return (
    <div className="tab-content center-content">
      <div style={{ textAlign: 'center' }}>
        <Loader2 size={48} className="spin" color="var(--accent-primary)" style={{ marginBottom: 24 }} />
        <h3 className="text-gradient" style={{ fontSize: '1.5rem', fontWeight: 800 }}>Choreographing Sequences</h3>
        <p style={{ color: 'var(--text-tertiary)' }}>Calculating camera vectors and lighting scripts...</p>
      </div>
    </div>
  );

  if (!script) return (
    <div className="tab-content center-content">
      <div className="empty-state" style={{ maxWidth: 500 }}>
        <div className="empty-state-icon"><Video size={32} /></div>
        <h3>Script Sequence Required</h3>
        <p>We need a finalized script to design cinematic camera movements and professional lighting setups.</p>
      </div>
    </div>
  );

  if (!motionPlan) return (
    <div className="tab-content center-content">
      <div className="empty-state" style={{ maxWidth: 600 }}>
        <div className="empty-state-icon"><Camera size={32} /></div>
        <h3>Motion Architect</h3>
        <p>Design professional camera movements, lighting scripts, and color grades for "{topic}".</p>
        <button onClick={fetchMotionPlan} className="shiny-button" style={{ marginTop: 24 }}>
          <Wand2 size={18} /> Initialize Motion Analysis
        </button>
      </div>
    </div>
  );

  return (
    <div className="tab-content">
      <div className="tab-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20 }}>
        <div>
          <h2 className="tab-title text-gradient">Motion Architect</h2>
          <p className="tab-subtitle">Cinematic staging & visual choreography for {topic}</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
           <div className="view-switcher" style={{ background: 'var(--bg-tertiary)', padding: 4, borderRadius: 12, border: '1px solid var(--border-subtle)', display: 'flex' }}>
              {['sequence', 'lighting'].map(v => (
                 <button 
                   key={v}
                   onClick={() => setActiveView(v)}
                   style={{ 
                     fontSize: '0.75rem', fontWeight: 700, padding: '8px 16px', borderRadius: 8, border: 'none',
                     background: activeView === v ? 'var(--bg-secondary)' : 'transparent',
                     color: activeView === v ? 'var(--accent-primary)' : 'var(--text-tertiary)',
                     cursor: 'pointer', transition: 'all 0.2s'
                   }}
                 >
                   {v === 'sequence' ? 'Shot Sequence' : 'Lighting & Grade'}
                 </button>
              ))}
           </div>
           <button onClick={fetchMotionPlan} className="btn-secondary" style={{ padding: '8px 12px' }}>
              <RefreshCw size={18} />
           </button>
        </div>
      </div>

      {/* Energy Pulse Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="card" 
        style={{ padding: 24, marginBottom: 24, background: 'linear-gradient(to right, var(--bg-secondary) 0%, var(--bg-tertiary) 100%)', border: '1px solid var(--accent-warning)20' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Zap size={18} color="var(--accent-warning)" />
              <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>Global Motion Energy Map</h3>
           </div>
           <div className="badge badge-yellow" style={{ fontSize: '0.8rem', fontWeight: 900 }}>{motionPlan.overallEnergy} Intensity</div>
        </div>
        <div style={{ height: 60, display: 'flex', alignItems: 'flex-end', gap: 4 }}>
           {motionPlan.sequences.map((s, i) => (
              <motion.div 
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${s.energyScore}%` }}
                transition={{ delay: i * 0.05, duration: 1 }}
                style={{ 
                  flex: 1, 
                  background: s.energyScore > 70 ? 'var(--accent-warning)' : s.energyScore > 40 ? 'var(--accent-primary)' : 'var(--text-tertiary)30',
                  borderRadius: '4px 4px 0 0',
                  boxShadow: s.energyScore > 70 ? '0 -4px 12px var(--accent-warning)30' : 'none'
                }}
                title={`Scene ${i+1}: ${s.energyScore}%`}
              />
           ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, fontSize: '0.6rem', color: 'var(--text-tertiary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
           <span>Opening Hook</span>
           <span>Narrative Arc</span>
           <span>The Climax</span>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {activeView === 'sequence' ? (
          <motion.div 
            key="sequence"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
          >
             {motionPlan.sequences.map((shot, i) => (
                <motion.div 
                  key={i} 
                  whileHover={{ x: 4, borderColor: 'var(--accent-primary)40' }}
                  className="card" 
                  style={{ padding: 24, display: 'flex', alignItems: 'center', gap: 24 }}
                >
                   <div style={{ width: 50, height: 50, borderRadius: 14, background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: 'var(--accent-primary)', fontSize: '0.9rem' }}>
                      {i+1}
                   </div>
                   <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                         <h4 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{shot.scene}</h4>
                         <span className="badge badge-purple" style={{ fontSize: '0.65rem' }}>{shot.visualBeat}</span>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>
                         <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Camera size={14} color="var(--accent-info)" /> {shot.shotType}</div>
                         <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Maximize2 size={14} color="var(--accent-secondary)" /> {shot.focalLength}</div>
                         <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Play size={14} color="var(--accent-success)" /> {shot.movement}</div>
                      </div>
                   </div>
                   <div style={{ display: 'flex', gap: 12 }}>
                      <div style={{ textAlign: 'right', minWidth: 120 }}>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 800, marginBottom: 4 }}>Lighting Script</div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{shot.lighting}</div>
                      </div>
                      <button 
                         onClick={() => handleCopy(`${shot.shotType}, ${shot.movement}, ${shot.lighting}, ${shot.visualBeat}`, `shot-${i}`)}
                         className="btn-mini" 
                         title="Copy Runway/Luma Prompt"
                         style={{ height: 36, width: 36, borderRadius: 10 }}
                      >
                         {copied === `shot-${i}` ? <Check size={16} /> : <Copy size={16} />}
                      </button>
                   </div>
                </motion.div>
             ))}
          </motion.div>
        ) : (
          <motion.div 
            key="lighting"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 24 }}
          >
             <div className="card" style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                   <div style={{ padding: 10, background: 'var(--accent-primary)10', color: 'var(--accent-primary)', borderRadius: 12 }}>
                      <Palette size={20} />
                   </div>
                   <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Cinematic Color Grade</h3>
                </div>
                
                <div style={{ background: 'var(--bg-tertiary)', padding: 24, borderRadius: 20, border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                   <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: 20, textTransform: 'uppercase' }}>{motionPlan.colorGrade.vibe}</div>
                   <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                      {motionPlan.colorGrade.palette.map((color, i) => (
                         <div key={i} title={color} style={{ width: 44, height: 44, borderRadius: 12, background: color, border: '2px solid var(--bg-secondary)', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }} />
                      ))}
                   </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                   <div style={{ padding: 16, background: 'var(--bg-tertiary)', borderRadius: 16, border: '1px solid var(--border-subtle)' }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', fontWeight: 800, textTransform: 'uppercase', marginBottom: 4 }}>Saturation</div>
                      <div style={{ fontSize: '1rem', fontWeight: 700 }}>{motionPlan.colorGrade.saturation}</div>
                   </div>
                   <div style={{ padding: 16, background: 'var(--bg-tertiary)', borderRadius: 16, border: '1px solid var(--border-subtle)' }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', fontWeight: 800, textTransform: 'uppercase', marginBottom: 4 }}>Contrast View</div>
                      <div style={{ fontSize: '1rem', fontWeight: 700 }}>High Cinematic</div>
                   </div>
                </div>
                
                <p style={{ fontSize: '0.9rem', color: 'var(--text-tertiary)', lineHeight: 1.6 }}>
                   This grade is optimized for high-end digital screens, ensuring your content pops in a cluttered feed without losing dynamic range.
                </p>
             </div>

             <div className="card" style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                   <div style={{ padding: 10, background: 'var(--accent-warning)10', color: 'var(--accent-warning)', borderRadius: 12 }}>
                      <Sun size={20} />
                   </div>
                   <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Atmosphere Script</h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                   {motionPlan.sequences.slice(0, 5).map((shot, i) => (
                      <div key={i} style={{ padding: 16, background: 'var(--bg-tertiary)', borderRadius: 16, border: '1px solid var(--border-subtle)', position: 'relative' }}>
                         <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: 'var(--accent-warning)', borderRadius: '4px 0 0 4px' }} />
                         <div style={{ fontSize: '0.7rem', color: 'var(--accent-warning)', fontWeight: 800, textTransform: 'uppercase', marginBottom: 4 }}>Scene {i+1} Lighting</div>
                         <div style={{ fontSize: '1rem', fontWeight: 700 }}>{shot.lighting}</div>
                         <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginTop: 4 }}>{shot.visualBeat}</div>
                      </div>
                   ))}
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const Loader2 = ({ size, className, color, style }) => (
  <RefreshCw size={size} className={className} color={color} style={style} />
);
