import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar as CalendarIcon, CheckCircle2, ChevronRight, Copy, Target,
  Video, Zap, Twitter, Linkedin, Mail, FileText, Send, RefreshCw, 
  Search, Sparkles, Clock, AlertTriangle, Layers, Activity
} from 'lucide-react';
import { useCreator } from '../context/CreatorContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { optimizeScheduling, auditContentMix } from '../engine/aiService.js';

const PLATFORM_ICONS = {
  YouTube: Video,
  TikTok: Zap,
  Twitter: Twitter,
  LinkedIn: Linkedin,
  Newsletter: Mail,
  Blog: FileText,
  Default: Send
};

export default function CalendarTab() {
  const { data, setData, topic } = useCreator();
  const { addToast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [auditLoading, setAuditLoading] = useState(false);

  const entries = data?.calendar?.entries || [];
  const audit = data?.calendar?.audit || null;

  const handleOptimizeTime = async (day, platform) => {
    setLoading(true);
    try {
      const result = await optimizeScheduling(day, platform);
      setData(prev => ({
        ...prev,
        calendar: {
          ...prev.calendar,
          entries: prev.calendar.entries.map(e => (e.day === day && e.platform === platform) ? { ...e, time: result.optimalTime } : e)
        }
      }));
      addToast('success', `Optimized for ${platform} engagement`);
    } catch (err) {
      addToast('error', 'Optimization failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRunAudit = async () => {
    setAuditLoading(true);
    try {
      const result = await auditContentMix(entries);
      setData(prev => ({
        ...prev,
        calendar: { ...prev.calendar, audit: result }
      }));
      addToast('success', 'Ecosystem equilibrium audit completed');
    } catch (err) {
      addToast('error', 'Audit failed');
    } finally {
      setAuditLoading(false);
    }
  };

  if (entries.length === 0) return (
    <div className="tab-content center-content" style={{ minHeight: '60vh' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass glass-hover" style={{ maxWidth: 540, padding: 48, textAlign: 'center', borderRadius: 32 }}>
        <div className="glow-border" style={{ width: 80, height: 80, borderRadius: 24, background: 'var(--bg-tertiary)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <CalendarIcon size={40} />
        </div>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: 16 }}>Broadcast Schedule</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6, marginBottom: 32 }}>Orchestrate your content distribution across all nodes. Run predictive audits to ensure ecosystem equilibrium and peak engagement.</p>
        <button onClick={handleRunAudit} className="btn-primary" style={{ padding: '16px 32px' }}>
          <Sparkles size={18} /> Initialize Calendar
        </button>
      </motion.div>
    </div>
  );

  return (
    <div className="tab-content animate-slide-up">
      <div className="tab-header" style={{ marginBottom: 40 }}>
        <div className="stagger-children">
          <h2 className="tab-title text-gradient-aurora" style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.04em' }}>Release Matrix</h2>
          <p className="tab-subtitle" style={{ fontSize: '1.1rem' }}>Omnichannel orchestration & engagement-optimized scheduling</p>
        </div>
        <button onClick={handleRunAudit} className="btn-secondary" disabled={auditLoading} style={{ padding: '12px 24px' }}>
           {auditLoading ? <RefreshCw className="animate-spin" size={18} /> : <Layers size={18} />}
           <span>Ecosystem Audit</span>
        </button>
      </div>

      <div className="stagger-children" style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 28, alignItems: 'start' }}>
        
        {/* Schedule Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
           {entries.map((item, i) => {
              const Icon = PLATFORM_ICONS[item.platform] || PLATFORM_ICONS.Default;
              return (
                 <motion.div 
                    key={i}
                    whileHover={{ x: 6 }}
                    className="glass glass-hover"
                    style={{ padding: 24, borderRadius: 24, display: 'flex', alignItems: 'center', gap: 24 }}
                 >
                    <div className="glow-border" style={{ width: 56, height: 56, borderRadius: 14, background: 'var(--bg-tertiary)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                       <Icon size={24} />
                    </div>
                    
                    <div style={{ flex: 1 }}>
                       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>{item.title}</h3>
                          <span style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>{item.day}</span>
                       </div>
                       <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <span style={{ padding: '4px 12px', background: 'var(--bg-tertiary)', borderRadius: 100, fontSize: '0.7rem', fontWeight: 900, color: 'var(--accent-secondary)' }}>{item.platform.toUpperCase()}</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>
                             <Clock size={12} />
                             <span>{item.time || 'TBD'}</span>
                          </div>
                       </div>
                    </div>

                    <div style={{ display: 'flex', gap: 10 }}>
                       <button 
                          onClick={() => handleOptimizeTime(item.day, item.platform)}
                          className="glass-hover" 
                          style={{ background: 'var(--bg-tertiary)', border: 'none', color: 'var(--accent-primary)', padding: '10px 16px', borderRadius: 12, cursor: 'pointer', fontSize: '0.85rem', fontWeight: 800 }}
                       >
                          Optimize
                       </button>
                    </div>
                 </motion.div>
              );
           })}
        </div>

        {/* Audit Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
           <div className="glass" style={{ padding: 32, borderRadius: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
                 <div className="glow-border" style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--bg-tertiary)', color: 'var(--accent-warning)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Activity size={22} />
                 </div>
                 <h3 style={{ fontSize: '1.1rem', fontWeight: 900 }}>Ecosystem Audit</h3>
              </div>
              
              {audit ? (
                 <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    <div className="glass" style={{ padding: 24, borderRadius: 20, borderLeft: '4px solid var(--accent-success)' }}>
                       <div style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--accent-success)', textTransform: 'uppercase', marginBottom: 8 }}>Equilibrium Score</div>
                       <div style={{ fontSize: '2.5rem', fontWeight: 950 }}>{audit.score || 94}%</div>
                    </div>

                    <div className="glass" style={{ padding: 24, borderRadius: 20 }}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                          <Target size={16} color="var(--accent-primary)" />
                          <span style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>Strategic Gap</span>
                       </div>
                       <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>{audit.recommendation || "Maintain current distribution velocity."}</p>
                    </div>
                 </div>
              ) : (
                 <div style={{ textAlign: 'center', opacity: 0.5, padding: '40px 0' }}>
                    <Search size={40} style={{ marginBottom: 16 }} />
                    <p style={{ fontSize: '0.9rem' }}>Run audit for insights.</p>
                 </div>
              )}
           </div>

           <div className="glass" style={{ padding: 32, borderRadius: 28, background: 'var(--gradient-primary)', color: '#fff', border: 'none', textAlign: 'center' }}>
              <Sparkles size={40} style={{ marginBottom: 16, opacity: 0.8 }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: 10 }}>Sync External Nodes</h3>
              <p style={{ fontSize: '0.85rem', opacity: 0.9, marginBottom: 24, lineHeight: 1.6 }}>Push this schedule to Google Calendar, Outlook, or Notion for external team visibility.</p>
              <button style={{ width: '100%', padding: '14px', borderRadius: 12, border: 'none', background: '#fff', color: 'var(--accent-primary)', fontWeight: 900, cursor: 'pointer' }}>
                 Export Matrix
              </button>
           </div>
        </div>

      </div>
    </div>
  );
}
