import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, Folder, Trash2, ArrowRight, Loader, Search, 
  History as HistoryIcon, Layers, ChevronRight, Info,
  Sparkles, Activity, Target, Briefcase, Calendar,
  RefreshCw, Database
} from 'lucide-react';
import { useCreator } from '../context/CreatorContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { dbService } from '../services/dbService.js';
import { useToast } from '../context/ToastContext.jsx';

export default function HistoryTab() {
  const { user } = useAuth();
  const { loadProject, currentProjectId, activeWorkspace, workspaces } = useCreator();
  const { addToast } = useToast();
  
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const teamId = activeWorkspace !== 'personal' ? activeWorkspace : null;
      const data = await dbService.getProjects(user.id, teamId);
      setProjects(data);
    } catch (err) {
      console.error('History load failed:', err);
      addToast('error', 'Chronicle failed to load.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [user, activeWorkspace]);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!confirm('Decommission this chronicle entry?')) return;
    try {
      await dbService.deleteProject(id);
      setProjects(prev => prev.filter(p => p.id !== id));
      addToast('success', 'Project decommissioned.');
    } catch (err) {
      addToast('error', 'Decommission failed.');
    }
  };

  const handleSelect = async (id) => {
    addToast('info', 'Synchronizing snapshot...');
    await loadProject(id);
    addToast('success', 'Project synchronization complete.');
  };

  if (loading) return (
     <div className="tab-content center-content" style={{ minHeight: '60vh' }}>
        <RefreshCw size={48} className="animate-spin" color="var(--accent-primary)" />
     </div>
  );

  const currentWorkspaceName = workspaces.find(w => w.id === activeWorkspace)?.name || 'Project History';

  return (
    <div className="tab-content animate-slide-up">
      <div className="tab-header" style={{ marginBottom: 40 }}>
        <div className="stagger-children">
          <h2 className="tab-title text-gradient-aurora" style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.04em' }}>Intelligence Archives</h2>
          <p className="tab-subtitle" style={{ fontSize: '1.1rem' }}>Chronological snapshots of creative evolution in {currentWorkspaceName}</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
           <div className="glass" style={{ padding: '8px 20px', borderRadius: 100, fontSize: '0.8rem', fontWeight: 900, color: 'var(--accent-primary)', background: 'rgba(0, 212, 255, 0.05)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Database size={14} />
              <span>{projects.length} SNAPSHOTS</span>
           </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {projects.length === 0 ? (
          <motion.div 
            key="empty"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="center-content" 
            style={{ minHeight: '400px' }}
          >
            <div className="glass glass-hover" style={{ padding: 48, borderRadius: 32, textAlign: 'center', maxWidth: 480 }}>
              <Folder size={48} style={{ marginBottom: 24, opacity: 0.2, margin: '0 auto 24px' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: 16 }}>Archives Silent</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>Initialize your first content cycle to materialize intelligence snapshots.</p>
            </div>
          </motion.div>
        ) : (
          <motion.div 
             key="grid"
             layout
             className="stagger-children" 
             style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 28 }}
          >
            {projects.map(project => (
              <motion.div
                key={project.id}
                layout
                whileHover={{ y: -8 }}
                onClick={() => handleSelect(project.id)}
                className={`glass glass-hover ${currentProjectId === project.id ? 'glass-strong' : ''}`}
                style={{ 
                  padding: 32, cursor: 'pointer', borderRadius: 32, position: 'relative',
                  border: currentProjectId === project.id ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                   <div className="glow-border" style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--bg-tertiary)', color: currentProjectId === project.id ? 'var(--accent-primary)' : 'var(--accent-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Briefcase size={22} />
                   </div>
                   {currentProjectId === project.id && (
                     <div className="glass" style={{ padding: '6px 14px', borderRadius: 100, fontSize: '0.65rem', fontWeight: 950, color: 'var(--accent-primary)', background: 'rgba(0, 212, 255, 0.1)' }}>ACTIVE SESSION</div>
                   )}
                </div>

                <h3 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: 16, lineHeight: 1.2 }}>
                   {project.topic}
                </h3>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 800, marginBottom: 32 }}>
                   <Calendar size={12} />
                   <span>ARCHIVED {new Date(project.updated_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 20, borderTop: '1px solid var(--border-subtle)' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--accent-primary)', fontSize: '0.85rem', fontWeight: 900 }}>
                      <span>Saturate Session</span>
                      <ChevronRight size={16} />
                   </div>
                   
                   <button 
                     onClick={(e) => handleDelete(e, project.id)}
                     className="glass-hover"
                     style={{ padding: '8px', color: 'var(--text-tertiary)', border: 'none', background: 'transparent', borderRadius: 8, cursor: 'pointer' }}
                   >
                     <Trash2 size={16} />
                   </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
