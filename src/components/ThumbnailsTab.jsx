import React from 'react';
import { Image, Palette, Layout, Type, Wand2, CheckCircle, Info } from 'lucide-react';
import { useCreator } from '../context/CreatorContext';
import { RegenerateButton } from './ui/RegenerateButton';
import { ExportButton } from './ui/ExportButton';
import { CopyBlock } from './ui/CopyBlock';

export default function ThumbnailsTab() {
  const { data, loading, regenerateSection } = useCreator();
  const tb = data?.thumbnails;

  if (!tb) return <EmptyState />;

  return (
    <div className="tab-content">
      <div className="tab-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 className="tab-title text-gradient">Thumbnail Psychology Engine</h2>
          <p className="tab-subtitle">Visual concept framework, archetype analysis, and AI-ready prompts</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <ExportButton section="thumbnails" data={tb} />
          <RegenerateButton onClick={() => regenerateSection('thumbnails')} loading={loading} />
        </div>
      </div>

      {/* Visual Concept Framework */}
      <h3 style={{ marginBottom: 'var(--space-md)', color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
        Visual Concept Framework
      </h3>
      <div className="card-grid stagger-children" style={{ marginBottom: 'var(--space-2xl)' }}>
        {[
          { icon: Palette, title: 'Primary Emotion', value: tb.visualConcept.primaryEmotion, color: 'var(--accent-danger)' },
          { icon: Palette, title: 'Color Psychology', value: tb.visualConcept.colorPsychology, color: 'var(--accent-warning)' },
          { icon: Layout, title: 'Composition', value: tb.visualConcept.compositionStructure, color: 'var(--accent-primary)' },
          { icon: Layout, title: 'Depth Layering', value: tb.visualConcept.depthLayering, color: 'var(--accent-info)' },
          { icon: Layout, title: 'Eye Direction Flow', value: tb.visualConcept.eyeDirectionFlow, color: 'var(--accent-secondary)' },
          { icon: Layout, title: 'Focal Tension Point', value: tb.visualConcept.focalTensionPoint, color: 'var(--accent-success)' },
        ].map((item, i) => (
          <div key={i} className="card">
            <div className="card-header">
              <div className="card-title-group">
                <div className="card-icon" style={{ background: `${item.color}18`, color: item.color }}>
                  <item.icon size={16} />
                </div>
                <h3 className="card-title">{item.title}</h3>
              </div>
            </div>
            <div className="card-body"><p>{item.value}</p></div>
          </div>
        ))}
      </div>

      {/* Archetype Selection */}
      <div className="section-divider" />
      <h3 style={{ marginBottom: 'var(--space-md)', color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
        Thumbnail Archetype Selection
      </h3>
      <div className="card card-full" style={{ marginBottom: 'var(--space-lg)' }}>
        <div className="card-header">
          <div className="card-title-group">
            <div className="card-icon" style={{ background: 'rgba(34, 197, 94, 0.12)', color: 'var(--accent-success)' }}>
              <CheckCircle size={16} />
            </div>
            <h3 className="card-title">Selected: {tb.archetype.selected}</h3>
          </div>
          <span className="badge badge-green">Best Fit</span>
        </div>
        <div className="card-body">
          <p style={{ color: 'var(--text-primary)', marginBottom: 16 }}>{tb.archetype.reasoning}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 12 }}>
            {tb.archetype.alternatives.map((alt, i) => (
              <div key={i} style={{ padding: 12, background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: 4 }}>{alt.name}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: 4 }}>{alt.fit}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', fontStyle: 'italic' }}>{alt.note}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Text Overlay Strategy */}
      <div className="section-divider" />
      <h3 style={{ marginBottom: 'var(--space-md)', color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
        Text Overlay Strategy
      </h3>
      <div className="card-grid stagger-children" style={{ marginBottom: 'var(--space-2xl)' }}>
        <div className="card">
          <div className="card-header">
            <div className="card-title-group">
              <div className="card-icon"><Type size={16} /></div>
              <h3 className="card-title">Overlay Text</h3>
            </div>
          </div>
          <div className="card-body">
            <div style={{
              fontSize: '1.5rem',
              fontWeight: 900,
              fontFamily: 'var(--font-display)',
              letterSpacing: '-0.02em',
              padding: '16px',
              background: 'var(--bg-primary)',
              borderRadius: 'var(--radius-md)',
              textAlign: 'center',
              marginBottom: 12,
            }}>
              {tb.textOverlay.text}
            </div>
            <p><strong>Max Words:</strong> {tb.textOverlay.maxWords}</p>
            <p><strong>Placement:</strong> {tb.textOverlay.placement}</p>
            <p><strong>Font:</strong> {tb.textOverlay.fontPersonality}</p>
            <p><strong>Caps:</strong> {tb.textOverlay.capitalization}</p>
            <p><strong>Contrast:</strong> {tb.textOverlay.contrast}</p>
          </div>
        </div>
      </div>

      {/* AI Prompts */}
      <div className="section-divider" />
      <h3 style={{ marginBottom: 'var(--space-md)', color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
        AI Thumbnail Prompts
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        <CopyBlock content={tb.aiPrompt.midjourney} label="MIDJOURNEY PROMPT" />
        <CopyBlock content={tb.aiPrompt.sdxl} label="SDXL PROMPT" />

        <div className="card-grid" style={{ marginTop: 8 }}>
          {[
            { label: 'Lighting', value: tb.aiPrompt.lighting },
            { label: 'Lens', value: tb.aiPrompt.lens },
            { label: 'Mood', value: tb.aiPrompt.mood },
            { label: 'Color Scheme', value: tb.aiPrompt.colorScheme },
            { label: 'Angle', value: tb.aiPrompt.compositionAngle },
          ].map((m, i) => (
            <div key={i} className="meta-item" style={{ padding: 12, background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <span className="meta-label">{m.label}</span>
              <span className="meta-value">{m.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="tab-content">
      <div className="empty-state">
        <div className="empty-state-icon"><Image size={32} /></div>
        <h3>No Thumbnail Analysis</h3>
        <p>Generate a topic to get visual concept frameworks, archetype analysis, and AI-ready thumbnail prompts.</p>
      </div>
    </div>
  );
}
