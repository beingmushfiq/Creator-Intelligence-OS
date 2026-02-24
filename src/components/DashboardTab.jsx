import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, Target, FileText, Zap, CheckCircle2, TrendingUp, 
  ArrowRight, Clock, Layout, Sparkles, Layers, Play, 
  RefreshCw, Coffee, AlertTriangle, MessageSquare, 
  ChevronRight, Brain, Briefcase, Rocket, ShieldCheck
} from 'lucide-react';
import { useCreator } from '../context/CreatorContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { getCommunityPulse } from '../engine/aiService.js';
import { dbService } from '../services/dbService.js';

export default function DashboardTab() {
  const { 
    topic, data, currentProjectId, setActiveTab, 
    batchQueue, processBatch, loading: creatorLoading,
    workload, analyzeWorkloadData
  } = useCreator();
  const { user } = useAuth();
  
  const [pulse, setPulse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const loadDashboard = async () => {
      if (!currentProjectId || !topic) {
        setLoading(false);
        return;
      }
      try {
        const [taskData, pulseData] = await Promise.all([
          dbService.getTasks(currentProjectId),
          getCommunityPulse(topic, data)
        ]);
        setTasks(taskData);
        setPulse(pulseData);
      } catch (err) {
        console.error('Snapshot failed:', err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
    if (!workload && topic) analyzeWorkloadData();
  }, [currentProjectId, topic, data, workload, analyzeWorkloadData]);

  if (!currentProjectId) {
    return (
      <div className="tab-content center-content" style={{ minHeight: '60vh' }}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ textAlign: 'center', maxWidth: 500 }}
        >
          <Target size={64} color="var(--accent-primary)" style={{ marginBottom: 32, opacity: 0.8 }} />
          <h2 className="tab-title text-gradient" style={{ fontSize: '2.5rem' }}>The Command Center</h2>
          <p className="tab-subtitle" style={{ fontSize: '1.2rem', marginTop: 16 }}>
             Your project's high-fidelity intelligence and production pulse will synchronize here once you initiate a mission.
          </p>
          <button className="shiny-button" style={{ marginTop: 40, padding: '16px 48px' }} onClick={() => document.querySelector('input')?.focus()}>
            Initiate Project Alpha
          </button>
        </motion.div>
      </div>
    );
  }

  const completedTasks = tasks.filter(t => t.status === 'done').length;
  const progress = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  return (
    <div className="tab-content">
      <div className="tab-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20 }}>
        <div>
          <h2 className="tab-title text-gradient">Executive Mission Control</h2>
          <p className="tab-subtitle">Unified project synchronization & algorithmic pulse for {topic}</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <div className="badge badge-purple" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Activity size={14} />
            <span>Health Score: {pulse?.healthScore || 0}%</span>
          </div>
        </div>
      </div>

      <div className="stagger-children" style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        
        {/* Project Intelligence Hub */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="card card-full" 
          style={{ 
            padding: 40, background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%)',
            display: 'flex', flexWrap: 'wrap', gap: 40, border: '1px solid var(--border-medium)'
          }}
        >
          <div style={{ flex: 1, minWidth: 320 }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <Rocket size={24} color="var(--accent-primary)" />
                <h3 style={{ fontSize: '1.8rem', fontWeight: 950 }}>{topic}</h3>
             </div>
             <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 32 }}>
                {pulse?.summary || "Project intelligence synchronized. Complete specialized modules to unlock executive insights."}
             </p>
             <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {pulse?.insights?.map((insight, i) => (
                  <div key={i} style={{ fontSize: '0.75rem', fontWeight: 800, padding: '6px 16px', background: 'var(--bg-primary)', borderRadius: 20, color: 'var(--text-tertiary)', border: '1px solid var(--border-subtle)' }}>
                    • {insight}
                  </div>
                ))}
             </div>
          </div>
          
          <div style={{ width: 340, flexShrink: 0, padding: 32, background: 'var(--bg-primary)', borderRadius: 24, border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: 20 }}>
             <h4 style={{ fontSize: '0.9rem', fontWeight: 950, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>System Diagnostics</h4>
             
             {data?.community && (
               <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700 }}>
                     <span style={{ color: 'var(--accent-success)' }}>Community Resonance</span>
                     <span>{data.community.healthMetric.score}%</span>
                  </div>
                  <div style={{ height: 6, background: 'var(--bg-tertiary)', borderRadius: 3, overflow: 'hidden' }}>
                     <motion.div initial={{ width: 0 }} animate={{ width: `${data.community.healthMetric.score}%` }} style={{ height: '100%', background: 'var(--accent-success)' }} />
                  </div>
               </div>
             )}

             {data?.performance && (
               <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700 }}>
                     <span style={{ color: 'var(--accent-primary)' }}>Predicted Velocity</span>
                     <span>{data.performance.velocityScore}%</span>
                  </div>
                  <div style={{ height: 6, background: 'var(--bg-tertiary)', borderRadius: 3, overflow: 'hidden' }}>
                     <motion.div initial={{ width: 0 }} animate={{ width: `${data.performance.velocityScore}%` }} style={{ height: '100%', background: 'var(--accent-primary)' }} />
                  </div>
               </div>
             )}

             <div style={{ padding: 16, background: 'var(--bg-tertiary)', borderRadius: 16, border: '1px solid var(--border-subtle)', marginTop: 12 }}>
                <div style={{ fontSize: '0.65rem', fontWeight: 900, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: 8 }}>AI Directive</div>
                <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 500, lineHeight: 1.5 }}>{pulse?.recommendation || "Initiate Research Mode to broaden project context."}</p>
             </div>
          </div>
        </motion.div>

        {/* Console Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 24 }}>
           
           {/* Strategy Console */}
           <motion.div whileHover={{ y: -5, borderColor: 'var(--accent-primary)' }} className="card" style={{ padding: 32 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Target size={22} color="var(--accent-primary)" />
                    <h4 style={{ fontSize: '1.2rem', fontWeight: 900 }}>Strategy Engine</h4>
                 </div>
                 <button className="btn-ghost-sm" onClick={() => setActiveTab('strategy')}><ChevronRight size={16} /></button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                 {data?.narrative ? (
                   <>
                     <div style={{ padding: 16, background: 'var(--bg-tertiary)', borderRadius: 12 }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--accent-primary)', textTransform: 'uppercase' }}>Main Angle</span>
                        <p style={{ margin: '4px 0 0 0', fontWeight: 700 }}>{data.narrative.hook_strategies?.[0]?.angle}</p>
                     </div>
                     <div className="badge badge-purple" style={{ alignSelf: 'flex-start' }}>Tone: {data.tone}</div>
                   </>
                 ) : <p style={{ color: 'var(--text-tertiary)', fontStyle: 'italic' }}>Pending session initialization...</p>}
              </div>
           </motion.div>

           {/* Production Monitor */}
           <motion.div whileHover={{ y: -5, borderColor: 'var(--accent-success)' }} className="card" style={{ padding: 32 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Activity size={22} color="var(--accent-success)" />
                    <h4 style={{ fontSize: '1.2rem', fontWeight: 900 }}>Production Flow</h4>
                 </div>
                 <button className="btn-ghost-sm" onClick={() => setActiveTab('tasks')}><ChevronRight size={16} /></button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 800 }}>
                    <span style={{ color: 'var(--text-tertiary)' }}>Global Progress</span>
                    <span style={{ color: 'var(--accent-success)' }}>{progress}%</span>
                 </div>
                 <div style={{ height: 8, background: 'var(--bg-tertiary)', borderRadius: 4, overflow: 'hidden' }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} style={{ height: '100%', background: 'var(--accent-success)' }} />
                 </div>
                 {tasks.length > 0 && (
                    <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                       {tasks.slice(0, 2).map(task => (
                          <div key={task.id} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.85rem' }}>
                             {task.status === 'done' ? <CheckCircle2 size={14} color="var(--accent-success)" /> : <Clock size={14} color="var(--text-tertiary)" />}
                             <span style={{ textDecoration: task.status === 'done' ? 'line-through' : 'none', color: task.status === 'done' ? 'var(--text-tertiary)' : 'var(--text-primary)' }}>{task.title}</span>
                          </div>
                       ))}
                    </div>
                 )}
              </div>
           </motion.div>

           {/* Multi-Platform Control */}
           <motion.div whileHover={{ y: -5, borderColor: 'var(--accent-secondary)' }} className="card" style={{ padding: 32 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                 <Layers size={22} color="var(--accent-secondary)" />
                 <h4 style={{ fontSize: '1.2rem', fontWeight: 900 }}>Platform Ecosystem</h4>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                 {['Shorts', 'LinkedIn', 'Twitter', 'Blog', 'Email', 'Podcast'].map(p => (
                   <motion.div 
                     key={p} 
                     whileHover={{ scale: 1.05, background: 'var(--bg-secondary)', borderColor: 'var(--accent-secondary)40' }}
                     onClick={() => setActiveTab('viral')}
                     style={{ 
                       padding: '12px 0', background: 'var(--bg-tertiary)', borderRadius: 14, border: '1px solid var(--border-subtle)',
                       fontSize: '0.75rem', fontWeight: 800, textAlign: 'center', cursor: 'pointer', color: 'var(--text-secondary)'
                     }}
                   >
                      {p}
                   </motion.div>
                 ))}
              </div>
           </motion.div>

           {/* Performance Wellness */}
           {workload && (
             <motion.div 
               whileHover={{ y: -5, borderColor: workload.riskLevel === 'Low' ? 'var(--accent-success)' : 'var(--accent-warning)' }}
               className="card" 
               style={{ 
                  padding: 32, background: workload.riskLevel === 'Low' ? 'var(--accent-success)05' : 'var(--accent-warning)05',
                  borderColor: workload.riskLevel === 'Low' ? 'var(--accent-success)20' : 'var(--accent-warning)20'
               }}
               onClick={() => setActiveTab('burnout')}
             >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <Coffee size={22} color={workload.riskLevel === 'Low' ? 'var(--accent-success)' : 'var(--accent-warning)'} />
                      <h4 style={{ fontSize: '1.2rem', fontWeight: 900 }}>Production Health</h4>
                   </div>
                   <div className={`badge badge-${workload.riskLevel === 'Low' ? 'success' : 'warning'}`} style={{ fontWeight: 900 }}>{workload.riskLevel.toUpperCase()} RISK</div>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 20 }}>
                   {workload.tips?.[0]}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--accent-primary)', fontSize: '0.85rem', fontWeight: 800 }}>
                   <span>System Longevity Protocol</span>
                   <ChevronRight size={14} />
                </div>
             </motion.div>
           )}

           {/* Community Snapshot */}
           <motion.div whileHover={{ y: -5, borderColor: 'var(--accent-info)' }} className="card" style={{ padding: 32 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <MessageSquare size={22} color="var(--accent-info)" />
                    <h4 style={{ fontSize: '1.2rem', fontWeight: 900 }}>Engagement Pulse</h4>
                 </div>
                 <div className="badge badge-cyan" style={{ fontWeight: 900 }}>88% POSITIVE</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                 <div style={{ padding: 16, background: 'var(--bg-tertiary)', borderRadius: 16, textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 950 }}>12</div>
                    <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Auto-Drafts</div>
                 </div>
                 <div style={{ padding: 16, background: 'var(--bg-tertiary)', borderRadius: 16, textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 950, color: 'var(--accent-danger)' }}>3</div>
                    <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>High Priority</div>
                 </div>
              </div>
              <button onClick={() => setActiveTab('engagement')} className="btn-ghost" style={{ width: '100%', marginTop: 24, padding: 12, fontSize: '0.85rem' }}>Open Response Oracle</button>
           </motion.div>
           
           {/* Growth Accelerator */}
           <motion.div whileHover={{ y: -5, borderColor: '#a855f7' }} className="card" style={{ padding: 32 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                 <Sparkles size={22} color="#a855f7" />
                 <h4 style={{ fontSize: '1.2rem', fontWeight: 900 }}>Growth Flywheel</h4>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700 }}>
                    <span style={{ color: 'var(--text-tertiary)' }}>Current Velocity</span>
                    <span style={{ color: '#a855f7' }}>+24% DoD</span>
                 </div>
                 <div style={{ padding: 16, background: 'var(--bg-tertiary)', borderRadius: 16, border: '1px solid #a855f720' }}>
                    <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: 1.5, color: 'var(--text-secondary)' }}>
                       Community resonance peaking in Week 2. Deploy <strong>Personal Story</strong> variants for Day 12 to sustain momentum.
                    </p>
                 </div>
              </div>
           </motion.div>

        </div>
      </div>
    </div>
  );
}
