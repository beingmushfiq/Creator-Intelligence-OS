import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, UserPlus, Heart, MessageCircle, BarChart3, 
  ShieldCheck, Trophy, Sparkles, RefreshCw, Layers,
  CheckCircle2, AlertTriangle, ArrowRight, Zap, Wand2,
  Activity, Target, Calendar, Star, Info
} from 'lucide-react';
import { useCreator } from '../context/CreatorContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { generateCommunityStrategy } from '../engine/aiService.js';

export default function CommunityTab() {
  const { data, loading, topic, setData } = useCreator();
  const { addToast } = useToast();
  const community = data?.community;
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeView, setActiveView] = useState('ascension'); // 'ascension' | 'rituals' | 'impact'

  const fetchCommunityStrategy = async () => {
    if (!topic || isGenerating) return;
    setIsGenerating(true);
    try {
      const result = await generateCommunityStrategy(topic, data?.niche || 'Digital Content', data?.genome?.dna_snippet);
      setData(prev => ({
         ...prev,
         community: result
      }));
      addToast('success', 'Community Flywheel architected!');
    } catch (err) {
      addToast('error', 'Failed to design community strategy.');
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (topic && !community && !loading) {
      fetchCommunityStrategy();
    }
  }, [topic, community, loading]);

  if (isGenerating) return (
     <div className="tab-content center-content">
        <div style={{ textAlign: 'center' }}>
           <RefreshCw size={48} className="spin" color="var(--accent-primary)" style={{ marginBottom: 24 }} />
           <h3 className="text-gradient" style={{ fontSize: '1.5rem', fontWeight: 800 }}>Mapping Tribal Belonging</h3>
           <p style={{ color: 'var(--text-tertiary)' }}>Calculating ascension tiers and ritual frequencies...</p>
        </div>
     </div>
  );

  if (!community) return (
    <div className="tab-content center-content">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="empty-state" 
        style={{ maxWidth: 600 }}
      >
        <div className="empty-state-icon" style={{ background: 'var(--accent-primary)15', color: 'var(--accent-primary)' }}>
          <Users size={32} />
        </div>
        <h3>Tribal Belonging Engine</h3>
        <p>Moats are built on belonging. Design an ascension map that turns passive content consumers into dedicated community advocates.</p>
        <button onClick={fetchCommunityStrategy} className="shiny-button" style={{ marginTop: 24, padding: '16px 32px' }}>
          <Wand2 size={18} /> Initialize Community Architect
        </button>
      </motion.div>
    </div>
  );

  return (
    <div className="tab-content">
      <div className="tab-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20 }}>
        <div>
          <h2 className="tab-title text-gradient">Community Architect</h2>
          <p className="tab-subtitle">Engineering retention moats & feedback flywheels for {topic}</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <div className="view-switcher" style={{ background: 'var(--bg-tertiary)', padding: 4, borderRadius: 12, border: '1px solid var(--border-subtle)', display: 'flex' }}>
             {['ascension', 'rituals', 'impact'].map(v => (
                <button 
                  key={v}
                  onClick={() => setActiveView(v)}
                  style={{ 
                    fontSize: '0.7rem', fontWeight: 800, padding: '8px 16px', borderRadius: 8, border: 'none',
                    background: activeView === v ? 'var(--bg-secondary)' : 'transparent',
                    color: activeView === v ? 'var(--accent-primary)' : 'var(--text-tertiary)',
                    cursor: 'pointer', transition: 'all 0.2s', textTransform: 'uppercase', letterSpacing: '0.05em'
                  }}
                >
                  {v === 'ascension' ? 'Tribal Map' : v}
                </button>
             ))}
          </div>
          <button onClick={fetchCommunityStrategy} className="btn-secondary" style={{ padding: '8px 16px' }}><RefreshCw size={18} /></button>
        </div>
      </div>

      <div className="stagger-children" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        
        {/* Health Pulse */}
        <motion.div 
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           className="card" 
           style={{ padding: 24, display: 'flex', alignItems: 'center', gap: 32, background: 'var(--bg-secondary)' }}
        >
           <div style={{ position: 'relative', width: 80, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="80" height="80" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
                 <circle cx="50" cy="50" r="45" fill="none" stroke="var(--bg-tertiary)" strokeWidth="8" />
                 <motion.circle 
                    cx="50" cy="50" r="45" fill="none" 
                    stroke="var(--accent-success)" strokeWidth="8"
                    strokeDasharray="283"
                    initial={{ strokeDashoffset: 283 }}
                    animate={{ strokeDashoffset: 283 - (283 * community.healthMetric.score / 100) }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                    strokeLinecap="round"
                    style={{ filter: 'drop-shadow(0 0 8px var(--accent-success)40)' }}
                 />
              </svg>
              <div style={{ position: 'absolute', fontSize: '1.4rem', fontWeight: 950, color: 'var(--text-primary)' }}>{community.healthMetric.score}</div>
           </div>
           <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                 <ShieldCheck size={20} color="var(--accent-success)" />
                 <h4 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Community Health Score</h4>
              </div>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', margin: 0 }}>{community.healthMetric.sentiment}</p>
           </div>
           <div style={{ display: 'flex', gap: 10 }}>
              {community.healthMetric.risks.map((risk, i) => (
                 <div key={i} className="badge badge-yellow" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <AlertTriangle size={14} /> Risk: {risk}
                 </div>
              ))}
           </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {activeView === 'ascension' && (
            <motion.div 
              key="ascension"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}
            >
               {Object.entries(community.flywheel).map(([stage, details], i) => (
                  <motion.div 
                    key={stage} 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -8, borderColor: 'var(--accent-primary)50' }}
                    className="card" 
                    style={{ padding: 32, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', background: i === 1 ? 'var(--bg-secondary)' : 'transparent' }}
                  >
                     <div style={{ width: 64, height: 64, borderRadius: 20, background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                        {stage === 'listener' && <Users size={32} color="var(--accent-info)" />}
                        {stage === 'participant' && <MessageCircle size={32} color="var(--accent-primary)" style={{ fill: 'var(--accent-primary)20' }} />}
                        {stage === 'advocate' && <Heart size={32} color="var(--accent-success)" style={{ fill: 'var(--accent-success)20' }} />}
                     </div>
                     <div className="badge badge-purple" style={{ marginBottom: 12, fontSize: '0.7rem', fontWeight: 900 }}>STAGE 0{i+1} • {stage.toUpperCase()}</div>
                     <h3 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: 16 }}>{details.action}</h3>
                     <div style={{ padding: 20, background: 'var(--bg-primary)60', borderRadius: 20, border: '1px solid var(--border-subtle)', width: '100%' }}>
                        <div style={{ fontSize: '0.65rem', fontWeight: 900, color: 'var(--accent-primary)', textTransform: 'uppercase', marginBottom: 8, letterSpacing: '0.05em' }}>Engagement Hook</div>
                        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', fontStyle: 'italic', margin: 0 }}>"{details.hook}"</p>
                     </div>
                  </motion.div>
               ))}
            </motion.div>
          )}

          {activeView === 'rituals' && (
            <motion.div 
              key="rituals"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
            >
               {community.rituals.map((ritual, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="card" 
                    style={{ padding: 24, display: 'flex', alignItems: 'center', gap: 32, borderLeft: '4px solid var(--accent-primary)' }}
                  >
                     <div style={{ padding: 16, background: 'var(--bg-tertiary)', borderRadius: 16, color: 'var(--accent-primary)' }}>
                        <RefreshCw size={28} />
                     </div>
                     <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: 4 }}>{ritual.name}</h4>
                        <p style={{ fontSize: '0.95rem', color: 'var(--text-tertiary)', margin: 0 }}>{ritual.description}</p>
                     </div>
                     <div className="badge badge-primary" style={{ padding: '8px 16px', fontWeight: 800 }}>
                        {ritual.frequency}
                     </div>
                  </motion.div>
               ))}
            </motion.div>
          )}

          {activeView === 'impact' && (
            <motion.div 
              key="impact"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}
            >
               {community.socialProof.map((proof, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="card" 
                    style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}
                  >
                     <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ padding: 8, background: 'var(--accent-warning)15', color: 'var(--accent-warning)', borderRadius: 10 }}>
                           <Trophy size={20} />
                        </div>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 900 }}>{proof.type}</h4>
                     </div>
                     <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', margin: 0, paddingLeft: 12, borderLeft: '2px solid var(--accent-primary)40' }}>{proof.implementation}</p>
                     <div className="badge badge-green" style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Zap size={14} /> Expected Impact: {proof.impact}
                     </div>
                  </motion.div>
               ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
