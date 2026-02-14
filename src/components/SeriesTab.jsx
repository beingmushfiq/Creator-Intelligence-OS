import React from 'react';
import { GitBranch, Calendar, TrendingUp, Crown, Layers } from 'lucide-react';
import { useCreator } from '../context/CreatorContext';
import { RegenerateButton } from './ui/RegenerateButton';
import { ExportButton } from './ui/ExportButton';

export default function SeriesTab() {
  const { data, loading, regenerateSection } = useCreator();
  const s = data?.series;

  if (!s) return <EmptyState />;

  return (
    <div className="tab-content">
      <div className="tab-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 className="tab-title text-gradient">Series & Brand Builder</h2>
          <p className="tab-subtitle">Content arcs, escalation roadmap, and authority positioning strategy</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <ExportButton section="series" data={s} />
          <RegenerateButton onClick={() => regenerateSection('series')} loading={loading} />
        </div>
      </div>

      {/* Sequel Topics */}
      <h3 style={{ marginBottom: 'var(--space-md)', color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
        Sequel Topics
      </h3>
      <div className="timeline stagger-children" style={{ marginBottom: 'var(--space-2xl)' }}>
        {s.sequels.map((seq, i) => (
          <div key={i} className="timeline-item">
            <div className="timeline-title">{seq.title}</div>
            <div className="timeline-desc">{seq.description}</div>
            <div style={{ marginTop: 6 }}>
              <span className="badge badge-blue"><Calendar size={10} /> {seq.timing}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Content Arcs */}
      <div className="section-divider" />
      <h3 style={{ marginBottom: 'var(--space-md)', color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
        Content Arcs
      </h3>
      <div className="card" style={{ marginBottom: 'var(--space-2xl)' }}>
        <div className="card-header">
          <div className="card-title-group">
            <div className="card-icon" style={{ background: 'rgba(0, 212, 255, 0.12)', color: 'var(--accent-secondary)' }}>
              <Layers size={16} />
            </div>
            <h3 className="card-title">Narrative Arc Structures</h3>
          </div>
        </div>
        <div className="card-body">
          <ul>
            {s.contentArcs.map((arc, i) => <li key={i}>{arc}</li>)}
          </ul>
        </div>
      </div>

      {/* Escalation Roadmap */}
      <div className="section-divider" />
      <h3 style={{ marginBottom: 'var(--space-md)', color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
        Escalation Roadmap
      </h3>
      <div className="card-grid stagger-children" style={{ marginBottom: 'var(--space-2xl)' }}>
        {s.escalationRoadmap.map((phase, i) => (
          <div key={i} className="card">
            <div className="card-header">
              <div className="card-title-group">
                <div className="card-icon" style={{
                  background: i === 0 ? 'rgba(124, 92, 252, 0.12)' : i === 1 ? 'rgba(0, 212, 255, 0.12)' : i === 2 ? 'rgba(34, 197, 94, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                  color: i === 0 ? 'var(--accent-primary)' : i === 1 ? 'var(--accent-secondary)' : i === 2 ? 'var(--accent-success)' : 'var(--accent-warning)',
                }}>
                  <TrendingUp size={16} />
                </div>
                <h3 className="card-title">{phase.phase}</h3>
              </div>
              <span className="badge">Ep. {phase.episodes}</span>
            </div>
            <div className="card-body">
              <p>{phase.goal}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Authority Positioning */}
      <div className="section-divider" />
      <h3 style={{ marginBottom: 'var(--space-md)', color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
        Authority Positioning
      </h3>
      <div className="card" style={{ marginBottom: 'var(--space-2xl)' }}>
        <div className="card-header">
          <div className="card-title-group">
            <div className="card-icon" style={{ background: 'rgba(245, 158, 11, 0.12)', color: 'var(--accent-warning)' }}>
              <Crown size={16} />
            </div>
            <h3 className="card-title">Brand Strategy</h3>
          </div>
        </div>
        <div className="card-body">
          <p style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>{s.authorityPositioning}</p>
        </div>
      </div>

      {/* Content Funnel */}
      <div className="section-divider" />
      <h3 style={{ marginBottom: 'var(--space-md)', color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
        Content Funnel Design
      </h3>
      <div className="card">
        <div className="card-body">
          <ul>
            {s.contentFunnel.map((item, i) => <li key={i}>{item}</li>)}
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
        <div className="empty-state-icon"><GitBranch size={32} /></div>
        <h3>No Series Plan</h3>
        <p>Generate a topic to build a content series roadmap with sequels, arcs, escalation, and authority positioning.</p>
      </div>
    </div>
  );
}
