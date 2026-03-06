import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Hash, Globe, TrendingUp, Copy, RefreshCw, Zap, 
  Check, Video, BarChart3, Clock, Lock, Sparkles,
  ChevronRight, ArrowRight, Activity
} from 'lucide-react';
import { useCreator } from '../context/CreatorContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { ExportButton } from './ui/ExportButton.jsx';

export default function SeoTab() {
  const { data, loading, regenerateSection, topic } = useCreator();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('keywords');

  const seo = data?.seo || {};

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    addToast('success', 'Capture synchronization complete.');
  };

  if (!seo || Object.keys(seo).length === 0) return <EmptyState />;

  return (
    <div className="tab-content animate-slide-up">
      <div className="tab-header" style={{ marginBottom: 40 }}>
        <div className="stagger-children">
          <h2 className="tab-title text-gradient-aurora" style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.04em' }}>Search Optimization</h2>
          <p className="tab-subtitle" style={{ fontSize: '1.1rem' }}>Neural indexing variants & algorithmic visibility mapping</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
           <ExportButton section="seo" data={seo} />
           <button onClick={() => regenerateSection('seo')} className="btn-secondary" disabled={loading} style={{ padding: '12px' }}>
              {loading ? <RefreshCw className="animate-spin" size={18} /> : <RefreshCw size={18} />}
           </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
         <NavPill label="Keyword Strategy" active={activeTab === 'keywords'} onClick={() => setActiveTab('keywords')} icon={Search} />
         <NavPill label="Metadata Forge" active={activeTab === 'metadata'} onClick={() => setActiveTab('metadata')} icon={Activity} />
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'keywords' ? (
           <motion.div 
             key="keywords"
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0, y: -10 }}
             style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 28 }}
           >
              <div className="glass" style={{ padding: 40, borderRadius: 32 }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 32 }}>
                    <div className="glow-border" style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--bg-tertiary)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                       <Hash size={22} />
                    </div>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 900 }}>High-Density Keywords</h3>
                 </div>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {seo.highVolumeKeywords?.map((kw, i) => (
                       <div key={i} className="glass glass-hover" style={{ padding: '16px 24px', borderRadius: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '1rem', fontWeight: 700 }}>{kw}</span>
                          <button onClick={() => copyToClipboard(kw)} style={{ background: 'transparent', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer' }}>
                             <Copy size={14} />
                          </button>
                       </div>
                    ))}
                 </div>
              </div>

              <div className="glass" style={{ padding: 40, borderRadius: 32 }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 32 }}>
                    <div className="glow-border" style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--bg-tertiary)', color: 'var(--accent-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                       <Globe size={22} />
                    </div>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 900 }}>Latent Semantic Nodes</h3>
                 </div>
                 <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                    {seo.longTailKeywords?.map((kw, i) => (
                       <div key={i} className="glass glass-hover" style={{ padding: '10px 18px', borderRadius: 100, fontSize: '0.85rem', fontWeight: 800, background: 'rgba(255,255,255,0.02)', color: 'var(--text-secondary)' }}>
                          {kw}
                       </div>
                    ))}
                 </div>
              </div>
           </motion.div>
        ) : (
           <motion.div 
             key="metadata"
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0, y: -10 }}
             style={{ display: 'flex', flexDirection: 'column', gap: 28 }}
           >
              <div className="glass" style={{ padding: 40, borderRadius: 32 }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                       <Zap size={22} color="var(--accent-warning)" />
                       <h3 style={{ fontSize: '1.2rem', fontWeight: 900 }}>Optimized Video Description</h3>
                    </div>
                    <button onClick={() => copyToClipboard(seo.description)} className="btn-secondary" style={{ padding: 8 }}><Copy size={16} /></button>
                 </div>
                 <div className="glass" style={{ padding: 32, borderRadius: 24, background: 'rgba(255,255,255,0.01)', fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                    {seo.description}
                 </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>
                 <div className="glass" style={{ padding: 32, borderRadius: 28 }}>
                    <h4 style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: 20 }}>Categorization</h4>
                    <div className="glass" style={{ padding: '16px 20px', borderRadius: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                       <span style={{ fontWeight: 800 }}>{seo.category || "Education / Tech"}</span>
                       <ChevronRight size={16} style={{ opacity: 0.3 }} />
                    </div>
                 </div>
                 <div className="glass" style={{ padding: 32, borderRadius: 28 }}>
                    <h4 style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: 20 }}>Language Origin</h4>
                    <div className="glass" style={{ padding: '16px 20px', borderRadius: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                       <span style={{ fontWeight: 800 }}>Primary (EN-US)</span>
                       <Check size={16} color="var(--accent-success)" />
                    </div>
                 </div>
              </div>
           </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NavPill({ label, active, onClick, icon: Icon }) {
   return (
      <button 
         onClick={onClick}
         className={`glass glass-hover ${active ? 'glass-strong' : ''}`}
         style={{ 
            padding: '12px 24px', borderRadius: 100, border: active ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
            display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
            color: active ? 'var(--accent-primary)' : 'var(--text-secondary)',
            fontWeight: 850, fontSize: '0.9rem'
         }}
      >
         <Icon size={18} />
         <span>{label}</span>
      </button>
   );
}

function EmptyState() {
  return (
    <div className="tab-content center-content" style={{ minHeight: '60vh' }}>
      <div className="glass glass-hover" style={{ maxWidth: 480, padding: 48, textAlign: 'center', borderRadius: 32 }}>
        <div className="glow-border" style={{ width: 80, height: 80, borderRadius: 24, background: 'var(--bg-tertiary)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <Search size={40} />
        </div>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: 16 }}>Search Optimization</h3>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>Initialize keywords and metadata forge based on your strategic foundation to maximize algorithmic reach.</p>
      </div>
    </div>
  );
}
