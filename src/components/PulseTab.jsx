import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, TrendingUp, TrendingDown, Minus, Zap, Target, 
  MessageCircle, AlertCircle, RefreshCw, HeartPulse, Brain,
  Sparkles, Info, Users, BarChart3, ChevronRight, Magnet
} from 'lucide-react';
import { useCreator } from '../context/CreatorContext.jsx';

export default function PulseTab() {
  const { pulse, generatePulse, loading, topic } = useCreator();

  useEffect(() => {
    if (!pulse && topic && !loading) {
      generatePulse();
    }
  }, [topic]);

  if (!topic) {
    return (
      <div className="tab-content center-content">
        <div style={{ textAlign: 'center' }}>
          <Activity size={48} className="opacity-20" style={{ marginBottom: 20 }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Awaiting Topic Intelligence</h3>
          <p style={{ color: 'var(--text-tertiary)' }}>Initialize a topic to analyze the Community Pulse.</p>
        </div>
      </div>
    );
  }

  if (loading && !pulse) {
    return (
      <div className="tab-content center-content">
        <div style={{ textAlign: 'center' }}>
          <RefreshCw size={48} className="spin" color="var(--accent-primary)" style={{ marginBottom: 24 }} />
          <h3 className="text-gradient" style={{ fontSize: '1.5rem', fontWeight: 800 }}>Analyzing Audience DNA</h3>
          <p style={{ color: 'var(--text-tertiary)' }}>Mapping sentiment heatmaps and trend drift velocity...</p>
        </div>
      </div>
    );
  }

  const { sentiment, vibeTags, trendDrift } = pulse || {
    sentiment: {},
    vibeTags: [],
    trendDrift: { score: 0, direction: 'Stable', reasoning: 'Deep-learning narrative analysis pending...' }
  };

  const DriftIcon = {
    Up: TrendingUp,
    Down: TrendingDown,
    Stable: Minus
  }[trendDrift.direction] || Minus;

  const getDriftColor = () => {
    if (trendDrift.direction === 'Up') return 'var(--accent-success)';
    if (trendDrift.direction === 'Down') return 'var(--accent-danger)';
    return 'var(--accent-info)';
  };

  return (
    <div className="tab-content">
      <div className="tab-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20 }}>
        <div>
          <h2 className="tab-title text-gradient">Community Heartbeat</h2>
          <p className="tab-subtitle">Real-time audience resonance & trend velocity analysis</p>
        </div>
        <button 
          onClick={generatePulse}
          disabled={loading}
          className="shiny-button"
          style={{ padding: '10px 24px', gap: 10 }}
        >
          {loading ? <RefreshCw size={18} className="spin" /> : <Activity size={18} />}
          <span>Re-analyze Rhythm</span>
        </button>
      </div>

      <div className="stagger-children" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 24 }}>
           {/* Trend Drift Console */}
           <motion.div 
             initial={{ opacity: 0, y: 15 }}
             animate={{ opacity: 1, y: 0 }}
             className="card" 
             style={{ padding: 40, background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%)', position: 'relative', overflow: 'hidden' }}
           >
              <div style={{ position: 'absolute', top: -30, right: -30, opacity: 0.05 }}>
                 <DriftIcon size={240} />
              </div>

              <div style={{ position: 'relative', zIndex: 1 }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
                    <div style={{ padding: 10, borderRadius: 12, background: 'var(--accent-primary)15', color: 'var(--accent-primary)' }}>
                       <Magnet size={24} />
                    </div>
                    <div>
                       <h3 style={{ fontSize: '1.2rem', fontWeight: 900 }}>Trend Drift Analysis</h3>
                       <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>Predictive trend velocity score</p>
                    </div>
                 </div>

                 <div style={{ display: 'flex', alignItems: 'flex-end', gap: 24, marginBottom: 32 }}>
                    <div style={{ fontSize: '5rem', fontWeight: 950, lineHeight: 0.8, letterSpacing: '-0.05em' }}>
                       {trendDrift.score}<span style={{ fontSize: '2rem', color: 'var(--text-tertiary)', fontWeight: 700 }}>%</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                       <div className="badge badge-primary" style={{ display: 'flex', alignItems: 'center', gap: 8, background: getDriftColor(), color: '#fff', border: 'none' }}>
                          <DriftIcon size={16} /> {trendDrift.direction} Velocity
                       </div>
                    </div>
                 </div>

                 <div style={{ padding: 24, background: 'var(--bg-primary)80', borderRadius: 20, border: '1px solid var(--border-subtle)', backdropFilter: 'blur(10px)' }}>
                    <div style={{ display: 'flex', gap: 12 }}>
                       <Brain size={20} color="var(--accent-secondary)" style={{ flexShrink: 0, marginTop: 2 }} />
                       <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontStyle: 'italic', margin: 0, lineHeight: 1.6 }}>
                          "{trendDrift.reasoning}"
                       </p>
                    </div>
                 </div>
              </div>
           </motion.div>

           {/* Vibe Cloud */}
           <motion.div 
             initial={{ opacity: 0, y: 15 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
             className="card" 
             style={{ padding: 40, display: 'flex', flexDirection: 'column' }}
           >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
                 <div style={{ padding: 10, borderRadius: 12, background: 'var(--accent-secondary)15', color: 'var(--accent-secondary)' }}>
                    <Sparkles size={24} />
                 </div>
                 <h3 style={{ fontSize: '1.2rem', fontWeight: 900 }}>Narrative Vibes</h3>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, flex: 1 }}>
                 {vibeTags.map((tag, i) => (
                    <motion.div 
                      key={tag}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 + (i * 0.05) }}
                      whileHover={{ scale: 1.05, borderColor: 'var(--accent-secondary)' }}
                      style={{ 
                        padding: '12px 20px', background: 'var(--bg-secondary)', borderRadius: 14, 
                        border: '1px solid var(--border-subtle)', fontSize: '0.9rem', fontWeight: 700, 
                        color: 'var(--text-primary)', cursor: 'default', transition: 'border-color 0.2s'
                      }}
                    >
                      #{tag}
                    </motion.div>
                 ))}
              </div>

              <div style={{ marginTop: 32, paddingTop: 32, borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>
                 <Users size={14} />
                 <span>Dominant archetypes detected from audience profiling</span>
              </div>
           </motion.div>
        </div>

        {/* Sentiment Matrix */}
        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.2 }}
           className="card card-full" 
           style={{ padding: 40 }}
        >
           <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 40 }}>
              <div style={{ padding: 10, borderRadius: 12, background: 'var(--accent-success)05', color: 'var(--accent-success)' }}>
                 <HeartPulse size={24} />
              </div>
              <div>
                 <h3 style={{ fontSize: '1.2rem', fontWeight: 900 }}>Sentiment Heatmap</h3>
                 <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>Mapping emotional resonance distribution</p>
              </div>
           </div>

           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 20 }}>
              {Object.entries(sentiment).map(([key, value], i) => (
                 <motion.div 
                    key={key}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + (i * 0.05) }}
                    style={{ textAlign: 'center' }}
                 >
                    <motion.div 
                       whileHover={{ scale: 1.02 }}
                       style={{ 
                          aspectRatio: '1/1', background: 'var(--bg-secondary)', borderRadius: 24, 
                          display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
                          border: '2px solid', borderColor: `rgba(var(--accent-primary-rgb), ${value / 200 + 0.1})`,
                          position: 'relative', overflow: 'hidden'
                       }}
                    >
                       <div style={{ position: 'absolute', inset: 0, background: 'var(--accent-primary)', opacity: value / 100 }} />
                       <div style={{ position: 'relative', fontSize: '1.8rem', fontWeight: 950, color: value > 50 ? '#fff' : 'var(--text-primary)' }}>{value}</div>
                    </motion.div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', color: 'var(--text-tertiary)', letterSpacing: '0.05em' }}>{key}</div>
                 </motion.div>
              ))}
           </div>
        </motion.div>

        {/* Strategic Insight Flash */}
        <div style={{ padding: '24px 32px', background: 'var(--accent-warning)05', borderRadius: 20, border: '1px solid var(--accent-warning)20', display: 'flex', gap: 20, alignItems: 'center' }}>
           <div style={{ padding: 12, background: 'var(--accent-warning)15', borderRadius: 12, color: 'var(--accent-warning)' }}>
              <AlertCircle size={24} />
           </div>
           <div>
              <div style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', color: 'var(--accent-warning)', marginBottom: 4 }}>System Strategic Insight</div>
              <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', margin: 0 }}>
                 Narrative drift indicates a shift toward the <strong>#{vibeTags[0]}</strong> archetype. Optimize your next 3 scripts for this resonance mode to maintain peak community pulse.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
