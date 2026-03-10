import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, X, Sparkles, AlertCircle, ChevronDown,
  Zap, RefreshCw, Target, ShieldCheck, Microscope,
  Activity, Cpu, HeartPulse, Compass, ChevronRight
} from 'lucide-react';
import { useCreator } from '../context/CreatorContext.jsx';
import './CoachSidebar.css';

export default function CoachSidebar({ isOpen, onClose }) {
  const { data, loading, analyzeCoachFeedback } = useCreator();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="sidebar-overlay visible"
            style={{ zIndex: 1100 }}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 250 }}
            className="glass"
            style={{
              position: 'fixed',
              top: 0, bottom: 0, right: 0,
              width: 420,
              borderLeft: '1px solid var(--accent-primary)30',
              zIndex: 1200,
              display: 'flex',
              flexDirection: 'column',
              boxShadow: 'var(--shadow-glow)',
              background: 'rgba(10, 10, 15, 0.95)',
              backdropFilter: 'blur(20px)'
            }}
          >
            {/* Header */}
            <div style={{ padding: '32px 40px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div className="glow-border" style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--bg-tertiary)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     <Brain size={22} />
                  </div>
                  <div>
                     <h3 style={{ fontSize: '1.2rem', fontWeight: 900, margin: 0 }}>Intelligence Audit</h3>
                     <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, repeat: Infinity }} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-success)' }} />
                        <span style={{ fontSize: '0.65rem', fontWeight: 900, color: 'var(--accent-success)', textTransform: 'uppercase' }}>Live Diagnostic</span>
                     </div>
                  </div>
               </div>
               <button onClick={onClose} className="btn-ghost" style={{ padding: 10, borderRadius: '50%' }}><X size={20} /></button>
            </div>

            {/* Audit Feed */}
            <div style={{ flex: 1, overflowY: 'auto', padding: 40, display: 'flex', flexDirection: 'column', gap: 32 }}>
               
               {/* Global Status */}
               <div className="glass" style={{ padding: 28, borderRadius: 24, background: 'var(--gradient-primary)10' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                     <Sparkles size={18} color="var(--accent-primary)" />
                     <h4 style={{ fontSize: '1rem', fontWeight: 800 }}>Engine Performance</h4>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Strategic Alignment</span>
                     <span style={{ fontSize: '1.1rem', fontWeight: 950, color: 'var(--accent-success)' }}>94%</span>
                  </div>
               </div>

               {/* Sections */}
               <AuditSection title="Resonance Alerts" icon={Activity} color="var(--accent-primary)">
                  <AuditCard text="Retention logic in 'Titles' module currently under-indexed. Recommend 14% more punchy keywords." color="var(--accent-primary)" />
                  <AuditCard text="Visual style DNA is 92% synced via Visual Forge assets." color="var(--accent-primary)" />
               </AuditSection>

               <AuditSection title="Strategic Gaps" icon={Target} color="var(--accent-warning)">
                  <AuditCard text="Monetization vectors are silent. Check Affiliate tab for yield projections." color="var(--accent-warning)" />
               </AuditSection>

               <AuditSection title="Market Drift" icon={Compass} color="var(--accent-secondary)">
                  <AuditCard text="Alpha Cluster activity detected in 'Technical Deep-dives'. Pivot Phase 02 roadmap." color="var(--accent-secondary)" />
               </AuditSection>

            </div>

            {/* Footer */}
            <div style={{ padding: 40, borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-tertiary)30' }}>
               <button 
                  className="btn-primary" 
                  onClick={analyzeCoachFeedback}
                  disabled={loading || !data}
                  style={{ width: '100%', padding: '16px', gap: 12 }}
               >
                  {loading ? <RefreshCw className="animate-spin" size={16} /> : <RefreshCw size={16} />}
                  <span>{loading ? 'Analyzing Workspace...' : 'Execute Full Workspace Audit'}</span>
               </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function AuditSection({ title, icon: Icon, color, children }) {
   return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
         <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Icon size={16} color={color} />
            <h4 style={{ fontSize: '0.75rem', fontWeight: 950, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{title}</h4>
         </div>
         <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>{children}</div>
      </div>
   );
}

function AuditCard({ text, color }) {
   return (
      <div className="glass glass-hover" style={{ padding: 20, borderRadius: 16, borderLeft: `3px solid ${color}` }}>
         <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>{text}</p>
      </div>
   );
}
