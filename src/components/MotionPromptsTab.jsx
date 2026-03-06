import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Video, Camera, Sun, Zap, Play, 
  RefreshCw, Wand2, Maximize2, Palette,
  Copy, Check, Share2, Info, Activity,
  ChevronRight, Sparkles, Clock, Layers
} from 'lucide-react';
import { useCreator } from '../context/CreatorContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { generateMotionPlan } from '../engine/aiService.js';

export default function MotionPromptsTab() {
  const { data, setData, topic } = useCreator();
  const { addToast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [copyId, setCopyId] = useState(null);
  const [selectedPrompt, setSelectedPrompt] = useState(0);

  const prompts = data?.motionPlan?.prompts || [];

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopyId(id);
    addToast('success', 'Prompt captured.');
    setTimeout(() => setCopyId(null), 2000);
  };

  const fetchMotionPlan = async () => {
    if (!topic) {
      addToast('error', 'Start a project first!');
      return;
    }
    setLoading(true);
    try {
      const scriptText = data?.script?.scenes ? JSON.stringify(data.script.scenes) : '';
      const result = await generateMotionPlan(topic, scriptText);
      setData(prev => ({
        ...prev,
        motionPlan: result
      }));
      addToast('success', 'Motion architecture forged.');
    } catch (err) {
      addToast('error', 'Forge failed.');
    } finally {
      setLoading(false);
    }
  };

  if (prompts.length === 0) return (
    <div className="tab-content center-content" style={{ minHeight: '60vh' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass glass-hover" style={{ maxWidth: 540, padding: 48, textAlign: 'center', borderRadius: 32 }}>
        <div className="glow-border" style={{ width: 80, height: 80, borderRadius: 24, background: 'var(--bg-tertiary)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <Zap size={40} />
        </div>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: 16 }}>Kinetic Intelligence</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6, marginBottom: 32 }}>Generate high-fidelity motion graphics prompts and cinematic camera movements tailored to your script's visual rhythm.</p>
        <button onClick={fetchMotionPlan} className="btn-primary" style={{ padding: '16px 32px' }}>
          <Sparkles size={18} /> Materialize Motion Plan
        </button>
      </motion.div>
    </div>
  );

  return (
    <div className="tab-content animate-slide-up">
      <div className="tab-header" style={{ marginBottom: 40 }}>
        <div className="stagger-children">
          <h2 className="tab-title text-gradient-aurora" style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.04em' }}>Motion Forge</h2>
          <p className="tab-subtitle" style={{ fontSize: '1.1rem' }}>Cinetic camera orchestration & visual interest prompts</p>
        </div>
        <button onClick={fetchMotionPlan} className="btn-secondary" style={{ padding: '12px 20px' }}>
          {loading ? <RefreshCw className="animate-spin" size={18} /> : <RefreshCw size={18} />}
        </button>
      </div>

      <div className="stagger-children" style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 28, alignItems: 'start' }}>
         
         {/* Main Viewport */}
         <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            <div className="glass" style={{ padding: 40, borderRadius: 32, minHeight: 400, position: 'relative' }}>
               <AnimatePresence mode="wait">
                  <motion.div 
                     key={selectedPrompt}
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: -20 }}
                  >
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                           <div className="glow-border" style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--bg-tertiary)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Camera size={22} />
                           </div>
                           <h3 style={{ fontSize: '1.4rem', fontWeight: 900 }}>{prompts[selectedPrompt].sceneName}</h3>
                        </div>
                        <span style={{ fontSize: '0.7rem', fontWeight: 950, color: 'var(--accent-secondary)', letterSpacing: '0.1em' }}>PROMPT 0{selectedPrompt + 1}</span>
                     </div>

                     <div className="glass" style={{ padding: 32, borderRadius: 24, background: 'rgba(255,255,255,0.02)', marginBottom: 32 }}>
                        <div style={{ fontSize: '0.65rem', fontWeight: 900, color: 'var(--accent-primary)', textTransform: 'uppercase', marginBottom: 16, letterSpacing: '0.1em' }}>Prompt Directive</div>
                        <p style={{ fontSize: '1.2rem', color: 'var(--text-primary)', fontWeight: 700, lineHeight: 1.6, margin: 0 }}>
                           "{prompts[selectedPrompt].prompt}"
                        </p>
                     </div>

                     <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                        <div className="glass" style={{ padding: 24, borderRadius: 20 }}>
                           <h4 style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: 12 }}>Visual Style</h4>
                           <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', margin: 0 }}>{prompts[selectedPrompt].style || "Cinematic 8k, bokeh background"}</p>
                        </div>
                        <div className="glass" style={{ padding: 24, borderRadius: 20 }}>
                           <h4 style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: 12 }}>Camera Move</h4>
                           <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', margin: 0 }}>{prompts[selectedPrompt].cameraMove || "Slow push-in"}</p>
                        </div>
                     </div>
                  </motion.div>
               </AnimatePresence>

               <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 40 }}>
                  {prompts.map((_, i) => (
                     <button 
                        key={i} 
                        onClick={() => setSelectedPrompt(i)}
                        style={{ 
                           width: selectedPrompt === i ? 24 : 10, 
                           height: 10, 
                           borderRadius: 5, 
                           background: selectedPrompt === i ? 'var(--accent-primary)' : 'var(--border-medium)',
                           border: 'none', cursor: 'pointer', transition: 'all 0.3s'
                        }} 
                     />
                  ))}
               </div>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
               <button 
                  onClick={() => handleCopy(prompts[selectedPrompt].prompt, selectedPrompt)}
                  className="btn-primary" 
                  style={{ flex: 1, padding: '16px' }}
               >
                  {copyId === selectedPrompt ? <Check size={18} /> : <Copy size={18} />}
                  <span>Capture Prompt</span>
               </button>
               <button className="btn-secondary" style={{ padding: '16px 24px' }}>
                  <Share2 size={18} />
               </button>
            </div>
         </div>

         {/* Info Sidebar */}
         <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            <div className="glass" style={{ padding: 32, borderRadius: 28 }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
                  <div className="glow-border" style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--bg-tertiary)', color: 'var(--accent-warning)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     <Activity size={22} />
                  </div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 900 }}>Motion Stats</h3>
               </div>
               <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div className="glass" style={{ padding: '16px 20px', borderRadius: 16, display: 'flex', justifyContent: 'space-between' }}>
                     <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-tertiary)' }}>Total Prompts</span>
                     <span style={{ fontWeight: 900 }}>{prompts.length}</span>
                  </div>
                  <div className="glass" style={{ padding: '16px 20px', borderRadius: 16, display: 'flex', justifyContent: 'space-between' }}>
                     <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-tertiary)' }}>Visual Energy</span>
                     <span style={{ fontWeight: 900, color: 'var(--accent-success)' }}>High</span>
                  </div>
               </div>
            </div>

            <div className="glass glass-hover" style={{ padding: 32, borderRadius: 28, background: 'var(--gradient-primary)', color: '#fff', border: 'none' }}>
               <Palette size={40} style={{ marginBottom: 16, opacity: 0.8 }} />
               <h3 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: 12 }}>Visual Style Sync</h3>
               <p style={{ fontSize: '0.85rem', opacity: 0.9, marginBottom: 24, lineHeight: 1.6 }}>Apply current Style DNA to all generated motion prompts for consistent visual branding.</p>
               <button style={{ width: '100%', padding: '14px', borderRadius: 12, border: 'none', background: '#fff', color: 'var(--accent-primary)', fontWeight: 900, cursor: 'pointer' }}>
                  Sync DNA
               </button>
            </div>
         </div>

      </div>
    </div>
  );
}
