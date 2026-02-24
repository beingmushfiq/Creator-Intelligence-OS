import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, Send, Sparkles, Wand2, Copy, Check, 
  MessageCircle, AlertCircle, Smile, Shield, Zap, Search,
  Activity, BarChart3, Filter, Trash2, ChevronDown,
  Info, TrendingUp, Heart
} from 'lucide-react';
import { useCreator } from '../context/CreatorContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { generateCommentResponses } from '../engine/aiService.js';

const TONES = [
  { id: 'Supportive', label: 'Supportive', icon: Smile, color: 'var(--accent-success)' },
  { id: 'Witty', label: 'Witty', icon: Zap, color: 'var(--accent-warning)' },
  { id: 'Professional', label: 'Professional', icon: Shield, color: 'var(--accent-secondary)' },
  { id: 'Debunking', label: 'Debunking', icon: AlertCircle, color: 'var(--accent-danger)' }
];

export default function EngagementTab() {
  const { data, topic } = useCreator();
  const { addToast } = useToast();
  const [comment, setComment] = useState('');
  const [selectedTone, setSelectedTone] = useState('Supportive');
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleHandleGenerate = async () => {
    if (!comment.trim()) {
      addToast('error', 'Please enter a comment to analyze.');
      return;
    }
    setIsGenerating(true);
    try {
      const response = await generateCommentResponses(comment, selectedTone, data?.genome?.dna_snippet);
      setResults(response);
      addToast('success', 'Oracle has drafted resonance-optimized responses!');
    } catch (err) {
      addToast('error', 'Failed to generate diplomatic responses.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    addToast('success', 'Response copied to clipboard!');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="tab-content">
      <div className="tab-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20 }}>
        <div>
          <h2 className="tab-title text-gradient">Engagement Oracle</h2>
          <p className="tab-subtitle">AI-assisted audience resonance & community diplomacy</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
           <div className="badge badge-primary" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px' }}>
              <Activity size={14} /> Live Audience DNA Active
           </div>
        </div>
      </div>

      <div className="stagger-children" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        
        {/* Input Station */}
        <motion.div 
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           className="card" 
           style={{ padding: 32, background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%)' }}
        >
           <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                 <MessageSquare size={18} color="var(--accent-primary)" />
                 <label style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>Viewer Intelligence Input</label>
              </div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Paste a complex viewer comment or question here..."
                style={{
                  width: '100%', minHeight: 140, background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', borderRadius: 20,
                  padding: 24, color: 'var(--text-primary)', fontSize: '1rem', lineHeight: 1.6, outline: 'none', resize: 'none',
                  transition: 'all 0.2s', borderLeft: '4px solid var(--accent-primary)40'
                }}
              />
           </div>

           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                 {TONES.map(tone => {
                   const Icon = tone.icon;
                   const active = selectedTone === tone.id;
                   return (
                     <motion.button
                       key={tone.id}
                       whileHover={{ y: -2 }}
                       whileTap={{ scale: 0.98 }}
                       onClick={() => setSelectedTone(tone.id)}
                       style={{
                         display: 'flex', alignItems: 'center', gap: 10, padding: '10px 18px', borderRadius: 14,
                         background: active ? tone.color : 'var(--bg-primary)',
                         color: active ? '#fff' : 'var(--text-secondary)',
                         border: '1px solid',
                         borderColor: active ? 'transparent' : 'var(--border-subtle)',
                         fontSize: '0.85rem', fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s',
                         boxShadow: active ? `0 8px 20px ${tone.color}30` : 'none'
                       }}
                     >
                       <Icon size={16} />
                       {tone.label}
                     </motion.button>
                   );
                 })}
              </div>

              <button
                className="shiny-button"
                onClick={handleHandleGenerate}
                disabled={isGenerating || !comment.trim()}
                style={{ padding: '12px 32px', gap: 10 }}
              >
                {isGenerating ? <RefreshCw size={20} className="spin" /> : <Wand2 size={20} />}
                <span>Forge Response</span>
              </button>
           </div>
        </motion.div>

        {/* Results Stream */}
        <AnimatePresence mode="wait">
          {results ? (
            <motion.div 
               key="results"
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.98 }}
               style={{ display: 'flex', flexDirection: 'column', gap: 24 }}
            >
               <div style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '0 8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                     <div style={{ padding: 8, background: 'var(--bg-tertiary)', borderRadius: 10 }}><BarChart3 size={16} color="var(--accent-primary)" /></div>
                     <span style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>Detected Sentiment</span>
                  </div>
                  <div className={`badge ${
                    results.sentiment === 'Positive' ? 'badge-green' : 
                    results.sentiment === 'Negative' ? 'badge-red' : 
                    results.sentiment === 'Constructive' ? 'badge-blue' : 'badge-gold'
                  }`} style={{ padding: '6px 16px', fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase' }}>
                    {results.sentiment} Resonance
                  </div>
               </div>

               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 24 }}>
                  {results.replies.map((reply, i) => (
                     <motion.div 
                       key={i}
                       initial={{ opacity: 0, scale: 0.95 }}
                       animate={{ opacity: 1, scale: 1 }}
                       transition={{ delay: i * 0.1 }}
                       className="card"
                       style={{ background: 'var(--bg-secondary)', padding: 32, display: 'flex', flexDirection: 'column', gap: 24, border: '1px solid var(--border-subtle)', position: 'relative' }}
                     >
                        <div style={{ position: 'absolute', top: 12, right: 12 }}>
                           <button 
                             onClick={() => copyToClipboard(reply.text, i)}
                             className="btn-mini"
                             style={{ padding: 10, background: 'var(--bg-tertiary)', color: copiedIndex === i ? 'var(--accent-success)' : 'var(--text-secondary)' }}
                           >
                             {copiedIndex === i ? <Check size={18} /> : <Copy size={18} />}
                           </button>
                        </div>
                        
                        <div style={{ fontSize: '1.1rem', lineHeight: 1.7, color: 'var(--text-primary)', fontWeight: 500 }}>
                           "{reply.text}"
                        </div>
                        
                        <div style={{ padding: 20, background: 'var(--bg-tertiary)', borderRadius: 18, border: '1px solid var(--border-subtle)' }}>
                           <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                              <TrendingUp size={14} color="var(--accent-primary)" />
                              <span style={{ fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>Diplomatic Rationale</span>
                           </div>
                           <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>{reply.rationale}</p>
                        </div>
                     </motion.div>
                  ))}
               </div>
            </motion.div>
          ) : !isGenerating && (
            <motion.div 
               key="empty"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="card" 
               style={{ padding: 60, textAlign: 'center', border: '1px dashed var(--border-subtle)', background: 'transparent' }}
            >
               <MessageCircle size={48} color="var(--accent-primary)" style={{ opacity: 0.1, marginBottom: 24 }} />
               <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: 12 }}>Awaiting Resonance Mapping</h3>
               <p style={{ color: 'var(--text-tertiary)', maxWidth: 460, margin: '0 auto' }}>
                  Paste viewer feedback above to leverage the Oracle's diplomatic intelligence. Maintain brand voice across supportive, professional, and debunking scenarios.
               </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
