import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Palette, Layout, Type, Wand2, CheckCircle, 
  Loader2, Sparkles, Image as ImageIcon, 
  ArrowRight, RefreshCw, Layers, Zap,
  Monitor, Smartphone, Maximize, Share2,
  Trash2, Info
} from 'lucide-react';
import { useCreator } from '../context/CreatorContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { VISUAL_STYLES, ASPECT_RATIOS } from '../engine/visualPrompts.js';
import { dbService } from '../services/dbService.js';
import { RegenerateButton } from './ui/RegenerateButton.jsx';
import { ExportButton } from './ui/ExportButton.jsx';

export default function ThumbnailsTab() {
  const { data, loading, regenerateSection, topic } = useCreator();
  const { addToast } = useToast();
  
  const [generating, setGenerating] = useState(false);
  const [selectedConcept, setSelectedConcept] = useState(0);

  const concepts = data?.thumbnails?.concepts || [];

  const handleGenerateImage = async (conceptIndex) => {
    setGenerating(true);
    addToast('info', 'Materializing visual concept...');
    try {
      // Simulation of image generation
      await new Promise(r => setTimeout(r, 2000));
      addToast('success', 'Visual concept crystallized.');
    } catch (e) {
      addToast('error', 'Crystallization failure.');
    } finally {
      setGenerating(false);
    }
  };

  if (concepts.length === 0) return <EmptyState />;

  return (
    <div className="tab-content animate-slide-up">
      <div className="tab-header" style={{ marginBottom: 40 }}>
        <div className="stagger-children">
          <h2 className="tab-title text-gradient-aurora" style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.04em' }}>Visual Magnetism</h2>
          <p className="tab-subtitle" style={{ fontSize: '1.1rem' }}>High-CTR thumbnail blueprints & visual hook architectures</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <ExportButton section="thumbnails" data={data?.thumbnails} />
          <RegenerateButton onClick={() => regenerateSection('thumbnails')} loading={loading} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 28, alignItems: 'start' }}>
         
         {/* Concept Slider / Viewport */}
         <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            <div className="glass" style={{ padding: 40, borderRadius: 32, minHeight: 450, position: 'relative', overflow: 'hidden' }}>
               <AnimatePresence mode="wait">
                  <motion.div 
                     key={selectedConcept}
                     initial={{ opacity: 0, scale: 0.98 }}
                     animate={{ opacity: 1, scale: 1 }}
                     exit={{ opacity: 0, scale: 1.02 }}
                  >
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                           <div className="glow-border" style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--bg-tertiary)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Layout size={22} />
                           </div>
                           <h3 style={{ fontSize: '1.4rem', fontWeight: 900 }}>Concept: {concepts[selectedConcept].name || `Blueprint 0${selectedConcept + 1}`}</h3>
                        </div>
                        <div className="glass" style={{ padding: '6px 14px', borderRadius: 100, fontSize: '0.65rem', fontWeight: 950, color: 'var(--accent-secondary)' }}>PREDICTIVE CTR: 9.2%</div>
                     </div>

                     <div className="glass glass-hover" style={{ aspectRatio: '16/9', borderRadius: 24, marginBottom: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-tertiary)50', border: '1px dashed var(--border-subtle)', position: 'relative', overflow: 'hidden' }}>
                        <ImageIcon size={64} style={{ opacity: 0.1 }} />
                        <div style={{ position: 'absolute', bottom: 20, left: 20, display: 'flex', gap: 10 }}>
                            <div className="glass" style={{ padding: '4px 10px', borderRadius: 8, fontSize: '0.6rem', fontWeight: 900, background: 'rgba(0,0,0,0.4)', color: '#fff' }}>1920 x 1080</div>
                            <div className="glass" style={{ padding: '4px 10px', borderRadius: 8, fontSize: '0.6rem', fontWeight: 900, background: 'rgba(0,0,0,0.4)', color: '#fff' }}>16:9 RATIO</div>
                        </div>
                     </div>

                     <div className="glass" style={{ padding: 28, borderRadius: 24, background: 'rgba(255,255,255,0.02)' }}>
                        <h4 style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: 12 }}>Visual Directive</h4>
                        <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                           {concepts[selectedConcept].description}
                        </p>
                     </div>
                  </motion.div>
               </AnimatePresence>

               <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 40 }}>
                  {concepts.map((_, i) => (
                     <button 
                        key={i} 
                        onClick={() => setSelectedConcept(i)}
                        className={selectedConcept === i ? 'glass-strong' : 'glass-hover'}
                        style={{ padding: '8px 16px', borderRadius: 12, border: selectedConcept === i ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)', background: 'transparent', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 900, color: selectedConcept === i ? 'var(--accent-primary)' : 'var(--text-tertiary)', transition: 'all 0.3s' }}
                     >
                        0{i + 1}
                     </button>
                  ))}
               </div>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
               <button onClick={() => handleGenerateImage(selectedConcept)} disabled={generating} className="btn-primary" style={{ flex: 1, padding: '16px' }}>
                  {generating ? <RefreshCw className="animate-spin" size={18} /> : <Wand2 size={18} />}
                  <span>Forge Visual Hybrid</span>
               </button>
               <button className="btn-secondary" style={{ padding: '16px 24px' }}>
                  <Maximize size={18} />
               </button>
               <button className="btn-secondary" style={{ padding: '16px 24px' }}>
                  <Share2 size={18} />
               </button>
            </div>
         </div>

         {/* Sidebar / Options */}
         <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            <div className="glass" style={{ padding: 32, borderRadius: 28 }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
                  <div className="glow-border" style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--bg-tertiary)', color: 'var(--accent-warning)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     <Sparkles size={22} />
                  </div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 900 }}>Visual Engine</h3>
               </div>
               <div className="stagger-children" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div className="glass" style={{ padding: '16px 20px', borderRadius: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <Maximize size={14} color="var(--text-tertiary)" />
                        <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Res: 4k Cinematic</span>
                     </div>
                     <ChevronRight size={14} style={{ opacity: 0.3 }} />
                  </div>
                  <div className="glass" style={{ padding: '16px 20px', borderRadius: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <Palette size={14} color="var(--text-tertiary)" />
                        <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Style: Hi-Contrast</span>
                     </div>
                     <ChevronRight size={14} style={{ opacity: 0.3 }} />
                  </div>
               </div>
            </div>

            <div className="glass glass-hover" style={{ padding: 32, borderRadius: 28, background: 'var(--gradient-primary)05', border: '1px solid var(--accent-primary)20' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <Zap size={18} color="var(--accent-primary)" />
                  <span style={{ fontSize: '0.7rem', fontWeight: 950, color: 'var(--accent-primary)', textTransform: 'uppercase' }}>CTR Advice</span>
               </div>
               <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                  Analysis of 200+ top-performing videos in this niche suggests using red/yellow color accents and a "Surprised" face for 22% higher CTR.
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
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass glass-hover" style={{ maxWidth: 480, padding: 48, borderRadius: 32, textAlign: 'center' }}>
        <div className="glow-border" style={{ width: 80, height: 80, borderRadius: 24, background: 'var(--bg-tertiary)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <Palette size={40} />
        </div>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: 16 }}>Visual Magnetism</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6 }}>Generate high-CTR thumbnail blueprints and visual hook architectures focused on algorithmic breakthrough.</p>
      </motion.div>
    </div>
  );
}
