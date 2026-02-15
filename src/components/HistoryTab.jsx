import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Folder, Trash2, ArrowRight, Loader } from 'lucide-react';
import { useCreator } from '../context/CreatorContext';
import { useAuth } from '../context/AuthContext';
import { dbService } from '../services/dbService';
import { useToast } from '../context/ToastContext';

export default function HistoryTab() {
  const { user } = useAuth();
  const { loadProject, currentProjectId } = useCreator();
  const { addToast } = useToast();
  
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await dbService.getProjects(user.id);
      setProjects(data);
    } catch (err) {
      console.error(err);
      addToast('error', 'Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [user]);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    try {
      await dbService.deleteProject(id);
      setProjects(prev => prev.filter(p => p.id !== id));
      addToast('success', 'Project deleted');
    } catch (err) {
      addToast('error', 'Failed to delete');
    }
  };

  const handleSelect = async (id) => {
    addToast('info', 'Loading project...');
    await loadProject(id);
    addToast('success', 'Project loaded successfully');
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader className="animate-spin text-accent-primary" />
    </div>
  );

  return (
    <div className="history-tab">
      <header className="mb-8">
        <h2 className="text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-text-primary to-text-secondary mb-2">
          Project History
        </h2>
        <p className="text-text-tertiary">
          Your archive of creative intelligence.
        </p>
      </header>

      {projects.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-border-medium rounded-xl">
          <Folder size={48} className="mx-auto text-text-tertiary mb-4" />
          <h3 className="text-xl font-bold text-text-secondary">No projects yet</h3>
          <p className="text-text-tertiary">Start a new session to build your history.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <motion.div
              key={project.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelect(project.id)}
              className={`p-6 rounded-xl border cursor-pointer transition-all group relative overflow-hidden ${
                currentProjectId === project.id 
                  ? 'bg-accent-primary/10 border-accent-primary' 
                  : 'bg-bg-card border-border-subtle hover:border-accent-primary/50'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-bg-tertiary rounded-lg">
                  <Folder size={24} className="text-accent-secondary" />
                </div>
                {currentProjectId === project.id && (
                  <span className="px-2 py-1 text-xs font-bold bg-accent-primary/20 text-accent-primary rounded-full">
                    Active
                  </span>
                )}
              </div>

              <h3 className="text-xl font-bold text-text-primary mb-2 line-clamp-2">
                {project.topic}
              </h3>
              
              <div className="flex items-center gap-2 text-xs text-text-tertiary mb-6">
                <Clock size={12} />
                Updated {new Date(project.updated_at).toLocaleDateString()}
              </div>

              <div className="flex justify-between items-center mt-auto">
                <span className="text-sm font-bold text-accent-primary opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                  Open Project <ArrowRight size={14} />
                </span>
                
                <button 
                  onClick={(e) => handleDelete(e, project.id)}
                  className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-colors text-text-tertiary"
                  title="Delete Project"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
