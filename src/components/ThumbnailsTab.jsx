import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Palette, Layout, Type, Wand2, CheckCircle, 
  Loader2, Sparkles, Image as ImageIcon, 
  Zap, Eye, Target, Layers, Download, Trash2, Camera, Info
} from 'lucide-react';
import { useCreator } from '../context/CreatorContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { generateImage, enhanceImagePrompt } from '../engine/aiService';
import { VISUAL_STYLES, ASPECT_RATIOS } from '../engine/visualPrompts';
import { dbService } from '../services/dbService';
import { RegenerateButton } from './ui/RegenerateButton';
import { ExportButton } from './ui/ExportButton';

export default function ThumbnailsTab() {
  const { data, loading, regenerateSection } = useCreator();
  const { user } = useAuth();
  const { addToast } = useToast();
  const tb = data?.thumbnails;

  const [generatedImages, setGeneratedImages] = useState([]);
  const [loadingImage, setLoadingImage] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState('mrbeast');
  const [selectedRatio, setSelectedRatio] = useState('landscape');
  const [customPrompt, setCustomPrompt] = useState('');
  const [isEnhancing, setIsEnhancing] = useState(false);

  useEffect(() => {
    if (tb?.aiPrompt?.midjourney) {
      setCustomPrompt(tb.aiPrompt.midjourney);
    }
  }, [tb]);

  const handleEnhance = async () => {
    if (!customPrompt) return;
    setIsEnhancing(true);
    try {
      const enhanced = await enhanceImagePrompt(customPrompt);
      setCustomPrompt(enhanced);
      addToast('success', 'Prompt enhanced by AI!');
    } catch (e) {
      addToast('error', 'Enhancement failed');
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleGenerateImage = async () => {
    try {
      setLoadingImage(true);
      addToast('info', `Synthesizing ${VISUAL_STYLES[selectedStyle].label} thumbnail...`);
      const url = await generateImage(customPrompt, selectedStyle, selectedRatio);
      
      const newImage = {
        url,
        style: selectedStyle,
        ratio: selectedRatio,
        prompt: customPrompt,
        timestamp: Date.now(),
        id: Date.now()
      };

      setGeneratedImages(prev => [newImage, ...prev]);
      addToast('success', 'Thumbnail synthesized successfully!');

      if (user) {
        try {
          await dbService.saveAsset(user.id, null, 'image', url, customPrompt);
        } catch (e) {
          console.warn('Asset save skipped:', e.message);
        }
      }
    } catch (err) {
      addToast('error', 'Synthesis failed. Check API connection.');
    } finally {
      setLoadingImage(false);
    }
  };

  if (!tb) return <EmptyState />;

  return (
    <div className="tab-content">
      <div className="tab-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20 }}>
        <div>
          <h2 className="tab-title text-gradient">Thumbnail Psychology Engine</h2>
          <p className="tab-subtitle">Visual concept framework, archetype analysis, and AI optimization</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <ExportButton section="thumbnails" data={tb} />
          <RegenerateButton onClick={() => regenerateSection('thumbnails')} loading={loading} />
        </div>
      </div>

      <div className="thumbnails-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 24 }}>
        
        {/* Left Col: Analysis & Strategy */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
           {/* Visual Concept */}
           <motion.div 
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             className="card" 
             style={{ padding: 24 }}
           >
              <h3 style={{ marginBottom: 20, fontSize: '1.1rem', fontWeight: 800 }}>Visual Concept Framework</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                 {[
                   { icon: Zap, label: 'Emotion', val: tb.visualConcept.primaryEmotion, color: 'var(--accent-danger)' },
                   { icon: Palette, label: 'Colors', val: tb.visualConcept.colorPsychology, color: 'var(--accent-warning)' },
                   { icon: Layout, label: 'Structure', val: tb.visualConcept.compositionStructure, color: 'var(--accent-primary)' },
                   { icon: Layers, label: 'Depth', val: tb.visualConcept.depthLayering, color: 'var(--accent-info)' },
                   { icon: Eye, label: 'Flow', val: tb.visualConcept.eyeDirectionFlow, color: 'var(--accent-secondary)' },
                   { icon: Target, label: 'Focus', val: tb.visualConcept.focalTensionPoint, color: 'var(--accent-success)' },
                 ].map((item, i) => (
                   <div key={i} style={{ padding: 12, background: 'var(--bg-tertiary)', borderRadius: 12, border: '1px solid var(--border-subtle)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                         <item.icon size={12} color={item.color} />
                         <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>{item.label}</span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 600, lineHeight: 1.4 }}>{item.val}</div>
                   </div>
                 ))}
              </div>
           </motion.div>

           {/* Archetype */}
           <motion.div 
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
             className="card" 
             style={{ padding: 24 }}
           >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                 <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Thumbnail Archetype</h3>
                 <span className="badge badge-green">OPTIMIZED</span>
              </div>
              <div style={{ padding: 16, background: 'var(--accent-success)05', borderRadius: 16, border: '1px solid var(--accent-success)20', marginBottom: 20 }}>
                 <div style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--accent-success)', marginBottom: 8 }}>{tb.archetype.selected}</div>
                 <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{tb.archetype.reasoning}</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                 {tb.archetype.alternatives.map((alt, i) => (
                   <div key={i} style={{ padding: 12, background: 'var(--bg-tertiary)', borderRadius: 12, border: '1px solid var(--border-subtle)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, alignItems: 'center' }}>
                         <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{alt.name}</span>
                         <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--accent-primary)' }}>{75 + (i * 4)}% Fit</span>
                      </div>
                      <div className="progress-bg" style={{ height: 4, marginBottom: 8 }}>
                         <div className="progress-fill" style={{ width: `${75 + (i * 4)}%`, background: 'var(--accent-primary)' }} />
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{alt.note}</div>
                   </div>
                 ))}
              </div>
           </motion.div>
        </div>

        {/* Right Col: Text & Studio */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
           {/* Text Strategy */}
           <motion.div 
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2 }}
             className="card" 
             style={{ padding: 24, border: '1px solid var(--accent-secondary)30', background: 'var(--accent-secondary)02' }}
           >
              <h3 style={{ marginBottom: 20, fontSize: '1.1rem', fontWeight: 800 }}>Text Overlay Strategy</h3>
              <div style={{ 
                fontSize: '2rem', fontWeight: 900, textAlign: 'center', padding: '32px 20px', 
                background: 'linear-gradient(135deg, #FFDD00 0%, #FBB03B 100%)', color: 'black', 
                borderRadius: 20, marginBottom: 20, textTransform: 'uppercase', letterSpacing: '-0.03em',
                boxShadow: '0 10px 30px rgba(251, 176, 59, 0.3)', textShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                {tb.textOverlay.text}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                 <div style={{ fontSize: '0.85rem' }}><span style={{ color: 'var(--text-tertiary)' }}>Font:</span> <strong>{tb.textOverlay.fontPersonality}</strong></div>
                 <div style={{ fontSize: '0.85rem' }}><span style={{ color: 'var(--text-tertiary)' }}>Contrast:</span> <strong>{tb.textOverlay.contrast}</strong></div>
                 <div style={{ fontSize: '0.85rem' }}><span style={{ color: 'var(--text-tertiary)' }}>Placement:</span> <strong>{tb.textOverlay.placement}</strong></div>
                 <div style={{ fontSize: '0.85rem' }}><span style={{ color: 'var(--text-tertiary)' }}>Format:</span> <strong>{tb.textOverlay.capitalization}</strong></div>
              </div>
           </motion.div>

           {/* Studio */}
           <motion.div 
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.3 }}
             className="card" 
             style={{ padding: 24 }}
           >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                 <div style={{ padding: 8, background: 'var(--accent-primary)10', color: 'var(--accent-primary)', borderRadius: 10 }}>
                    <Sparkles size={18} />
                 </div>
                 <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Thumbnail Studio</h3>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                 <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: 8, display: 'block' }}>Visual Style</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 8 }}>
                       {Object.values(VISUAL_STYLES).map(style => (
                         <button
                           key={style.id}
                           onClick={() => setSelectedStyle(style.id)}
                           style={{
                             padding: '10px', borderRadius: 10, fontSize: '0.75rem', fontWeight: 600,
                             background: selectedStyle === style.id ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                             color: selectedStyle === style.id ? 'white' : 'var(--text-secondary)',
                             border: '1px solid var(--border-subtle)', transition: 'all 0.2s'
                           }}
                         >
                           {style.label}
                         </button>
                       ))}
                    </div>
                 </div>

                 <div style={{ position: 'relative' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                       <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Midjourney Prompt</label>
                       <button 
                         onClick={handleEnhance} 
                         disabled={isEnhancing}
                         style={{ fontSize: '0.7rem', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}
                       >
                         {isEnhancing ? <Loader2 size={12} className="spin" /> : <Wand2 size={12} />}
                         Enhance
                       </button>
                    </div>
                    <textarea
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      style={{
                        width: '100%', minHeight: 100, padding: 12, borderRadius: 12, outline: 'none',
                        background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)',
                        color: 'var(--text-primary)', fontSize: '0.85rem', resize: 'vertical', lineHeight: 1.5
                      }}
                    />
                 </div>

                 <button
                   onClick={handleGenerateImage}
                   disabled={loadingImage || !customPrompt}
                   className="shiny-button"
                   style={{ padding: '16px', borderRadius: 16 }}
                 >
                   {loadingImage ? <Loader2 size={20} className="spin" /> : <ImageIcon size={20} />}
                   <span>{loadingImage ? 'Synthesizing...' : 'Generate Viral Thumbnail'}</span>
                 </button>
              </div>
           </motion.div>
        </div>
      </div>

      {/* Gallery Section */}
      {generatedImages.length > 0 && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          style={{ marginTop: 48 }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <History size={18} color="var(--text-tertiary)" />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Generated Assets</h3>
             </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
            {generatedImages.map((img, i) => (
              <motion.div 
                key={img.id} 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card" 
                style={{ padding: 12, overflow: 'hidden' }}
              >
                <div style={{ width: '100%', aspectRatio: '16/9', borderRadius: 12, overflow: 'hidden', position: 'relative', background: 'var(--bg-primary)' }}>
                   <img src={img.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                   <div className="asset-overlay" style={{
                      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                      opacity: 0, transition: 'opacity 0.3s ease', display: 'flex', alignItems: 'flex-end', padding: 16
                   }}>
                      <div style={{ color: 'white' }}>
                         <div style={{ fontSize: '0.6rem', textTransform: 'uppercase', fontWeight: 800, color: 'var(--accent-primary)', marginBottom: 4 }}>Style: {VISUAL_STYLES[img.style]?.label}</div>
                         <div style={{ fontSize: '0.75rem', fontWeight: 600 }}>{img.prompt}</div>
                      </div>
                   </div>
                </div>
                <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 4px' }}>
                   <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>16:9 Landscape</div>
                   <div style={{ display: 'flex', gap: 8 }}>
                      <a href={img.url} download target="_blank" className="btn-mini"><Download size={14} /></a>
                   </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      <style jsx>{`
        .card:hover .asset-overlay { opacity: 1 !important; }
      `}</style>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="tab-content">
      <div className="empty-state">
        <div className="empty-state-icon"><ImageIcon size={32} /></div>
        <h3>Analysis Pending</h3>
        <p>Generate a topic to unlock thumbnail psychology frameworks, archetype analysis, and AI optimization.</p>
      </div>
    </div>
  );
}
