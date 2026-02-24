import React from 'react';
import { Search, Users, Brain, Radio } from 'lucide-react';
import { useCreator } from '../context/CreatorContext';
import { RegenerateButton } from './ui/RegenerateButton';
import { ExportButton } from './ui/ExportButton';
import { motion } from 'framer-motion';

export default function ResearchTab() {
  const { data, loading, regenerateSection } = useCreator();
  const r = data?.research;

  if (!r) return <EmptyState />;

  return (
    <div className="tab-content">
      <div className="tab-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20 }}>
        <div>
          <h2 className="tab-title text-gradient">Deep Analysis Mode</h2>
          <p className="tab-subtitle">Myth matrix, incentive mapping, cognitive bias analysis & algorithmic amplification</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <ExportButton section="research" data={r} />
          <RegenerateButton onClick={() => regenerateSection('research')} loading={loading} />
        </div>
      </div>

      {/* Myth Matrix */}
      <h3 style={{ marginBottom: 20, color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: 800 }}>
        The Myth vs. Reality Matrix
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 40 }}>
        {r.mythMatrix.map((m, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ scale: 1.01, borderColor: 'var(--accent-primary)40' }}
            className="card" 
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr)) auto', gap: 24, padding: 24, alignItems: 'center' }}
          >
            <div>
              <div className="meta-label" style={{ marginBottom: 8, color: 'var(--accent-danger)', fontWeight: 800, fontSize: '0.65rem', textTransform: 'uppercase' }}>Public Myth</div>
              <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{m.myth}</div>
            </div>
            <div className="myth-divider" style={{ paddingLeft: 24, borderLeft: '1px solid var(--border-subtle)' }}>
              <div className="meta-label" style={{ marginBottom: 8, color: 'var(--accent-success)', fontWeight: 800, fontSize: '0.65rem', textTransform: 'uppercase' }}>Structural Reality</div>
              <div style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: 600, lineHeight: 1.5 }}>{m.reality}</div>
            </div>
            <div style={{ textAlign: 'center', paddingLeft: 24 }}>
              <div className="meta-label" style={{ marginBottom: 8, fontSize: '0.65rem' }}>Match</div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 48,
                height: 48,
                borderRadius: 12,
                background: m.confidence > 85 ? 'var(--accent-success)15' : 'var(--accent-warning)15',
                color: m.confidence > 85 ? 'var(--accent-success)' : 'var(--accent-warning)',
                fontWeight: 800,
                fontSize: '0.85rem',
                border: `1px solid ${m.confidence > 85 ? 'var(--accent-success)30' : 'var(--accent-warning)30'}`
              }}>
                {m.confidence}%
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Incentive Map */}
      <h3 style={{ marginBottom: 20, color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: 800 }}>
        Stakeholder Incentive Mapping
      </h3>
      <div className="card-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, marginBottom: 40 }}>
        {r.incentiveMap.map((item, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -4, borderColor: 'var(--accent-warning)' }}
            className="card" 
            style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ padding: 8, background: 'var(--accent-warning)10', borderRadius: 10, color: 'var(--accent-warning)' }}>
                  <Users size={18} />
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>{item.actor}</h3>
              </div>
              <span className={`badge ${item.impact === 'High' ? 'badge-red' : 'badge-yellow'}`} style={{ fontSize: '0.65rem' }}>{item.impact} Impact</span>
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: 4, fontWeight: 700 }}>Primary Incentive</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 600 }}>{item.incentive}</div>
            </div>
            <div style={{ padding: 12, background: 'var(--bg-tertiary)', borderRadius: 10, border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: 4, fontWeight: 700 }}>Predicted Behavior</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{item.behavior}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Cognitive Biases */}
      <h3 style={{ marginBottom: 20, color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: 800 }}>
        Cognitive Bias Analysis
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 40 }}>
        {r.cognitiveBiases.map((b, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ scale: 1.01 }}
            className="card" 
            style={{ padding: 24, borderLeft: `4px solid ${b.severity === 'High' ? 'var(--accent-danger)' : 'var(--accent-warning)'}` }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Brain size={18} color={b.severity === 'High' ? 'var(--accent-danger)' : 'var(--accent-warning)'} />
                  <h4 style={{ fontWeight: 800, fontSize: '1rem' }}>{b.bias}</h4>
               </div>
               <span className={`badge ${b.severity === 'High' ? 'badge-red' : 'badge-yellow'}`} style={{ fontSize: '0.65rem' }}>Severity: {b.severity}</span>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>{b.description}</p>
            <div style={{ fontSize: '0.85rem', padding: '8px 12px', background: 'var(--bg-tertiary)', borderRadius: 8, display: 'inline-block', border: '1px solid var(--border-subtle)' }}>
               <span style={{ color: 'var(--text-tertiary)', fontWeight: 600 }}>Exploited by:</span> {b.exploitedBy}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Algorithmic Amplification */}
      <h3 style={{ marginBottom: 20, color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: 800 }}>
        Algorithmic Amplification
      </h3>
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4 }}
        className="card" 
        style={{ padding: 24, background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%)', border: '1px solid var(--accent-secondary)30' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
          <div style={{ padding: 8, background: 'var(--accent-secondary)20', borderRadius: 10, color: 'var(--accent-secondary)' }}>
            <Radio size={18} />
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Platform Velocity Patterns</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          {r.algorithmicAmplification.map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, padding: 16, background: 'var(--bg-primary)', borderRadius: 12, border: '1px solid var(--border-subtle)' }}>
               <div style={{ width: 4, height: '100%', background: 'var(--accent-secondary)', borderRadius: 2 }} />
               <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{item}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="tab-content">
      <div className="empty-state">
        <div className="empty-state-icon"><Search size={32} /></div>
        <h3>Deep Analysis Mode</h3>
        <p>Generate a topic to activate deep research analysis — myth matrices, incentive maps, cognitive bias breakdowns, and algorithmic amplification patterns.</p>
      </div>
    </div>
  );
}
