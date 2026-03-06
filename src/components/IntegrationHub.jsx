import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Globe, Link2, Check, Settings, Database, MessageSquare, Share2, Zap, Shield, PlugZap,
  ChevronRight, ArrowRight, Zap as ZapIcon, Info, Sparkles, Layers
} from 'lucide-react';

const INTEGRATIONS = [
  { id: 'youtube',   name: 'YouTube',          desc: 'Publish videos & manage channel metadata directly from your OS.',    icon: Share2,       color: '#FF0000', connected: false },
  { id: 'notion',    name: 'Notion',            desc: 'Sync projects, wikis, and content briefs to your Notion workspace.', icon: Database,     color: '#3B3835', connected: false },
  { id: 'wordpress', name: 'WordPress',         desc: 'Auto-publish blog posts and articles to your site.',                 icon: Globe,        color: '#21759b', connected: false },
  { id: 'linkedin',  name: 'LinkedIn',          desc: 'Auto-post carousels, long-form articles, and thought leadership.',   icon: Share2,       color: '#0077b5', connected: true  },
  { id: 'slack',     name: 'Slack',             desc: 'Pipe activity feeds and milestone alerts to any channel.',           icon: MessageSquare,color: '#4a154b', connected: false },
  { id: 'webhooks',  name: 'Custom Webhooks',   desc: 'Connect to any external service via a secure URL endpoint.',        icon: Link2,        color: 'var(--accent-primary)', connected: false },
];

export default function IntegrationHub() {
  const [integrations, setIntegrations] = useState(INTEGRATIONS);

  const toggle = (id) =>
    setIntegrations(prev =>
      prev.map(i => (i.id === id ? { ...i, connected: !i.connected } : i))
    );

  const activeCount = integrations.filter(i => i.connected).length;

  return (
    <div className="tab-content animate-slide-up">
      <div className="tab-header" style={{ marginBottom: 48 }}>
        <div className="stagger-children">
          <h2 className="tab-title text-gradient-aurora" style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.04em' }}>Integration Hub</h2>
          <p className="tab-subtitle" style={{ fontSize: '1.1rem' }}>Establishing secure ecosystem uplinks & automated sync protocols</p>
        </div>
        <div className="glass" style={{ padding: '8px 16px', borderRadius: 100, display: 'flex', alignItems: 'center', gap: 10, border: '1px solid var(--accent-success)30' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-success)', boxShadow: '0 0 10px var(--accent-success)' }} />
          <span style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--accent-success)' }}>{activeCount} ACTIVE UPLINKS</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 28, marginBottom: 48 }}>
        {integrations.map(p => {
          const Icon = p.icon;
          return (
            <motion.div key={p.id} whileHover={{ y: -6 }} className={`glass glass-hover ${p.connected ? 'glass-strong' : ''}`} style={{ padding: 32, borderRadius: 28, border: p.connected ? `1px solid ${p.color}40` : '1px solid var(--border-subtle)' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                  <div className="glow-border" style={{ width: 48, height: 48, borderRadius: 12, background: p.color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     <Icon size={24} />
                  </div>
                  {p.connected && (
                     <div className="glass" style={{ padding: '4px 10px', borderRadius: 6, fontSize: '0.6rem', fontWeight: 950, color: 'var(--accent-success)', background: 'rgba(34, 197, 94, 0.05)' }}>SYNC ACTIVE</div>
                  )}
               </div>
               <h3 style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: 12 }}>{p.name}</h3>
               <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 32, minHeight: 48 }}>{p.desc}</p>
               
               <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={() => toggle(p.id)} className={p.connected ? 'btn-secondary' : 'btn-primary'} style={{ flex: 1, padding: '12px' }}>
                     {p.connected ? 'Terminate Link' : 'Establish Link'}
                  </button>
                  {p.connected && (
                     <button className="btn-ghost" style={{ padding: 12, borderRadius: 12 }}><Settings size={18} /></button>
                  )}
               </div>
            </motion.div>
          );
        })}
      </div>

      {/* Sync Engine Banner */}
      <div className="glass" style={{ padding: 48, borderRadius: 40, background: 'var(--gradient-primary)05', border: '1px solid var(--accent-primary)20', position: 'relative', overflow: 'hidden' }}>
         <div style={{ position: 'absolute', right: -40, top: -40, opacity: 0.1, transform: 'rotate(15deg)' }}>
            <Zap size={280} color="var(--accent-primary)" />
         </div>
         <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ maxWidth: 600 }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
                  <div className="glow-border" style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--bg-tertiary)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     <PlugZap size={22} />
                  </div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 900 }}>Neural Sync Engine</h3>
               </div>
               <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                  Orchestrate cross-platform production workflows with zero friction. Automatically sync scripts to Notion, trigger WordPress drafts, and Pipe telemetry to Slack.
               </p>
               <div style={{ display: 'flex', gap: 16, marginTop: 32 }}>
                  <span className="glass" style={{ padding: '6px 14px', borderRadius: 100, fontSize: '0.75rem', fontWeight: 900, color: 'var(--accent-success)' }}>E2E ENCRYPTED</span>
                  <span className="glass" style={{ padding: '6px 14px', borderRadius: 100, fontSize: '0.75rem', fontWeight: 900, color: 'var(--accent-primary)' }}>REAL-TIME SYNC</span>
               </div>
            </div>
            <button className="btn-primary" style={{ padding: '20px 48px', borderRadius: 20, fontSize: '1.1rem', fontWeight: 950 }}>Optimize Workflows</button>
         </div>
      </div>
    </div>
  );
}
