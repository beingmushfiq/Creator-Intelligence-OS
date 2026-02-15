import React, { useState } from 'react';
import { ChevronDown, Film, Camera, Sun, Music, Wand2, FileText, Play } from 'lucide-react';
import { useCreator } from '../context/CreatorContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { generateSpeech } from '../engine/aiService';
import { dbService } from '../services/dbService';
import { RegenerateButton } from './ui/RegenerateButton';
import { ExportButton } from './ui/ExportButton';
import { CopyBlock } from './ui/CopyBlock';

export default function ScriptTab() {
  const { data, loading, regenerateSection, setCurrentAudio } = useCreator();
  const { user } = useAuth();
  const script = data?.script;
  const { addToast } = useToast();
  
  const [loadingAudio, setLoadingAudio] = useState(false);

  const handleGenerateAudio = async () => {
    if (!script || !script.sections) return;
    
    // Combine all section content for reading
    const fullText = script.sections.map(s => s.content).join('\n\n');
    
    if (!fullText) {
      addToast('error', 'No script content to read.');
      return;
    }

    try {
      setLoadingAudio(true);
      addToast('info', 'Generating audio with ElevenLabs...');
      const audioUrl = await generateSpeech(fullText);
      setCurrentAudio(audioUrl);
      addToast('success', 'Audio generation complete!');

      // Save to Supabase
      if (user) {
        try {
          await dbService.saveAsset(user.id, null, 'audio', audioUrl, 'Script read-through');
        } catch (e) {
          console.warn('Asset save skipped:', e.message);
        }
      }
    } catch (err) {
      console.error(err);
      addToast('error', 'Failed to generate audio. Check API Key.');
    } finally {
      setLoadingAudio(false);
    }
  };

  if (!script) return <EmptyState />;

  return (
    <div className="tab-content">
      <div className="tab-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 className="tab-title text-gradient">Master Script</h2>
          <p className="tab-subtitle">
            {script.estimatedDuration} · Tone: {script.tone}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={handleGenerateAudio}
            disabled={loadingAudio}
            className="flex items-center gap-2 px-3 py-2 bg-accent-primary/10 hover:bg-accent-primary/20 text-accent-primary rounded-lg transition-colors border border-accent-primary/20 text-sm font-bold"
          >
            {loadingAudio ? (
              <span className="animate-pulse">Generating...</span>
            ) : (
              <>
                <Play size={14} fill="currentColor" />
                Listen
              </>
            )}
          </button>
          <ExportButton section="script" data={script} />
          <RegenerateButton onClick={() => regenerateSection('script')} loading={loading} />
        </div>
      </div>

      <div className="stagger-children" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        {script.sections.map((section, index) => (
          <ScriptSection key={section.id} section={section} index={index} />
        ))}
      </div>
    </div>
  );
}

function ScriptSection({ section, index }) {
  const [open, setOpen] = useState(index === 0);

  return (
    <div className="accordion-item">
      <div className="accordion-header" onClick={() => setOpen(!open)}>
        <div className="accordion-header-left">
          <div className="accordion-number">{index + 1}</div>
          <div>
            <div className="accordion-title">{section.title}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{section.subtitle}</div>
          </div>
        </div>
        <ChevronDown size={18} className={`accordion-chevron ${open ? 'open' : ''}`} />
      </div>

      <div className={`accordion-content ${open ? 'open' : ''}`}>
        {/* Script text */}
        <div className="script-text">
          {section.content.split('\n').map((para, i) => (
            para.trim() ? <p key={i} style={{ marginBottom: 12, color: 'var(--text-primary)' }}>{para}</p> : null
          ))}
        </div>

        {/* Scene metadata grid */}
        <div className="scene-meta">
          <div className="meta-item">
            <span className="meta-label"><Camera size={10} style={{ display: 'inline', marginRight: 4 }} />Camera</span>
            <span className="meta-value">{section.cameraMovement}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label"><Sun size={10} style={{ display: 'inline', marginRight: 4 }} />Lighting</span>
            <span className="meta-value">{section.lighting}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label"><Music size={10} style={{ display: 'inline', marginRight: 4 }} />Music Cue</span>
            <span className="meta-value">{section.musicCue}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label"><Film size={10} style={{ display: 'inline', marginRight: 4 }} />Scene</span>
            <span className="meta-value">{section.sceneDescription}</span>
          </div>
        </div>

        {/* AI Video Prompt */}
        <div style={{ marginTop: 'var(--space-md)' }}>
          <CopyBlock content={section.aiVideoPrompt} label="AI VIDEO PROMPT" />
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="tab-content">
      <div className="empty-state">
        <div className="empty-state-icon"><FileText size={32} /></div>
        <h3>No Script Generated</h3>
        <p>Generate a topic to create a full 10+ minute structured script with scene directions and AI prompts.</p>
      </div>
    </div>
  );
}
