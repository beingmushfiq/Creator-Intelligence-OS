import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Video, Linkedin, Twitter, FileText, Mail, Instagram, Mic, Copy, Check, 
  Download, RefreshCw, GitMerge, ArrowRight, Sparkles, Zap, Smartphone,
  Layers, Palette, Wand2, ChevronRight, Globe, Info, Clock, Save
} from 'lucide-react';
import { useCreator } from '../context/CreatorContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import EditableText from './ui/EditableText.jsx';

function WorkflowStep({ icon: Icon, label, status }) {
  const isActive = status === 'active';
  const isDone = status === 'done';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, opacity: isDone || isActive ? 1 : 0.3 }}>
      <div className={`glow-border ${isActive ? 'animate-pulse' : ''}`} style={{ 
        width: 36, height: 36, borderRadius: 10, background: 'var(--bg-tertiary)', 
        color: isActive ? 'var(--accent-primary)' : isDone ? 'var(--accent-success)' : 'var(--text-tertiary)',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <Icon size={18} />
      </div>
      <span style={{ fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</span>
      {isDone && <Check size={14} color="var(--accent-success)" />}
    </div>
  );
}

const PLATFORM_CONFIG = {
  shortForm: { icon: Video, color: '#FF0000', label: 'Short-Form Clips' },
  linkedIn: { icon: Linkedin, color: '#0077B5', label: 'LinkedIn Carousel' },
  twitter: { icon: Twitter, color: '#1DA1F2', label: 'Twitter Thread' },
  blog: { icon: FileText, color: '#4CAF50', label: 'Deep Dive Blog' },
  newsletter: { icon: Mail, color: '#FF9800', label: 'Newsletter Special' },
  instagram: { icon: Instagram, color: '#E1306C', label: 'IG Visual Hook' },
  podcast: { icon: Mic, color: '#9C27B0', label: 'Podcast Protocol' }
};

export default function RepurposingTab() {
  const { data, setData, topic } = useCreator();
  const { addToast } = useToast();
  
  const content = data?.repurposed || {};
  const isGenerating = content.isGenerating || false;

  const handleAIGenerate = async () => {
    if (!topic) {
      addToast('error', 'Start a project first!');
      return;
    }
    setData(prev => ({ ...prev, repurposed: { ...prev.repurposed, isGenerating: true } }));
    
    // Simulations of generative progress
    try {
       await new Promise(r => setTimeout(r, 1500));
       // In a real app, this would call aiService.repurposeEverything(topic, script)
       addToast('success', 'Ecosystem repurposing initiated.');
       setData(prev => ({ 
          ...prev, 
          repurposed: { 
             ...prev.repurposed, 
             shortForm: { clips: [{ hook: "The Hook", body: "Body content..." }] },
             linkedIn: { post: "LinkedIn Post content..." },
             isGenerating: false 
          } 
       }));
    } catch(e) {
       addToast('error', 'Repurposing failure.');
       setData(prev => ({ ...prev, repurposed: { ...prev.repurposed, isGenerating: false } }));
    }
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    addToast('success', 'Content captured.');
  };

  return (
    <div className="tab-content animate-slide-up">
      <div className="tab-header" style={{ marginBottom: 40 }}>
        <div className="stagger-children">
          <h2 className="tab-title text-gradient-aurora" style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.04em' }}>Repurposing Arc</h2>
          <p className="tab-subtitle" style={{ fontSize: '1.1rem' }}>Platform-native variant synchronization & narrative expansion</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
           <button onClick={handleAIGenerate} className="btn-primary" disabled={isGenerating} style={{ padding: '12px 24px' }}>
             {isGenerating ? <RefreshCw className="animate-spin" size={18} /> : <GitMerge size={18} />}
             <span>{isGenerating ? 'Synthesizing...' : 'Saturate Ecosystem'}</span>
           </button>
        </div>
      </div>

      <div className="glass" style={{ padding: 24, borderRadius: 24, marginBottom: 40, display: 'flex', gap: 40, justifyContent: 'center', background: 'var(--bg-tertiary)50' }}>
         <WorkflowStep icon={Layers} label="Script Ingestion" status="done" />
         <WorkflowStep icon={Palette} label="Variant Forging" status={isGenerating ? 'active' : content.shortForm ? 'done' : 'idle'} />
         <WorkflowStep icon={Globe} label="Node Sync" status={content.shortForm ? 'done' : 'idle'} />
      </div>

      <div className="stagger-children" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: 28 }}>
         {Object.entries(PLATFORM_CONFIG).map(([key, config]) => {
            const platformData = content[key];
            return (
               <motion.div 
                  key={key} 
                  whileHover={{ y: -6 }}
                  className="glass glass-hover" 
                  style={{ padding: 40, borderRadius: 32, display: 'flex', flexDirection: 'column', gap: 28 }}
               >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div className="glow-border" style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--bg-tertiary)', color: config.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                           <config.icon size={22} />
                        </div>
                        <h3 style={{ fontSize: '1.3rem', fontWeight: 900 }}>{config.label}</h3>
                     </div>
                     {!platformData && !isGenerating && (
                        <span style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--text-tertiary)', background: 'var(--bg-tertiary)', padding: '6px 12px', borderRadius: 100 }}>QUEUED</span>
                     )}
                  </div>

                  {platformData ? (
                     <div className="glass" style={{ padding: 24, borderRadius: 20, background: 'rgba(255,255,255,0.02)', flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                           <span style={{ fontSize: '0.65rem', fontWeight: 950, color: 'var(--accent-primary)', textTransform: 'uppercase' }}>Synchronized Content</span>
                           <button onClick={() => handleCopy(JSON.stringify(platformData))} style={{ background: 'transparent', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer' }}>
                              <Copy size={14} />
                           </button>
                        </div>
                        <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                           {typeof platformData === 'string' ? platformData : JSON.stringify(platformData, null, 2)}
                        </div>
                     </div>
                  ) : (
                     <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40, textAlign: 'center', opacity: 0.3 }}>
                        <config.icon size={48} style={{ marginBottom: 20 }} />
                        <p style={{ fontWeight: 800 }}>Node not yet materialized.</p>
                     </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12 }}>
                     <div style={{ display: 'flex', gap: 10 }}>
                        <button className="btn-secondary" disabled={!platformData} style={{ padding: '10px 20px' }}>
                           <Save size={16} />
                           <span>Save</span>
                        </button>
                     </div>
                     <ArrowRight size={20} style={{ opacity: 0.2 }} />
                  </div>
               </motion.div>
            );
         })}
      </div>
    </div>
  );
}
