import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, Folder, Trash2, ArrowRight, Loader, Search, 
  History as HistoryIcon, Layers, ChevronRight, Info,
  Sparkles, Activity, Target, Briefcase, Calendar
} from 'lucide-react';
import { useCreator } from '../context/CreatorContext';
import { useAuth } from '../context/AuthContext';
import { dbService } from '../services/dbService';
import { useToast } from '../context/ToastContext';

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
     <div className="tab-content center-content">
        <div style={{ textAlign: 'center' }}>
           <Loader size={48} className="spin" color="var(--accent-primary)" style={{ opacity: 0.2, marginBottom: 24 }} />
           <p style={{ color: 'var(--text-tertiary)' }}>Fetching workspace chronicles...</p>
        </div>
     </div>
  );

  const currentWorkspaceName = workspaces.find(w => w.id === activeWorkspace)?.name || 'Project History';

  return (
    <div className="tab-content">
      <div className="tab-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20 }}>
        <div>
          <h2 className="tab-title text-gradient">{currentWorkspaceName}</h2>
          <p className="tab-subtitle">Archive of creative intelligence snapshots for this workspace</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
           <div className="badge badge-primary" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <HistoryIcon size={14} />
              <span>{projects.length} Snapshots</span>
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
            <div style={{ textAlign: 'center' }}>
              <Folder size={48} className="opacity-10" style={{ marginBottom: 24 }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-tertiary)' }}>The Archives Are Silent</h3>
              <p style={{ color: 'var(--text-tertiary)' }}>Initialize your first content cycle to build a history.</p>
            </div>
          </motion.div>
        ) : (
          <motion.div 
             key="grid"
             layout
             className="stagger-children" 
             style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}
          >
            {projects.map(project => (
              <motion.div
                key={project.id}
                layout
                whileHover={{ y: -8, borderColor: currentProjectId === project.id ? 'var(--accent-primary)' : 'var(--accent-primary)30' }}
                onClick={() => handleSelect(project.id)}
                className="card"
                style={{ 
                  padding: 32, cursor: 'pointer', transition: 'all 0.3s', position: 'relative',
                  background: currentProjectId === project.id ? 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--accent-primary)05 100%)' : 'var(--bg-secondary)',
                  border: currentProjectId === project.id ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                   <div style={{ padding: 10, borderRadius: 12, background: 'var(--bg-tertiary)', color: currentProjectId === project.id ? 'var(--accent-primary)' : 'var(--accent-secondary)' }}>
                      <Briefcase size={20} />
                   </div>
                   {currentProjectId === project.id && (
                     <div className="badge badge-primary" style={{ fontSize: '0.65rem', fontWeight: 900 }}>ACTIVE SESSION</div>
                   )}
                </div>

                <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: 16, lineHeight: 1.3, height: 68, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                   {project.topic}
                </h3>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 700, marginBottom: 32 }}>
                   <Calendar size={12} />
                   <span>ARCHIVED {new Date(project.updated_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 20, borderTop: '1px solid var(--border-subtle)' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--accent-primary)', fontSize: '0.8rem', fontWeight: 800 }}>
                      <span>Saturate Session</span>
                      <ChevronRight size={14} />
                   </div>
                   
                   <button 
                     onClick={(e) => handleDelete(e, project.id)}
                     className="btn-secondary"
                     style={{ padding: '8px', color: 'var(--text-tertiary)', border: 'none' }}
                     title="Decommission Snapshot"
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
