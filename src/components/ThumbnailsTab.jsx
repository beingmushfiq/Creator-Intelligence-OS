import React, { useState } from 'react';
import { Image, Palette, Layout, Type, Wand2, CheckCircle, Loader2, Sparkles } from 'lucide-react';
import { useCreator } from '../context/CreatorContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { generateImage, enhanceImagePrompt } from '../engine/aiService';
import { VISUAL_STYLES, ASPECT_RATIOS } from '../engine/visualPrompts';
import { dbService } from '../services/dbService';
import { RegenerateButton } from './ui/RegenerateButton';
import { ExportButton } from './ui/ExportButton';
import { CopyBlock } from './ui/CopyBlock';

export default function ThumbnailsTab() {
  const { data, loading, regenerateSection } = useCreator();
  const { user } = useAuth();
  const { addToast } = useToast();
  const tb = data?.thumbnails;

  const [generatedImages, setGeneratedImages] = useState([]);
  const [loadingImage, setLoadingImage] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState('mrbeast');
  const [selectedRatio, setSelectedRatio] = useState('landscape');
  const [customPrompt, setCustomPrompt] = useState('');
  const [isEnhancing, setIsEnhancing] = useState(false);

  // Pre-fill prompt when data loads
  React.useEffect(() => {
    if (tb?.aiPrompt?.midjourney) {
      setCustomPrompt(tb.aiPrompt.midjourney);
    }
  }, [tb]);

  const handleEnhance = async () => {
    if (!customPrompt) return;
    setIsEnhancing(true);
    try {
      const enhanced = await enhanceImagePrompt(customPrompt);
      setCustomPrompt(enhanced);
      addToast('success', 'Prompt enhanced by AI!');
    } catch (e) {
      addToast('error', 'Enhancement failed');
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleGenerateImage = async () => {
    try {
      setLoadingImage(true);
      addToast('info', `Generating ${VISUAL_STYLES[selectedStyle].label} thumbnail...`);
      
      const url = await generateImage(customPrompt, selectedStyle, selectedRatio);
      
      const newImage = {
        url,
        style: selectedStyle,
        ratio: selectedRatio,
        prompt: customPrompt,
        timestamp: Date.now()
      };

      setGeneratedImages(prev => [newImage, ...prev]);
      addToast('success', 'Thumbnail generated!');

      // Save to Supabase
      if (user) {
        try {
          await dbService.saveAsset(user.id, null, 'image', url, customPrompt);
        } catch (e) {
          console.warn('Asset save skipped:', e.message);
        }
      }
    } catch (err) {
      console.error(err);
      addToast('error', 'Image generation failed. Check your OPENAI_API_KEY.');
    } finally {
      setLoadingImage(false);
    }
  };

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

      {/* Studio Mode UI */}
      <div className="section-divider" />
      <h3 style={{ marginBottom: 'var(--space-md)', color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
        🎨 Studio Mode
      </h3>
      
      <div className="card" style={{ padding: 24 }}>
        
        {/* Style Selector */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Visual Style</label>
          <div className="grid-xs" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
            {Object.values(VISUAL_STYLES).map(style => (
              <div 
                key={style.id}
                onClick={() => setSelectedStyle(style.id)}
                className={`style-card ${selectedStyle === style.id ? 'active' : ''}`}
                style={{
                  padding: 12,
                  borderRadius: 8,
                  border: selectedStyle === style.id ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                  background: selectedStyle === style.id ? 'rgba(var(--accent-primary-rgb), 0.1)' : 'var(--bg-tertiary)',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{style.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Aspect Ratio */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Aspect Ratio</label>
          <div className="thumbnail-studio" style={{ display: 'flex', gap: 12 }}>
            {Object.values(ASPECT_RATIOS).map(ratio => (
              <button
                key={ratio.id}
                onClick={() => setSelectedRatio(ratio.id)}
                className={selectedRatio === ratio.id ? 'btn-primary' : 'btn-secondary'}
                style={{ flex: 1, padding: 10, borderRadius: 8, border: '1px solid var(--border-medium)' }}
              >
                {ratio.label}
              </button>
            ))}
          </div>
        </div>

        {/* Prompt Editor */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <label style={{ fontWeight: 600 }}>Prompt</label>
            <button 
              onClick={handleEnhance} 
              disabled={isEnhancing}
              style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: 4 }}
            >
              <Wand2 size={12} className={isEnhancing ? 'spin' : ''} />
              {isEnhancing ? 'Enhancing...' : 'Magic Enhance'}
            </button>
          </div>
          <textarea
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            rows={4}
            style={{
              width: '100%',
              padding: 12,
              borderRadius: 8,
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-medium)',
              color: 'var(--text-primary)',
              fontFamily: 'inherit',
              resize: 'vertical'
            }}
          />
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerateImage}
          disabled={loadingImage || !customPrompt}
          className="shiny-button"
          style={{ width: '100%', padding: 16, fontSize: '1rem', display: 'flex', justifyContent: 'center', gap: 8 }}
        >
          {loadingImage ? <Loader2 size={20} className="spin" /> : <Sparkles size={20} />}
          {loadingImage ? 'Generating...' : 'Generate Thumbnail'}
        </button>
      </div>

      {/* Gallery */}
      {generatedImages.length > 0 && (
        <div style={{ marginTop: 32 }}>
          <h3 style={{ marginBottom: 16 }}>Gallery</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {generatedImages.map((img, i) => (
              <div key={i} className="card" style={{ overflow: 'hidden' }}>
                <img src={img.url} style={{ width: '100%', aspectRatio: img.ratio === 'landscape' ? '16/9' : '9/16', objectFit: 'cover' }} />
                <div style={{ padding: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-tertiary)', marginBottom: 4 }}>
                    <span>{VISUAL_STYLES[img.style]?.label}</span>
                    <span>{ASPECT_RATIOS[img.ratio]?.label}</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {img.prompt}
                  </div>
                  <a href={img.url} target="_blank" style={{ display: 'block', marginTop: 8, fontSize: '0.8rem', color: 'var(--accent-primary)' }}>Download High-Res</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
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
