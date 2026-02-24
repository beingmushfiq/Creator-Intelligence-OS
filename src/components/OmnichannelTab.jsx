import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Layers, Sparkles, Copy, Check, Download, RefreshCw, 
  Loader2, Play, Layout, Maximize2, Palette, Zap, 
  ArrowRight, ArrowLeft, Share2, Monitor, Instagram,
  Linkedin, Twitter, Info, MoreHorizontal
} from 'lucide-react';
import { useCreator } from '../context/CreatorContext';
import { useToast } from '../context/ToastContext';
import { getVisualRepurposingPlan, generateImage } from '../engine/aiService';

export default function OmnichannelTab() {
  const { data, setData, topic } = useCreator();
  const { addToast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isGeneratingImg, setIsGeneratingImg] = useState(null);

  const omni = data?.omnichannel || null;

  const handleGeneratePlan = async () => {
    if (!data?.script) {
      addToast('error', 'Generate a script first to build a visual plan');
      return;
    }
    
    setIsLoading(true);
    try {
      const fullScript = data.script.sections ? data.script.sections.map(s => s.content).join('\n\n') : '';
      const plan = await getVisualRepurposingPlan(topic, fullScript);
      setData(prev => ({ ...prev, omnichannel: plan }));
      addToast('success', 'Visual carousel plan created');
      setActiveSlide(0);
    } catch (err) {
      addToast('error', 'Failed to generate visual plan');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenSlideImage = async (index) => {
    if (!omni?.slides[index]) return;
    setIsGeneratingImg(index);
    try {
      const url = await generateImage(omni.slides[index].graphicPrompt, '1024x1024', 'vivid');
      const newSlides = [...omni.slides];
      newSlides[index].image = url;
      setData(prev => ({
        ...prev,
        omnichannel: { ...prev.omnichannel, slides: newSlides }
      }));
      addToast('success', 'Slide visual generated');
    } catch (err) {
      addToast('error', 'Visual generation failed');
    } finally {
      setIsGeneratingImg(null);
    }
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    addToast('success', `Copied ${type} to clipboard`);
  };

  if (!omni && !isLoading) {
    return (
      <div className="tab-content center-content">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="empty-state" 
          style={{ maxWidth: 600 }}
        >
          <div className="empty-state-icon" style={{ background: 'var(--accent-info)15', color: 'var(--accent-info)' }}>
            <Layers size={32} />
          </div>
          <h3>Omnichannel Empire</h3>
          <p>Break the algorithm's silos. Transmute your core content into high-conversion visual carousels optimized for LinkedIn, Instagram, and the modern social web.</p>
          <button onClick={handleGeneratePlan} className="shiny-button" style={{ marginTop: 24, padding: '16px 32px' }}>
            <Zap size={18} /> Scale Content Empire
          </button>
        </motion.div>
      </div>
    );
  }

  if (isLoading) return (
    <div className="tab-content center-content">
       <div style={{ textAlign: 'center' }}>
          <RefreshCw size={48} className="spin" color="var(--accent-primary)" style={{ marginBottom: 24 }} />
          <h3 className="text-gradient" style={{ fontSize: '1.5rem', fontWeight: 800 }}>Repurposing Narrative DNA</h3>
          <p style={{ color: 'var(--text-tertiary)' }}>Mapping slide arcs and cross-platform hooks...</p>
       </div>
    </div>
  );

  const slides = omni?.slides || [];
  const currentSlide = slides[activeSlide];

  return (
    <div className="tab-content">
      <div className="tab-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20 }}>
        <div>
          <h2 className="tab-title text-gradient">Omnichannel Hub</h2>
          <p className="tab-subtitle">Visual storyboards & platform-specific hooks for {topic}</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ display: 'flex', gap: 4, padding: '4px 8px', background: 'var(--bg-tertiary)', borderRadius: 12, border: '1px solid var(--border-subtle)' }}>
             <button className="icon-btn-sm" style={{ background: 'transparent' }}><Instagram size={14} /></button>
             <button className="icon-btn-sm" style={{ background: 'transparent' }}><Linkedin size={14} /></button>
             <button className="icon-btn-sm" style={{ background: 'transparent' }}><Twitter size={14} /></button>
          </div>
          <button onClick={handleGeneratePlan} className="btn-secondary" style={{ padding: '8px 16px' }}><RefreshCw size={18} /></button>
          <button className="shiny-button" style={{ padding: '8px 16px', fontSize: '0.8rem' }} onClick={() => addToast('info', 'PDF Export Coming Soon!')}>
             <Download size={18} /> Export Deck
          </button>
        </div>
      </div>

      <div className="omni-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24, alignItems: 'start' }}>
        
        {/* Carousel Preview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
           <div className="card" style={{ padding: 0, overflow: 'hidden', background: '#080808', aspectRatio: '1/1', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', border: '1px solid var(--border-subtle)', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
              <AnimatePresence mode="wait">
                 <motion.div
                   key={activeSlide}
                   initial={{ opacity: 0, scale: 0.98 }}
                   animate={{ opacity: 1, scale: 1 }}
                   exit={{ opacity: 0, scale: 1.02 }}
                   style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 60, position: 'relative' }}
                 >
                   {currentSlide?.image ? (
                     <motion.img 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        src={currentSlide.image} 
                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} 
                     />
                   ) : (
                     <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, #111 0%, #080808 100%)' }} />
                   )}

                   <div style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
                      <div className="badge badge-purple" style={{ marginBottom: 24, padding: '4px 16px', fontSize: '0.7rem', fontWeight: 900 }}>SLIDE 0{activeSlide + 1}</div>
                      <h1 style={{ fontSize: '3.5rem', fontWeight: 950, color: '#fff', lineHeight: 1, letterSpacing: '-0.04em', marginBottom: 24, textTransform: 'uppercase' }}>
                         {currentSlide?.title}
                      </h1>
                      <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, fontWeight: 500, maxWidth: 500, margin: '0 auto' }}>
                         {currentSlide?.body}
                      </p>
                   </div>
                 </motion.div>
              </AnimatePresence>

              <div style={{ position: 'absolute', bottom: 24, left: 24, right: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
                 <button onClick={() => setActiveSlide(Math.max(0, activeSlide - 1))} disabled={activeSlide === 0} className="btn-mini" style={{ padding: 12, borderRadius: 12, background: 'rgba(255,255,255,0.05)', color: '#fff' }}><ArrowLeft size={18} /></button>
                 <div style={{ display: 'flex', gap: 6 }}>
                    {slides.map((_, i) => (
                       <div key={i} onClick={() => setActiveSlide(i)} style={{ width: 6, height: 6, borderRadius: '50%', background: activeSlide === i ? 'var(--accent-primary)' : 'rgba(255,255,255,0.2)', cursor: 'pointer', transition: 'all 0.2s' }} />
                    ))}
                 </div>
                 <button onClick={() => setActiveSlide(Math.min(slides.length - 1, activeSlide + 1))} disabled={activeSlide === slides.length - 1} className="btn-mini" style={{ padding: 12, borderRadius: 12, background: 'rgba(255,255,255,0.05)', color: '#fff' }}><ArrowRight size={18} /></button>
              </div>
           </div>
        </div>

        {/* Info & Flow */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, position: 'sticky', top: 24 }}>
           <div className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                 <Palette size={18} color="var(--accent-primary)" />
                 <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>Slide Command</h3>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                 <div>
                    <label style={{ fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: 8, display: 'block' }}>Visual Intelligence</label>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>{currentSlide?.visualDescription}</p>
                 </div>

                 <div style={{ padding: 20, background: 'var(--bg-tertiary)', borderRadius: 16, border: '1px solid var(--border-subtle)', position: 'relative' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                       <span style={{ fontSize: '0.65rem', fontWeight: 900, color: 'var(--accent-primary)', textTransform: 'uppercase' }}>AI Background Prompt</span>
                       <div style={{ display: 'flex', gap: 8 }}>
                          <button onClick={() => copyToClipboard(currentSlide?.graphicPrompt, 'Prompt')} className="btn-mini" style={{ padding: 6 }}><Copy size={12} /></button>
                          <button 
                            onClick={() => handleGenSlideImage(activeSlide)} 
                            disabled={isGeneratingImg !== null}
                            className="btn-mini"
                            style={{ padding: 6, background: 'var(--accent-primary)15', color: 'var(--accent-primary)' }}
                          >
                            {isGeneratingImg === activeSlide ? <Loader2 size={12} className="spin" /> : <Zap size={12} />}
                          </button>
                       </div>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontStyle: 'italic', margin: 0, lineHeight: 1.6 }}>"{currentSlide?.graphicPrompt}"</p>
                 </div>
              </div>
           </div>

           <div className="card" style={{ padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Monitor size={18} color="var(--accent-secondary)" />
                    <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>Carousel Flow</h3>
                 </div>
                 <span className="badge badge-primary">{slides.length} Slides</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: 8 }}>
                 {slides.map((s, i) => (
                    <motion.div 
                      key={i} 
                      onClick={() => setActiveSlide(i)}
                      whileHover={{ x: 4 }}
                      style={{ 
                         padding: '12px 16px', background: activeSlide === i ? 'var(--accent-primary)10' : 'var(--bg-tertiary)50', 
                         borderRadius: 12, cursor: 'pointer', border: '1px solid',
                         borderColor: activeSlide === i ? 'var(--accent-primary)40' : 'var(--border-subtle)',
                         transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 12
                      }}
                    >
                       <div style={{ fontSize: '0.8rem', fontWeight: 900, color: activeSlide === i ? 'var(--accent-primary)' : 'var(--text-tertiary)' }}>0{i+1}</div>
                       <span style={{ fontSize: '0.85rem', fontWeight: 600, color: activeSlide === i ? 'var(--text-primary)' : 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.title}</span>
                    </motion.div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
