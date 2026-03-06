import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cpu, Zap, Workflow, UserCog, Clock, 
  BarChart3, Settings, Play, RefreshCw, 
  CheckCircle2, AlertTriangle, ArrowRight,
  ChevronRight, Layout, Database, Copy,
  Globe, Languages, Share2
} from 'lucide-react';
import { useCreator } from '../context/CreatorContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { 
  generateProductionWorkflow,
  generateYouTubeMetadata
} from '../engine/aiService.js';

export default function AutomationTab() {
  const { data, setData, topic } = useCreator();
  const { addToast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [metadataLoading, setMetadataLoading] = useState(false);

  const workflow = data?.automation?.workflow || [];
  const metadata = data?.automation?.metadata || null;

  const fetchAutomationStrategy = async () => {
    if (!topic) {
      addToast('error', 'Start a project first!');
      return;
    }
    setLoading(true);
    try {
      const result = await generateProductionWorkflow(topic);
      setData(prev => ({
        ...prev,
        automation: { ...prev.automation, workflow: result.stages }
      }));
      addToast('success', 'Production architecture optimized');
    } catch (err) {
      addToast('error', 'Workflow generation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateYTMetadata = async () => {
    setMetadataLoading(true);
    try {
      const result = await generateYouTubeMetadata(topic, data?.script?.scenes);
      setData(prev => ({
        ...prev,
        automation: { ...prev.automation, metadata: result }
      }));
      addToast('success', 'Algorithm metadata synchronized');
    } catch (err) {
      addToast('error', 'Metadata failed');
    } finally {
      setMetadataLoading(false);
    }
  };

  const handlePublish = async () => {
    setPublishing(true);
    try {
      await new Promise(r => setTimeout(r, 2000));
      addToast('success', 'Simulation: Content published to all nodes');
    } catch (err) {
      addToast('error', 'Deployment failed');
    } finally {
      setPublishing(false);
    }
  };

  if (workflow.length === 0 && !metadata) return (
    <div className="tab-content center-content" style={{ minHeight: '60vh' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass glass-hover" style={{ maxWidth: 540, padding: 48, textAlign: 'center', borderRadius: 32 }}>
        <div className="glow-border" style={{ width: 80, height: 80, borderRadius: 24, background: 'var(--bg-tertiary)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <Cpu size={40} />
        </div>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: 16 }}>Autonomous Growth</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6, marginBottom: 32 }}>Build optimized production workflows, generate SEO-ready metadata, and orchestrate omnichannel deployments.</p>
        <button onClick={fetchAutomationStrategy} className="btn-primary" style={{ padding: '16px 32px' }}>
          <Zap size={18} /> Scale Operations
        </button>
      </motion.div>
    </div>
  );

  return (
    <div className="tab-content animate-slide-up">
      <div className="tab-header" style={{ marginBottom: 40 }}>
        <div className="stagger-children">
          <h2 className="tab-title text-gradient-aurora" style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.04em' }}>Operation Command</h2>
          <p className="tab-subtitle" style={{ fontSize: '1.1rem' }}>Autonomous production architecture & algorithmic deployment</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
           <button onClick={handlePublish} className="btn-primary" disabled={publishing} style={{ padding: '12px 24px' }}>
             {publishing ? <RefreshCw className="animate-spin" size={18} /> : <Share2 size={18} />}
             <span>{publishing ? 'Deploying...' : 'Live Deploy'}</span>
           </button>
        </div>
      </div>

      <div className="stagger-children" style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        
        {/* Workflow Engine */}
        <div className="glass" style={{ padding: 40, borderRadius: 32 }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                 <div className="glow-border" style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--bg-tertiary)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Workflow size={22} />
                 </div>
                 <h3 style={{ fontSize: '1.3rem', fontWeight: 900 }}>Production Arc</h3>
              </div>
              <button 
                 onClick={fetchAutomationStrategy} 
                 className="btn-secondary" 
                 disabled={loading}
                 style={{ padding: '10px 20px', fontSize: '0.85rem' }}
              >
                 {loading ? <RefreshCw className="animate-spin" size={16} /> : <RefreshCw size={16} />}
                 <span>{loading ? 'Optimizing...' : 'Refresh Arc'}</span>
              </button>
           </div>

           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
              {workflow.map((stage, i) => (
                 <motion.div 
                    key={i} 
                    whileHover={{ scale: 1.02, y: -4 }}
                    className="glass glass-hover" 
                    style={{ padding: 28, borderRadius: 24, borderLeft: '4px solid var(--accent-primary)' }}
                 >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                       <span style={{ fontSize: '0.65rem', fontWeight: 950, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Stage 0{i+1}</span>
                       <div className="glass" style={{ width: 32, height: 32, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)' }}>
                          <CheckCircle2 size={16} />
                       </div>
                    </div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 10 }}>{stage.stage}</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>{stage.description}</p>
                 </motion.div>
              ))}
           </div>
        </div>

        {/* Algorithm Metadata */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 28, alignItems: 'start' }}>
           <div className="glass" style={{ padding: 40, borderRadius: 32 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div className="glow-border" style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--bg-tertiary)', color: 'var(--accent-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                       <Globe size={22} />
                    </div>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 900 }}>Algorithmic Metadata</h3>
                 </div>
                 <button 
                   onClick={handleGenerateYTMetadata} 
                   className="btn-secondary" 
                   disabled={metadataLoading}
                   style={{ padding: '10px 20px', fontSize: '0.85rem' }}
                 >
                   {metadataLoading ? <RefreshCw className="animate-spin" size={16} /> : <Zap size={16} />}
                   <span>Sync Patterns</span>
                 </button>
              </div>

              {metadata ? (
                 <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    <div className="glass" style={{ padding: 28, borderRadius: 24 }}>
                       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                          <span style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--accent-primary)', textTransform: 'uppercase' }}>Optimized Title</span>
                          <Copy size={14} className="cursor-pointer" style={{ opacity: 0.5 }} />
                       </div>
                       <p style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>{metadata.title}</p>
                    </div>

                    <div className="glass" style={{ padding: 28, borderRadius: 24 }}>
                       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                          <span style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--accent-secondary)', textTransform: 'uppercase' }}>Smart Description</span>
                          <Copy size={14} className="cursor-pointer" style={{ opacity: 0.5 }} />
                       </div>
                       <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>{metadata.description}</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
                       <div className="glass" style={{ padding: 24, borderRadius: 20 }}>
                          <span style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--accent-warning)', textTransform: 'uppercase', display: 'block', marginBottom: 12 }}>Index Tags</span>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                             {metadata.tags?.map((t, i) => (
                                <span key={i} style={{ fontSize: '0.75rem', padding: '4px 10px', background: 'var(--bg-tertiary)', borderRadius: 6, color: 'var(--text-secondary)' }}>#{t}</span>
                             ))}
                          </div>
                       </div>
                       <div className="glass" style={{ padding: 24, borderRadius: 20 }}>
                          <span style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--accent-success)', textTransform: 'uppercase', display: 'block', marginBottom: 12 }}>Timestamp Logic</span>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>Chapters automatically mapped to high-tension script nodes.</p>
                       </div>
                    </div>
                 </div>
              ) : (
                 <div style={{ padding: '60px 0', textAlign: 'center', opacity: 0.5 }}>
                    <Database size={48} style={{ marginBottom: 20 }} />
                    <p>Algorithm patterns not yet synchronized.</p>
                 </div>
              )}
           </div>

           <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
              <div className="glass" style={{ padding: 32, borderRadius: 28 }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
                    <UserCog size={20} color="var(--accent-primary)" />
                    <h4 style={{ fontSize: '1rem', fontWeight: 800 }}>Agentic Settings</h4>
                 </div>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <SettingToggle label="Auto-Publish to Nodes" active={true} />
                    <SettingToggle label="Bilateral Localization" active={false} />
                    <SettingToggle label="A/B Title Polling" active={true} />
                 </div>
              </div>

              <div className="glass" style={{ padding: 32, borderRadius: 28, background: 'var(--gradient-primary)05', border: '1px solid var(--accent-primary)20' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                    <Activity size={18} color="var(--accent-primary)" />
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent-primary)' }}>Operation Health</span>
                 </div>
                 <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                    Systems are running at 98% efficiency. All worker nodes are synchronized with the primary intelligence core.
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function SettingToggle({ label, active }) {
   return (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderRadius: 12, background: 'var(--bg-tertiary)' }}>
         <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>{label}</span>
         <div style={{ width: 36, height: 20, borderRadius: 10, background: active ? 'var(--accent-primary)' : 'var(--border-medium)', position: 'relative', cursor: 'pointer' }}>
            <div style={{ position: 'absolute', top: 2, left: active ? 18 : 2, width: 16, height: 16, borderRadius: '50%', background: '#fff' }} />
         </div>
      </div>
   );
}
