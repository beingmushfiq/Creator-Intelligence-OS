import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ImageIcon, Sparkles, Download, Wand2, 
  Loader2, Trash2, History, Image as ImageBtn,
  Maximize2, X, Info, Zap, Camera, Layout
} from 'lucide-react';
import { useCreator } from '../context/CreatorContext';
import { useToast } from '../context/ToastContext';
import { VISUAL_STYLES, ASPECT_RATIOS } from '../engine/visualPrompts';

export default function VisualsTab() {
  const { topic, assets, setAssets, generateImage, loading: contextLoading } = useCreator();
  const { addToast } = useToast();
  
  const [prompt, setPrompt] = useState(topic || '');
  const [selectedStyle, setSelectedStyle] = useState('mrbeast');
  const [selectedRatio, setSelectedRatio] = useState('landscape');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const handleMagicEnhance = async () => {
    if (!prompt.trim()) return;
    setIsEnhancing(true);
    try {
      const { enhanceImagePrompt } = await import('../engine/aiService');
      const enhanced = await enhanceImagePrompt(prompt);
      setPrompt(enhanced);
      addToast('success', 'Prompt enhanced with AI patterns!');
    } catch (err) {
      addToast('error', 'Enhancement failed');
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    try {
      await generateImage(prompt, selectedStyle, selectedRatio);
      addToast('success', 'Image generated successfully!');
    } catch (err) {
      addToast('error', 'Generation failed. Check your API settings.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = (url, id) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `creator-os-asset-${id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = (id) => {
    setAssets(prev => prev.filter(a => a.id !== id));
    addToast('info', 'Asset removed from project');
  };

  return (
    <div className="tab-content">
      <div className="tab-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20 }}>
        <div>
          <h2 className="tab-title text-gradient">Visual Studio</h2>
          <p className="tab-subtitle">Synthesize high-conversion thumbnails and cinematic assets</p>
        </div>
      </div>

      <div className="visuals-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, alignItems: 'start' }}>
        
        {/* Input Column */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card" 
          style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 24, position: 'sticky', top: 24 }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ padding: 8, background: 'var(--accent-primary)10', color: 'var(--accent-primary)', borderRadius: 10 }}>
                <Sparkles size={18} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Asset Concept</h3>
            </div>
            
            <div style={{ position: 'relative' }}>
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the visual scene..."
                style={{ 
                  width: '100%', minHeight: 120, background: 'var(--bg-tertiary)', 
                  border: '1px solid var(--border-subtle)', borderRadius: 16, padding: '16px',
                  fontSize: '0.9rem', color: 'var(--text-primary)', resize: 'none',
                  outline: 'none', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)'
                }}
              />
              <button 
                onClick={handleMagicEnhance}
                disabled={isEnhancing || !prompt.trim()}
                style={{ 
                  position: 'absolute', bottom: 12, right: 12, 
                  background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)',
                  borderRadius: 10, padding: '4px 8px', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: 6,
                  color: 'var(--accent-primary)', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s'
                }}
              >
                {isEnhancing ? <Loader2 size={12} className="spin" /> : <Wand2 size={12} />}
                Enhance
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
             <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: 8, display: 'block' }}>Visual Style</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
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

             <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: 8, display: 'block' }}>Aspect Ratio</label>
                <div style={{ display: 'flex', gap: 8 }}>
                   {Object.values(ASPECT_RATIOS).map(ratio => (
                     <button
                       key={ratio.id}
                       onClick={() => setSelectedRatio(ratio.id)}
                       style={{
                         flex: 1, padding: '10px', borderRadius: 10, fontSize: '0.75rem', fontWeight: 600,
                         background: selectedRatio === ratio.id ? 'var(--accent-secondary)20' : 'var(--bg-tertiary)',
                         color: selectedRatio === ratio.id ? 'var(--accent-secondary)' : 'var(--text-secondary)',
                         border: `1px solid ${selectedRatio === ratio.id ? 'var(--accent-secondary)40' : 'var(--border-subtle)'}`,
                         display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.2s'
                       }}
                     >
                       <div style={{ width: ratio.id === 'landscape' ? 16 : 8, height: ratio.id === 'landscape' ? 8 : 16, border: '1.5px solid currentColor', borderRadius: 2 }} />
                       {ratio.label}
                     </button>
                   ))}
                </div>
             </div>
          </div>

          <button 
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="shiny-button"
            style={{ padding: '16px', borderRadius: 16, fontSize: '1rem' }}
          >
            {isGenerating ? <Loader2 size={20} className="spin" /> : <ImageIcon size={20} />}
            <span>{isGenerating ? 'Synthesizing...' : 'Generate AI Visual'}</span>
          </button>
        </motion.div>

        {/* Gallery Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <History size={18} color="var(--text-tertiary)" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Generation History</h3>
             </div>
             <span className="badge badge-primary">{assets.length} Assets</span>
          </div>

          {assets.length === 0 ? (
            <div className="card" style={{ minHeight: 400, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-secondary)50', border: '2px dashed var(--border-subtle)', borderRadius: 24, padding: 48, textAlign: 'center' }}>
               <div style={{ width: 80, height: 80, background: 'var(--bg-tertiary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, color: 'var(--text-tertiary)', opacity: 0.5 }}>
                  <ImageIcon size={40} />
               </div>
               <h3 style={{ fontSize: '1.2rem', color: 'var(--text-tertiary)', marginBottom: 12 }}>Design Gallery Empty</h3>
               <p style={{ fontSize: '0.9rem', color: 'var(--text-tertiary)', maxWidth: 300, lineHeight: 1.6 }}>Describe a sequence or thumbnail concept on the left to start generating project assets.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
               <AnimatePresence mode="popLayout">
                 {assets.map((asset, index) => (
                   <motion.div
                     key={asset.id}
                     layout
                     initial={{ opacity: 0, scale: 0.9, y: 10 }}
                     animate={{ opacity: 1, scale: 1, y: 0 }}
                     exit={{ opacity: 0, scale: 0.9 }}
                     transition={{ delay: index * 0.05 }}
                     className="card"
                     style={{ padding: 12, overflow: 'hidden', cursor: 'default' }}
                   >
                     <div 
                       style={{ 
                         width: '100%', 
                         aspectRatio: asset.ratio === 'portrait' ? '9/16' : '16/9', 
                         borderRadius: 12, 
                         overflow: 'hidden', 
                         background: 'var(--bg-primary)',
                         position: 'relative',
                         cursor: 'zoom-in'
                       }}
                       onClick={() => setPreviewImage(asset)}
                     >
                       <img 
                         src={asset.url} 
                         alt={asset.prompt}
                         style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                       />
                       <div className="asset-overlay" style={{
                         position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                         background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                         opacity: 0, transition: 'opacity 0.3s ease', display: 'flex', alignItems: 'flex-end', padding: 16
                       }}>
                         <div style={{ color: 'white' }}>
                            <div style={{ fontSize: '0.6rem', textTransform: 'uppercase', fontWeight: 800, color: 'var(--accent-primary)', marginBottom: 4 }}>Style: {asset.style}</div>
                            <div style={{ fontSize: '0.75rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                               {asset.prompt}
                            </div>
                         </div>
                       </div>
                     </div>

                     <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 4px' }}>
                        <div>
                           <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                              <Camera size={10} /> {asset.ratio === 'portrait' ? '9:16 vertical' : '16:9 cinematic'}
                           </div>
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                           <button onClick={(e) => { e.stopPropagation(); handleDownload(asset.url, asset.id); }} className="btn-mini" title="Download High Res">
                              <Download size={14} />
                           </button>
                           <button onClick={(e) => { e.stopPropagation(); handleDelete(asset.id); }} className="btn-mini" style={{ color: 'var(--accent-danger)', borderColor: 'var(--accent-danger)30' }} title="Delete Asset">
                              <Trash2 size={14} />
                           </button>
                        </div>
                     </div>
                   </motion.div>
                 ))}
               </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Modern Lightbox */}
      <AnimatePresence>
        {previewImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(20px)', zIndex: 1000,
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40
            }}
            onClick={() => setPreviewImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              style={{ maxWidth: 'min(1400px, 90vw)', maxHeight: '85vh', position: 'relative' }}
              onClick={e => e.stopPropagation()}
            >
              <img 
                src={previewImage.url} 
                alt="High res preview" 
                style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 24, boxShadow: '0 40px 100px rgba(0,0,0,0.8)' }}
              />
              <div style={{ 
                position: 'absolute', bottom: -80, left: 0, right: 0, 
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#fff'
              }}>
                <div style={{ maxWidth: '70%' }}>
                   <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 4 }}>{previewImage.prompt}</div>
                   <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', display: 'flex', gap: 16 }}>
                      <span>Style: <strong style={{ color: '#fff' }}>{previewImage.style}</strong></span>
                      <span>Aspect: <strong style={{ color: '#fff' }}>{previewImage.ratio}</strong></span>
                      <span>Date: <strong style={{ color: '#fff' }}>{new Date(previewImage.id).toLocaleDateString()}</strong></span>
                   </div>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button onClick={() => handleDownload(previewImage.url, previewImage.id)} className="shiny-button" style={{ padding: '12px 24px', fontSize: '0.9rem' }}>
                    <Download size={18} /> High-Res PNG
                  </button>
                  <button onClick={() => setPreviewImage(null)} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '12px 24px', borderRadius: 12, cursor: 'pointer', transition: 'all 0.2s' }}>
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .card:hover .asset-overlay {
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );
}
