import React, { useState, useEffect } from 'react';
import { 
  Target, Zap, Eye, TrendingUp, Brain, 
  Shield, BarChart3, Globe, Sparkles, 
  Loader2 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useCreator } from '../context/CreatorContext';
import { RegenerateButton } from './ui/RegenerateButton';
import { ExportButton } from './ui/ExportButton';
import { exportMasterReport } from '../utils/exportUtils';

export default function StrategyTab() {
  const { data, loading, regenerateSection, topic } = useCreator();
  const n = data?.narrative;
  const [globalStrategy, setGlobalStrategy] = useState(null);
  const [isGlobalLoading, setIsGlobalLoading] = useState(false);

  const fetchGlobalStrategy = async () => {
    if (!topic || globalStrategy) return;
    setIsGlobalLoading(true);
    try {
      const { getGlobalMarketStrategy } = await import('../engine/aiService.js');
      const strategy = await getGlobalMarketStrategy(topic, data?.niche || 'Content Creation');
      setGlobalStrategy(strategy);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGlobalLoading(false);
    }
  };

  useEffect(() => {
    if (n && !globalStrategy) {
      fetchGlobalStrategy();
    }
  }, [n, topic]);

  if (!n) return <EmptyState />;

  return (
    <div className="tab-content">
      <div className="tab-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20 }}>
        <div>
          <h2 className="tab-title text-gradient">Narrative Intelligence</h2>
          <p className="tab-subtitle">Strategic breakdown of your topic — tension, incentives, and positioning</p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <button 
            className="btn-primary" 
            onClick={() => exportMasterReport(data, data.topic || 'Project')}
            style={{ fontSize: '0.85rem', boxShadow: '0 4px 12px var(--accent-primary)40' }}
          >
            <Brain size={16} />
            <span>Master Report</span>
          </button>
          <ExportButton section="narrative" data={n} />
          <RegenerateButton onClick={() => regenerateSection('narrative')} loading={loading} />
        </div>
      </div>

      <div className="card-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 24 }}>
        {/* Content Type */}
        <motion.div 
          whileHover={{ y: -4, borderColor: 'var(--accent-primary)' }}
          className="card" 
          style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ padding: 8, background: 'var(--accent-primary)10', borderRadius: 10, color: 'var(--accent-primary)' }}><Target size={18} /></div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Content Type</h3>
            </div>
            <span className="badge badge-purple">{n.contentType}</span>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{n.contentTypeReasoning}</p>
        </motion.div>

        {/* Topic Interpretation */}
        <motion.div 
          whileHover={{ y: -4, borderColor: 'var(--accent-secondary)' }}
          className="card" 
          style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ padding: 8, background: 'var(--accent-secondary)10', borderRadius: 10, color: 'var(--accent-secondary)' }}><Brain size={18} /></div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Core Interpretation</h3>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{n.interpretation}</p>
        </motion.div>

        {/* Core Tension */}
        <motion.div 
          whileHover={{ y: -4, borderColor: 'var(--accent-danger)' }}
          className="card" 
          style={{ gridColumn: '1 / -1', padding: 24, border: '1px solid var(--accent-danger)20', background: 'var(--accent-danger)05' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{ padding: 8, background: 'var(--accent-danger)10', borderRadius: 10, color: 'var(--accent-danger)' }}><Zap size={18} /></div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>The Core Tension</h3>
          </div>
          <p style={{ fontSize: '1rem', color: 'var(--text-primary)', lineHeight: 1.8, fontWeight: 500 }}>{n.coreTension}</p>
        </motion.div>

        {/* Hidden Incentives */}
        <motion.div 
          whileHover={{ y: -4, borderColor: 'var(--accent-warning)' }}
          className="card" 
          style={{ padding: 24 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <div style={{ padding: 8, background: 'var(--accent-warning)10', borderRadius: 10, color: 'var(--accent-warning)' }}><Eye size={18} /></div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Hidden Incentives</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {n.hiddenIncentives.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-warning)' }} />
                {item}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Emotional Leverage points */}
        <motion.div 
          whileHover={{ y: -4, borderColor: 'var(--accent-secondary)' }}
          className="card" 
          style={{ padding: 24 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <div style={{ padding: 8, background: 'var(--accent-secondary)10', borderRadius: 10, color: 'var(--accent-secondary)' }}><TrendingUp size={18} /></div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Psychological Leverage</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {n.emotionalLeverage.map((item, i) => (
              <div key={i} style={{ padding: 12, background: 'var(--bg-tertiary)', borderRadius: 12, border: '1px solid var(--border-subtle)' }}>
                <span className="badge badge-cyan" style={{ marginBottom: 8, fontSize: '0.65rem' }}>{item.emotion}</span>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{item.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Market Context */}
        <motion.div 
          whileHover={{ y: -4, borderColor: 'var(--accent-success)' }}
          className="card" 
          style={{ padding: 24 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{ padding: 8, background: 'var(--accent-success)10', borderRadius: 10, color: 'var(--accent-success)' }}><BarChart3 size={18} /></div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Market Context</h3>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{n.marketContext}</p>
        </motion.div>

        {/* Global Market Strategy */}
        <motion.div 
          whileHover={{ y: -4 }}
          className="card" 
          style={{ gridColumn: '1 / -1', padding: 24, background: 'linear-gradient(135deg, rgba(124, 92, 252, 0.05) 0%, rgba(0, 212, 255, 0.05) 100%)', border: '1px solid var(--accent-primary)20' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ padding: 8, background: 'var(--accent-primary)', borderRadius: 10, color: 'white' }}><Globe size={18} /></div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Global Expansion Intelligence</h3>
            </div>
            <button 
              className="btn-mini" 
              onClick={fetchGlobalStrategy} 
              disabled={isGlobalLoading}
            >
              {isGlobalLoading ? <Loader2 size={12} className="spin" /> : 'Refresh Analysis'}
            </button>
          </div>
          
          {globalStrategy ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
              {globalStrategy.markets.map((m, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  style={{ padding: 20, background: 'var(--bg-secondary)', borderRadius: 16, border: '1px solid var(--border-subtle)', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                >
                   <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                     <span style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '1rem' }}>{m.name}</span>
                     <span className={`badge ${m.potential === 'High' ? 'badge-green' : 'badge-blue'}`} style={{ fontSize: '0.65rem' }}>{m.potential} Potential</span>
                   </div>
                   <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginBottom: 12, fontWeight: 600 }}>LOC: {m.language}</div>
                   <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', borderTop: '1px solid var(--border-subtle)', paddingTop: 12 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--accent-primary)', fontWeight: 800, fontSize: '0.65rem', textTransform: 'uppercase', marginBottom: 6 }}>
                        <Sparkles size={10} /> Local Cultural Hook
                      </span>
                      {m.culturalHook}
                   </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-tertiary)' }}>
               <Loader2 size={24} className="spin" style={{ margin: '0 auto 12px', opacity: 0.5 }} />
               <p style={{ fontSize: '0.9rem' }}>Analyzing cross-cultural entry points...</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="tab-content">
      <div className="empty-state">
        <div className="empty-state-icon">
          <Target size={32} />
        </div>
        <h3>Enter a Topic to Begin</h3>
        <p>Type a single topic sentence above and hit Generate to unlock your narrative intelligence breakdown.</p>
      </div>
    </div>
  );
}
