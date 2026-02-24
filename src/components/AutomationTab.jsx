import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cpu, Zap, Workflow, UserCog, Clock, 
  BarChart3, Settings, Play, RefreshCw, 
  CheckCircle2, AlertTriangle, ArrowRight,
  ShieldCheck, Wand2, Boxes, Timer,
  Youtube, Share2, Type, FileText,
  Tag, Image as ImageIcon, Rocket,
  Copy, Loader2, Maximize2, X, ChevronRight,
  TrendingUp, Activity
} from 'lucide-react';
import { useCreator } from '../context/CreatorContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { 
  generateProductionWorkflow,
  generateYouTubeMetadata
} from '../engine/aiService.js';

export default function AutomationTab() {
  const { data, loading, topic, script, setData } = useCreator();
  const { addToast } = useToast();
  const automation = data?.automation;
  const ytMetadata = data?.ytMetadata;

  const [isGenerating, setIsGenerating] = useState(false);
  const [activeView, setActiveView] = useState('pipeline');
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishProgress, setPublishProgress] = useState(0);

  const fetchAutomationStrategy = async () => {
    if (!topic || isGenerating) return;
    setIsGenerating(true);
    try {
      const result = await generateProductionWorkflow(topic, data?.niche || 'Digital Content', data?.genome?.dna_snippet);
      setData(prev => ({
         ...prev,
         automation: result
      }));
      addToast('success', 'Production Pipeline automated!');
    } catch (err) {
      addToast('error', 'Failed to design production workflow.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateYTMetadata = async () => {
    if (!topic || isGenerating) return;
    setIsGenerating(true);
    try {
      const result = await generateYouTubeMetadata(topic, script);
      setData(prev => ({ ...prev, ytMetadata: result }));
      addToast('success', 'Viral metadata generated!');
    } catch (err) {
      addToast('error', 'Failed to generate YouTube metadata.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublish = async () => {
    if (isPublishing) return;
    setIsPublishing(true);
    setPublishProgress(0);
    const timer = setInterval(() => {
      setPublishProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setIsPublishing(false);
          addToast('success', 'Video successfully deployed to YouTube!');
          return 100;
        }
        return prev + 4;
      });
    }, 150);
  };

  useEffect(() => {
    if (topic && !automation && !loading) {
      fetchAutomationStrategy();
    }
  }, [topic, automation, loading]);

  if (isGenerating && activeView !== 'youtube') return (
    <div className="tab-content center-content">
       <div style={{ textAlign: 'center' }}>
          <RefreshCw size={48} className="spin" color="var(--accent-primary)" style={{ marginBottom: 24 }} />
          <h3 className="text-gradient" style={{ fontSize: '1.5rem', fontWeight: 800 }}>Calibrating Studio Ops</h3>
          <p style={{ color: 'var(--text-tertiary)' }}>Mapping bottlenecks and delegating tasks...</p>
       </div>
    </div>
  );

  if (!automation) return (
    <div className="tab-content center-content">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="empty-state" 
        style={{ maxWidth: 600 }}
      >
        <div className="empty-state-icon" style={{ background: 'var(--accent-secondary)15', color: 'var(--accent-secondary)' }}>
          <Cpu size={32} />
        </div>
        <h3>Studio Scale Command</h3>
        <p>Transition from solo-creator to studio-operator. Build an automated production pipeline designed for velocity and output volume.</p>
        <button onClick={fetchAutomationStrategy} className="shiny-button" style={{ marginTop: 24, padding: '16px 32px' }}>
          <Wand2 size={18} /> Initialize Studio Architect
        </button>
      </motion.div>
    </div>
  );

  return (
    <div className="tab-content">
      <div className="tab-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20 }}>
        <div>
          <h2 className="tab-title text-gradient">Automation Architect</h2>
          <p className="tab-subtitle">High-velocity production scaling & studio operations</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <div className="view-switcher" style={{ background: 'var(--bg-tertiary)', padding: 4, borderRadius: 12, border: '1px solid var(--border-subtle)', display: 'flex' }}>
             {['pipeline', 'delegation', 'bottlenecks', 'youtube'].map(v => (
                <button 
                  key={v}
                  onClick={() => setActiveView(v)}
                  style={{ 
                    fontSize: '0.7rem', fontWeight: 800, padding: '8px 12px', borderRadius: 8, border: 'none',
                    background: activeView === v ? 'var(--bg-secondary)' : 'transparent',
                    color: activeView === v ? 'var(--accent-primary)' : 'var(--text-tertiary)',
                    cursor: 'pointer', transition: 'all 0.2s', textTransform: 'uppercase', letterSpacing: '0.05em'
                  }}
                >
                  {v === 'youtube' ? 'YouTube Lab' : v}
                </button>
             ))}
          </div>
          <button onClick={fetchAutomationStrategy} className="btn-secondary" style={{ padding: '8px 16px' }}><RefreshCw size={18} /></button>
        </div>
      </div>

      {/* Stats Pulse */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="card" 
        style={{ padding: 24, marginBottom: 32, display: 'flex', alignItems: 'center', gap: 32, background: 'linear-gradient(to right, var(--bg-secondary) 0%, var(--bg-tertiary) 100%)' }}
      >
         <div style={{ position: 'relative', width: 90, height: 90, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="90" height="90" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
               <circle cx="50" cy="50" r="45" fill="none" stroke="var(--bg-primary)" strokeWidth="8" />
               <motion.circle 
                  cx="50" cy="50" r="45" fill="none" 
                  stroke="var(--accent-primary)" strokeWidth="8"
                  strokeDasharray="283"
                  initial={{ strokeDashoffset: 283 }}
                  animate={{ strokeDashoffset: 283 - (283 * automation.velocityScore / 100) }}
                  transition={{ duration: 2, ease: 'easeOut' }}
                  strokeLinecap="round"
                  style={{ filter: 'drop-shadow(0 0 8px var(--accent-primary)40)' }}
               />
            </svg>
            <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
               <span style={{ fontSize: '1.8rem', fontWeight: 950, color: 'var(--text-primary)', lineHeight: 1 }}>{automation.velocityScore}</span>
               <span style={{ fontSize: '0.55rem', fontWeight: 800, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Index</span>
            </div>
         </div>
         <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
               <Activity size={20} color="var(--accent-primary)" />
               <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Production Velocity Index</h3>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-tertiary)', margin: 0, opacity: 0.8 }}>
              {automation.velocityScore > 80 ? 'Exceptional production readiness.' : 'Optimization required to scale output.'} Detected <strong>{automation.bottlenecks.length}</strong> critical bottlenecks.
            </p>
         </div>
         <div style={{ display: 'flex', gap: 10 }}>
            {automation.bottlenecks.slice(0, 1).map((b, i) => (
               <div key={i} className="badge badge-yellow" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px' }}>
                  <AlertTriangle size={14} /> Critical: {b.area}
               </div>
            ))}
         </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {activeView === 'pipeline' && (
          <motion.div 
            key="pipeline"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
          >
             {automation.pipeline.map((stage, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="card" 
                  style={{ padding: 24, display: 'flex', alignItems: 'center', gap: 32, borderLeft: '4px solid var(--accent-primary)20' }}
                >
                   <div style={{ width: 44, height: 44, borderRadius: 14, background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: 'var(--text-tertiary)', border: '1px solid var(--border-subtle)' }}>
                      {i+1}
                   </div>
                   <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                         <h4 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{stage.stage}</h4>
                         <span className="badge badge-primary" style={{ fontSize: '0.65rem' }}>{stage.automationPotential} Potential</span>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                         {stage.tasks.map((task, j) => (
                            <span key={j} style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', padding: '4px 12px', background: 'var(--bg-tertiary)', borderRadius: 20, border: '1px solid var(--border-subtle)' }}>{task}</span>
                         ))}
                      </div>
                   </div>
                   <div style={{ textAlign: 'right', minWidth: 140 }}>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', fontWeight: 800, textTransform: 'uppercase', marginBottom: 4 }}>Est. Human Time</div>
                      <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>
                         <Clock size={16} /> {stage.estimatedTime}
                      </div>
                   </div>
                </motion.div>
             ))}
          </motion.div>
        )}

        {activeView === 'delegation' && (
          <motion.div 
            key="delegation"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}
          >
             {['do', 'delegate', 'automate'].map((type, i) => (
                <div key={type} className="card" style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 24, background: type === 'automate' ? 'var(--bg-secondary)' : 'transparent' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ padding: 10, borderRadius: 12, background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)' }}>
                         {type === 'do' && <Play size={20} color="var(--accent-primary)" style={{ fill: 'var(--accent-primary)20' }} />}
                         {type === 'delegate' && <UserCog size={20} color="var(--accent-secondary)" />}
                         {type === 'automate' && <Zap size={20} color="var(--accent-success)" style={{ fill: 'var(--accent-success)20' }} />}
                      </div>
                      <h4 style={{ fontSize: '1.2rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{type}</h4>
                   </div>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {automation.delegation[type].map((task, j) => (
                         <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '0.9rem', color: 'var(--text-secondary)', padding: '12px 16px', background: 'var(--bg-secondary)50', borderRadius: 14, border: '1px solid var(--border-subtle)' }}>
                            <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--text-tertiary)40' }} />
                            {task}
                         </div>
                      ))}
                   </div>
                </div>
             ))}
          </motion.div>
        )}

        {activeView === 'bottlenecks' && (
          <motion.div 
            key="bottlenecks"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 24 }}
          >
             {automation.bottlenecks.map((b, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="card" 
                  style={{ padding: 32, display: 'flex', gap: 40, background: 'var(--bg-secondary)' }}
                >
                   <div style={{ padding: 20, background: 'var(--accent-warning)10', color: 'var(--accent-warning)', borderRadius: 20 }}>
                      <AlertTriangle size={40} />
                   </div>
                   <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: 8 }}>{b.area} Bottleneck</h4>
                      <p style={{ fontSize: '0.95rem', color: 'var(--text-tertiary)', marginBottom: 24, paddingLeft: 4, borderLeft: '2px solid var(--border-subtle)' }}>Critical friction point detected in the production cycle.</p>
                      <div style={{ padding: 24, background: 'var(--bg-tertiary)', borderRadius: 20, border: '1px solid var(--accent-primary)20' }}>
                         <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                            <Zap size={18} color="var(--accent-primary)" />
                            <div style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', textTransform: 'uppercase', fontWeight: 900 }}>Scale Optimized Solution</div>
                         </div>
                         <p style={{ fontSize: '1.1rem', color: 'var(--text-primary)', fontWeight: 600, margin: 0, lineHeight: 1.6 }}>{b.solution}</p>
                      </div>
                   </div>
                </motion.div>
             ))}
          </motion.div>
        )}

        {activeView === 'youtube' && (
          <motion.div 
            key="youtube"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="youtube-lab-layout"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr)) 360px', gap: 24, alignItems: 'start' }}
          >
             <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div className="card" style={{ padding: 32 }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                         <div style={{ background: '#FF000015', padding: 12, borderRadius: 16, color: '#FF0000' }}>
                            <Youtube size={28} />
                         </div>
                         <div>
                            <h3 style={{ fontSize: '1.4rem', fontWeight: 900 }}>Viral Metadata Lab</h3>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>Click-through optimization & SEO mapping</p>
                         </div>
                      </div>
                      <button onClick={handleGenerateYTMetadata} disabled={isGenerating} className="btn-secondary" style={{ padding: '8px 16px' }}>
                         {isGenerating ? <Loader2 size={18} className="spin" /> : <RefreshCw size={18} />}
                      </button>
                   </div>

                   {!ytMetadata && !isGenerating ? (
                      <div className="empty-state" style={{ padding: '60px 0' }}>
                         <Wand2 size={32} opacity={0.2} style={{ marginBottom: 20 }} />
                         <p style={{ marginBottom: 24 }}>Generate viral metadata concepts for this content project.</p>
                         <button onClick={handleGenerateYTMetadata} className="shiny-button" style={{ padding: '12px 32px' }}>Forge Metadata</button>
                      </div>
                   ) : isGenerating ? (
                      <div className="loading-state" style={{ padding: '60px 0', textAlign: 'center' }}>
                         <div className="spinner" style={{ margin: '0 auto 24px' }} />
                         <p style={{ color: 'var(--text-tertiary)' }}>Calculating Search Trends...</p>
                      </div>
                   ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                         <div>
                            <div style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                               <Type size={16} /> High-Velocity Titles
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                               {ytMetadata.titles.map((t, idx) => (
                                  <div key={idx} style={{ padding: '16px 20px', background: 'var(--bg-tertiary)', borderRadius: 16, border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.2s' }}>
                                     <span style={{ fontSize: '1rem', fontWeight: 700 }}>{t}</span>
                                     <button onClick={() => { navigator.clipboard.writeText(t); addToast('success', 'Title copied!'); }} className="btn-mini"><Copy size={16} /></button>
                                  </div>
                               ))}
                            </div>
                         </div>

                         <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, fontSize: '0.75rem', fontWeight: 900, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                               <FileText size={16} /> Optimized Production Description
                            </div>
                            <div style={{ position: 'relative' }}>
                               <textarea 
                                  readOnly 
                                  value={ytMetadata.description}
                                  style={{ width: '100%', height: 260, background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', borderRadius: 20, padding: 24, fontSize: '0.9rem', color: 'var(--text-secondary)', fontFamily: 'monospace', resize: 'none', lineHeight: 1.6 }}
                               />
                               <button 
                                  onClick={() => { navigator.clipboard.writeText(ytMetadata.description); addToast('success', 'Description copied!'); }}
                                  className="btn-secondary" 
                                  style={{ position: 'absolute', top: 12, right: 12, padding: '8px 12px' }}
                               >
                                  <Copy size={14} />
                               </button>
                            </div>
                         </div>
                      </div>
                   )}
                </div>
             </div>

             <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div className="card" style={{ padding: 24 }}>
                   <div style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: 20 }}>Publishing Command</div>
                   
                   <div style={{ marginBottom: 24 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: 8, fontWeight: 700 }}>
                         <span style={{ color: 'var(--text-secondary)' }}>Production Status</span>
                         <span style={{ color: isPublishing ? 'var(--accent-primary)' : 'var(--accent-success)' }}>
                            {isPublishing ? `${publishProgress}% Uploading` : 'System Ready'}
                         </span>
                      </div>
                      <div style={{ height: 8, background: 'var(--bg-tertiary)', borderRadius: 4, overflow: 'hidden' }}>
                         <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${publishProgress}%` }}
                            style={{ height: '100%', background: 'var(--accent-primary)', filter: 'drop-shadow(0 0 4px var(--accent-primary)40)' }}
                         />
                      </div>
                   </div>

                   <button 
                      onClick={handlePublish}
                      disabled={isPublishing || !ytMetadata}
                      className="shiny-button" 
                      style={{ width: '100%', gap: 12, height: 56, fontSize: '1rem' }}
                   >
                      {isPublishing ? <Loader2 size={24} className="spin" /> : <Rocket size={24} />}
                      {isPublishing ? 'Deploying...' : 'Publish to YouTube'}
                   </button>
                </div>

                {ytMetadata && (
                   <div className="card" style={{ padding: 24 }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: 20 }}>Metadata Intelligence</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                         <div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', fontWeight: 800, marginBottom: 8 }}>Viral Concept</div>
                            <div style={{ padding: 16, background: 'var(--accent-primary)05', border: '1px solid var(--accent-primary)20', borderRadius: 12, fontSize: '0.85rem', fontStyle: 'italic', lineHeight: 1.5 }}>
                               "{ytMetadata.thumbnailConcept}"
                            </div>
                         </div>
                         <div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', fontWeight: 800, marginBottom: 8 }}>Algorithmic Tags</div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                               {ytMetadata.tags.map((tag, idx) => (
                                  <span key={idx} style={{ fontSize: '0.65rem', padding: '4px 8px', background: 'var(--bg-tertiary)', borderRadius: 6, color: 'var(--text-tertiary)', border: '1px solid var(--border-subtle)' }}>{tag}</span>
                               ))}
                            </div>
                         </div>
                      </div>
                   </div>
                )}
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
