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
  ListTodo
} from 'lucide-react';
import { useCreator } from '../context/CreatorContext';
import { useAuth } from '../context/AuthContext';
import { dbService } from '../services/dbService';

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
  const { activeWorkspace } = useCreator();
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
    // Poll every 30 seconds for new activities
    const interval = setInterval(fetchActivities, 30000);
    return () => clearInterval(interval);
  }, [user, activeWorkspace]);

  if (loading) {
    return (
      <div className="tab-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <RefreshCw className="animate-spin" size={32} color="var(--accent-primary)" />
      </div>
    );
  }

  return (
    <div className="tab-content">
      <div className="tab-header">
        <div>
          <h2 className="tab-title text-gradient">Activity Feed</h2>
          <p className="tab-subtitle">Real-time stream of team actions and workspace intelligence</p>
        </div>
        <button className="btn-ghost" onClick={fetchActivities}>
          <RefreshCw size={16} />
          <span>Refresh</span>
        </button>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        {activities.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ 
              width: 60, height: 60, borderRadius: '50%', 
              background: 'var(--bg-tertiary)', display: 'flex', 
              alignItems: 'center', justifyContent: 'center', 
              margin: '0 auto 16px' 
            }}>
              <Clock size={30} color="var(--text-tertiary)" />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: 8 }}>No activity yet</h3>
            <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>
              Actions taken in this workspace will appear here.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <AnimatePresence mode="popLayout">
              {activities.map((item, idx) => {
                const Icon = TYPE_ICONS[item.type] || TYPE_ICONS.default;
                const color = TYPE_COLORS[item.type] || TYPE_COLORS.default;
                
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="card"
                    style={{ 
                      padding: '16px 20px',
                      display: 'flex',
                      gap: 16,
                      alignItems: 'center',
                      borderLeft: `4px solid ${color}`
                    }}
                  >
                    <div style={{ 
                      width: 40, height: 40, borderRadius: 10, 
                      background: `${color}15`, display: 'flex', 
                      alignItems: 'center', justifyContent: 'center',
                      color: color, flexShrink: 0
                    }}>
                      <Icon size={20} />
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                        <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>
                          {item.description}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', whiteSpace: 'nowrap' }}>
                          {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <User size={12} />
                          <span>{item.user_email?.split('@')[0] || 'Member'}</span>
                        </div>
                        {item.projects?.topic && (
                          <>
                            <ArrowRight size={12} />
                            <div style={{ color: 'var(--accent-primary)', fontWeight: 500 }}>
                              {item.projects.topic}
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
