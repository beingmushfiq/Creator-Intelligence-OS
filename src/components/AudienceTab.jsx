import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Target, 
  Zap, 
  Brain, 
  MessageSquare, 
  RefreshCw, 
  Sparkles,
  ChevronRight,
  Eye,
  AlertCircle
} from 'lucide-react';
import { useCreator } from '../context/CreatorContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { generateAudience, reframeForPersona } from '../engine/aiService';

export default function AudienceTab() {
  const { topic, data, setData, currentProjectId } = useCreator();
  const { addToast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [reframing, setReframing] = useState(null); // ID of persona being reframed
  const [reframingResult, setReframingResult] = useState('');

  const avatars = data?.audience || [];

  const handleGenerateAudience = async () => {
    if (!topic || !data) {
      addToast('info', 'Generate a project strategy first');
      return;
    }
    setLoading(true);
    try {
      const result = await generateAudience(topic, data);
      setData(prev => ({ ...prev, audience: result }));
      addToast('success', 'Audience archetypes generated');
    } catch (err) {
      addToast('error', 'Audience generation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleReframe = async (persona, index) => {
    const existingHook = data.script?.sections?.[0]?.content || data.narrative?.hook_strategies?.[0]?.angle || "Welcome to the video.";
    setReframing(index);
    setReframingResult('');
    try {
      const result = await reframeForPersona(persona, topic, existingHook);
      setReframingResult(result);
    } catch (err) {
      addToast('error', 'Reframing failed');
    }
  };

  if (!currentProjectId) {
    return (
      <div className="tab-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center' }}>
        <div style={{ maxWidth: 400 }}>
          <Users size={48} color="var(--accent-primary)" style={{ marginBottom: 20 }} />
          <h2 style={{ marginBottom: 12 }}>Audience Intelligence</h2>
          <p style={{ color: 'var(--text-tertiary)', marginBottom: 24 }}>
            Understand exactly WHO you are making this for. Unlock deep psychographic profiles and psychological framing.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="tab-content">
      <div className="tab-header">
        <div>
          <h2 className="tab-title text-gradient">Audience Intelligence</h2>
          <p className="tab-subtitle">Psychographic profiling & psychological content framing</p>
        </div>
        <button 
          className="btn-primary" 
          onClick={handleGenerateAudience} 
          disabled={loading}
        >
          {loading ? <RefreshCw className="animate-spin" size={16} /> : <Brain size={16} />}
          <span>{avatars.length > 0 ? 'Regenerate Avatars' : 'Identify Audience'}</span>
        </button>
      </div>

      {avatars.length === 0 ? (
        <div style={{ 
          display: 'flex', flexDirection: 'column', alignItems: 'center', 
          justifyContent: 'center', minHeight: '50vh', background: 'var(--bg-secondary)', 
          borderRadius: 16, border: '1px dashed var(--border-subtle)', margin: '0 20px'
        }}>
          <Target size={40} color="var(--text-tertiary)" style={{ marginBottom: 16, opacity: 0.5 }} />
          <p style={{ color: 'var(--text-tertiary)' }}>No audience profiles identified yet.</p>
          <button className="btn-ghost" onClick={handleGenerateAudience} style={{ marginTop: 12 }}>
            Run Psychographic Analysis
          </button>
        </div>
      ) : (
        <div className="card-grid" style={{ 
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: 20, alignItems: 'start' 
        }}>
          {avatars.map((persona, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="card persona-card"
              style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}
            >
              <div style={{ position: 'absolute', top: 0, right: 0, padding: '12px', opacity: 0.1 }}>
                <Users size={60} />
              </div>

              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 4, color: 'var(--accent-primary)' }}>
                {persona.name}
              </h3>
              <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
                <span className="badge" style={{ background: 'var(--bg-tertiary)', fontSize: '0.65rem' }}>
                  Trigger: {persona.trigger}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: 4, fontWeight: 700 }}>Core Desire</div>
                  <div style={{ fontSize: '0.85rem', lineHeight: 1.5 }}>{persona.desire}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: 4, fontWeight: 700 }}>Pain Point</div>
                  <div style={{ fontSize: '0.85rem', lineHeight: 1.5, color: '#ef4444' }}>{persona.painPoint}</div>
                </div>
              </div>

              <div style={{ background: 'var(--bg-tertiary)', borderRadius: 12, padding: 16, border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700 }}>Psychological Reframe</div>
                  <button 
                    className="btn-mini" 
                    onClick={() => handleReframe(persona, idx)}
                    disabled={reframing === idx}
                  >
                    {reframing === idx ? <RefreshCw className="animate-spin" size={12} /> : <Zap size={12} />}
                    <span>Reframe Hook</span>
                  </button>
                </div>
                
                <div style={{ fontSize: '0.85rem', fontStyle: 'italic', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {reframing === idx && !reframingResult ? 'Calculating reframed hook...' : (reframing === idx ? reframingResult : persona.sampleHook)}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
