import React, { useState } from 'react';
import { 
  ChevronDown, Film, Camera, Sun, 
  Music, Wand2, FileText, Play, 
  ShoppingBag, Users, Search, 
  Globe, RefreshCw, Copy, Zap,
  Sparkles, Clock, Layers, MessageSquare,
  AlertTriangle, CheckCircle2, ChevronRight,
  ShieldCheck, Brain
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCreator } from '../context/CreatorContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { translateContent, generateSpeech } from '../engine/aiService.js';
import EditableText from './ui/EditableText.jsx';

const LANGUAGES = [
  { id: 'en', name: 'English', flag: '🇺🇸' },
  { id: 'es', name: 'Spanish', flag: '🇪🇸' },
  { id: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { id: 'de', name: 'German', flag: '🇩🇪' },
  { id: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { id: 'fr', name: 'French', flag: '🇫🇷' }
];

export default function ScriptTab() {
  const { data, setData, topic, loading } = useCreator();
  const { addToast } = useToast();
  
  const [translating, setTranslating] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);

  const script = data?.script || {};
  const scenes = script.scenes || [];

  const handleTranslate = async (langCode) => {
    setTranslating(true);
    try {
      addToast('info', 'Neural translation engaged...');
      const translated = await translateContent(scenes, langCode, data?.niche || 'general');
      setData(prev => ({
        ...prev,
        script: { ...prev.script, scenes: JSON.parse(translated) }
      }));
      addToast('success', 'Workspace synchronized with translated script.');
    } catch (err) {
      addToast('error', 'Translation failed.');
    } finally {
      setTranslating(false);
    }
  };

  const handleGenerateAudio = async () => {
    setAudioLoading(true);
    try {
      addToast('info', 'Acoustic forging initiated...');
      const fullText = scenes.map(s => s.dialogue).join(' ');
      const audioUrl = await generateSpeech(fullText);
      setData(prev => ({
        ...prev,
        script: { ...prev.script, audioUrl }
      }));
      addToast('success', 'Acoustic blueprint finalized.');
    } catch (err) {
      addToast('error', 'Audio forge failure.');
    } finally {
      setAudioLoading(false);
    }
  };

  if (scenes.length === 0) return (
     <div className="tab-content center-content" style={{ minHeight: '60vh' }}>
        <div className="glass glass-hover" style={{ padding: 48, borderRadius: 32, textAlign: 'center', maxWidth: 480 }}>
           <div className="glow-border" style={{ width: 80, height: 80, borderRadius: 24, background: 'var(--bg-tertiary)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <FileText size={40} />
           </div>
           <h3 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: 16 }}>No Script Blueprint</h3>
           <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>Generate a strategic foundation to materialize your creative script segments.</p>
        </div>
     </div>
  );

  return (
    <div className="tab-content animate-slide-up">
      <div className="tab-header" style={{ marginBottom: 40 }}>
        <div className="stagger-children">
          <h2 className="tab-title text-gradient-aurora" style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.04em' }}>Script Architecture</h2>
          <p className="tab-subtitle" style={{ fontSize: '1.1rem' }}>Scene-by-scene narrative orchestration & multi-modal blueprints</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <div className="glass" style={{ display: 'flex', padding: 4, borderRadius: 12 }}>
             {LANGUAGES.slice(0, 3).map(l => (
                <button 
                  key={l.id} 
                  onClick={() => handleTranslate(l.id)}
                  disabled={translating}
                  className="glass-hover"
                  style={{ padding: '8px 12px', borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', gap: 6, alignItems: 'center' }}
                  title={l.name}
                >
                  <span>{l.flag}</span>
                </button>
             ))}
          </div>
          <button onClick={handleGenerateAudio} disabled={audioLoading} className="btn-primary" style={{ padding: '12px 24px' }}>
            {audioLoading ? <RefreshCw className="animate-spin" size={18} /> : <Music size={18} />}
            <span>{audioLoading ? 'Forging...' : 'Forge Audio'}</span>
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 28, alignItems: 'start' }}>
        
        {/* Script Content */}
        <div className="stagger-children" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {scenes.map((scene, idx) => (
             <ScriptSection key={idx} section={scene} index={idx} brollMap={script.brollMap} />
          ))}
        </div>

        {/* Script Intelligence Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
           <div className="glass" style={{ padding: 32, borderRadius: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
                 <div className="glow-border" style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--bg-tertiary)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Brain size={22} />
                 </div>
                 <h3 style={{ fontSize: '1.1rem', fontWeight: 900 }}>Script Analytics</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                 <div className="glass" style={{ padding: '16px 20px', borderRadius: 16, display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-tertiary)' }}>Total Scenes</span>
                    <span style={{ fontWeight: 900 }}>{scenes.length}</span>
                 </div>
                 <div className="glass" style={{ padding: '16px 20px', borderRadius: 16, display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-tertiary)' }}>Est. Duration</span>
                    <span style={{ fontWeight: 900 }}>{scenes.length * 15}s</span>
                 </div>
                 <div className="glass" style={{ padding: '16px 20px', borderRadius: 16, display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-tertiary)' }}>Narrative Flow</span>
                    <span style={{ fontWeight: 900, color: 'var(--accent-success)' }}>Optimal</span>
                 </div>
              </div>
           </div>

           <div className="glass glass-hover" style={{ padding: 32, borderRadius: 28, background: 'var(--gradient-primary)05', border: '1px solid var(--accent-primary)20' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                 <Sparkles size={18} color="var(--accent-primary)" />
                 <span style={{ fontSize: '0.7rem', fontWeight: 950, color: 'var(--accent-primary)', textTransform: 'uppercase' }}>Production Tip</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                 Ensure audio pacing remains under 140 words per minute for maximum narrative retention across TikTok and YouTube Shorts.
              </p>
           </div>
        </div>

      </div>
    </div>
  );
}

function ScriptSection({ section, index, brollMap }) {
  const [expanded, setExpanded] = useState(true);
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="glass glass-hover" 
      style={{ borderRadius: 28, overflow: 'hidden' }}
    >
      <div 
        onClick={() => setExpanded(!expanded)}
        style={{ padding: '24px 32px', background: 'var(--bg-tertiary)30', borderBottom: expanded ? '1px solid var(--border-subtle)' : 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
           <div className="glass" style={{ width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 950, color: 'var(--accent-primary)' }}>
              {index + 1}
           </div>
           <h3 style={{ fontSize: '1.1rem', fontWeight: 900, margin: 0 }}>Scene Protocol: {section.sceneName || 'Untitled'}</h3>
        </div>
        <ChevronDown size={18} style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s', opacity: 0.3 }} />
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 24 }}>
               
               {/* Visual Segment */}
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                  <div className="glass" style={{ padding: 24, borderRadius: 20, background: 'rgba(0, 212, 255, 0.02)' }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                        <Camera size={16} color="var(--accent-primary)" />
                        <span style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Visual Segment</span>
                     </div>
                     <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>{section.visual}</p>
                  </div>
                  
                  <div className="glass" style={{ padding: 24, borderRadius: 20, background: 'rgba(124, 92, 252, 0.02)' }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                        <Sun size={16} color="var(--accent-primary)" />
                        <span style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Lighting & Mood</span>
                     </div>
                     <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>Cinematic, high-contrast, professional grade.</p>
                  </div>
               </div>

               {/* Dialogue Segment */}
               <div className="glass" style={{ padding: 32, borderRadius: 24, borderLeft: '4px solid var(--accent-primary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                     <MessageSquare size={18} color="var(--accent-primary)" />
                     <span style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--accent-primary)', textTransform: 'uppercase' }}>Vocal Blueprint</span>
                  </div>
                  <div style={{ fontSize: '1.2rem', color: 'var(--text-primary)', fontWeight: 700, lineHeight: 1.5, fontStyle: 'italic' }}>
                     "{section.dialogue}"
                  </div>
               </div>

               {/* B-Roll Suggestions */}
               {brollMap?.[index] && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                     {brollMap[index].map((tag, i) => (
                        <div key={i} className="glass" style={{ padding: '6px 14px', borderRadius: 100, fontSize: '0.65rem', fontWeight: 900, color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                           <Film size={10} />
                           <span>{tag.toUpperCase()}</span>
                        </div>
                     ))}
                  </div>
               )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
