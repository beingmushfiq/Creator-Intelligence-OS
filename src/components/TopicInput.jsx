import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Search, Sparkles, Send, Zap, 
  RefreshCw, Smile, Brain, Rocket, 
  ChevronRight, ArrowRight, Zap as ZapIcon,
  Layers, FileText, Activity, Globe
} from 'lucide-react';
import { useCreator } from '../context/CreatorContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

const TONE_PRESETS = [
  { value: 'Educational',  label: '🎓 Educational' },
  { value: 'Analytical',    label: '📊 Analytical' },
  { value: 'Aggressive',    label: '🔥 Aggressive' },
  { value: 'Philosophical', label: '🧠 Philosophical' },
  { value: 'Satirical',     label: '😏 Satirical' },
];

const GENERATION_MODES = [
  { id: 'full',   label: 'Full Strategy', icon: Layers   },
  { id: 'quick',  label: 'Quick Outline', icon: Zap      },
  { id: 'script', label: 'Script Focus',  icon: FileText },
];

export default function TopicInput() {
  const { topic, setTopic, data, generateTopicIdeas, loading } = useCreator();
  const { addToast } = useToast();
  const [inputValue, setInputValue] = useState(topic || '');
  const [isFocused, setIsFocused] = useState(false);

  const handleGenerate = async () => {
    if (!inputValue.trim()) {
      addToast('error', 'Topic node required for synthesis.');
      return;
    }
    setTopic(inputValue);
    try {
      await generateTopicIdeas(inputValue);
      addToast('success', 'Workspace synchronized with intelligence.');
    } catch (e) {
      addToast('error', 'Synthesis failed.');
    }
  };

  return (
    <div style={{ padding: '0 40px 40px', position: 'relative', zIndex: 900 }}>
       <motion.div 
         className={`glass ${isFocused ? 'glass-strong' : ''}`}
         style={{ 
            padding: 32, borderRadius: 32, 
            border: `1px solid ${isFocused ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
            boxShadow: isFocused ? 'var(--shadow-glow)' : 'var(--shadow-sm)',
            transition: 'all 0.4s var(--ease-premium)'
         }}
       >
         <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div className="glow-border" style={{ width: 52, height: 52, borderRadius: 16, background: 'var(--bg-tertiary)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
               <Brain size={26} />
            </div>
            <div style={{ flex: 1, position: 'relative' }}>
               <input 
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                  placeholder="Initiate strategic topic loop... (e.g., 'The future of decentralized AI')"
                  style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border-subtle)', padding: '12px 0', fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', outline: 'none' }}
               />
               <AnimatePresence>
                 {inputValue && (
                    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)' }}>
                       <button onClick={handleGenerate} disabled={loading} className="btn-primary" style={{ padding: '10px 24px', borderRadius: 12 }}>
                          {loading ? <RefreshCw className="animate-spin" size={18} /> : <Zap size={18} />}
                          <span>Execute</span>
                       </button>
                    </motion.div>
                 )}
               </AnimatePresence>
            </div>
         </div>

         {/* Tone & Modes */}
         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 32 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
               <span style={{ fontSize: '0.7rem', fontWeight: 950, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Neural Tone</span>
               <div className="glass" style={{ padding: '4px', borderRadius: 100, display: 'flex', gap: 4 }}>
                  {TONE_PRESETS.map(tone => (
                     <button key={tone.value} className="glass-hover" style={{ padding: '6px 14px', borderRadius: 100, border: 'none', background: 'transparent', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', color: 'var(--text-secondary)' }}>
                        {tone.label}
                     </button>
                  ))}
               </div>
            </div>

            <div style={{ display: 'flex', gap: 20 }}>
               {GENERATION_MODES.map(mode => (
                  <div key={mode.id} className="glass glass-hover" style={{ padding: '10px 16px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                     <mode.icon size={16} color="var(--accent-primary)" />
                     <span style={{ fontSize: '0.8rem', fontWeight: 850, color: 'var(--text-secondary)' }}>{mode.label}</span>
                  </div>
               ))}
            </div>
         </div>
       </motion.div>
    </div>
  );
}
