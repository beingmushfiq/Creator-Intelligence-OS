import React from 'react';
import { Target, Zap, Eye, TrendingUp, Brain, Shield, BarChart3 } from 'lucide-react';
import { useCreator } from '../context/CreatorContext';
import { RegenerateButton } from './ui/RegenerateButton';
import { ExportButton } from './ui/ExportButton';

export default function StrategyTab() {
  const { data, loading, regenerateSection } = useCreator();
  const n = data?.narrative;

  if (!n) return <EmptyState />;

  return (
    <div className="tab-content">
      <div className="tab-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 className="tab-title text-gradient">Narrative Intelligence</h2>
          <p className="tab-subtitle">Strategic breakdown of your topic — tension, incentives, and positioning</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <ExportButton section="narrative" data={n} />
          <RegenerateButton onClick={() => regenerateSection('narrative')} loading={loading} />
        </div>
      </div>

      <div className="card-grid stagger-children">
        {/* Content Type */}
        <div className="card">
          <div className="card-header">
            <div className="card-title-group">
              <div className="card-icon"><Target size={16} /></div>
              <h3 className="card-title">Content Type</h3>
            </div>
            <span className="badge">{n.contentType}</span>
          </div>
          <div className="card-body">
            <p>{n.contentTypeReasoning}</p>
          </div>
        </div>

        {/* Topic Interpretation */}
        <div className="card">
          <div className="card-header">
            <div className="card-title-group">
              <div className="card-icon"><Brain size={16} /></div>
              <h3 className="card-title">Topic Interpretation</h3>
            </div>
          </div>
          <div className="card-body">
            <p>{n.interpretation}</p>
          </div>
        </div>

        {/* Core Tension */}
        <div className="card card-full">
          <div className="card-header">
            <div className="card-title-group">
              <div className="card-icon" style={{ background: 'rgba(239, 68, 68, 0.12)', color: 'var(--accent-danger)' }}><Zap size={16} /></div>
              <h3 className="card-title">Core Tension</h3>
            </div>
          </div>
          <div className="card-body">
            <p style={{ fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: 1.8 }}>{n.coreTension}</p>
          </div>
        </div>

        {/* Hidden Incentives */}
        <div className="card">
          <div className="card-header">
            <div className="card-title-group">
              <div className="card-icon" style={{ background: 'rgba(245, 158, 11, 0.12)', color: 'var(--accent-warning)' }}><Eye size={16} /></div>
              <h3 className="card-title">Hidden Incentive Mapping</h3>
            </div>
          </div>
          <div className="card-body">
            <ul>
              {n.hiddenIncentives.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </div>
        </div>

        {/* Emotional Leverage */}
        <div className="card">
          <div className="card-header">
            <div className="card-title-group">
              <div className="card-icon" style={{ background: 'rgba(0, 212, 255, 0.12)', color: 'var(--accent-secondary)' }}><TrendingUp size={16} /></div>
              <h3 className="card-title">Emotional Leverage Points</h3>
            </div>
          </div>
          <div className="card-body">
            {n.emotionalLeverage.map((item, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <span className="badge-cyan badge" style={{ marginBottom: 4 }}>{item.emotion}</span>
                <p style={{ marginTop: 4 }}>{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Market Context */}
        <div className="card">
          <div className="card-header">
            <div className="card-title-group">
              <div className="card-icon" style={{ background: 'rgba(34, 197, 94, 0.12)', color: 'var(--accent-success)' }}><BarChart3 size={16} /></div>
              <h3 className="card-title">Market Context</h3>
            </div>
          </div>
          <div className="card-body">
            <p>{n.marketContext}</p>
          </div>
        </div>

        {/* Psychological Context */}
        <div className="card">
          <div className="card-header">
            <div className="card-title-group">
              <div className="card-icon"><Shield size={16} /></div>
              <h3 className="card-title">Psychological Context</h3>
            </div>
          </div>
          <div className="card-body">
            <p>{n.psychologicalContext}</p>
          </div>
        </div>
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
