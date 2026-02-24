import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  Map, 
  Search, 
  TrendingUp, 
  AlertTriangle, 
  RefreshCw, 
  Sparkles,
  Zap,
  Fingerprint,
  Users
} from 'lucide-react';
import { useCreator } from '../context/CreatorContext';
import { useToast } from '../context/ToastContext';
import { generateMarketAnalysis } from '../engine/aiService';

export default function MarketTab() {
  const { topic, data, setData, currentProjectId } = useCreator();
  const { addToast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const m = data?.market;

  const handleGenerateMarket = async () => {
    if (!topic || !data) {
      addToast('info', 'Generate a project strategy first');
      return;
    }
    setLoading(true);
    try {
      const result = await generateMarketAnalysis(topic, data);
      setData(prev => ({ ...prev, market: result }));
      addToast('success', 'Market intelligence synchronized');
    } catch (err) {
      addToast('error', 'Market analysis failed');
    } finally {
      setLoading(false);
    }
  };

  if (!currentProjectId) {
    return (
      <div className="tab-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center' }}>
        <div style={{ maxWidth: 400 }}>
          <BarChart3 size={48} color="var(--accent-primary)" style={{ marginBottom: 20 }} />
          <h2 style={{ marginBottom: 12 }}>Competitive Intelligence</h2>
          <p style={{ color: 'var(--text-tertiary)', marginBottom: 24 }}>
            Analyze the competition and identify your Blue Ocean. Map out the content gaps in your niche.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="tab-content">
      <div className="tab-header">
        <div>
          <h2 className="tab-title text-gradient">Market Intelligence</h2>
          <p className="tab-subtitle">Competitor mapping & content gap identification</p>
        </div>
        <button 
          className="btn-primary" 
          onClick={handleGenerateMarket} 
          disabled={loading}
        >
          {loading ? <RefreshCw className="animate-spin" size={16} /> : <Search size={16} />}
          <span>{m ? 'Refresh Analysis' : 'Scan Market'}</span>
        </button>
      </div>

      {!m ? (
        <div style={{ 
          display: 'flex', flexDirection: 'column', alignItems: 'center', 
          justifyContent: 'center', minHeight: '50vh', background: 'var(--bg-secondary)', 
          borderRadius: 16, border: '1px dashed var(--border-subtle)', margin: '0 20px'
        }}>
          <Map size={40} color="var(--text-tertiary)" style={{ marginBottom: 16, opacity: 0.5 }} />
          <p style={{ color: 'var(--text-tertiary)' }}>No market map generated for this mission.</p>
          <button className="btn-ghost" onClick={handleGenerateMarket} style={{ marginTop: 12 }}>
            Initiate Competitive Scan
          </button>
        </div>
      ) : (
        <div className="card-grid stagger-children">
          
          {/* Blue Ocean Strategy - Main Highlight */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card card-full" 
            style={{ 
              background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%)',
              border: '1px solid var(--accent-secondary)30',
              padding: '32px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ padding: 10, background: 'var(--accent-secondary)20', borderRadius: 12, color: 'var(--accent-secondary)' }}>
                <Sparkles size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Blue Ocean Strategy</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Your unique market differentiator</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 32 }}>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--accent-secondary)', marginBottom: 8 }}>{m.blueOceanAngle.title}</h4>
                <p style={{ fontSize: '1rem', lineHeight: 1.6, color: 'var(--text-primary)' }}>{m.blueOceanAngle.concept}</p>
              </div>
              <div style={{ background: 'var(--bg-primary)', padding: '20px', borderRadius: 12, border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, color: 'var(--accent-success)' }}>
                  <Fingerprint size={16} />
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>The Differentiator</span>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{m.blueOceanAngle.differentiation}</p>
              </div>
            </div>
          </motion.div>

          {/* Competitor Archetypes */}
          <div className="card" style={{ gridColumn: 'span 2' }}>
            <div className="card-header">
              <div className="card-title-group">
                <div className="card-icon"><Users size={16} /></div>
                <h3 className="card-title">Competitor Archetypes</h3>
              </div>
            </div>
            <div className="card-body">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
                {m.archetypes.map((a, i) => (
                  <div key={i} style={{ padding: 16, background: 'var(--bg-tertiary)', borderRadius: 10, border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontWeight: 700, marginBottom: 4, color: 'var(--text-primary)' }}>{a.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 12 }}>{a.approach}</div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, fontSize: '0.75rem', color: '#ef4444' }}>
                      <AlertTriangle size={12} style={{ marginTop: 2 }} />
                      <span>Gap: {a.weakness}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Content Gaps */}
          <div className="card">
            <div className="card-header">
              <div className="card-title-group">
                <div className="card-icon" style={{ color: 'var(--accent-primary)' }}><Zap size={16} /></div>
                <h3 className="card-title">Underserved Gaps</h3>
              </div>
            </div>
            <div className="card-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {m.gaps.map((gap, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div style={{ width: 20, h: 20, borderRadius: '50%', background: 'var(--accent-primary)20', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, flexShrink: 0, marginTop: 2 }}>{i+1}</div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{gap}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
