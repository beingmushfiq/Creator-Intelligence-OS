import React, { useState, useEffect } from 'react';
import { 
  Target, Zap, Eye, TrendingUp, Brain, 
  Shield, BarChart3, Globe, Sparkles, 
  RefreshCw, Layers, Compass, ChevronRight,
  ShieldCheck, Activity, HeartPulse
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCreator } from '../context/CreatorContext.jsx';
import { RegenerateButton } from './ui/RegenerateButton.jsx';
import { ExportButton } from './ui/ExportButton.jsx';
import { exportMasterReport } from '../utils/exportUtils.js';

export default function StrategyTab() {
  const { data, loading, regenerateSection, topic } = useCreator();
  const s = data?.strategy || {};

  if (!s || Object.keys(s).length === 0) return <EmptyState />;

  return (
    <div className="tab-content animate-slide-up">
      <div className="tab-header" style={{ marginBottom: 48 }}>
        <div className="stagger-children">
          <h2 className="tab-title text-gradient-aurora" style={{ fontSize: '3rem', fontWeight: 950, letterSpacing: '-0.04em' }}>Global Strategy</h2>
          <p className="tab-subtitle" style={{ fontSize: '1.2rem' }}>High-fidelity operational roadmap & ecosystem alignment protocols</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <ExportButton section="strategy" data={s} />
          <RegenerateButton onClick={() => regenerateSection('strategy')} loading={loading} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 28, marginBottom: 48 }}>
         
         {/* Main Strategy Arc */}
         <div className="glass" style={{ padding: 48, borderRadius: 40, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', right: -20, top: -20, opacity: 0.1 }}><Compass size={200} color="var(--accent-primary)" /></div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 40 }}>
               <div className="glow-border" style={{ width: 52, height: 52, borderRadius: 16, background: 'var(--bg-tertiary)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Brain size={26} />
               </div>
               <div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: 4 }}>Neural Roadmap</h3>
                  <div style={{ display: 'flex', gap: 10 }}>
                     <span className="glass" style={{ padding: '4px 10px', borderRadius: 100, fontSize: '0.65rem', fontWeight: 900, color: 'var(--accent-success)' }}>OPTIMAL SYNC</span>
                     <span className="glass" style={{ padding: '4px 10px', borderRadius: 100, fontSize: '0.65rem', fontWeight: 900, color: 'var(--accent-primary)' }}>AI-ENABLED</span>
                  </div>
               </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 24, position: 'relative', zIndex: 1 }}>
               {s.roadmap?.map((step, i) => (
                  <motion.div key={i} whileHover={{ x: 10 }} className="glass" style={{ padding: 32, borderRadius: 28, borderLeft: `4px solid ${i % 2 === 0 ? 'var(--accent-primary)' : 'var(--accent-secondary)'}` }}>
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 950, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Phase 0{i+1}: {step.phase}</span>
                        <ChevronRight size={18} style={{ opacity: 0.2 }} />
                     </div>
                     <p style={{ fontSize: '1.1rem', color: 'var(--text-primary)', fontWeight: 700, margin: 0, lineHeight: 1.5 }}>{step.directive}</p>
                  </motion.div>
               )) || <div className="glass" style={{ padding: 48, textAlign: 'center', opacity: 0.5 }}>Strategic roadmap pending synthesis...</div>}
            </div>
         </div>

         {/* Strategic Pillars */}
         <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            <div className="glass" style={{ padding: 32, borderRadius: 28 }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 32 }}>
                  <div className="glow-border" style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--bg-tertiary)', color: 'var(--accent-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     <Layers size={22} />
                  </div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 900 }}>Strategic Pillars</h3>
               </div>
               <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <PillarItem label="Retention Architecture" status="Optimal" color="var(--accent-success)" />
                  <PillarItem label="Monetization Vector" status="Scaling" color="var(--accent-primary)" />
                  <PillarItem label="Engagement Friction" status="Minimizing" color="var(--accent-warning)" />
               </div>
            </div>

            <div className="glass glass-hover" style={{ padding: 32, borderRadius: 28, background: 'var(--gradient-primary)05', border: '1px solid var(--accent-primary)20' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <Sparkles size={18} color="var(--accent-primary)" />
                  <span style={{ fontSize: '0.7rem', fontWeight: 950, color: 'var(--accent-primary)', textTransform: 'uppercase' }}>Executive Insight</span>
               </div>
               <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                  Current operational telemetry suggests a 22% lift in retention by shifting focus to "Evergreen Technical" narrative nodes in Phase 02.
               </p>
            </div>
         </div>

      </div>

      {/* Global Metrics Area */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 28 }}>
         <StrategyStat icon={Globe} label="Market Reach potential" value="2.4M+" color="var(--accent-primary)" />
         <StrategyStat icon={Zap} label="Growth Velocity" value="Alpha Cluster" color="var(--accent-warning)" />
         <StrategyStat icon={ShieldCheck} label="Brand Safety" value="100% Secured" color="var(--accent-success)" />
      </div>
    </div>
  );
}

function PillarItem({ label, status, color }) {
   return (
      <div className="glass glass-hover" style={{ padding: '16px 20px', borderRadius: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
         <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>{label}</span>
         <span style={{ fontSize: '0.75rem', fontWeight: 950, color: color }}>{status.toUpperCase()}</span>
      </div>
   );
}

function StrategyStat({ icon: Icon, label, value, color }) {
   return (
      <motion.div whileHover={{ y: -8 }} className="glass glass-hover" style={{ padding: 32, borderRadius: 28 }}>
         <div className="glow-border" style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--bg-tertiary)', color: color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
            <Icon size={22} />
         </div>
         <div style={{ fontSize: '1.4rem', fontWeight: 950, marginBottom: 4 }}>{value}</div>
         <div style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</div>
      </motion.div>
   );
}

function EmptyState() {
  return (
    <div className="tab-content center-content" style={{ minHeight: '60vh' }}>
      <div className="glass glass-hover" style={{ maxWidth: 480, padding: 48, borderRadius: 32, textAlign: 'center' }}>
        <div className="glow-border" style={{ width: 80, height: 80, borderRadius: 24, background: 'var(--bg-tertiary)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <Target size={40} />
        </div>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: 16 }}>Global Strategy</h3>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>Initialize your strategic foundation to visualize your operational roadmap and high-fidelity ecosystem alignment protocols.</p>
      </div>
    </div>
  );
}
