import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Globe, Link2, Check, Settings, Database, MessageSquare, Share2, Zap, Shield, PlugZap
} from 'lucide-react';

const INTEGRATIONS = [
  { id: 'youtube',   name: 'YouTube',          desc: 'Publish videos & manage channel metadata directly from your OS.',    icon: Share2,       color: '#FF0000', connected: false },
  { id: 'notion',    name: 'Notion',            desc: 'Sync projects, wikis, and content briefs to your Notion workspace.', icon: Database,     color: '#3B3835', connected: false },
  { id: 'wordpress', name: 'WordPress',         desc: 'Auto-publish blog posts and articles to your site.',                 icon: Globe,        color: '#21759b', connected: false },
  { id: 'linkedin',  name: 'LinkedIn',          desc: 'Auto-post carousels, long-form articles, and thought leadership.',   icon: Share2,       color: '#0077b5', connected: true  },
  { id: 'slack',     name: 'Slack',             desc: 'Pipe activity feeds and milestone alerts to any channel.',           icon: MessageSquare,color: '#4a154b', connected: false },
  { id: 'webhooks',  name: 'Custom Webhooks',   desc: 'Connect to any external service via a secure URL endpoint.',        icon: Link2,        color: 'var(--accent-primary)', connected: false },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
const item = {
  hidden: { opacity: 0, y: 14 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};

export default function IntegrationHub() {
  const [integrations, setIntegrations] = useState(INTEGRATIONS);

  const toggle = (id) =>
    setIntegrations(prev =>
      prev.map(i => (i.id === id ? { ...i, connected: !i.connected } : i))
    );

  const activeCount = integrations.filter(i => i.connected).length;

  return (
    <div className="ih-root">

      {/* ── Section Header ── */}
      <div className="ih-header">
        <div className="ih-header-left">
          <div className="sp-card-label" style={{ marginBottom: 4 }}>
            <Link2 size={14} />
            <span>Platform Synchronization</span>
          </div>
          <h2 className="sp-card-title" style={{ fontSize: '1.4rem' }}>Integration Hub</h2>
          <p className="sp-card-sub">Connect your Intelligence OS to the tools you already use.</p>
        </div>

        <div className="ih-uplinks-badge">
          <span className="ih-uplinks-dot" />
          {activeCount} Active Uplink{activeCount !== 1 ? 's' : ''}
        </div>
      </div>

      {/* ── Integration Cards Grid ── */}
      <motion.div
        className="ih-grid"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {integrations.map(platform => {
          const Icon = platform.icon;
          return (
            <motion.div
              key={platform.id}
              variants={item}
              className={`sp-card ih-card ${platform.connected ? 'connected' : ''}`}
            >
              {/* Live Badge */}
              <AnimatePresence>
                {platform.connected && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.7 }}
                    className="ih-live-badge"
                  >
                    <span className="ih-live-dot" />
                    Live
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Card Body */}
              <div className="ih-card-body">
                <div
                  className="ih-platform-icon"
                  style={{ background: platform.color }}
                >
                  <Icon size={22} color="#fff" />
                </div>
                <div className="ih-card-text">
                  <h4 className="ih-platform-name">{platform.name}</h4>
                  <p className="ih-platform-desc">{platform.desc}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="ih-card-actions">
                <button
                  onClick={() => toggle(platform.id)}
                  className={`ih-action-btn ${platform.connected ? 'disconnect' : 'connect'}`}
                >
                  {platform.connected ? 'Disconnect' : 'Establish Link'}
                </button>
                {platform.connected && (
                  <button className="ih-settings-btn" title="Configure">
                    <Settings size={14} />
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* ── Sync Engine Banner ── */}
      <div className="sp-card ih-banner">
        <div className="ih-banner-bg-icon">
          <Zap size={160} />
        </div>
        <div className="ih-banner-content">
          <div className="ih-banner-left">
            <div className="ih-banner-icon">
              <PlugZap size={20} className="text-[var(--accent-primary)]" />
            </div>
            <div>
              <h3 className="ih-banner-title">Real-Time Sync Engine</h3>
              <p className="ih-banner-sub">
                Orchestrate cross-platform production workflows. Automatically sync scripts to Notion,
                trigger WordPress drafts, or notify Slack on project milestones.
              </p>
              <div className="ih-banner-chips">
                <span className="ih-chip">
                  <Shield size={10} style={{ color: '#22c55e' }} />
                  E2E Encrypted
                </span>
                <span className="ih-chip">
                  <Zap size={10} className="text-[var(--accent-primary)]" />
                  Ultra-Low Latency
                </span>
              </div>
            </div>
          </div>
          <button className="ih-banner-btn">
            Optimize Workflows
          </button>
        </div>
      </div>
    </div>
  );
}
