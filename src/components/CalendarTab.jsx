import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar as CalendarIcon, CheckCircle2, ChevronRight, Copy, Target,
  Sparkles, RefreshCw, Send, Video, Twitter, Linkedin, Mail, FileText,
  Activity, Zap, Clock, PieChart as PieChartIcon, TrendingUp, AlertCircle, 
  ArrowUpRight, Info, BarChart3, Star, Layers, Search
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis 
} from 'recharts';
import { useCreator } from '../context/CreatorContext';
import { useToast } from '../context/ToastContext';
import { ExportButton } from './ui/ExportButton';
import { optimizeScheduling, auditContentMix } from '../engine/aiService';

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
  const { calendar, topic, data, loading, regenerateSection, setData } = useCreator();
  const { addToast } = useToast();
  
  const [activeView, setActiveView] = useState('timeline'); // 'timeline' | 'audit'
  const [optimizingDay, setOptimizingDay] = useState(null);
  const [isAuditing, setIsAuditing] = useState(false);

  const schedule = calendar?.schedule || [];
  const dnaSnippet = data?.genome?.dna_snippet;

  const handleOptimizeTime = async (day, platform) => {
    setOptimizingDay(day);
    try {
      const result = await optimizeScheduling(topic, platform, dnaSnippet);
      setData(prev => ({
        ...prev,
        calendar: {
          ...prev.calendar,
          schedule: prev.calendar.schedule.map(d => 
            d.day === day ? { ...d, optimization: result } : d
          )
        }
      }));
      addToast('success', `Peak windows found for Day ${day}!`);
    } catch (err) {
      addToast('error', 'Optimization failed');
    } finally {
      setOptimizingDay(null);
    }
  };

  const handleRunAudit = async () => {
    setIsAuditing(true);
    try {
      const projects = [
        { type: 'value', count: 15 },
        { type: 'viral', count: 8 },
        { type: 'personal', count: 2 }
      ];
      const result = await auditContentMix(projects, dnaSnippet);
      setData(prev => ({
        ...prev,
        calendar: {
          ...prev.calendar,
          audit: result
        }
      }));
      addToast('success', 'Strategic Mix Audit Complete');
    } catch (err) {
      addToast('error', 'Audit failed');
    } finally {
      setIsAuditing(false);
    }
  };

  const auditData = useMemo(() => {
    if (!calendar?.audit?.currentMix) return [];
    const mix = calendar.audit.currentMix;
    return [
      { name: 'Value (70%)', value: mix.value, color: 'var(--accent-primary)' },
      { name: 'Viral (20%)', value: mix.viral, color: 'var(--accent-warning)' },
      { name: 'Personal (10%)', value: mix.personal, color: 'var(--accent-secondary)' },
    ];
  }, [calendar]);

  const weeks = useMemo(() => {
    const grouped = {};
    schedule.forEach(item => {
      const w = item.week || Math.ceil(item.day / 7);
      if (!grouped[w]) grouped[w] = [];
      grouped[w].push(item);
    });
    return Object.values(grouped);
  }, [schedule]);

  if (!calendar && !loading) {
    return (
      <div className="tab-content center-content">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="empty-state" 
          style={{ maxWidth: 600 }}
        >
          <div className="empty-state-icon" style={{ background: 'var(--accent-primary)15', color: 'var(--accent-primary)' }}>
            <CalendarIcon size={32} />
          </div>
          <h3>The Production Clock</h3>
          <p>Transform your concept into a high-fidelity 30-day algorithmic assault. Schedule with military precision.</p>
          <button onClick={() => regenerateSection('calendar')} className="shiny-button" style={{ marginTop: 24, padding: '16px 32px' }}>
            <Sparkles size={18} /> Build 30-Day Strategy
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="tab-content">
      <div className="tab-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20 }}>
        <div>
          <h2 className="tab-title text-gradient">Content Choreography</h2>
          <p className="tab-subtitle">30-day performance roadmap & distribution intelligence for {topic}</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <div className="view-switcher" style={{ background: 'var(--bg-tertiary)', padding: 4, borderRadius: 12, border: '1px solid var(--border-subtle)', display: 'flex' }}>
             {['timeline', 'audit'].map(v => (
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
                  {v}
                </button>
             ))}
          </div>
          <button onClick={() => regenerateSection('calendar')} className="btn-secondary" style={{ padding: '8px 16px' }}><RefreshCw size={18} /></button>
          <ExportButton section="calendar" data={calendar} />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeView === 'timeline' ? (
          <motion.div 
            key="timeline"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 32 }}
          >
            {weeks.map((week, wIdx) => (
              <div key={wIdx} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div className="badge badge-purple" style={{ padding: '6px 16px', fontWeight: 900 }}>WEEK {wIdx + 1}</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-secondary)' }}>{week[0]?.theme}</div>
                 </div>
                 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
                   {week.map((day, dIdx) => {
                     const Icon = PLATFORM_ICONS[day.platform] || PLATFORM_ICONS.Default;
                     return (
                       <motion.div 
                         key={dIdx} 
                         whileHover={{ y: -5, borderColor: 'var(--accent-primary)40' }}
                         className="card" 
                         style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12, minHeight: 220, background: 'var(--bg-secondary)' }}
                       >
                         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 950, color: 'var(--text-tertiary)' }}>D{day.day}</span>
                            <div style={{ padding: 6, borderRadius: 8, background: 'var(--bg-tertiary)', color: 'var(--accent-primary)' }}>
                               <Icon size={14} />
                            </div>
                         </div>
                         <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
                            <div style={{ fontSize: '0.9rem', fontWeight: 800, lineHeight: 1.4, color: 'var(--text-primary)' }}>
                               {day.hook}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', lineHeight: 1.5 }}>
                               {day.description}
                            </div>
                         </div>
                         
                         <div style={{ marginTop: 'auto', paddingTop: 12, borderTop: '1px solid var(--border-subtle)' }}>
                            {day.optimization ? (
                              <div style={{ background: 'var(--accent-success)05', padding: 8, borderRadius: 10, border: '1px solid var(--accent-success)20' }}>
                                 <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--accent-success)', fontSize: '0.65rem', fontWeight: 900 }}>
                                    <Clock size={12} /> {day.optimization.peakWindows[0].time}
                                 </div>
                                 <div style={{ fontSize: '0.6rem', color: 'var(--text-tertiary)', marginTop: 2, fontWeight: 700 }}>{day.optimization.peakWindows[0].reachPotential}% POTENTIAL</div>
                              </div>
                            ) : (
                              <button 
                                onClick={() => handleOptimizeTime(day.day, day.platform)}
                                disabled={optimizingDay === day.day}
                                className="btn-ghost" 
                                style={{ width: '100%', fontSize: '0.7rem', padding: '6px' }}
                              >
                                 {optimizingDay === day.day ? <RefreshCw size={12} className="spin" /> : 'Optimize Time'}
                              </button>
                            )}
                         </div>
                       </motion.div>
                     );
                   })}
                 </div>
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            key="audit"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 24 }}
          >
            <div className="card" style={{ padding: 32 }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
                  <PieChartIcon size={20} color="var(--accent-primary)" />
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 900 }}>Strategic Content Mix</h3>
               </div>
               
               <div style={{ width: '100%', height: 320, position: 'relative' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={auditData.length > 0 ? auditData : [{ name: 'Empty', value: 1, color: 'var(--bg-tertiary)' }]}
                        innerRadius={90} outerRadius={120} paddingAngle={8} dataKey="value"
                      >
                        {auditData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                     <div style={{ fontSize: '1.8rem', fontWeight: 950, color: 'var(--accent-primary)' }}>{calendar?.audit?.auditScore || 0}%</div>
                     <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Strategy Score</div>
                  </div>
               </div>
               
               <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 32 }}>
                  {auditData.map((item, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 12, background: 'var(--bg-secondary)', borderRadius: 12 }}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 12, height: 12, borderRadius: 3, background: item.color }} />
                          <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{item.name}</span>
                       </div>
                       <span style={{ fontWeight: 900, color: item.color }}>{item.value}%</span>
                    </div>
                  ))}
               </div>
               <button 
                onClick={handleRunAudit}
                disabled={isAuditing}
                className="shiny-button" 
                style={{ width: '100%', marginTop: 24, padding: 14 }}
               >
                  {isAuditing ? <RefreshCw size={18} className="spin" /> : <Activity size={18} />}
                  <span>{isAuditing ? 'Auditing Blueprint...' : 'Run Content Strategy Audit'}</span>
               </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
               <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="card" 
                  style={{ padding: 32 }}
               >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                     <Target size={22} color="var(--accent-warning)" />
                     <h3 style={{ fontSize: '1.1rem', fontWeight: 900 }}>Strategic Roadmap</h3>
                  </div>
                  {calendar?.audit ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                       <div style={{ padding: 24, background: 'var(--bg-tertiary)', borderRadius: 16, border: '1px solid var(--border-subtle)' }}>
                          <div style={{ fontSize: '0.65rem', fontWeight: 900, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: 12, letterSpacing: '0.05em' }}>AI Recommendation</div>
                          <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.6, fontWeight: 500 }}>{calendar.audit.recommendation}</p>
                       </div>

                       <div style={{ padding: 24, background: 'var(--accent-warning)05', borderRadius: 16, border: '1px solid var(--accent-warning)20' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                             <Sparkles size={16} color="var(--accent-warning)" />
                             <span style={{ fontSize: '0.65rem', fontWeight: 900, color: 'var(--accent-warning)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>The Growth Lever</span>
                          </div>
                          <p style={{ margin: 0, fontSize: '1rem', color: 'var(--text-primary)', fontWeight: 700, fontStyle: 'italic' }}>{calendar.audit.nextProjectSuggestion}</p>
                       </div>
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-tertiary)' }}>
                       <BarChart3 size={40} style={{ opacity: 0.1, marginBottom: 16 }} />
                       <p style={{ fontSize: '0.9rem' }}>Initialize audit to generate strategy insights</p>
                    </div>
                  )}
               </motion.div>

               <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="card card-full" 
                 style={{ padding: 32, background: 'var(--accent-primary)', color: '#fff', border: 'none' }}
               >
                  <Activity size={32} style={{ marginBottom: 16, opacity: 0.8 }} />
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: 8 }}>Dynamic Saturation Awareness</h3>
                  <p style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: 0, lineHeight: 1.6 }}>
                     Your strategy indicates a 42% niche overlap for Week 3. High-velocity personal narratives are recommended for Day 18 to break competitive friction.
                  </p>
               </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
