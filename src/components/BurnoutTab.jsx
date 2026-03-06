import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Battery, Coffee, RefreshCcw, AlertTriangle, CheckCircle2, 
  Brain, Calendar, ArrowRight, TrendingDown, Wind, 
  Zap, Sparkles, Activity, ShieldAlert, Heart, Info,
  ChevronRight, Timer, HeartPulse, Recycle
} from 'lucide-react';
import { useCreator } from '../context/CreatorContext.jsx';
import { analyzeWorkload, getEvergreenRecycleIdeas } from '../engine/aiService.js';

export default function BurnoutTab() {
  const { data, loading, regenerateSection } = useCreator();
  const [sustainability, setSustainability] = useState(null);
  const [ideas, setIdeas] = useState([]);

  const loadSustainabilityData = async () => {
    if (data?.tasks) {
      const analysis = await analyzeWorkload(data.tasks);
      setSustainability(analysis);
      const recycleIdeas = await getEvergreenRecycleIdeas();
      setIdeas(recycleIdeas);
    }
  };

  useEffect(() => { loadSustainabilityData(); }, [data?.tasks]);

  const getRiskColor = (risk) => {
    if (risk === 'High') return 'var(--accent-danger)';
    if (risk === 'Moderate') return 'var(--accent-warning)';
    return 'var(--accent-success)';
  };

  if (!sustainability) return <EmptyState />;

  return (
    <div className="tab-content animate-slide-up">
      <div className="tab-header" style={{ marginBottom: 40 }}>
        <div className="stagger-children">
          <h2 className="tab-title text-gradient-aurora" style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.04em' }}>Neural Sustainability</h2>
          <p className="tab-subtitle" style={{ fontSize: '1.1rem' }}>Burnout protection protocols & recursive creative energy diagnostics</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
           <button onClick={loadSustainabilityData} className="btn-secondary" disabled={loading} style={{ padding: '12px' }}>
              <RefreshCcw size={18} />
           </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 28, marginBottom: 48 }}>
         
         {/* Vitality Hub */}
         <div className="glass" style={{ padding: 40, borderRadius: 32, position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div className="glow-border" style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--bg-tertiary)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     <Battery size={22} />
                  </div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 900 }}>Neural Battery</h3>
               </div>
               <div className="glass" style={{ padding: '6px 14px', borderRadius: 100, fontSize: '0.65rem', fontWeight: 950, color: getRiskColor(sustainability.riskLevel) }}>
                  CRITICAL AT 84%
               </div>
            </div>

            <div style={{ position: 'relative', height: 12, background: 'var(--bg-tertiary)', borderRadius: 10, marginBottom: 40, overflow: 'hidden' }}>
               <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '84%' }}
                  style={{ height: '100%', background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))', boxShadow: '0 0 20px var(--accent-primary)40' }} 
               />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
               <div className="glass" style={{ padding: 24, borderRadius: 20, textAlign: 'center' }}>
                  <div style={{ fontSize: '0.65rem', fontWeight: 900, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: 10 }}>Pacing Logic</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 950, color: 'var(--accent-success)' }}>Optimal</div>
               </div>
               <div className="glass" style={{ padding: 24, borderRadius: 20, textAlign: 'center' }}>
                  <div style={{ fontSize: '0.65rem', fontWeight: 900, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: 10 }}>Stress Load</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 950, color: 'var(--accent-warning)' }}>Moderate</div>
               </div>
               <div className="glass" style={{ padding: 24, borderRadius: 20, textAlign: 'center' }}>
                  <div style={{ fontSize: '0.65rem', fontWeight: 900, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: 10 }}>Evergreen Ratio</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 950, color: 'var(--accent-primary)' }}>64%</div>
               </div>
            </div>
         </div>

         {/* Energy Protection Sidebar */}
         <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            <div className="glass" style={{ padding: 32, borderRadius: 28 }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
                  <div className="glow-border" style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--bg-tertiary)', color: 'var(--accent-danger)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     <ShieldAlert size={22} />
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 900 }}>Protection Directives</h3>
               </div>
               <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {sustainability?.advice?.map((adv, i) => (
                     <div key={i} className="glass glass-hover" style={{ padding: '14px 18px', borderRadius: 12, display: 'flex', gap: 12, alignItems: 'center' }}>
                        <Zap size={14} color="var(--accent-warning)" />
                        <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{adv}</span>
                     </div>
                  ))}
               </div>
            </div>

            <div className="glass glass-hover" style={{ padding: 32, borderRadius: 28, background: 'var(--gradient-primary)05', border: '1px solid var(--accent-primary)20' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <Coffee size={18} color="var(--accent-primary)" />
                  <span style={{ fontSize: '0.7rem', fontWeight: 950, color: 'var(--accent-primary)', textTransform: 'uppercase' }}>Wellness Node</span>
               </div>
               <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                  High creative variance detected. Recommend scheduled "Idea Incubation" blocks to maintain long-term neural resilience.
               </p>
            </div>
         </div>

      </div>

      {/* Evergreen Recycling */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
         <h3 style={{ fontSize: '1.3rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: 12 }}>
            <Recycle size={22} color="var(--accent-success)" /> Narrative Recycling Ideas
         </h3>
         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
            {ideas.map((idea, i) => (
               <motion.div key={i} whileHover={{ y: -6 }} className="glass glass-hover" style={{ padding: 28, borderRadius: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                     <div className="glass" style={{ padding: '6px 12px', borderRadius: 8, fontSize: '0.65rem', fontWeight: 950, color: 'var(--accent-success)' }}>SUSTAINABLE</div>
                     <ArrowRight size={16} color="var(--text-tertiary)" />
                  </div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 12 }}>{idea.topic}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>{idea.logic}</p>
               </motion.div>
            ))}
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
          <Brain size={40} />
        </div>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: 16 }}>Neural Sustainability</h3>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>Initialize your workspace tasks to visualize creative energy diagnostics and burnout protection protocols.</p>
      </div>
    </div>
  );
}
