import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ImageIcon, Sparkles, Download, Wand2, 
  Loader2, Trash2, History, Image as ImageBtn,
  Maximize2, X, Info, Zap, Camera, Layout,
  Layers, RefreshCw, ChevronRight, Share2,
  Maximize
} from 'lucide-react';
import { useToast } from '../context/ToastContext.jsx';
import { generateImage } from '../engine/aiService.js';
import { VISUAL_STYLES, ASPECT_RATIOS } from '../engine/visualPrompts.js';
import { dbService } from '../services/dbService.js';

export default function VisualsTab() {
  const { addToast } = useToast();
  const [prompt, setPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [assets, setAssets] = useState([]);
  const [selectedStyle, setSelectedStyle] = useState(VISUAL_STYLES[0]);
  const [selectedRatio, setSelectedRatio] = useState(ASPECT_RATIOS[0]);
  const [previewImage, setPreviewImage] = useState(null);

  const loadAssets = async () => {
    try {
      const data = await dbService.getAssets();
      setAssets(data || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => { loadAssets(); }, []);

  const handleGenerate = async () => {
    if (!prompt) return;
    setGenerating(true);
    addToast('info', 'Engaging visual forge...');
    try {
      const url = await generateImage(prompt, selectedStyle, selectedRatio.value);
      await dbService.saveAsset({
        type: 'image',
        url,
        prompt,
        metadata: { style: selectedStyle, ratio: selectedRatio.label }
      });
      loadAssets();
      addToast('success', 'Visual asset crystallized.');
    } catch (e) {
      addToast('error', 'Forge failure.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="tab-content animate-slide-up">
      <div className="tab-header" style={{ marginBottom: 40 }}>
        <div className="stagger-children">
          <h2 className="tab-title text-gradient-aurora" style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.04em' }}>Visual Forge</h2>
          <p className="tab-subtitle" style={{ fontSize: '1.1rem' }}>High-fidelity neural image generation & asset library orchestration</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
           <button onClick={loadAssets} className="btn-secondary" style={{ padding: '12px' }}>
              <RefreshCw size={18} />
           </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 28 }}>
         
         <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            
            {/* Forge Control Panel */}
            <div className="glass" style={{ padding: 40, borderRadius: 32 }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 32 }}>
                  <div className="glow-border" style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--bg-tertiary)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     <Wand2 size={22} />
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 900 }}>Forge Directive</h3>
               </div>

               <textarea 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your visual concept... (e.g., 'Cyberpunk city at dusk, ultra-realistic')"
                  style={{ width: '100%', minHeight: 140, background: 'var(--bg-tertiary)50', border: '1px solid var(--border-subtle)', borderRadius: 20, padding: 24, fontSize: '1.1rem', color: 'var(--text-primary)', resize: 'none', marginBottom: 32 }}
               />

               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 40 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                     <span style={{ fontSize: '0.7rem', fontWeight: 950, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Visual Archetype</span>
                     <div className="glass" style={{ padding: '4px', borderRadius: 12, display: 'flex', gap: 4 }}>
                        {VISUAL_STYLES.slice(0, 3).map(style => (
                           <button 
                              key={style}
                              onClick={() => setSelectedStyle(style)}
                              className={`glass-hover ${selectedStyle === style ? 'glass-strong' : ''}`}
                              style={{ flex: 1, padding: '10px', borderRadius: 8, border: 'none', background: 'transparent', fontSize: '0.75rem', fontWeight: 850, color: selectedStyle === style ? 'var(--accent-primary)' : 'var(--text-tertiary)', cursor: 'pointer' }}
                           >
                              {style}
                           </button>
                        ))}
                     </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                     <span style={{ fontSize: '0.7rem', fontWeight: 950, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Aspect Protocol</span>
                     <div className="glass" style={{ padding: '4px', borderRadius: 12, display: 'flex', gap: 4 }}>
                        {ASPECT_RATIOS.map(ratio => (
                           <button 
                              key={ratio.label}
                              onClick={() => setSelectedRatio(ratio)}
                              className={`glass-hover ${selectedRatio.label === ratio.label ? 'glass-strong' : ''}`}
                              style={{ flex: 1, padding: '10px', borderRadius: 8, border: 'none', background: 'transparent', fontSize: '0.75rem', fontWeight: 850, color: selectedRatio.label === ratio.label ? 'var(--accent-primary)' : 'var(--text-tertiary)', cursor: 'pointer' }}
                           >
                              {ratio.label}
                           </button>
                        ))}
                     </div>
                  </div>
               </div>

               <button onClick={handleGenerate} disabled={generating || !prompt} className="btn-primary" style={{ width: '100%', padding: '20px', borderRadius: 20 }}>
                  {generating ? <RefreshCw className="animate-spin" size={20} /> : <Zap size={20} />}
                  <span style={{ fontSize: '1.1rem', fontWeight: 950 }}>{generating ? 'Crystallizing Visuals...' : 'Execute Asset Forge'}</span>
               </button>
            </div>

            {/* Recent Assets Library */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
               <h3 style={{ fontSize: '1.4rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <ImageIcon size={24} color="var(--accent-secondary)" /> Asset Archives
               </h3>
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 24 }}>
                  {assets.map((asset, i) => (
                     <motion.div 
                        key={asset.id} 
                        whileHover={{ scale: 1.02, y: -4 }}
                        className="glass glass-hover" 
                        style={{ borderRadius: 24, overflow: 'hidden', position: 'relative' }}
                     >
                        <div style={{ aspectRatio: '1/1', background: 'var(--bg-tertiary)', overflow: 'hidden' }}>
                           <img src={asset.url} alt={asset.prompt} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
                        </div>
                        <div style={{ padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                           <div className="glass" style={{ padding: '4px 8px', borderRadius: 6, fontSize: '0.6rem', fontWeight: 950, color: 'var(--text-tertiary)' }}>{asset.metadata?.ratio || '1:1'}</div>
                           <div style={{ display: 'flex', gap: 8 }}>
                              <button className="btn-ghost" style={{ padding: 6 }}><Download size={14} /></button>
                              <button className="btn-ghost" style={{ padding: 6 }}><Trash2 size={14} color="var(--accent-danger)" /></button>
                           </div>
                        </div>
                     </motion.div>
                  ))}
               </div>
            </div>
         </div>

         {/* Sidebar / Engine Status */}
         <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            <div className="glass" style={{ padding: 32, borderRadius: 28 }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
                  <div className="glow-border" style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--bg-tertiary)', color: 'var(--accent-warning)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     <Layers size={22} />
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 900 }}>Engine Telemetry</h3>
               </div>
               <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div className="glass" style={{ padding: '16px 20px', borderRadius: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-tertiary)' }}>GPU Load</span>
                     <span style={{ fontWeight: 950, color: 'var(--accent-success)' }}>Idle</span>
                  </div>
                  <div className="glass" style={{ padding: '16px 20px', borderRadius: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-tertiary)' }}>Model Rank</span>
                     <span style={{ fontWeight: 950, color: 'var(--accent-primary)' }}>SD 5.0 LUX</span>
                  </div>
               </div>
            </div>

            <div className="glass glass-hover" style={{ padding: 32, borderRadius: 28, background: 'var(--gradient-primary)05', border: '1px solid var(--accent-primary)20' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <Sparkles size={18} color="var(--accent-primary)" />
                  <span style={{ fontSize: '0.7rem', fontWeight: 950, color: 'var(--accent-primary)', textTransform: 'uppercase' }}>Aesthetic Tip</span>
               </div>
               <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                  Using "Volumetric Lighting" in your directives currently results in a 14% higher engagement lift for industrial tech niches.
               </p>
            </div>
         </div>

      </div>
    </div>
  );
}
