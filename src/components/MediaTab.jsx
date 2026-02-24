import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Film, Music, Search, Camera, Play, 
  Layers, Zap, Wand2, RefreshCw, 
  Volume2, Image as ImageIcon, Copy,
  Check, ArrowRight, Video, List, FileText
} from 'lucide-react';
import { useCreator } from '../context/CreatorContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { generateMediaPlan } from '../engine/aiService.js';

export default function MediaTab() {
  const { data, loading, topic, setData } = useCreator();
  const { addToast } = useToast();
  const media = data?.media;
  const script = data?.script;
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeView, setActiveView] = useState('broll'); // 'broll' | 'audio'
  const [copiedId, setCopiedId] = useState(null);

  const fetchMediaPlan = async () => {
    if (!topic || !script || isGenerating) return;
    setIsGenerating(true);
    try {
      const result = await generateMediaPlan(topic, script);
      setData(prev => ({
         ...prev,
         media: result
      }));
      addToast('success', 'Visual asset map generated!');
    } catch (err) {
      console.error(err);
      addToast('error', 'Failed to map visual assets.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    addToast('success', 'Search term copied!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  useEffect(() => {
    if (topic && script && !media && !loading) {
      fetchMediaPlan();
    }
  }, [topic, script, media, loading]);

  if (isGenerating) return (
    <div className="loading-state" style={{ height: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
      <div className="spinner" style={{ width: 40, height: 40 }} />
      <p style={{ color: 'var(--text-tertiary)', fontWeight: 500 }}>Mapping Visual Sequences...</p>
    </div>
  );

  if (!script) return (
    <div className="empty-state" style={{ height: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
       <FileText size={48} color="var(--accent-primary)" style={{ opacity: 0.2, marginBottom: 20 }} />
       <h3 style={{ fontSize: '1.2rem', marginBottom: 12 }}>Script Required</h3>
       <p style={{ color: 'var(--text-tertiary)', maxWidth: 400, marginBottom: 24 }}>
          We need a script to map out your B-roll and visual assets. Generate a script first!
       </p>
    </div>
  );

  if (!media) return (
    <div className="empty-state" style={{ height: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
       <Film size={48} color="var(--accent-primary)" style={{ opacity: 0.2, marginBottom: 20 }} />
       <h3 style={{ fontSize: '1.2rem', marginBottom: 12 }}>Visual Asset Intelligence</h3>
       <p style={{ color: 'var(--text-tertiary)', maxWidth: 400, marginBottom: 24 }}>
          Generate a scene-by-scene visual map, stock keywords, and audio palette for "${topic}".
       </p>
       <button onClick={fetchMediaPlan} className="btn-primary" style={{ gap: 8 }}>
          <Wand2 size={18} /> Initialize Media Architect
       </button>
    </div>
  );

  return (
    <div className="tab-content">
      <div className="tab-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 className="tab-title text-gradient">Media Architect</h2>
          <p className="tab-subtitle">Visual sequences & asset intelligence for ${topic}</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
           <div className="view-switcher" style={{ display: 'flex', background: 'var(--bg-tertiary)', padding: 4, borderRadius: 12, border: '1px solid var(--border-subtle)' }}>
              {['broll', 'audio'].map(v => (
                 <button 
                   key={v}
                   onClick={() => setActiveView(v)}
                   className={`btn-ghost ${activeView === v ? 'active' : ''}`}
                   style={{ 
                     fontSize: '0.75rem', 
                     padding: '6px 12px', 
                     borderRadius: 8,
                     background: activeView === v ? 'var(--bg-secondary)' : 'transparent',
                     color: activeView === v ? 'var(--accent-primary)' : 'var(--text-tertiary)',
                     textTransform: 'capitalize'
                   }}
                 >
                   {v === 'broll' ? 'B-Roll Map' : 'Audio Palette'}
                 </button>
              ))}
           </div>
           <button onClick={fetchMediaPlan} className="btn-ghost" style={{ padding: 12, borderRadius: 12, border: '1px solid var(--border-subtle)' }}>
              <RefreshCw size={18} />
           </button>
        </div>
      </div>

      <div className="stagger-children">
        <div className="readiness-meter" style={{ marginBottom: 30, padding: 24, background: 'var(--bg-secondary)', borderRadius: 16, border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 32 }}>
           <div style={{ position: 'relative', width: 80, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="80" height="80" viewBox="0 0 80 80">
                 <circle cx="40" cy="40" r="36" fill="none" stroke="var(--bg-tertiary)" strokeWidth="6" />
                 <motion.circle 
                    cx="40" cy="40" r="36" fill="none" 
                    stroke="var(--accent-secondary)" strokeWidth="6"
                    strokeDasharray="226"
                    initial={{ strokeDashoffset: 226 }}
                    animate={{ strokeDashoffset: 226 - (226 * media.readinessScore / 100) }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                    strokeLinecap="round"
                 />
              </svg>
              <div style={{ position: 'absolute', fontSize: '1.2rem', fontWeight: 900 }}>{media.readinessScore}%</div>
           </div>
           <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                 <Video size={18} color="var(--accent-secondary)" />
                 <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Visual Readiness Score</h4>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-tertiary)', marginBottom: 12 }}>
                Percentage of script beats covered by high-impact visual suggestions and stock assets.
              </p>
              <div style={{ display: 'flex', gap: 12 }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'var(--accent-success)', padding: '4px 8px', background: 'var(--accent-success)15', borderRadius: 4 }}>
                    <Layers size={12} /> {media.brollMap.length} Visual Cues
                 </div>
                 <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'var(--accent-primary)', padding: '4px 8px', background: 'var(--accent-primary)15', borderRadius: 4 }}>
                    <Volume2 size={12} /> {media.audioPalette.sfxCues.length} SFX Cues
                 </div>
              </div>
           </div>
        </div>

        <AnimatePresence mode="wait">
          {activeView === 'broll' && (
            <motion.div 
              key="broll"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
            >
               {media.brollMap.map((cue, i) => (
                  <div key={i} className="card" style={{ padding: 24, borderLeft: '4px solid var(--accent-secondary)' }}>
                     <div style={{ display: 'flex', gap: 24 }}>
                        <div style={{ width: 100, flexShrink: 0 }}>
                           <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700, marginBottom: 8 }}>Vibe</div>
                           <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-secondary)', background: 'var(--accent-secondary)15', padding: '6px', borderRadius: 6, textAlign: 'center' }}>
                              {cue.vibe}
                           </div>
                        </div>
                        <div style={{ flex: 1 }}>
                           <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                              <Film size={16} color="var(--accent-secondary)" />
                              <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{cue.visualSuggestion}</h4>
                           </div>
                           <p style={{ fontSize: '0.9rem', color: 'var(--text-tertiary)', marginBottom: 16, fontStyle: 'italic', background: 'var(--bg-tertiary)', padding: '8px 12px', borderRadius: 8, borderLeft: '2px solid var(--border-subtle)' }}>
                              "{cue.dialogueSnippet}"
                           </p>
                           <div>
                              <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700, marginBottom: 8 }}>Stock Search Terms</div>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                 {cue.searchTerms.map((term, j) => (
                                    <button 
                                      key={j} 
                                      onClick={() => copyToClipboard(term, `${i}-${j}`)}
                                      style={{ 
                                        display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', 
                                        color: 'var(--text-secondary)', padding: '6px 12px', background: 'var(--bg-tertiary)', 
                                        borderRadius: 8, border: '1px solid var(--border-subtle)', cursor: 'pointer'
                                      }}
                                    >
                                       <Search size={12} /> {term}
                                       {copiedId === `${i}-${j}` ? <Check size={12} color="var(--accent-success)" /> : <Copy size={12} style={{ opacity: 0.3 }} />}
                                    </button>
                                 ))}
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               ))}
            </motion.div>
          )}

          {activeView === 'audio' && (
            <motion.div 
              key="audio"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 20 }}
            >
               <div className="card" style={{ padding: 24, background: 'var(--accent-primary)10' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                     <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Music size={20} color="var(--accent-primary)" />
                     </div>
                     <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Music Style</h4>
                  </div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 12 }}>
                     {media.audioPalette.musicStyle}
                  </div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-tertiary)', lineHeight: 1.5 }}>
                     This genre choice aligns with the psychological framing of the script to maximize viewer retention.
                  </p>
               </div>

               <div className="card" style={{ padding: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Volume2 size={20} color="var(--accent-secondary)" />
                     </div>
                     <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Impact SFX Cues</h4>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                     {media.audioPalette.sfxCues.map((cue, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '12px 16px', background: 'var(--bg-tertiary)', borderRadius: 12, border: '1px solid var(--border-subtle)' }}>
                           <div style={{ background: 'var(--bg-secondary)', padding: '4px 10px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-secondary)' }}>
                              {cue.time}
                           </div>
                           <div style={{ flex: 1 }}>
                              <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{cue.sound}</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{cue.purpose}</div>
                           </div>
                           <Play size={16} style={{ opacity: 0.2 }} />
                        </div>
                     ))}
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
