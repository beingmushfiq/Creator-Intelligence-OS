import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, Zap, AlertTriangle, RefreshCw, Flame, 
  Gauge, ArrowUp, ArrowDown, Target, Compass,
  ShieldCheck, Rocket, Activity, BarChart3,
  Sparkles, Layers, ChevronRight, Magnet
} from 'lucide-react';
import { useCreator } from '../context/CreatorContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { ExportButton } from './ui/ExportButton.jsx';

export default function PerformanceTab() {
  const { data, loading, topic } = useCreator();
  const { addToast } = useToast();
  
  const performance = data?.performance || {};

  if (!performance || Object.keys(performance).length === 0) return <EmptyState />;

  return (
    <div className="tab-content animate-slide-up">
      <div className="tab-header" style={{ marginBottom: 40 }}>
        <div className="stagger-children">
          <h2 className="tab-title text-gradient-aurora" style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.04em' }}>Viral Lab</h2>
          <p className="tab-subtitle" style={{ fontSize: '1.1rem' }}>Psychological performance diagnostics & viral velocity optimization</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
           <ExportButton section="performance" data={performance} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 28, marginBottom: 48 }}>
         
         {/* Viral Velocity */}
         <div className="glass glass-hover" style={{ padding: 40, borderRadius: 32, position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div className="glow-border" style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--bg-tertiary)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     <Rocket size={22} />
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 900 }}>Viral Velocity</h3>
               </div>
               <div className="glass" style={{ padding: '6px 14px', borderRadius: 100, fontSize: '0.65rem', fontWeight: 950, color: 'var(--accent-primary)' }}>ALPHA-RANK</div>
            </div>
            
            <div style={{ fontSize: '3.5rem', fontWeight: 950, color: 'var(--text-primary)', marginBottom: 12 }}>0.94</div>
            <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Projected Propagation Rate</p>
         </div>

         {/* Psychological Hooks */}
         <div className="glass glass-hover" style={{ padding: 40, borderRadius: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 32 }}>
               <div className="glow-border" style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--bg-tertiary)', color: 'var(--accent-warning)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Flame size={22} />
               </div>
               <h3 style={{ fontSize: '1.25rem', fontWeight: 900 }}>Hook Saturation</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
               <div className="glass" style={{ padding: '16px 20px', borderRadius: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>Curiosity Gap</span>
                  <span style={{ fontWeight: 950, color: 'var(--accent-success)' }}>High</span>
               </div>
               <div className="glass" style={{ padding: '16px 20px', borderRadius: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>Aesthetic Sync</span>
                  <span style={{ fontWeight: 950, color: 'var(--accent-primary)' }}>Optimal</span>
               </div>
            </div>
         </div>

         {/* Retention Diagnostics */}
         <div className="glass glass-hover" style={{ padding: 40, borderRadius: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 32 }}>
               <div className="glow-border" style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--bg-tertiary)', color: 'var(--accent-success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Gauge size={22} />
               </div>
               <h3 style={{ fontSize: '1.25rem', fontWeight: 900 }}>Retention Sync</h3>
            </div>
            <div style={{ fontSize: '3.5rem', fontWeight: 950, color: 'var(--text-primary)', marginBottom: 12 }}>84%</div>
            <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Neural Engagement Floor</p>
         </div>

      </div>

      {/* Strategic Directives */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
         <h3 style={{ fontSize: '1.4rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: 12 }}>
            <ShieldCheck size={22} color="var(--accent-success)" /> Performance Guardrails
         </h3>
         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 28 }}>
            {performance.directives?.map((dir, i) => (
               <motion.div key={i} whileHover={{ y: -6 }} className="glass glass-hover" style={{ padding: 32, borderRadius: 28, borderLeft: '4px solid var(--accent-primary)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                     <div className="glass" style={{ padding: '6px 14px', borderRadius: 8, fontSize: '0.65rem', fontWeight: 950, color: 'var(--accent-primary)' }}>DIRECTIVE 0{i+1}</div>
                     <Sparkles size={16} style={{ opacity: 0.2 }} />
                  </div>
                  <h4 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: 16 }}>{dir.title}</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>{dir.logic}</p>
               </motion.div>
            )) || <div className="glass" style={{ padding: 32, textAlign: 'center', opacity: 0.5, gridColumn: '1 / -1' }}>No active performance directives.</div>}
         </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="tab-content center-content" style={{ minHeight: '60vh' }}>
      <div className="glass glass-hover" style={{ maxWidth: 480, padding: 48, borderRadius: 32, textAlign: 'center' }}>
        <div className="glow-border" style={{ width: 80, height: 80, borderRadius: 24, background: 'var(--bg-tertiary)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <Zap size={40} />
        </div>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: 16 }}>Viral Lab</h3>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>Initialize your topic node above to unlock high-fidelity viral diagnostics and performance directives.</p>
      </div>
    </div>
  );
}
