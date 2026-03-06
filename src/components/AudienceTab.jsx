import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Target, Zap, Brain, MessageSquare, 
  RefreshCw, Sparkles, Eye, User, ShieldCheck,
  ChevronRight, ArrowRight, Activity, TrendingUp,
  Globe, Layout
} from 'lucide-react';
import { useCreator } from '../context/CreatorContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { generateAudience, reframeForPersona } from '../engine/aiService.js';

export default function AudienceTab() {
  const { data, setData, topic, loading } = useCreator();
  const { addToast } = useToast();
  
  const [reframing, setReframing] = useState(null);

  const audience = data?.audience || [];

  const handleGenerateAudience = async () => {
    if (!topic) {
      addToast('error', 'Initiate project loop first.');
      return;
    }
    try {
      addToast('info', 'Synchronizing audience nodes...');
      const result = await generateAudience(topic);
      setData(prev => ({
        ...prev,
        audience: result
      }));
      addToast('success', 'Audience synchronized.');
    } catch (e) {
      addToast('error', 'Synchronization failed.');
    }
  };

  const handleReframe = async (persona, index) => {
    setReframing(index);
    try {
      const result = await reframeForPersona(topic, persona);
      addToast('info', `Intelligence reframed for ${persona.name}.`);
    } catch (e) {
      addToast('error', 'Reframe failed.');
    } finally {
      setReframing(null);
    }
  };

  if (audience.length === 0) return (
     <div className="tab-content center-content" style={{ minHeight: '60vh' }}>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass glass-hover" style={{ maxWidth: 520, padding: 60, borderRadius: 32, textAlign: 'center' }}>
           <div className="glow-border" style={{ width: 80, height: 80, borderRadius: 24, background: 'var(--bg-tertiary)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <Users size={40} />
           </div>
           <h3 style={{ fontSize: '1.6rem', fontWeight: 900, marginBottom: 16 }}>Audience Engineering</h3>
           <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6, marginBottom: 32 }}>Analyze psychological segments and architect persona-driven resonance models for your operational loops.</p>
           <button onClick={handleGenerateAudience} className="btn-primary" style={{ padding: '16px 32px' }}>
              <Zap size={18} /> Initialize Audience Sync
           </button>
        </motion.div>
     </div>
  );

  return (
    <div className="tab-content animate-slide-up">
      <div className="tab-header" style={{ marginBottom: 40 }}>
        <div className="stagger-children">
          <h2 className="tab-title text-gradient-aurora" style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.04em' }}>Resonance Hub</h2>
          <p className="tab-subtitle" style={{ fontSize: '1.1rem' }}>Psychological persona mapping & recursive audience synchronization</p>
        </div>
        <button onClick={handleGenerateAudience} className="btn-secondary" disabled={loading} style={{ padding: '12px' }}>
          {loading ? <RefreshCw className="animate-spin" size={18} /> : <RefreshCw size={18} />}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: 28, marginBottom: 48 }}>
        {audience.map((a, i) => (
           <motion.div 
             key={i} 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: i * 0.1 }}
             whileHover={{ y: -8 }}
             className="glass glass-hover" 
             style={{ padding: 40, borderRadius: 32 }}
           >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div className="glow-border" style={{ width: 52, height: 52, borderRadius: 16, background: 'var(--bg-tertiary)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                       <User size={26} />
                    </div>
                    <div>
                       <h3 style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: 4 }}>{a.name}</h3>
                       <span style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Primary Segment</span>
                    </div>
                 </div>
                 <div className="glass" style={{ padding: '6px 14px', borderRadius: 100, fontSize: '0.65rem', fontWeight: 950, color: 'var(--accent-secondary)' }}>9.4 RESONANCE</div>
              </div>

              <div className="glass" style={{ padding: 24, borderRadius: 20, background: 'rgba(255,255,255,0.01)', marginBottom: 28 }}>
                 <h4 style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: 12 }}>Psychographic Blueprint</h4>
                 <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>{a.description}</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32 }}>
                 <div className="glass" style={{ padding: 16, borderRadius: 16, textAlign: 'center' }}>
                    <div style={{ fontSize: '0.6rem', fontWeight: 900, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: 4 }}>Retention</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 950, color: 'var(--accent-success)' }}>High</div>
                 </div>
                 <div className="glass" style={{ padding: 16, borderRadius: 16, textAlign: 'center' }}>
                    <div style={{ fontSize: '0.6rem', fontWeight: 900, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: 4 }}>Viral Lift</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 950, color: 'var(--accent-primary)' }}>0.92</div>
                 </div>
              </div>

              <button 
                 onClick={() => handleReframe(a, i)}
                 disabled={reframing === i}
                 className="btn-primary" 
                 style={{ width: '100%', padding: '16px' }}
              >
                 {reframing === i ? <RefreshCw className="animate-spin" size={16} /> : <Brain size={16} />}
                 <span>{reframing === i ? 'Reframing...' : 'Execute Persona Reframe'}</span>
              </button>
           </motion.div>
        ))}
      </div>
    </div>
  );
}
