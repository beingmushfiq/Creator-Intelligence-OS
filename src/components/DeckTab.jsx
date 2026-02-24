import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Film, Video, Camera, Layout, Clock, Sparkles, 
  RefreshCw, Download, Play, Image as ImageIcon,
  Activity, Layers, Zap, Maximize2, ChevronRight,
  Target, AlertCircle, Info, Trash2
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, ResponsiveContainer 
} from 'recharts';
import { useCreator } from '../context/CreatorContext';
import { useToast } from '../context/ToastContext';
import { generateProductionDeck, analyzeVisualPace } from '../engine/aiService';
import { ExportButton } from './ui/ExportButton';

export default function DeckTab() {
  const { data, loading, regenerateSection, setData } = useCreator();
  const { addToast } = useToast();
  
  const deck = data?.productionDeck;
  const script = data?.script;
  const dnaSnippet = data?.genome?.dna_snippet;

  const [activeBeat, setActiveBeat] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [analyzingPace, setAnalyzingPace] = useState(false);

  const handleGenerateDeck = async () => {
    if (!script) {
      addToast('error', 'Please generate a script first');
      return;
    }
    
    setIsGenerating(true);
    try {
      const scriptText = script.sections.map(s => s.content).join('\n\n');
      const result = await generateProductionDeck(scriptText, dnaSnippet);
      
      setData(prev => ({
        ...prev,
        productionDeck: result
      }));
      addToast('success', 'Production Deck generated!');
    } catch (err) {
      addToast('error', 'Deck generation failed');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnalyzePace = async () => {
    if (!deck?.beats) return;
    setAnalyzingPace(true);
    try {
      const result = await analyzeVisualPace(deck.beats, dnaSnippet);
      setData(prev => ({
        ...prev,
        productionDeck: {
          ...prev.productionDeck,
          paceAnalysis: result
        }
      }));
      addToast('success', 'Visual Pace analysis complete');
    } catch (err) {
      addToast('error', 'Pace analysis failed');
    } finally {
      setAnalyzingPace(false);
    }
  };

  const paceData = useMemo(() => {
    if (!deck?.beats) return [];
    return deck.beats.map((b, i) => ({
      name: b.timestamp,
      velocity: 80 + Math.sin(i) * 20,
      threshold: 75
    }));
  }, [deck]);

  if (!deck && !loading && !isGenerating) {
    return (
      <div className="tab-content center-content">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="empty-state" 
          style={{ maxWidth: 600 }}
        >
           <div className="empty-state-icon" style={{ background: 'var(--accent-secondary)15', color: 'var(--accent-secondary)' }}>
              <Film size={32} />
           </div>
           <h3>Production Deck Visualizer</h3>
           <p>Transform your script into a cinematic, beat-by-beat storyboard with professional direction and visual pacing.</p>
           <button onClick={handleGenerateDeck} className="shiny-button" style={{ marginTop: 24, padding: '16px 32px' }}>
              <Zap size={18} />
              <span>Initialize Storyboard Engine</span>
           </button>
        </motion.div>
      </div>
    );
  }

  if (isGenerating) {
    return (
      <div className="tab-content center-content">
        <div style={{ textAlign: 'center' }}>
           <RefreshCw size={48} className="spin" color="var(--accent-primary)" style={{ marginBottom: 24 }} />
           <h3 className="text-gradient" style={{ fontSize: '1.5rem', fontWeight: 800 }}>Synthesizing Production Deck</h3>
           <p style={{ color: 'var(--text-tertiary)' }}>Calculating visual beats, aspect ratios, and cinematographic cues...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="tab-content">
      <div className="tab-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20 }}>
        <div>
          <h2 className="tab-title text-gradient">Production Deck</h2>
          <p className="tab-subtitle">Cinematic storyboard grid & visual velocity mapping</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={handleAnalyzePace} disabled={analyzingPace} className="btn-secondary" style={{ fontSize: '0.8rem' }}>
             <Activity size={14} className={analyzingPace ? 'spin' : ''} />
             <span>Visual Pacing</span>
          </button>
          <button onClick={handleGenerateDeck} className="btn-secondary" style={{ fontSize: '0.8rem' }}>
             <RefreshCw size={14} />
             <span>Regenerate</span>
          </button>
          <ExportButton section="productionDeck" data={deck} />
        </div>
      </div>

      <div className="deck-layout" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 24, alignItems: 'start' }}>
        
        {/* Storyboard Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                 <Layout size={18} color="var(--text-tertiary)" />
                 <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Keyframe Sequence</h3>
              </div>
              <span className="badge badge-primary">{deck.beats.length} Visual Beats</span>
           </div>

           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
             {deck.beats.map((beat, i) => (
               <motion.div 
                 key={i}
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ delay: i * 0.05 }}
                 onClick={() => setActiveBeat(i)}
                 className={`card storyboard-card ${activeBeat === i ? 'active' : ''}`}
                 style={{ 
                   padding: 12, overflow: 'hidden', cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                   borderWidth: 2, borderColor: activeBeat === i ? 'var(--accent-primary)' : 'var(--border-subtle)',
                   background: activeBeat === i ? 'var(--accent-primary)05' : 'var(--bg-secondary)'
                 }}
               >
                  <div style={{ 
                    width: '100%', aspectRatio: '16/9', background: 'var(--bg-tertiary)', borderRadius: 8, 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)30',
                    position: 'relative', overflow: 'hidden', border: '1px solid var(--border-subtle)'
                  }}>
                     <ImageIcon size={24} />
                     <div style={{ position: 'absolute', top: 6, left: 6, fontSize: '0.6rem', fontWeight: 900, padding: '2px 6px', background: 'rgba(0,0,0,0.5)', borderRadius: 4, color: 'white', letterSpacing: '0.05em' }}>
                        {beat.timestamp}
                     </div>
                  </div>
                  <div style={{ marginTop: 10 }}>
                     <div style={{ fontSize: '0.65rem', color: 'var(--accent-primary)', fontWeight: 800, marginBottom: 2, textTransform: 'uppercase' }}>Beat {i + 1}</div>
                     <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)', height: 32, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                        {beat.scriptBeat}
                     </p>
                  </div>
               </motion.div>
             ))}
           </div>
        </div>

        {/* Intelligence Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, position: 'sticky', top: 24 }}>
           <AnimatePresence mode="wait">
             <motion.div 
               key={activeBeat}
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               className="card"
               style={{ padding: 32, border: '1px solid var(--accent-primary)20', background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%)' }}
             >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--accent-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>
                         {activeBeat + 1}
                      </div>
                      <div>
                         <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Frame Insight</h3>
                         <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>Production Cue - {deck.beats[activeBeat].timestamp}</div>
                      </div>
                   </div>
                   <button className="btn-mini"><Maximize2 size={16} /></button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                   <div>
                      <label style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: 8, display: 'block' }}>Visual Prompt (AI Optimization)</label>
                      <div style={{ padding: 16, background: 'var(--bg-primary)', borderRadius: 16, border: '1px solid var(--border-subtle)', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                        "{deck.beats[activeBeat].visualPrompt}"
                      </div>
                   </div>

                   <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                      <div style={{ padding: 16, background: 'var(--bg-primary)', borderRadius: 16, border: '1px solid var(--border-subtle)' }}>
                         <Camera size={14} color="var(--accent-primary)" style={{ marginBottom: 12 }} />
                         <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: 4 }}>Cinematography</div>
                         <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{deck.beats[activeBeat].direction.camera}</div>
                      </div>
                      <div style={{ padding: 16, background: 'var(--bg-primary)', borderRadius: 16, border: '1px solid var(--border-subtle)' }}>
                         <Zap size={14} color="var(--accent-warning)" style={{ marginBottom: 12 }} />
                         <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: 4 }}>Motion Intensity</div>
                         <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{deck.beats[activeBeat].direction.motion}</div>
                      </div>
                   </div>

                   <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                         <label style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Visual Velocity Map</label>
                         <span style={{ fontSize: '0.7rem', color: 'var(--accent-primary)', fontWeight: 800 }}>82% Pacing Efficiency</span>
                      </div>
                      <div style={{ height: 120, width: '100%', background: 'var(--bg-primary)50', borderRadius: 16, padding: 10, border: '1px solid var(--border-subtle)' }}>
                         <ResponsiveContainer width="100%" height="100%">
                           <AreaChart data={paceData}>
                             <defs>
                               <linearGradient id="colorVel" x1="0" y1="0" x2="0" y2="1">
                                 <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.3}/>
                                 <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0}/>
                               </linearGradient>
                             </defs>
                             <Area 
                               type="monotone" 
                               dataKey="velocity" 
                               stroke="var(--accent-primary)" 
                               fillOpacity={1} 
                               fill="url(#colorVel)" 
                               strokeWidth={3}
                             />
                           </AreaChart>
                         </ResponsiveContainer>
                      </div>
                   </div>

                   {deck.paceAnalysis && (
                     <div style={{ padding: 20, background: 'var(--accent-danger)05', border: '1px solid var(--accent-danger)20', borderRadius: 16, display: 'flex', gap: 12 }}>
                        <AlertCircle size={20} color="var(--accent-danger)" style={{ flexShrink: 0 }} />
                        <div>
                           <div style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--accent-danger)', textTransform: 'uppercase', marginBottom: 4 }}>Retention Risk Detected</div>
                           <p style={{ fontSize: '0.85rem', margin: 0, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{deck.paceAnalysis.analysis}</p>
                        </div>
                     </div>
                   )}
                </div>
             </motion.div>
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
