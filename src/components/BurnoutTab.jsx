import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Battery, Coffee, RefreshCcw, AlertTriangle, CheckCircle2, 
  Brain, Calendar, ArrowRight, TrendingDown, Wind, 
  Zap, Sparkles, Activity, ShieldAlert, Heart, Info,
  ChevronRight, Timer
} from 'lucide-react';
import { useCreator } from '../context/CreatorContext.jsx';
import { analyzeWorkload, getEvergreenRecycleIdeas } from '../engine/aiService';

export default function BurnoutTab() {
  const { data, topic } = useCreator();
  const [report, setReport] = useState(null);
  const [recycleIdeas, setRecycleIdeas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSustainabilityData = async () => {
      setLoading(true);
      try {
        const mockHistory = [
          { date: '2024-02-20', projects: 2, difficulty: 'High' },
          { date: '2024-02-21', projects: 1, difficulty: 'Medium' },
          { date: '2024-02-22', projects: 3, difficulty: 'High' },
          { date: '2024-02-23', projects: 1, difficulty: 'Low' },
        ];
        
        const [workloadReport, ideas] = await Promise.all([
          analyzeWorkload(mockHistory),
          getEvergreenRecycleIdeas([{ topic: topic, performance: '98%' }, { topic: 'Social Media Psychology', performance: '92%' }])
        ]);

        setReport(workloadReport);
        setRecycleIdeas(ideas || []);
      } catch (err) {
        console.error('Sustainability data failed:', err);
      } finally {
        setLoading(false);
      }
    };
    loadSustainabilityData();
  }, [topic]);

  if (loading) {
    return (
      <div className="tab-content center-content">
        <div style={{ textAlign: 'center' }}>
          <RefreshCcw size={48} className="spin" color="var(--accent-primary)" style={{ marginBottom: 24 }} />
          <h3 className="text-gradient" style={{ fontSize: '1.5rem', fontWeight: 800 }}>Analyzing Creative Battery</h3>
          <p style={{ color: 'var(--text-tertiary)' }}>Mapping production velocity & burnout signals...</p>
        </div>
      </div>
    );
  }

  const getRiskColor = () => {
    if (report?.riskLevel === 'Low') return 'var(--accent-success)';
    if (report?.riskLevel === 'Moderate') return 'var(--accent-warning)';
    return 'var(--accent-danger)';
  };

  return (
    <div className="tab-content">
      <div className="tab-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20 }}>
        <div>
          <h2 className="tab-title text-gradient">Longevity Laboratory</h2>
          <p className="tab-subtitle">AI-powered workload sustainability & creative recovery intelligence</p>
        </div>
        <div className="badge badge-primary" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
           <Heart size={14} />
           <span>System Health: Optimal</span>
        </div>
      </div>

      <div className="stagger-children" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        
        {/* Hero Sustainability Trackers */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
           <motion.div 
             whileHover={{ y: -5 }}
             className="card" 
             style={{ padding: 32, borderTop: '4px solid var(--accent-primary)', background: 'var(--bg-secondary)' }}
           >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                 <div style={{ padding: 8, borderRadius: 10, background: 'var(--accent-primary)15', color: 'var(--accent-primary)' }}>
                    <Battery size={20} />
                 </div>
                 <h4 style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Content Buffer</h4>
              </div>
              <div style={{ fontSize: '3rem', fontWeight: 950, marginBottom: 8 }}>{report?.bufferDays || 0}<span style={{ fontSize: '1.2rem', color: 'var(--text-tertiary)', marginLeft: 8 }}>DAYS</span></div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 20 }}>Estimated production safety net before gap.</p>
              <div style={{ height: 10, background: 'var(--bg-tertiary)', borderRadius: 5, overflow: 'hidden' }}>
                 <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min((report?.bufferDays || 0) * 10, 100)}%` }} style={{ height: '100%', background: 'var(--accent-primary)' }} />
              </div>
           </motion.div>

           <motion.div 
             whileHover={{ y: -5 }}
             className="card" 
             style={{ padding: 32, borderTop: '4px solid var(--accent-secondary)', background: 'var(--bg-secondary)' }}
           >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                 <div style={{ padding: 8, borderRadius: 10, background: 'var(--accent-secondary)15', color: 'var(--accent-secondary)' }}>
                    <Brain size={20} />
                 </div>
                 <h4 style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Cognitive Load</h4>
              </div>
              <div style={{ fontSize: '3rem', fontWeight: 950, marginBottom: 8 }}>{report?.loadScore || 0}<span style={{ fontSize: '1.2rem', color: 'var(--text-tertiary)', marginLeft: 8 }}>%</span></div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 20 }}>Mental intensity of the current active cycle.</p>
              <div style={{ height: 10, background: 'var(--bg-tertiary)', borderRadius: 5, overflow: 'hidden' }}>
                 <motion.div initial={{ width: 0 }} animate={{ width: `${report?.loadScore || 0}%` }} style={{ height: '100%', background: 'var(--accent-secondary)' }} />
              </div>
           </motion.div>

           <motion.div 
             whileHover={{ y: -5 }}
             className="card" 
             style={{ padding: 32, borderTop: `4px solid ${getRiskColor()}`, background: 'var(--bg-secondary)' }}
           >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                 <div style={{ padding: 8, borderRadius: 10, background: `${getRiskColor()}15`, color: getRiskColor() }}>
                    <ShieldAlert size={20} />
                 </div>
                 <h4 style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Burnout Risk</h4>
              </div>
              <div style={{ fontSize: '3rem', fontWeight: 950, marginBottom: 8, color: getRiskColor() }}>{report?.riskLevel || 'Unknown'}</div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 20 }}>AI-detected exhaustion signal in output velocity.</p>
              <div style={{ display: 'flex', gap: 8 }}>
                 {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} style={{ flex: 1, height: 10, borderRadius: 5, background: i <= (report?.riskLevel === 'Low' ? 1 : report?.riskLevel === 'Moderate' ? 3 : 5) ? getRiskColor() : 'var(--bg-tertiary)' }} />
                 ))}
              </div>
           </motion.div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 24 }}>
           {/* Protocols */}
           <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="card" style={{ padding: 32 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
                 <div style={{ padding: 10, borderRadius: 12, background: 'var(--accent-warning)15', color: 'var(--accent-warning)' }}>
                    <Coffee size={24} />
                 </div>
                 <h3 style={{ fontSize: '1.2rem', fontWeight: 900 }}>Sustainability Protocol</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                 {report?.tips?.map((tip, i) => (
                    <div key={i} style={{ display: 'flex', gap: 20, padding: 20, background: 'var(--bg-secondary)', borderRadius: 16, border: '1px solid var(--border-subtle)' }}>
                       <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--accent-warning)15', color: 'var(--accent-warning)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 900, flexShrink: 0 }}>
                          {i + 1}
                       </div>
                       <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>{tip}</p>
                    </div>
                 ))}
              </div>
           </motion.div>

           {/* Evergreen Recycler */}
           <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="card" style={{ padding: 32 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
                 <div style={{ padding: 10, borderRadius: 12, background: 'var(--accent-primary)15', color: 'var(--accent-primary)' }}>
                    <RefreshCcw size={24} />
                 </div>
                 <h3 style={{ fontSize: '1.2rem', fontWeight: 900 }}>Evergreen Recycler</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                 {recycleIdeas.map((idea, i) => (
                    <motion.div 
                      key={i} 
                      whileHover={{ scale: 1.01, borderColor: 'var(--accent-primary)50' }}
                      style={{ padding: 24, background: 'var(--bg-secondary)', borderRadius: 20, border: '1px solid var(--border-subtle)', cursor: 'pointer', transition: 'border-color 0.2s' }}
                    >
                       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                          <span style={{ fontSize: '0.65rem', fontWeight: 950, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Source: {idea.originalTopic}</span>
                          <div className="badge badge-primary" style={{ fontSize: '0.65rem', fontWeight: 900 }}>{idea.complexity.toUpperCase()} ENERGY</div>
                       </div>
                       <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>{idea.recycleAngle}</h4>
                       <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--accent-primary)', fontSize: '0.8rem', fontWeight: 800 }}>
                          <span>Initialize Repurpose</span>
                          <ChevronRight size={14} />
                       </div>
                    </motion.div>
                 ))}
              </div>
           </motion.div>
        </div>

        {/* Deep Breath Zone */}
        <motion.div 
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           className="card card-full" 
           style={{ 
             padding: '50px 70px', 
             background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--bg-card) 100%)',
             color: '#fff', border: 'none', position: 'relative', overflow: 'hidden',
             display: 'flex', alignItems: 'center', gap: 60, flexWrap: 'wrap'
           }}
        >
           <div style={{ position: 'absolute', right: -60, bottom: -60, opacity: 0.1 }}>
              <Wind size={360} />
           </div>

           <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                 <Timer size={32} />
                 <span style={{ fontSize: '0.85rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Serenity Protocol Active</span>
              </div>
              <h3 style={{ fontSize: '2.5rem', fontWeight: 950, marginBottom: 16, lineHeight: 1.1 }}>Deep Breath Protocol</h3>
              <p style={{ fontSize: '1.2rem', opacity: 0.9, marginBottom: 32, maxWidth: 600, lineHeight: 1.5 }}>
                 High-intensity production signals detected for 4 consecutive days. <strong>{report?.analysis || "Reset your cognitive baseline with a structured creative breather."}</strong>
              </p>
              <div style={{ display: 'flex', gap: 20 }}>
                 <button className="shiny-button" style={{ background: '#fff', color: 'var(--accent-primary)', padding: '16px 40px', fontSize: '1rem', fontWeight: 900, border: 'none' }}>
                    Start Guided Break
                 </button>
                 <button className="btn-secondary" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', padding: '16px 40px', fontSize: '1rem', fontWeight: 900, border: '1px solid rgba(255,255,255,0.2)' }}>
                    Log Production Rest
                 </button>
              </div>
           </div>
        </motion.div>
      </div>
    </div>
  );
}
