import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, Users, RefreshCw, Layers, MessageCircle, 
  Sparkles, Target, Zap, ArrowRight, ShieldCheck, 
  ChevronRight, ArrowUpRight, Activity, Compass,
  Globe, Zap as ZapIcon, HeartPulse, BarChart
} from 'lucide-react';
import { useCreator } from '../context/CreatorContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { RegenerateButton } from './ui/RegenerateButton.jsx';
import { ExportButton } from './ui/ExportButton.jsx';

export default function GrowthTab() {
  const { data, loading, regenerateSection, topic } = useCreator();
  const { addToast } = useToast();
  
  const growth = data?.growth || {};

  if (!growth || Object.keys(growth).length === 0) return <EmptyState />;

  return (
    <div className="tab-content animate-slide-up">
      <div className="tab-header" style={{ marginBottom: 40 }}>
        <div className="stagger-children">
          <h2 className="tab-title text-gradient-aurora" style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.04em' }}>Growth Roadmap</h2>
          <p className="tab-subtitle" style={{ fontSize: '1.1rem' }}>Strategic expansion protocols & recursive audience acquisition</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <ExportButton section="growth" data={growth} />
          <RegenerateButton onClick={() => regenerateSection('growth')} loading={loading} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 28, marginBottom: 48 }}>
         
         {/* Strategy Core */}
         <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: 12 }}>
               <Compass size={22} color="var(--accent-primary)" /> High-Fidelity Strategies
            </h3>
            <div className="stagger-children" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
               {growth.strategies?.map((s, i) => (
                  <motion.div key={i} whileHover={{ x: 8 }} className="glass glass-hover" style={{ padding: 28, borderRadius: 24, display: 'flex', gap: 24, alignItems: 'flex-start' }}>
                     <div className="glow-border" style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--bg-tertiary)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <ZapIcon size={20} />
                     </div>
                     <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: 8 }}>{s.title || "Strategic Node"}</h4>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>{s.description}</p>
                     </div>
                     <div className="glass" style={{ padding: '6px 12px', borderRadius: 8, fontSize: '0.65rem', fontWeight: 950, color: 'var(--accent-success)', background: 'rgba(34, 197, 94, 0.05)' }}>
                        DEPLOYED
                     </div>
                  </motion.div>
               ))}
            </div>
         </div>

         {/* Growth Metrics */}
         <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            <div className="glass" style={{ padding: 32, borderRadius: 28 }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
                  <div className="glow-border" style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--bg-tertiary)', color: 'var(--accent-warning)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     <TrendingUp size={22} />
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 900 }}>Growth Impact</h3>
               </div>
               <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <MetricCard label="Est. Subscriber Lift" value="+14% / Mo" color="var(--accent-primary)" />
                  <MetricCard label="Reach Potential" value="840k+" color="var(--accent-secondary)" />
                  <MetricCard label="Viral Propensity" value="0.92" color="var(--accent-success)" />
               </div>
            </div>

            <div className="glass glass-hover" style={{ padding: 32, borderRadius: 28, background: 'var(--gradient-primary)05', border: '1px solid var(--accent-primary)20' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <Sparkles size={18} color="var(--accent-primary)" />
                  <span style={{ fontSize: '0.7rem', fontWeight: 950, color: 'var(--accent-primary)', textTransform: 'uppercase' }}>Intelligence Insight</span>
               </div>
               <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                  Focusing on "Algorithm-Native" content cycles currently yields a 2.4x higher subscriber conversion rate than standard industry baselines.
               </p>
            </div>
         </div>

      </div>

      {/* Target Segments */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
         <h3 style={{ fontSize: '1.3rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: 12 }}>
            <Users size={22} color="var(--accent-secondary)" /> Target Verticals
         </h3>
         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {growth.segments?.map((seg, i) => (
               <motion.div key={i} whileHover={{ y: -6 }} className="glass glass-hover" style={{ padding: 28, borderRadius: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                     <div className="glass" style={{ width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-secondary)' }}>
                        <Target size={16} />
                     </div>
                     <span style={{ fontSize: '1.1rem', fontWeight: 800 }}>{seg.name}</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>{seg.strategy}</p>
               </motion.div>
            )) || <div className="glass" style={{ padding: 32, gridColumn: '1 / -1', textAlign: 'center', opacity: 0.5 }}>No segments defined yet.</div>}
         </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, color }) {
   return (
      <div className="glass" style={{ padding: '16px 20px', borderRadius: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
         <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-tertiary)' }}>{label}</span>
         <span style={{ fontSize: '1rem', fontWeight: 900, color: color }}>{value}</span>
      </div>
   );
}

function EmptyState() {
  return (
    <div className="tab-content center-content" style={{ minHeight: '60vh' }}>
      <div className="glass glass-hover" style={{ maxWidth: 480, padding: 48, borderRadius: 32, textAlign: 'center' }}>
        <div className="glow-border" style={{ width: 80, height: 80, borderRadius: 24, background: 'var(--bg-tertiary)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <TrendingUp size={40} />
        </div>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: 16 }}>Growth Roadmap</h3>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>Initialize a strategic foundation to visualize your audience expansion protocols and recursive growth diagnostics.</p>
      </div>
    </div>
  );
}
