import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Film, Video, Camera, Layout, Clock, Sparkles, 
  RefreshCw, Download, Play, Image as ImageIcon,
  Zap, Info, ChevronRight, Maximize2, Activity
} from 'lucide-react';
import { useCreator } from '../context/CreatorContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { generateProductionDeck, analyzeVisualPace } from '../engine/aiService.js';
import { ExportButton } from './ui/ExportButton.jsx';

export default function DeckTab() {
  const { data, setData, topic } = useCreator();
  const { addToast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedSlide, setSelectedSlide] = useState(0);

  const deck = data?.deck?.slides || [];
  const pace = data?.deck?.pace || null;

  const handleGenerateDeck = async () => {
    if (!topic) {
      addToast('error', 'Start a project first!');
      return;
    }
    setLoading(true);
    try {
      const scriptText = data?.script?.scenes ? JSON.stringify(data.script.scenes) : '';
      const result = await generateProductionDeck(topic, scriptText);
      setData(prev => ({
        ...prev,
        deck: { 
          ...prev.deck, 
          slides: result.slides,
          pace: result.pace || prev.deck?.pace 
        }
      }));
      addToast('success', 'Production deck materialized');
    } catch (err) {
      addToast('error', 'Deck generation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzePace = async () => {
    setAnalyzing(true);
    try {
      const result = await analyzeVisualPace(deck);
      setData(prev => ({
        ...prev,
        deck: { ...prev.deck, pace: result }
      }));
      addToast('success', 'Visual rhythm analyzed');
    } catch (err) {
      addToast('error', 'Analysis failed');
    } finally {
      setAnalyzing(false);
    }
  };

  if (deck.length === 0) return (
    <div className="tab-content center-content" style={{ minHeight: '60vh' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass glass-hover" style={{ maxWidth: 540, padding: 48, textAlign: 'center', borderRadius: 32 }}>
        <div className="glow-border" style={{ width: 80, height: 80, borderRadius: 24, background: 'var(--bg-tertiary)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <Layout size={40} />
        </div>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: 16 }}>Production Director</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6, marginBottom: 32 }}>Transform your script into a cinematic production deck with visual cues, staging notes, and rhythm analysis.</p>
        <button onClick={handleGenerateDeck} className="btn-primary" style={{ padding: '16px 32px' }}>
          <Sparkles size={18} /> Initialize Production Deck
        </button>
      </motion.div>
    </div>
  );

  return (
    <div className="tab-content animate-slide-up">
      <div className="tab-header" style={{ marginBottom: 40 }}>
        <div className="stagger-children">
          <h2 className="tab-title text-gradient-aurora" style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.04em' }}>Director's Deck</h2>
          <p className="tab-subtitle" style={{ fontSize: '1.1rem' }}>Cinematic staging, visual rhythm & production intelligence</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <ExportButton section="deck" data={data?.deck} />
          <button onClick={handleGenerateDeck} className="btn-secondary" disabled={loading} style={{ padding: '12px 20px' }}>
            {loading ? <RefreshCw className="animate-spin" size={18} /> : <RefreshCw size={18} />}
          </button>
        </div>
      </div>

      <div className="stagger-children" style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 28, alignItems: 'start' }}>
        
        {/* Slides Viewport */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
           <div className="glass" style={{ padding: 40, borderRadius: 32, minHeight: 480, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 32, right: 32 }}>
                 <div className="glass" style={{ padding: '6px 16px', borderRadius: 100, fontSize: '0.7rem', fontWeight: 900, color: 'var(--accent-primary)', letterSpacing: '0.1em' }}>
                    SCENE {selectedSlide + 1} OF {deck.length}
                 </div>
              </div>

              <AnimatePresence mode="wait">
                 <motion.div 
                    key={selectedSlide}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                 >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 32 }}>
                       <div className="glow-border" style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--bg-tertiary)', color: 'var(--accent-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Video size={22} />
                       </div>
                       <h3 style={{ fontSize: '1.5rem', fontWeight: 900 }}>{deck[selectedSlide].sceneName}</h3>
                    </div>

                    <div className="glass" style={{ padding: 32, borderRadius: 24, background: 'rgba(255,255,255,0.02)', marginBottom: 32 }}>
                       <div style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Visual Execution</div>
                       <p style={{ fontSize: '1.2rem', color: 'var(--text-primary)', fontWeight: 600, lineHeight: 1.6, margin: 0 }}>
                          {deck[selectedSlide].visualCues}
                       </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                       <div className="glass" style={{ padding: 24, borderRadius: 20 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                             <Camera size={16} color="var(--accent-secondary)" />
                             <span style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>Camera Move</span>
                          </div>
                          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', margin: 0 }}>{deck[selectedSlide].cameraMove || "Static wide shot with slow push-in"}</p>
                       </div>
                       <div className="glass" style={{ padding: 24, borderRadius: 20 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                             <Clock size={16} color="var(--accent-warning)" />
                             <span style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>Duration</span>
                          </div>
                          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', margin: 0 }}>{deck[selectedSlide].duration || "2.5s"}</p>
                       </div>
                    </div>
                 </motion.div>
              </AnimatePresence>

              {/* Navigation Dot Indicators */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 40 }}>
                 {deck.map((_, i) => (
                    <button 
                       key={i} 
                       onClick={() => setSelectedSlide(i)}
                       style={{ 
                          width: selectedSlide === i ? 24 : 10, 
                          height: 10, 
                          borderRadius: 5, 
                          background: selectedSlide === i ? 'var(--accent-primary)' : 'var(--border-medium)',
                          border: 'none', cursor: 'pointer', transition: 'all 0.3s'
                       }} 
                    />
                 ))}
              </div>
           </div>

           {/* Scene Ribbon */}
           <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 12, scrollbarWidth: 'none' }}>
              {deck.map((s, i) => (
                 <motion.div 
                    key={i}
                    onClick={() => setSelectedSlide(i)}
                    whileHover={{ y: -4 }}
                    className={`glass glass-hover ${selectedSlide === i ? 'glass-strong' : ''}`}
                    style={{ 
                      flexShrink: 0, width: 220, padding: 20, borderRadius: 20, cursor: 'pointer',
                      border: selectedSlide === i ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)'
                    }}
                 >
                    <div style={{ fontSize: '0.65rem', fontWeight: 950, color: 'var(--text-tertiary)', marginBottom: 8 }}>SCENE {i + 1}</div>
                    <p style={{ fontSize: '0.9rem', fontWeight: 700, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.sceneName}</p>
                 </motion.div>
              ))}
           </div>
        </div>

        {/* Intelligence Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
           <div className="glass" style={{ padding: 32, borderRadius: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
                 <div className="glow-border" style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--bg-tertiary)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Activity size={22} />
                 </div>
                 <h3 style={{ fontSize: '1.1rem', fontWeight: 900 }}>Visual Rhythm</h3>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                 <div className="glass" style={{ padding: 24, borderRadius: 20, borderLeft: '4px solid var(--accent-primary)' }}>
                    <div style={{ fontSize: '0.65rem', fontWeight: 900, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Pacing Score</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 950 }}>{pace?.score || 92}%</div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 8 }}>Visual energy matches market velocity standards.</p>
                 </div>

                 <button onClick={handleAnalyzePace} className="btn-secondary" style={{ width: '100%', padding: '14px' }}>
                    {analyzing ? <RefreshCw className="animate-spin" size={16} /> : <Wand2 size={16} />}
                    <span>Recalculate Energy</span>
                 </button>
              </div>
           </div>

           <div className="glass glass-hover" style={{ padding: 32, borderRadius: 28, background: 'var(--gradient-primary)', color: '#fff', border: 'none' }}>
              <Play size={40} style={{ marginBottom: 16, opacity: 0.8 }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: 12 }}>Pre-Production Sync</h3>
              <p style={{ fontSize: '0.85rem', opacity: 0.9, marginBottom: 24, lineHeight: 1.6 }}>Initialize visual asset generation for all scene cues to begin production phase.</p>
              <button style={{ width: '100%', padding: '14px', borderRadius: 12, border: 'none', background: '#fff', color: 'var(--accent-primary)', fontWeight: 900, cursor: 'pointer' }}>
                 Begin Production
              </button>
           </div>
        </div>

      </div>
    </div>
  );
}
