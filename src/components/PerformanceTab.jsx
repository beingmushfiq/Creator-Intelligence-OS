import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  Zap, 
  AlertTriangle, 
  RefreshCw, 
  Flame, 
  Eye, 
  Target, 
  ArrowRight,
  ShieldCheck,
  BarChart3,
  Search
} from 'lucide-react';
import { useCreator } from '../context/CreatorContext';
import { useToast } from '../context/ToastContext';
import { getPerformanceProjection } from '../engine/aiService';

export default function PerformanceTab() {
  const { topic, data, setData, currentProjectId } = useCreator();
  const { addToast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const p = data?.performance;

  const handleRunProjection = async () => {
    if (!topic || !data?.script) {
      addToast('info', 'Generate a master script first to run performance lab');
      return;
    }
    setLoading(true);
    try {
      const result = await getPerformanceProjection(topic, data);
      setData(prev => ({ ...prev, performance: result }));
      addToast('success', 'Performance simulation complete');
    } catch (err) {
      addToast('error', 'Simulation failed');
    } finally {
      setLoading(false);
    }
  };

  if (!currentProjectId) {
    return (
      <div className="tab-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center' }}>
        <div style={{ maxWidth: 400 }}>
          <TrendingUp size={48} color="var(--accent-primary)" style={{ marginBottom: 20 }} />
          <h2 style={{ marginBottom: 12 }}>Performance Prediction</h2>
          <p style={{ color: 'var(--text-tertiary)', marginBottom: 24 }}>
            Analyze the viral potential of your project. Identify retention hazards and optimize for maximum reach.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="tab-content">
      <div className="tab-header">
        <div>
          <h2 className="tab-title text-gradient">Viral Vault</h2>
          <p className="tab-subtitle">AI-driven virality prediction & retention lab</p>
        </div>
        <button 
          className="btn-primary" 
          onClick={handleRunProjection} 
          disabled={loading}
        >
          {loading ? <RefreshCw className="animate-spin" size={16} /> : <Zap size={16} />}
          <span>{p ? 'Rerun Simulation' : 'Predict Performance'}</span>
        </button>
      </div>

      {!p ? (
        <div style={{ 
          display: 'flex', flexDirection: 'column', alignItems: 'center', 
          justifyContent: 'center', minHeight: '50vh', background: 'var(--bg-secondary)', 
          borderRadius: 16, border: '1px dashed var(--border-subtle)', margin: '0 20px'
        }}>
          <BarChart3 size={40} color="var(--text-tertiary)" style={{ marginBottom: 16, opacity: 0.5 }} />
          <p style={{ color: 'var(--text-tertiary)' }}>No performance projection generated yet.</p>
          <button className="btn-ghost" onClick={handleRunProjection} style={{ marginTop: 12 }}>
            Initiate Viral Projection
          </button>
        </div>
      ) : (
        <div className="card-grid stagger-children">
          
          {/* Main Velocity Meter */}
          <div className="card card-full" style={{ padding: '32px', background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(245, 158, 11, 0.05) 100%)', border: '1px solid var(--accent-secondary)20' }}>
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40, alignItems: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ position: 'relative', width: 140, height: 140, margin: '0 auto 16px' }}>
                    <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="var(--bg-tertiary)"
                        strokeWidth="3"
                        strokeDasharray="100, 100"
                      />
                      <motion.path
                        initial={{ strokeDasharray: "0, 100" }}
                        animate={{ strokeDasharray: `${p.velocityScore}, 100` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="var(--accent-secondary)"
                        strokeWidth="3"
                      />
                    </svg>
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                      <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-primary)' }}>{p.velocityScore}</div>
                      <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 700 }}>Viral Score</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
                    <div style={{ fontSize: '0.75rem', padding: '4px 8px', background: 'var(--accent-secondary)10', color: 'var(--accent-secondary)', borderRadius: 6, fontWeight: 700 }}>
                       Hook: {p.hookStrength}%
                    </div>
                  </div>
                </div>

                <div style={{ flex: 1 }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                      <Flame size={20} color="var(--accent-secondary)" />
                      <h3 style={{ fontWeight: 800, fontSize: '1.2rem' }}>Performance Projection</h3>
                   </div>
                   <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                      <div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: 4 }}>Reach Potential</div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 600 }}>{p.projections.reach}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: 4 }}>Est. Engagement</div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 600 }}>{p.projections.engagement}</div>
                      </div>
                      <div style={{ gridColumn: 'span 2' }}>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: 4 }}>Predicted Sentiment</div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 600 }}>{p.projections.sentiment}</div>
                      </div>
                   </div>
                </div>
             </div>
          </div>

          {/* Retention Hazards */}
          <div className="card" style={{ gridColumn: 'span 2' }}>
            <div className="card-header">
              <div className="card-title-group">
                <div className="card-icon" style={{ color: '#ef4444' }}><AlertTriangle size={16} /></div>
                <h3 className="card-title">Retention Hazard Map</h3>
              </div>
            </div>
            <div className="card-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {p.hazards.map((h, i) => (
                  <div key={i} style={{ padding: 16, background: 'var(--bg-tertiary)', borderRadius: 12, border: '1px solid var(--border-subtle)', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: 12, right: 12 }}>
                       <span className="badge" style={{ 
                         background: h.severity === 'High' ? 'rgba(239, 68, 68, 0.1)' : h.severity === 'Medium' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                         color: h.severity === 'High' ? '#ef4444' : h.severity === 'Medium' ? '#f59e0b' : '#22c55e',
                         borderColor: h.severity === 'High' ? '#ef4444' : h.severity === 'Medium' ? '#f59e0b' : '#22c55e',
                         fontSize: '0.6rem'
                       }}>
                         {h.severity} Risk
                       </span>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ color: 'var(--text-tertiary)' }}>At:</span> {h.location}
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 12 }}>{h.reason}</p>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '10px', background: 'var(--bg-primary)', borderRadius: 8, fontSize: '0.8rem' }}>
                       <ShieldCheck size={14} color="var(--accent-success)" style={{ marginTop: 2, flexShrink: 0 }} />
                       <div style={{ color: 'var(--text-primary)' }}><span style={{ fontWeight: 700, color: 'var(--accent-success)' }}>Fix:</span> {h.fix}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Viral Catalysts */}
          <div className="card">
            <div className="card-header">
              <div className="card-title-group">
                <div className="card-icon" style={{ color: 'var(--accent-primary)' }}><Flame size={16} /></div>
                <h3 className="card-title">Viral Catalysts</h3>
              </div>
            </div>
            <div className="card-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {p.catalysts.map((c, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--accent-primary)20', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, flexShrink: 0, marginTop: 2 }}>{i+1}</div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{c}</p>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 24, padding: 16, background: 'var(--bg-tertiary)', borderRadius: 12, textAlign: 'center', border: '1px dashed var(--border-subtle)' }}>
                 <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginBottom: 8 }}>Ready to film?</p>
                 <button className="btn-mini" style={{ width: '100%' }}>Finalize Pre-Prod</button>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
