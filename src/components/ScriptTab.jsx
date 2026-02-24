import React, { useState } from 'react';
import { 
  ChevronDown, Film, Camera, Sun, 
  Music, Wand2, FileText, Play, 
  ShoppingBag, Users, Search, 
  Globe, RefreshCw, Copy, Loader2, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCreator } from '../context/CreatorContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { generateSpeech, translateContent } from '../engine/aiService';
import { dbService } from '../services/dbService';
import { RegenerateButton } from './ui/RegenerateButton';
import { ExportButton } from './ui/ExportButton';
import { CopyBlock } from './ui/CopyBlock';

const LANGUAGES = [
  { id: 'en', name: 'English', flag: '🇺🇸' },
  { id: 'es', name: 'Spanish', flag: '🇪🇸' },
  { id: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { id: 'de', name: 'German', flag: '🇩🇪' },
  { id: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { id: 'fr', name: 'French', flag: '🇫🇷' }
];

export default function ScriptTab() {
  const { data, loading, setData, regenerateSection, setCurrentAudio, topic, setActiveTab } = useCreator();
  const { user } = useAuth();
  const script = data?.script;
  const { addToast } = useToast();
  
  const [loadingAudio, setLoadingAudio] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [targetLang, setTargetLang] = useState('en');
  const [withProductCTA, setWithProductCTA] = useState(false);
  const [withCommunitySegments, setWithCommunitySegments] = useState(false);

  const handleTranslate = async (langCode) => {
    if (!script) return;
    const lang = LANGUAGES.find(l => l.id === langCode);
    setTargetLang(langCode);
    
    setIsTranslating(true);
    addToast('info', `Translating script to ${lang.name}...`);
    try {
      const translated = await translateContent(script, lang.name, data?.niche || 'Content Creation');
      setData(prev => ({
        ...prev,
        script: {
          ...prev.script,
          sections: translated.sections,
          language: lang.name
        }
      }));
      addToast('success', `Script localized for ${lang.name} market!`);
    } catch (err) {
      console.error(err);
      addToast('error', 'Translation failed. Please try again.');
    } finally {
      setIsTranslating(false);
    }
  };

  const handleGenerateAudio = async () => {
    if (!script || !script.sections) return;
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
      <div className="tab-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20 }}>
        <div>
          <h2 className="tab-title text-gradient">Master Script</h2>
          <p className="tab-subtitle">
            {script.estimatedDuration} · Tone: {script.tone}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <div className="btn-group" style={{ display: 'flex', background: 'var(--bg-tertiary)', padding: 4, borderRadius: 12, border: '1px solid var(--border-subtle)' }}>
            <button
              onClick={handleGenerateAudio}
              disabled={loadingAudio}
              className="btn-ghost"
              style={{ padding: '6px 12px', gap: 8, fontSize: '0.75rem', color: 'var(--accent-primary)' }}
            >
              {loadingAudio ? <RefreshCw size={14} className="spin" /> : <Play size={14} fill="currentColor" />}
              {loadingAudio ? 'Generating...' : 'Listen'}
            </button>
            <div style={{ width: 1, background: 'var(--border-subtle)', margin: '4px 0' }} />
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', padding: '0 8px' }}>
              <Globe size={14} color="var(--accent-primary)" style={{ marginRight: 8 }} />
              <select 
                value={targetLang}
                onChange={(e) => handleTranslate(e.target.value)}
                disabled={isTranslating}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: '0.75rem', fontWeight: 600, outline: 'none', cursor: 'pointer' }}
              >
                {LANGUAGES.map(l => (
                  <option key={l.id} value={l.id}>{l.name}</option>
                ))}
              </select>
            </div>
          </div>
          
          <button
            onClick={() => setWithProductCTA(!withProductCTA)}
            className={`btn-ghost ${withProductCTA ? 'active' : ''}`}
            style={{ 
              padding: '6px 12px', 
              gap: 8, 
              borderColor: withProductCTA ? 'var(--accent-primary)' : 'var(--border-subtle)',
              color: withProductCTA ? 'var(--accent-primary)' : 'var(--text-tertiary)'
            }}
          >
            <ShoppingBag size={14} />
            <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Product CTA</span>
          </button>
          
          <ExportButton section="script" data={script} />
          <RegenerateButton onClick={() => regenerateSection('script', { withProductCTA, withCommunitySegments })} loading={loading} />
        </div>
      </div>

      <div className="stagger-children" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {script.sections.map((section, index) => (
          <ScriptSection key={section.id} section={section} index={index} brollMap={data?.media?.brollMap} />
        ))}
      </div>
    </div>
  );
}

function ScriptSection({ section, index, brollMap }) {
  const [open, setOpen] = useState(index === 0);
  const { setActiveTab } = useCreator();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="card" 
      style={{ padding: 0, overflow: 'hidden', background: 'var(--bg-secondary)', border: `1px solid ${open ? 'var(--accent-primary)30' : 'var(--border-subtle)'}` }}
    >
      <div 
        onClick={() => setOpen(!open)}
        style={{ 
          padding: '16px 24px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          cursor: 'pointer',
          background: open ? 'var(--accent-primary)05' : 'transparent',
          transition: 'background 0.2s ease'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ 
            width: 28, height: 28, borderRadius: '50%', background: open ? 'var(--accent-primary)' : 'var(--bg-tertiary)', 
            color: open ? 'white' : 'var(--text-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.75rem', fontWeight: 800, transition: 'all 0.3s ease'
          }}>
            {index + 1}
          </div>
          <div>
            <span style={{ fontSize: '1rem', fontWeight: 700, color: open ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{section.title}</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginLeft: 8 }}>{section.subtitle}</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
           <div style={{ display: 'flex', gap: 6 }}>
              {section.id === 'hook' && (
                <button 
                  onClick={(e) => { e.stopPropagation(); setActiveTab('viral'); }}
                  className="badge badge-warning" 
                  style={{ cursor: 'pointer', border: 'none', padding: '2px 8px', fontSize: '10px' }}
                >
                  <Zap size={10} /> Optimize
                </button>
              )}
              <button 
                onClick={(e) => { e.stopPropagation(); setActiveTab('deck'); }}
                className="badge badge-primary" 
                style={{ cursor: 'pointer', border: 'none', padding: '2px 8px', fontSize: '10px' }}
              >
                <Film size={10} /> Visualize
              </button>
           </div>
           <motion.div animate={{ rotate: open ? 180 : 0 }}>
              <ChevronDown size={18} color="var(--text-tertiary)" />
           </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div style={{ padding: '0 24px 24px' }}>
              <div style={{ height: 1, background: 'var(--border-subtle)', marginBottom: 20 }} />
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 32 }}>
                <div className="script-text" style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--text-primary)', maxWidth: 800 }}>
                  {section.content.split('\n').map((para, i) => (
                    para.trim() ? <p key={i} style={{ marginBottom: 16 }}>{para}</p> : null
                  ))}
                  
                  <div style={{ marginTop: 32 }}>
                    <CopyBlock content={section.aiVideoPrompt} label="Director's Vision (AI Prompt)" />
                  </div>
                </div>

                <div className="sidebar-meta" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div className="meta-card" style={{ padding: 16, background: 'var(--bg-tertiary)', borderRadius: 12, border: '1px solid var(--border-subtle)' }}>
                     <h4 style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Camera size={12} /> Staging & Setup
                     </h4>
                     <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <div>
                           <div style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)' }}>Camera Movement</div>
                           <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{section.cameraMovement}</div>
                        </div>
                        <div>
                           <div style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)' }}>Lighting Style</div>
                           <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{section.lighting}</div>
                        </div>
                        <div>
                           <div style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)' }}>Music/SFX Cue</div>
                           <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{section.musicCue}</div>
                        </div>
                     </div>
                  </div>

                  {brollMap && (
                    <div style={{ padding: 16, background: 'var(--accent-secondary)05', borderRadius: 12, border: '1px solid var(--accent-secondary)20' }}>
                       <h4 style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--accent-secondary)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Wand2 size={12} /> B-Roll Suggestions
                       </h4>
                       <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                          {brollMap.filter(cue => cue.scene.toLowerCase().includes(section.title.toLowerCase()) || section.title.toLowerCase().includes(cue.scene.toLowerCase())).slice(0, 2).map((cue, i) => (
                             <div key={i} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', padding: 8, background: 'var(--bg-secondary)', borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
                                <div style={{ fontWeight: 700, marginBottom: 4 }}>{cue.visualSuggestion}</div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                                   <Search size={10} /> {cue.searchTerms[0]}
                                </div>
                             </div>
                          ))}
                       </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
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
