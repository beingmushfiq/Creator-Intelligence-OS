import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, Target, Zap, CheckCircle2, TrendingUp, 
  Clock, Sparkles, Layers, 
  RefreshCw, Coffee, MessageSquare, 
  ChevronRight, Rocket, User, BarChart, 
  ListTodo, Database, HeartPulse
} from 'lucide-react';
import { useCreator } from '../context/CreatorContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { getCommunityPulse } from '../engine/aiService.js';
import { dbService } from '../services/dbService.js';

export default function DashboardTab() {
  const { user } = useAuth();
  const { topic, activeWorkspace, workspaces } = useCreator();
  const [stats, setStats] = useState({ 
    totalProjects: 0, 
    activeTasks: 0, 
    engagement: 0,
    health: 98
  });
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const teamId = activeWorkspace !== 'personal' ? activeWorkspace : null;
      const projects = await dbService.getProjects(user.id, teamId);
      const tasks = await dbService.getTasks(user.id);
      
      setStats({
        totalProjects: projects.length,
        activeTasks: tasks.filter(t => t.status !== 'done').length,
        engagement: 84,
        health: 92
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadDashboard(); }, [user, activeWorkspace]);

  if (loading) return (
     <div className="tab-content center-content" style={{ minHeight: '60vh' }}>
        <RefreshCw size={48} className="animate-spin" color="var(--accent-primary)" />
     </div>
  );

  const currentWorkspaceName = workspaces.find(w => w.id === activeWorkspace)?.name || 'Executive Suite';

  return (
    <div className="tab-content animate-slide-up">
      <div className="tab-header" style={{ marginBottom: 48 }}>
        <div className="stagger-children">
          <h2 className="tab-title text-gradient-aurora" style={{ fontSize: '3rem', fontWeight: 950, letterSpacing: '-0.04em' }}>Command Center</h2>
          <p className="tab-subtitle" style={{ fontSize: '1.2rem' }}>Ecosystem oversight & operational synchronization for {currentWorkspaceName}</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={loadDashboard} className="btn-secondary" style={{ padding: '12px' }}>
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="stagger-children" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 28, marginBottom: 48 }}>
        <KpiCard icon={Database} label="Intelligence Snapshots" value={stats.totalProjects} color="var(--accent-primary)" />
        <KpiCard icon={ListTodo} label="Pending Protocols" value={stats.activeTasks} color="var(--accent-secondary)" />
        <KpiCard icon={Rocket} label="Execution Velocity" value={`${stats.engagement}%`} color="var(--accent-success)" />
        <KpiCard icon={HeartPulse} label="Neural Health" value={`${stats.health}%`} color="var(--accent-warning)" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 28 }}>
        
        {/* Active Project Overview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
           <div className="glass glass-hover" style={{ padding: 40, borderRadius: 32, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', right: -20, top: -20, opacity: 0.1 }}>
                 <Rocket size={160} color="var(--accent-primary)" />
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
                 <div className="glow-border" style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--bg-tertiary)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Activity size={22} />
                 </div>
                 <h3 style={{ fontSize: '1.3rem', fontWeight: 900 }}>Current Trajectory</h3>
              </div>

              {topic ? (
                <div>
                   <h2 style={{ fontSize: '2rem', fontWeight: 950, marginBottom: 16, lineHeight: 1.2 }}>{topic}</h2>
                   <div style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
                      <span className="glass" style={{ padding: '6px 14px', borderRadius: 100, fontSize: '0.7rem', fontWeight: 900, color: 'var(--accent-primary)' }}>PRODUCTION PHASE</span>
                      <span className="glass" style={{ padding: '6px 14px', borderRadius: 100, fontSize: '0.7rem', fontWeight: 900, color: 'var(--accent-secondary)' }}>AI OPTIMIZED</span>
                   </div>
                   
                   <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                      <div className="glass" style={{ padding: 24, borderRadius: 20 }}>
                         <span style={{ fontSize: '0.65rem', fontWeight: 900, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: 10 }}>Est. Retention</span>
                         <div style={{ fontSize: '1.5rem', fontWeight: 950, color: 'var(--accent-success)' }}>84%</div>
                      </div>
                      <div className="glass" style={{ padding: 24, borderRadius: 20 }}>
                         <span style={{ fontSize: '0.65rem', fontWeight: 900, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: 10 }}>Viral Index</span>
                         <div style={{ fontSize: '1.5rem', fontWeight: 950, color: 'var(--accent-primary)' }}>0.92</div>
                      </div>
                   </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                   <p style={{ color: 'var(--text-tertiary)', fontWeight: 800 }}>No active operational loop. Start a new build to see telemetry.</p>
                </div>
              )}
           </div>

           <div className="glass" style={{ padding: 40, borderRadius: 32 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <Layers size={22} color="var(--accent-secondary)" />
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 900 }}>Operational Milestones</h3>
                 </div>
                 <ChevronRight size={20} style={{ opacity: 0.3 }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                 <MilestoneItem label="Neural Scripting Alignment" status="done" />
                 <MilestoneItem label="Viral Variant Forging" status="processing" />
                 <MilestoneItem label="Ecosystem Node Sync" status="pending" />
              </div>
           </div>
        </div>

        {/* Sidebar Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
           <div className="glass" style={{ padding: 32, borderRadius: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
                 <Sparkles size={22} color="var(--accent-warning)" />
                 <h3 style={{ fontSize: '1.1rem', fontWeight: 900 }}>AI Performance Coach</h3>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 24 }}>
                 "Your last workspace session showed a 12% increase in retention pacing. Recommend applying the 'Visual Retention DNA' module to current trajectory."
              </p>
              <button className="btn-secondary" style={{ width: '100%', padding: '12px' }}>
                 <span>Deploy Insight</span>
              </button>
           </div>

           <div className="glass glass-hover" style={{ padding: 32, borderRadius: 28, background: 'var(--gradient-primary)05', border: '1px solid var(--accent-primary)20' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                 <Zap size={18} color="var(--accent-primary)" />
                 <span style={{ fontSize: '0.7rem', fontWeight: 950, color: 'var(--accent-primary)', textTransform: 'uppercase' }}>Quick Action</span>
              </div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 900, marginBottom: 12 }}>Regenerate Marketing Arc</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginBottom: 20 }}>Refresh your monetization strategy based on latest market trends.</p>
              <button className="btn-primary" style={{ width: '100%', padding: '12px' }}>
                 <RefreshCw size={14} />
                 <span>Execute Refresh</span>
              </button>
           </div>
        </div>

      </div>
    </div>
  );
}

function KpiCard({ icon: Icon, label, value, color }) {
   return (
      <motion.div whileHover={{ y: -8 }} className="glass glass-hover" style={{ padding: 32, borderRadius: 28 }}>
         <div className="glow-border" style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--bg-tertiary)', color: color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
            <Icon size={20} />
         </div>
         <div style={{ fontSize: '2rem', fontWeight: 950, marginBottom: 4 }}>{value}</div>
         <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</div>
      </motion.div>
   );
}

function MilestoneItem({ label, status }) {
   const colors = {
      done: 'var(--accent-success)',
      processing: 'var(--accent-primary)',
      pending: 'var(--text-tertiary)'
   };
   
   return (
      <div className="glass" style={{ padding: '16px 20px', borderRadius: 16, display: 'flex', alignItems: 'center', gap: 16 }}>
         <div style={{ width: 10, height: 10, borderRadius: '50%', background: colors[status], boxShadow: status !== 'pending' ? `0 0 10px ${colors[status]}` : 'none' }} />
         <span style={{ flex: 1, fontSize: '0.95rem', fontWeight: 700, opacity: status === 'pending' ? 0.5 : 1 }}>{label}</span>
         {status === 'processing' && <RefreshCw size={14} className="animate-spin" color="var(--accent-primary)" />}
         {status === 'done' && <CheckCircle2 size={14} color="var(--accent-success)" />}
      </div>
   );
}
