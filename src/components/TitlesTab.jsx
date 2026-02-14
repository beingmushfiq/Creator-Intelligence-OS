import React from 'react';
import { Type, BarChart2, AlertTriangle, Star, Copy, Shield, Flame, Eye, Lock, Database, Lightbulb, MessageSquare, Zap } from 'lucide-react';
import { useCreator } from '../context/CreatorContext';
import { RegenerateButton } from './ui/RegenerateButton';
import { ExportButton } from './ui/ExportButton';

const TRIGGER_ICONS = {
  'Curiosity Gap': Eye,
  'Authority Challenge': Shield,
  'Fear of Loss': Lock,
  'Insider Revelation': Lightbulb,
  'Data-Driven': Database,
  'Contrarian': Flame,
  'Narrative Hook': MessageSquare,
  'Short-Form Viral': Zap,
};

const TRIGGER_COLORS = {
  'Curiosity Gap': { bg: 'rgba(124, 92, 252, 0.12)', color: 'var(--accent-primary)' },
  'Authority Challenge': { bg: 'rgba(239, 68, 68, 0.12)', color: 'var(--accent-danger)' },
  'Fear of Loss': { bg: 'rgba(245, 158, 11, 0.12)', color: 'var(--accent-warning)' },
  'Insider Revelation': { bg: 'rgba(34, 197, 94, 0.12)', color: 'var(--accent-success)' },
  'Data-Driven': { bg: 'rgba(59, 130, 246, 0.12)', color: 'var(--accent-info)' },
  'Contrarian': { bg: 'rgba(239, 68, 68, 0.12)', color: 'var(--accent-danger)' },
  'Narrative Hook': { bg: 'rgba(0, 212, 255, 0.12)', color: 'var(--accent-secondary)' },
  'Short-Form Viral': { bg: 'rgba(245, 158, 11, 0.12)', color: 'var(--accent-warning)' },
};

export default function TitlesTab() {
  const { data, loading, regenerateSection } = useCreator();
  const titles = data?.titles;

  if (!titles) return <EmptyState />;

  return (
    <div className="tab-content">
      <div className="tab-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 className="tab-title text-gradient">Title Psychology Engine</h2>
          <p className="tab-subtitle">Psychologically-optimized titles with CTR predictions and A/B testing sets</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <ExportButton section="titles" data={titles} />
          <RegenerateButton onClick={() => regenerateSection('titles')} loading={loading} />
        </div>
      </div>

      {/* Title Variants */}
      <h3 style={{ marginBottom: 'var(--space-md)', color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
        Title Variants by Psychological Trigger
      </h3>
      <div className="card-grid stagger-children" style={{ marginBottom: 'var(--space-2xl)' }}>
        {titles.variants.map((v, i) => {
          const Icon = TRIGGER_ICONS[v.trigger] || Star;
          const colors = TRIGGER_COLORS[v.trigger] || { bg: 'rgba(124, 92, 252, 0.12)', color: 'var(--accent-primary)' };
          return (
            <div key={i} className="title-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <div className="card-icon" style={{ background: colors.bg, color: colors.color, width: 28, height: 28 }}>
                  <Icon size={14} />
                </div>
                <span className="badge" style={{ background: colors.bg, color: colors.color, borderColor: colors.color.replace(')', ', 0.3)').replace('var(', 'rgba(').replace('--', '') }}>{v.trigger}</span>
              </div>
              <div className="title-card-text">{v.title}</div>
              <div className="title-card-meta">
                <span className="badge badge-green">{v.ctr}</span>
                <span className="badge badge-blue">{v.audience}</span>
              </div>
              <div className="title-card-reasoning">
                <strong style={{ color: 'var(--text-secondary)' }}>Why it works:</strong> {v.emotionalTrigger}
              </div>
            </div>
          );
        })}
      </div>

      {/* A/B Testing Sets */}
      <div className="section-divider" />
      <h3 style={{ marginBottom: 'var(--space-md)', color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
        A/B Testing Sets
      </h3>
      <div className="card-grid-2 stagger-children" style={{ marginBottom: 'var(--space-2xl)' }}>
        <div className="card">
          <div className="card-header">
            <div className="card-title-group">
              <div className="card-icon"><Star size={16} /></div>
              <h3 className="card-title">Primary Candidates</h3>
            </div>
            <span className="badge badge-green">Recommended</span>
          </div>
          <div className="card-body">
            <ul>
              {titles.abSets.primary.map((t, i) => <li key={i}>{t}</li>)}
            </ul>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title-group">
              <div className="card-icon" style={{ background: 'rgba(239, 68, 68, 0.12)', color: 'var(--accent-danger)' }}><Flame size={16} /></div>
              <h3 className="card-title">High-Risk / High-Reward</h3>
            </div>
            <span className="badge badge-red">Volatile</span>
          </div>
          <div className="card-body">
            <ul>
              {titles.abSets.highRisk.map((t, i) => <li key={i}>{t}</li>)}
            </ul>
          </div>
        </div>

        <div className="card card-full">
          <div className="card-header">
            <div className="card-title-group">
              <div className="card-icon" style={{ background: 'rgba(59, 130, 246, 0.12)', color: 'var(--accent-info)' }}><Shield size={16} /></div>
              <h3 className="card-title">Safe Evergreen</h3>
            </div>
            <span className="badge badge-blue">Monetization-safe</span>
          </div>
          <div className="card-body">
            <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>{titles.abSets.safeEvergreen}</p>
          </div>
        </div>
      </div>

      {/* Algorithm Sensitivity */}
      <div className="section-divider" />
      <h3 style={{ marginBottom: 'var(--space-md)', color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
        Algorithm Sensitivity Check
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
        {titles.algorithmCheck.flaggedWords.map((fw, i) => (
          <div key={i} className="alert-card warning">
            <div className="alert-title">⚠️ Flagged: "{fw.word}"</div>
            <div className="alert-text">{fw.risk}</div>
            <div className="alert-text" style={{ marginTop: 4, color: 'var(--accent-success)' }}>💡 {fw.suggestion}</div>
          </div>
        ))}
        {titles.algorithmCheck.overusedPhrases.map((p, i) => (
          <div key={i} className="alert-card info">
            <div className="alert-title">📊 Overused Phrase</div>
            <div className="alert-text">{p}</div>
          </div>
        ))}
        <div className="alert-card success">
          <div className="alert-title">💰 Ad Suitability</div>
          <div className="alert-text">{titles.algorithmCheck.adSuitability}</div>
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="tab-content">
      <div className="empty-state">
        <div className="empty-state-icon"><Type size={32} /></div>
        <h3>No Titles Generated</h3>
        <p>Generate a topic to get psychologically-optimized title variants with CTR predictions and A/B testing sets.</p>
      </div>
    </div>
  );
}
