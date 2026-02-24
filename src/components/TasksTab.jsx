import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Plus, 
  Sparkles, 
  Trash2, 
  AlertCircle,
  GripVertical
} from 'lucide-react';
import { useCreator } from '../context/CreatorContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { dbService } from '../services/dbService';
import { suggestTasks } from '../engine/aiService';

const COLUMNS = [
  { id: 'todo', label: 'Todo', icon: Circle, color: 'var(--text-tertiary)' },
  { id: 'doing', label: 'Developing', icon: Clock, color: 'var(--accent-secondary)' },
  { id: 'done', label: 'Mastered', icon: CheckCircle2, color: 'var(--accent-success)' }
];

const PRIORITY_COLORS = {
  high: '#ef4444',
  medium: 'var(--accent-secondary)',
  low: 'var(--accent-primary)'
};

export default function TasksTab() {
  const { user } = useAuth();
  const { topic, data, currentProjectId, activeWorkspace } = useCreator();
  const { addToast } = useToast();
  
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [suggesting, setSuggesting] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'medium' });

  useEffect(() => {
    if (currentProjectId) {
      fetchTasks();
    } else {
      setLoading(false);
    }
  }, [currentProjectId]);

  const fetchTasks = async () => {
    try {
      const data = await dbService.getTasks(currentProjectId);
      setTasks(data);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async () => {
    if (!newTask.title || !user || !currentProjectId) return;
    try {
      const teamId = activeWorkspace !== 'personal' ? activeWorkspace : null;
      const created = await dbService.createTask(user.id, currentProjectId, newTask, teamId);
      setTasks(prev => [...prev, created]);
      setShowAddModal(false);
      setNewTask({ title: '', description: '', priority: 'medium' });
      addToast('success', 'Task added');
    } catch (err) {
      addToast('error', 'Failed to add task');
    }
  };

  const handleUpdateStatus = async (taskId, newStatus) => {
    try {
      await dbService.updateTask(taskId, { status: newStatus });
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
      
      if (newStatus === 'done' && user) {
        const teamId = activeWorkspace !== 'personal' ? activeWorkspace : null;
        const task = tasks.find(t => t.id === taskId);
        dbService.logActivity(user.id, 'task_completion', `Completed task: ${task.title}`, teamId, currentProjectId);
        addToast('success', 'Task mastered!');
      }
    } catch (err) {
      addToast('error', 'Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await dbService.deleteTask(taskId);
      setTasks(prev => prev.filter(t => t.id !== taskId));
    } catch (err) {
      addToast('error', 'Failed to delete task');
    }
  };

  const handleMagicSuggest = async () => {
    if (!data || !currentProjectId || !user) {
      addToast('info', 'Generate a project first to use Task Intelligence');
      return;
    }
    setSuggesting(true);
    try {
      const suggestions = await suggestTasks(topic, data);
      const teamId = activeWorkspace !== 'personal' ? activeWorkspace : null;
      const created = await dbService.bulkAddTasks(user.id, currentProjectId, suggestions, teamId);
      setTasks(prev => [...prev, ...created]);
      addToast('success', `Generated ${suggestions.length} production tasks`);
      dbService.logActivity(user.id, 'task_generation', `AI generated ${suggestions.length} production tasks for "${topic}"`, teamId, currentProjectId);
    } catch (err) {
      addToast('error', 'AI task generation failed');
    } finally {
      setSuggesting(false);
    }
  };

  if (!currentProjectId) {
    return (
      <div className="tab-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center' }}>
        <div style={{ maxWidth: 400 }}>
          <Sparkles size={48} color="var(--accent-primary)" style={{ marginBottom: 20 }} />
          <h2 style={{ marginBottom: 12 }}>Task Intelligence</h2>
          <p style={{ color: 'var(--text-tertiary)', marginBottom: 24 }}>
            Generate a project strategy and script first to unlock AI-powered production workflows.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="tab-content">
      <div className="tab-header">
        <div>
          <h2 className="tab-title text-gradient">Production Board</h2>
          <p className="tab-subtitle">Manage your content lifecycle from pre-prod to final master</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn-secondary" onClick={handleMagicSuggest} disabled={suggesting}>
            {suggesting ? <Clock className="animate-spin" size={16} /> : <Sparkles size={16} />}
            <span>{suggesting ? 'Analyzing...' : 'Magic Suggest'}</span>
          </button>
          <button className="btn-primary" onClick={() => setShowAddModal(true)}>
            <Plus size={16} />
            <span>New Task</span>
          </button>
        </div>
      </div>

      <div className="kanban-grid" style={{ 
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: 20, minHeight: '60vh', alignItems: 'start' 
      }}>
        {COLUMNS.map(col => (
          <div key={col.id} className="kanban-column" style={{ 
            background: 'var(--bg-tertiary)', borderRadius: 12, padding: 16, 
            height: '100%', border: '1px solid var(--border-subtle)' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <col.icon size={18} color={col.color} />
              <h3 style={{ fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {col.label}
              </h3>
              <div style={{ 
                marginLeft: 'auto', background: 'var(--bg-secondary)', 
                padding: '2px 8px', borderRadius: 10, fontSize: '0.75rem', 
                color: 'var(--text-tertiary)' 
              }}>
                {tasks.filter(t => t.status === col.id).length}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <AnimatePresence mode="popLayout">
                {tasks.filter(t => t.status === col.id).map(task => (
                  <motion.div
                    key={task.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="card task-card"
                    style={{ 
                      padding: 16, position: 'relative', 
                      borderLeft: `3px solid ${PRIORITY_COLORS[task.priority]}` 
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ 
                        fontSize: '0.65rem', fontWeight: 700, 
                        color: PRIORITY_COLORS[task.priority], textTransform: 'uppercase' 
                      }}>
                        {task.priority}
                      </span>
                      <button 
                        onClick={() => handleDeleteTask(task.id)}
                        style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: 6 }}>{task.title}</h4>
                    {task.description && (
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginBottom: 12, lineHeight: 1.4 }}>
                        {task.description}
                      </p>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
                      {col.id !== 'todo' && (
                        <button className="btn-mini" onClick={() => handleUpdateStatus(task.id, 'todo')}>
                          Todo
                        </button>
                      )}
                      {col.id !== 'doing' && (
                        <button className="btn-mini" onClick={() => handleUpdateStatus(task.id, 'doing')}>
                          Doing
                        </button>
                      )}
                      {col.id !== 'done' && (
                        <button className="btn-mini" style={{ background: 'var(--accent-success)20', color: 'var(--accent-success)' }} onClick={() => handleUpdateStatus(task.id, 'done')}>
                          Mastered
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="modal-content" 
            onClick={e => e.stopPropagation()}
            style={{ maxWidth: 450 }}
          >
            <h3 style={{ marginBottom: 20 }}>Create New Task</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 6 }}>Task Title</label>
                <input 
                  type="text" 
                  value={newTask.title}
                  onChange={e => setNewTask({...newTask, title: e.target.value})}
                  className="input-primary" 
                  placeholder="e.g. Record A-roll for Intro"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 6 }}>Description (Optional)</label>
                <textarea 
                  value={newTask.description}
                  onChange={e => setNewTask({...newTask, description: e.target.value})}
                  className="input-primary" 
                  style={{ minHeight: 80 }}
                  placeholder="Brief production notes..."
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 6 }}>Priority</label>
                <div style={{ display: 'flex', gap: 10 }}>
                  {['low', 'medium', 'high'].map(p => (
                    <button
                      key={p}
                      onClick={() => setNewTask({...newTask, priority: p})}
                      style={{
                        flex: 1, padding: '8px', borderRadius: 8, border: '1px solid var(--border-subtle)',
                        background: newTask.priority === p ? `${PRIORITY_COLORS[p]}20` : 'transparent',
                        color: newTask.priority === p ? PRIORITY_COLORS[p] : 'var(--text-tertiary)',
                        fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', cursor: 'pointer'
                      }}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
                <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setShowAddModal(false)}>Cancel</button>
                <button className="btn-primary" style={{ flex: 1 }} onClick={handleAddTask}>Add Task</button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
