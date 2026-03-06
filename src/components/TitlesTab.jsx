import React from 'react';
import { motion } from 'framer-motion';
import { 
  Type, BarChart2, AlertTriangle, Star, Copy, Shield, Flame, 
  Eye, Lock, Database, Lightbulb, MessageSquare, Zap, Globe, Languages,
  ChevronRight, ExternalLink
} from 'lucide-react';
import { useCreator } from '../context/CreatorContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { RegenerateButton } from './ui/RegenerateButton.jsx';

const CATEGORY_STYLES = {
  'Highly Clickable': { bg: 'rgba(124, 92, 252, 0.12)', color: 'var(--accent-primary)' },
  'Educational/How-to': { bg: 'rgba(34, 197, 94, 0.12)', color: 'var(--accent-success)' },
  'Narrative Hook': { bg: 'rgba(0, 212, 255, 0.12)', color: 'var(--accent-secondary)' },
  'Short-Form Viral': { bg: 'rgba(245, 158, 11, 0.12)', color: 'var(--accent-warning)' },
};

export default function TitlesTab() {
  const { data, loading, regenerateSection, topic } = useCreator();
  const { addToast } = useToast();
  const titles = data?.titles || [];

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    addToast('success', 'Title copied to clipboard!');
  };

  if (titles.length === 0) return <EmptyState />;

  return (
    <div className="tab-content animate-slide-up">
      <div className="tab-header" style={{ marginBottom: 40 }}>
        <div className="stagger-children">
          <h2 className="tab-title text-gradient-aurora" style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.04em' }}>Title Engineering</h2>
          <p className="tab-subtitle" style={{ fontSize: '1.1rem' }}>Psychological hook variants & predictive click-through mapping</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <RegenerateButton onClick={() => regenerateSection('titles')} loading={loading} />
        </div>
      </div>

      <div className="stagger-children" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 28 }}>
        {titles.map((t, i) => (
          <motion.div 
            key={i} 
            whileHover={{ y: -6 }}
            className="glass glass-hover" 
            style={{ padding: 32, borderRadius: 28, position: 'relative', overflow: 'hidden' }}
          >
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <span style={{ 
                  padding: '6px 16px', 
                  borderRadius: 100, 
                  fontSize: '0.65rem', 
                  fontWeight: 900, 
                  background: CATEGORY_STYLES[t.category]?.bg || 'rgba(255,255,255,0.05)',
                  color: CATEGORY_STYLES[t.category]?.color || 'var(--text-secondary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em'
                }}>
                   {t.category}
                </span>
                <button 
                   onClick={() => handleCopy(t.text)}
                   className="glass-hover" 
                   style={{ background: 'transparent', border: 'none', color: 'var(--text-tertiary)', padding: 8, borderRadius: 10, cursor: 'pointer' }}
                >
                   <Copy size={16} />
                </button>
             </div>

             <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.4, marginBottom: 24 }}>
                "{t.text}"
             </h3>

             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
                <div className="glass" style={{ padding: '12px 16px', borderRadius: 16, textAlign: 'center' }}>
                   <div style={{ fontSize: '0.6rem', fontWeight: 900, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: 4 }}>Viral Score</div>
                   <div style={{ color: 'var(--accent-primary)', fontWeight: 900, fontSize: '1.1rem' }}>{t.score}%</div>
                </div>
                <div className="glass" style={{ padding: '12px 16px', borderRadius: 16, textAlign: 'center' }}>
                   <div style={{ fontSize: '0.6rem', fontWeight: 900, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: 4 }}>Resonance</div>
                   <div style={{ color: 'var(--accent-success)', fontWeight: 900, fontSize: '1.1rem' }}>High</div>
                </div>
             </div>

             <div className="glass" style={{ padding: 20, borderRadius: 18, background: 'rgba(255,255,255,0.02)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                   <Zap size={14} color="var(--accent-warning)" />
                   <span style={{ fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>Mechanism</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>{t.rationale || "Utilizes curiosity gap to trigger immediate dopamine response."}</p>
             </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="tab-content center-content" style={{ minHeight: '60vh' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass glass-hover" style={{ maxWidth: 480, padding: 48, textAlign: 'center', borderRadius: 32 }}>
        <div className="glow-border" style={{ width: 80, height: 80, borderRadius: 24, background: 'var(--bg-tertiary)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <Type size={40} />
        </div>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: 16 }}>Title Engineering</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6 }}>Generate high-CTR title variants optimized for algorithmic breakthrough and audience resonance.</p>
      </motion.div>
    </div>
  );
}
