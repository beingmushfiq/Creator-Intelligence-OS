import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  MessageSquare, 
  RefreshCw, 
  FilePlus, 
  User, 
  Clock,
  ArrowRight,
  Sparkles,
  CheckSquare,
  ListTodo,
  Activity,
  ChevronRight
} from 'lucide-react';
import { useCreator } from '../context/CreatorContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { dbService } from '../services/dbService.js';

const TYPE_ICONS = {
  generation: Zap,
  regeneration: RefreshCw,
  comment: MessageSquare,
  asset_creation: FilePlus,
  task_completion: CheckSquare,
  task_generation: ListTodo,
  default: Sparkles
};

const TYPE_COLORS = {
  generation: 'var(--accent-primary)',
  regeneration: 'var(--accent-secondary)',
  comment: 'var(--accent-success)',
  asset_creation: '#8b5cf6',
  task_completion: 'var(--accent-success)',
  task_generation: 'var(--accent-primary)',
  default: 'var(--text-tertiary)'
};

export default function ActivityFeed() {
  const { user } = useAuth();
  const { activeWorkspace, workspaces } = useCreator();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchActivities = async () => {
    if (!user) return;
    const teamId = activeWorkspace !== 'personal' ? activeWorkspace : null;
    try {
      const data = await dbService.getActivityLog(user.id, teamId);
      setActivities(data);
    } catch (err) {
      console.error('Failed to fetch activity log:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
    const interval = setInterval(fetchActivities, 30000);
    return () => clearInterval(interval);
  }, [user, activeWorkspace]);

  if (loading) {
    return (
      <div className="tab-content center-content" style={{ minHeight: '60vh' }}>
        <RefreshCw className="animate-spin" size={48} color="var(--accent-primary)" />
      </div>
    );
  }

  const currentWorkspaceName = workspaces.find(w => w.id === activeWorkspace)?.name || 'Central Workspace';

  return (
    <div className="tab-content animate-slide-up">
      <div className="tab-header" style={{ marginBottom: 40 }}>
        <div className="stagger-children">
          <h2 className="tab-title text-gradient-aurora" style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.04em' }}>Activity Stream</h2>
          <p className="tab-subtitle" style={{ fontSize: '1.1rem' }}>Real-time event logging & recursive workspace intelligence for {currentWorkspaceName}</p>
        </div>
        <button className="btn-secondary" onClick={fetchActivities} style={{ padding: '12px' }}>
          <RefreshCw size={18} />
        </button>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        {activities.length === 0 ? (
          <div className="glass" style={{ textAlign: 'center', padding: 80, borderRadius: 32 }}>
            <div className="glow-border" style={{ 
              width: 80, height: 80, borderRadius: 24, 
              background: 'var(--bg-tertiary)', display: 'flex', 
              alignItems: 'center', justifyContent: 'center', 
              margin: '0 auto 24px' 
            }}>
              <Activity size={40} color="var(--text-tertiary)" />
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: 12 }}>Archives Silent</h3>
            <p style={{ color: 'var(--text-tertiary)', fontSize: '1rem', fontWeight: 600 }}>
              Operational events in this workspace will materialize here.
            </p>
          </div>
        ) : (
          <div className="stagger-children" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <AnimatePresence mode="popLayout">
              {activities.map((item, idx) => {
                const Icon = TYPE_ICONS[item.type] || TYPE_ICONS.default;
                const color = TYPE_COLORS[item.type] || TYPE_COLORS.default;
                
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    whileHover={{ x: 8 }}
                    className="glass glass-hover"
                    style={{ 
                      padding: '20px 28px',
                      display: 'flex',
                      gap: 20,
                      alignItems: 'center',
                      borderRadius: 20,
                      borderLeft: `3px solid ${color}`
                    }}
                  >
                    <div className="glow-border" style={{ 
                      width: 44, height: 44, borderRadius: 12, 
                      background: `${color}10`, display: 'flex', 
                      alignItems: 'center', justifyContent: 'center',
                      color: color, flexShrink: 0
                    }}>
                      <Icon size={20} />
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                        <div style={{ fontSize: '1.05rem', fontWeight: 800 }}>
                          {item.description}
                        </div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--text-tertiary)', background: 'var(--bg-tertiary)', padding: '4px 10px', borderRadius: 8 }}>
                          {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '0.8rem', color: 'var(--text-tertiary)', fontWeight: 700 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <User size={12} />
                          <span>{item.user_email?.split('@')[0].toUpperCase() || 'OPERATOR'}</span>
                        </div>
                        {item.projects?.topic && (
                          <>
                            <ChevronRight size={12} style={{ opacity: 0.3 }} />
                            <div style={{ color: 'var(--accent-primary)', fontWeight: 900, display: 'flex', alignItems: 'center', gap: 6 }}>
                               <Sparkles size={10} />
                               <span>{item.projects.topic}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
