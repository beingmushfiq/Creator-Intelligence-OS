import React from 'react';
import { Video, Clock, Check } from 'lucide-react';
import { useCreator } from '../context/CreatorContext';
import { CopyBlock } from './ui/CopyBlock';
import { RegenerateButton } from './ui/RegenerateButton';
import { ExportButton } from './ui/ExportButton';

export default function MotionPromptsTab() {
  const { data, loading, regenerateSection } = useCreator();
  const prompts = data?.motionPrompts;

  if (!prompts) return <EmptyState />;

  return (
    <div className="tab-content">
      <div className="tab-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 className="tab-title text-gradient">AI Motion Prompts</h2>
          <p className="tab-subtitle">Copy-ready prompts for Runway, Veo, Pictory, CapCut, DaVinci</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <ExportButton section="motion" data={prompts} />
          <RegenerateButton onClick={() => regenerateSection('motionPrompts')} loading={loading} />
        </div>
      </div>

      <div className="card-grid stagger-children">
        {prompts.map((prompt, i) => (
          <div key={i} className="card">
            <div className="card-header">
              <div className="card-title-group">
                <div className="card-icon" style={{ background: 'rgba(0, 212, 255, 0.12)', color: 'var(--accent-secondary)' }}>
                  <Video size={16} />
                </div>
                <h3 className="card-title">{prompt.scene}</h3>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>
                <Clock size={12} /> {prompt.duration}
              </div>
            </div>

            <div className="tag-list" style={{ marginBottom: 12 }}>
              {prompt.platforms.map(p => (
                <span key={p} className="badge badge-cyan">{p}</span>
              ))}
            </div>

            <CopyBlock content={prompt.prompt} />
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="tab-content">
      <div className="empty-state">
        <div className="empty-state-icon"><Video size={32} /></div>
        <h3>No Motion Prompts Yet</h3>
        <p>Generate a topic to get AI-ready cinematic motion prompts optimized for all major video platforms.</p>
      </div>
    </div>
  );
}
