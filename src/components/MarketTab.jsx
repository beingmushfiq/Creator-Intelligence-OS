import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, Map, Search, TrendingUp, AlertTriangle, RefreshCw, 
  Sparkles, Zap, Fingerprint, Users, Compass, ArrowRight,
  Globe, Activity, Target, Layers, ChevronRight, Magnet
} from 'lucide-react';
import { useCreator } from '../context/CreatorContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { generateMarketAnalysis } from '../engine/aiService.js';

export default function MarketTab() {
  const { data, setData, topic, loading } = useCreator();
  const { addToast } = useToast();
  
  const market = data?.market || {};

  const handleGenerateMarket = async () => {
    if (!topic) {
      addToast('error', 'Initiate project node first.');
      return;
    }
    try {
      addToast('info', 'Synchronizing market topography...');
      const result = await generateMarketAnalysis(topic);
      setData(prev => ({
        ...prev,
        market: result
      }));
      addToast('success', 'Topography synchronized.');
    } catch (e) {
      addToast('error', 'Synchronization failed.');
    }
  };

  if (!market || Object.keys(market).length === 0) return (
     <div className="tab-content center-content" style={{ minHeight: '60vh' }}>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass glass-hover" style={{ maxWidth: 520, padding: 60, borderRadius: 32, textAlign: 'center' }}>
           <div className="glow-border" style={{ width: 80, height: 80, borderRadius: 24, background: 'var(--bg-tertiary)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <Globe size={40} />
           </div>
           <h3 style={{ fontSize: '1.6rem', fontWeight: 900, marginBottom: 16 }}>Market Topography</h3>
           <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6, marginBottom: 32 }}>Analyze competitive architectures and identify high-velocity opportunity nodes within your operating niche.</p>
           <button onClick={handleGenerateMarket} className="btn-primary" style={{ padding: '16px 32px' }}>
              <Compass size={18} /> Map Territory
           </button>
        </motion.div>
     </div>
  );

  return (
    <div className="tab-content animate-slide-up">
      <div className="tab-header" style={{ marginBottom: 40 }}>
        <div className="stagger-children">
          <h2 className="tab-title text-gradient-aurora" style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.04em' }}>Market Architecture</h2>
          <p className="tab-subtitle" style={{ fontSize: '1.1rem' }}>Competitive node mapping & recursive opportunity diagnostics</p>
        </div>
        <button onClick={handleGenerateMarket} className="btn-secondary" disabled={loading} style={{ padding: '12px' }}>
          {loading ? <RefreshCw className="animate-spin" size={18} /> : <RefreshCw size={18} />}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 28, marginBottom: 48 }}>
         
         {/* Competitive Landscape */}
         <div className="glass" style={{ padding: 40, borderRadius: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 32 }}>
               <div className="glow-border" style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--bg-tertiary)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Map size={22} />
               </div>
               <h3 style={{ fontSize: '1.3rem', fontWeight: 900 }}>Competitive Landscape</h3>
            </div>
            <div className="stagger-children" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
               {market.competitors?.map((comp, i) => (
                  <motion.div key={i} whileHover={{ x: 8 }} className="glass glass-hover" style={{ padding: 24, borderRadius: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div className="glass" style={{ width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-secondary)' }}>
                           <Users size={18} />
                        </div>
                        <div>
                           <div style={{ fontSize: '1rem', fontWeight: 800 }}>{comp.name}</div>
                           <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)' }}>Primary Node</div>
                        </div>
                     </div>
                     <div className="glass" style={{ padding: '4px 12px', borderRadius: 8, fontSize: '0.65rem', fontWeight: 950, color: 'var(--accent-primary)' }}>ALPHA-RANK</div>
                  </motion.div>
               ))}
            </div>
         </div>

         {/* Opportunity Sidebar */}
         <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            <div className="glass" style={{ padding: 32, borderRadius: 28 }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
                  <div className="glow-border" style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--bg-tertiary)', color: 'var(--accent-warning)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     <Target size={22} />
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 900 }}>Velocity Gaps</h3>
               </div>
               <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {market.gaps?.map((gap, i) => (
                     <div key={i} className="glass glass-hover" style={{ padding: '16px 20px', borderRadius: 16, borderLeft: '3px solid var(--accent-warning)' }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{gap.title}</div>
                        <div style={{ fontSize: '0.65rem', fontWeight: 900, color: 'var(--accent-warning)', textTransform: 'uppercase', marginTop: 4 }}>High Potential</div>
                     </div>
                  ))}
               </div>
            </div>

            <div className="glass glass-hover" style={{ padding: 32, borderRadius: 28, background: 'var(--gradient-primary)05', border: '1px solid var(--accent-primary)20' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <Sparkles size={18} color="var(--accent-primary)" />
                  <span style={{ fontSize: '0.7rem', fontWeight: 950, color: 'var(--accent-primary)', textTransform: 'uppercase' }}>Market Tip</span>
               </div>
               <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                  Competitor nodes are currently saturated in "Top-of-Funnel" content. Recommend pivoting to "High-Intent" technical narratives.
               </p>
            </div>
         </div>

      </div>

      {/* Strategic Positioning */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
         <h3 style={{ fontSize: '1.3rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: 12 }}>
            <Activity size={22} color="var(--accent-success)" /> Positioning Protocols
         </h3>
         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
            {market.positioning?.map((pos, i) => (
               <motion.div key={i} whileHover={{ y: -6 }} className="glass glass-hover" style={{ padding: 28, borderRadius: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                     <div className="glass" style={{ width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-success)' }}>
                        <Fingerprint size={16} />
                     </div>
                     <span style={{ fontSize: '1.1rem', fontWeight: 800 }}>{pos.id}</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>{pos.description}</p>
               </motion.div>
            ))}
         </div>
      </div>
    </div>
  );
}
