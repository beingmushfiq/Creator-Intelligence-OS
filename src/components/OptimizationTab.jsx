import React from 'react';
import { Settings, AlertTriangle, Clock, Scale, TrendingUp, Image } from 'lucide-react';
import { useCreator } from '../context/CreatorContext';
import { RegenerateButton } from './ui/RegenerateButton';
import { ExportButton } from './ui/ExportButton';

export default function OptimizationTab() {
  const { data, loading, regenerateSection } = useCreator();
  const opt = data?.optimization;

  if (!opt) return <EmptyState />;

  return (
    <div className="tab-content">
      <div className="tab-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 className="tab-title text-gradient">Self-Critique & Optimization</h2>
          <p className="tab-subtitle">Automated quality analysis — tension, pacing, legal, CTR, and thumbnail refinements</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <ExportButton section="optimization" data={opt} />
          <RegenerateButton onClick={() => regenerateSection('optimization')} loading={loading} />
        </div>
      </div>

      {/* Weak Tension Zones */}
      <h3 style={{ marginBottom: 'var(--space-md)', color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
        ⚡ Weak Tension Zones
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', marginBottom: 'var(--space-2xl)' }}>
        {opt.weakTensionZones.map((zone, i) => (
          <div key={i} className="alert-card warning">
            <div className="alert-title">Section: {zone.section}</div>
            <div className="alert-text">{zone.issue}</div>
            <div className="alert-text" style={{ marginTop: 6, color: 'var(--accent-success)' }}>
              💡 <strong>Fix:</strong> {zone.suggestion}
            </div>
          </div>
        ))}
      </div>

      {/* Pacing Risks */}
      <div className="section-divider" />
      <h3 style={{ marginBottom: 'var(--space-md)', color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
        🎯 Pacing Risks
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', marginBottom: 'var(--space-2xl)' }}>
        {opt.pacingRisks.map((risk, i) => (
          <div key={i} className={`alert-card ${risk.risk === 'Medium' ? 'warning' : 'success'}`}>
            <div className="alert-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Clock size={14} /> {risk.section}
              <span className={`badge ${risk.risk === 'Medium' ? 'badge-yellow' : 'badge-green'}`}>{risk.risk} Risk</span>
            </div>
            <div className="alert-text">{risk.detail}</div>
          </div>
        ))}
      </div>

      {/* Legal Flags */}
      <div className="section-divider" />
      <h3 style={{ marginBottom: 'var(--space-md)', color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
        ⚖️ Legal Vulnerability Flags
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', marginBottom: 'var(--space-2xl)' }}>
        {opt.legalFlags.map((flag, i) => (
          <div key={i} className={`alert-card ${flag.severity === 'Medium' ? 'warning' : 'info'}`}>
            <div className="alert-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Scale size={14} /> {flag.concern}
              <span className={`badge ${flag.severity === 'Medium' ? 'badge-yellow' : 'badge-blue'}`}>{flag.severity}</span>
            </div>
            <div className="alert-text">{flag.detail}</div>
          </div>
        ))}
      </div>

      {/* CTR Improvements */}
      <div className="section-divider" />
      <h3 style={{ marginBottom: 'var(--space-md)', color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
        📈 CTR Improvement Suggestions
      </h3>
      <div className="card" style={{ marginBottom: 'var(--space-2xl)' }}>
        <div className="card-header">
          <div className="card-title-group">
            <div className="card-icon" style={{ background: 'rgba(34, 197, 94, 0.12)', color: 'var(--accent-success)' }}>
              <TrendingUp size={16} />
            </div>
            <h3 className="card-title">Click-Through Optimization</h3>
          </div>
        </div>
        <div className="card-body">
          <ul>
            {opt.ctrImprovements.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </div>
      </div>

      {/* Thumbnail Refinements */}
      <div className="section-divider" />
      <h3 style={{ marginBottom: 'var(--space-md)', color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
        🎨 Thumbnail Refinement Suggestions
      </h3>
      <div className="card">
        <div className="card-header">
          <div className="card-title-group">
            <div className="card-icon" style={{ background: 'rgba(0, 212, 255, 0.12)', color: 'var(--accent-secondary)' }}>
              <Image size={16} />
            </div>
            <h3 className="card-title">Visual Optimization</h3>
          </div>
        </div>
        <div className="card-body">
          <ul>
            {opt.thumbnailRefinements.map((item, i) => <li key={i}>{item}</li>)}
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
        <div className="empty-state-icon"><Settings size={32} /></div>
        <h3>No Optimization Data</h3>
        <p>Generate a topic to receive automated self-critique — identifying weak zones, pacing risks, legal flags, and improvement suggestions.</p>
      </div>
    </div>
  );
}
