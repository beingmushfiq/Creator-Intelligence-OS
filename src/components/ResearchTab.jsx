import React from 'react';
import { Search, AlertTriangle, Users, Brain, Radio, BarChart3 } from 'lucide-react';
import { useCreator } from '../context/CreatorContext';
import { RegenerateButton } from './ui/RegenerateButton';
import { ExportButton } from './ui/ExportButton';

export default function ResearchTab() {
  const { data, loading, regenerateSection } = useCreator();
  const r = data?.research;

  if (!r) return <EmptyState />;

  return (
    <div className="tab-content">
      <div className="tab-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
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
      <h3 style={{ marginBottom: 'var(--space-md)', color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
        Myth Matrix
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', marginBottom: 'var(--space-2xl)' }}>
        {r.mythMatrix.map((m, i) => (
          <div key={i} className="card" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 'var(--space-lg)', alignItems: 'center' }}>
            <div>
              <div className="meta-label" style={{ marginBottom: 4 }}>Public Myth</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--accent-danger)' }}>{m.myth}</div>
            </div>
            <div>
              <div className="meta-label" style={{ marginBottom: 4 }}>Structural Reality</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--accent-success)' }}>{m.reality}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div className="meta-label" style={{ marginBottom: 4 }}>Confidence</div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 44,
                height: 44,
                borderRadius: 'var(--radius-full)',
                background: m.confidence > 85 ? 'rgba(34, 197, 94, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                color: m.confidence > 85 ? 'var(--accent-success)' : 'var(--accent-warning)',
                fontWeight: 700,
                fontSize: '0.8rem',
              }}>
                {m.confidence}%
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Incentive Map */}
      <div className="section-divider" />
      <h3 style={{ marginBottom: 'var(--space-md)', color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
        Incentive Map
      </h3>
      <div className="card-grid stagger-children" style={{ marginBottom: 'var(--space-2xl)' }}>
        {r.incentiveMap.map((item, i) => (
          <div key={i} className="card">
            <div className="card-header">
              <div className="card-title-group">
                <div className="card-icon" style={{ background: 'rgba(245, 158, 11, 0.12)', color: 'var(--accent-warning)' }}>
                  <Users size={16} />
                </div>
                <h3 className="card-title">{item.actor}</h3>
              </div>
              <span className={`badge ${item.impact === 'High' ? 'badge-red' : 'badge-yellow'}`}>{item.impact} Impact</span>
            </div>
            <div className="card-body">
              <p><strong style={{ color: 'var(--text-primary)' }}>Incentive:</strong> {item.incentive}</p>
              <p style={{ marginTop: 6 }}><strong style={{ color: 'var(--text-primary)' }}>Behavior:</strong> {item.behavior}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Cognitive Biases */}
      <div className="section-divider" />
      <h3 style={{ marginBottom: 'var(--space-md)', color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
        Cognitive Bias Breakdown
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', marginBottom: 'var(--space-2xl)' }}>
        {r.cognitiveBiases.map((b, i) => (
          <div key={i} className={`alert-card ${b.severity === 'High' ? 'danger' : 'warning'}`}>
            <div className="alert-title">🧠 {b.bias}</div>
            <div className="alert-text">{b.description}</div>
            <div className="alert-text" style={{ marginTop: 4 }}>
              <strong>Exploited by:</strong> {b.exploitedBy} · <span className={`badge ${b.severity === 'High' ? 'badge-red' : 'badge-yellow'}`} style={{ marginLeft: 4 }}>{b.severity}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Algorithmic Amplification */}
      <div className="section-divider" />
      <h3 style={{ marginBottom: 'var(--space-md)', color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
        Algorithmic Amplification Analysis
      </h3>
      <div className="card">
        <div className="card-header">
          <div className="card-title-group">
            <div className="card-icon" style={{ background: 'rgba(0, 212, 255, 0.12)', color: 'var(--accent-secondary)' }}>
              <Radio size={16} />
            </div>
            <h3 className="card-title">Platform Amplification Patterns</h3>
          </div>
        </div>
        <div className="card-body">
          <ul>
            {r.algorithmicAmplification.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </div>
      </div>
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
