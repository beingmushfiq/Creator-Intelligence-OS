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
  GripVertical,
  RefreshCw,
  Zap,
  Target,
  ListTodo
} from 'lucide-react';
import { useCreator } from '../context/CreatorContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { dbService } from '../services/dbService.js';
import { useAuth } from '../context/AuthContext.jsx';
import { generateSmartTasks } from '../engine/aiService.js';

const STATUS_CONFIG = [
  { id: 'todo', label: 'Queued', icon: Circle, color: 'var(--text-tertiary)' },
  { id: 'doing', label: 'Processing', icon: Clock, color: 'var(--accent-secondary)' },
  { id: 'done', label: 'Mastered', icon: CheckCircle2, color: 'var(--accent-success)' }
];

const PRIORITY_COLORS = {
  high: '#ef4444',
  medium: 'var(--accent-secondary)',
  low: 'var(--accent-primary)'
};

export default function TasksTab() {
  const { user } = useAuth();
  const { topic, data } = useCreator();
  const { addToast } = useToast();
  
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [magicLoading, setMagicLoading] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  useEffect(() => { loadTasks(); }, [user]);

  const loadTasks = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await dbService.getTasks(user.id);
      setTasks(data);
    } catch (e) {
      addToast('error', 'Task transmission failure.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return;
    try {
      const task = await dbService.addTask({
        user_id: user.id,
        title: newTaskTitle,
        status: 'todo',
        priority: 'medium'
      });
      setTasks([task, ...tasks]);
      setNewTaskTitle('');
      addToast('success', 'Task materialized.');
    } catch (e) {
      addToast('error', 'Protocol failure.');
    }
  };

  const handleUpdateStatus = async (taskId, newStatus) => {
    try {
       await dbService.updateTask(taskId, { status: newStatus });
       setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    } catch(e) {
       addToast('error', 'State update failed.');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await dbService.deleteTask(taskId);
      setTasks(prev => prev.filter(t => t.id !== taskId));
      addToast('success', 'Task decommissioned.');
    } catch (e) {
      addToast('error', 'Decommission failed.');
    }
  };

  const handleMagicSuggest = async () => {
    if (!topic) {
       addToast('error', 'Start a project first!');
       return;
    }
    setMagicLoading(true);
    try {
      const suggestions = await generateSmartTasks(topic, data?.strategy);
      const newTasks = [];
      for (const s of suggestions) {
         const t = await dbService.addTask({
            user_id: user.id,
            title: s.title,
            status: 'todo',
            priority: s.priority || 'medium'
         });
         newTasks.push(t);
      }
      setTasks([...newTasks, ...tasks]);
      addToast('success', 'Operational nodes expanded with AI suggestions.');
    } catch (e) {
      addToast('error', 'AI link failed.');
    } finally {
      setMagicLoading(false);
    }
  };

  return (
    <div className="tab-content animate-slide-up">
      <div className="tab-header" style={{ marginBottom: 40 }}>
        <div className="stagger-children">
          <h2 className="tab-title text-gradient-aurora" style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.04em' }}>Operational Log</h2>
          <p className="tab-subtitle" style={{ fontSize: '1.1rem' }}>High-priority execution nodes & agentic task orchestration</p>
        </div>
        <button onClick={handleMagicSuggest} className="btn-primary" disabled={magicLoading} style={{ padding: '12px 24px' }}>
          {magicLoading ? <RefreshCw className="animate-spin" size={18} /> : <Sparkles size={18} />}
          <span>Magic Suggest</span>
        </button>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto' }}>
         <div className="glass" style={{ padding: 12, borderRadius: 20, marginBottom: 40, display: 'flex', gap: 12 }}>
            <input 
               type="text" 
               placeholder="Initialize new execution node..." 
               value={newTaskTitle}
               onChange={(e) => setNewTaskTitle(e.target.value)}
               onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
               style={{ flex: 1, background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: 600, outline: 'none', padding: '12px 16px' }}
            />
            <button onClick={handleAddTask} className="btn-primary" style={{ padding: '12px 24px' }}>
               <Plus size={18} />
               <span>Add Task</span>
            </button>
         </div>

         <div className="stagger-children" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <AnimatePresence>
               {tasks.map((task, i) => (
                  <motion.div 
                     key={task.id} 
                     initial={{ opacity: 0, x: -20 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, scale: 0.95 }}
                     whileHover={{ x: 8 }}
                     className="glass glass-hover"
                     style={{ padding: 20, borderRadius: 20, display: 'flex', alignItems: 'center', gap: 20 }}
                  >
                     <div style={{ display: 'flex', gap: 4 }}>
                        {STATUS_CONFIG.map(s => (
                           <button 
                              key={s.id} 
                              onClick={() => handleUpdateStatus(task.id, s.id)}
                              style={{ 
                                 background: task.status === s.id ? s.color : 'transparent',
                                 border: `1px solid ${task.status === s.id ? s.color : 'var(--border-subtle)'}`,
                                 width: 28, height: 28, borderRadius: '50%', cursor: 'pointer',
                                 display: 'flex', alignItems: 'center', justifyContent: 'center',
                                 color: task.status === s.id ? '#fff' : 'var(--text-tertiary)',
                                 transition: 'all 0.3s'
                              }}
                           >
                              <s.icon size={14} />
                           </button>
                        ))}
                     </div>

                     <div style={{ flex: 1 }}>
                        <h4 style={{ 
                           fontSize: '1.05rem', fontWeight: 800, margin: 0, 
                           textDecoration: task.status === 'done' ? 'line-through' : 'none',
                           opacity: task.status === 'done' ? 0.4 : 1,
                           transition: 'all 0.3s'
                        }}>{task.title}</h4>
                     </div>

                     <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.medium, boxShadow: `0 0 8px ${PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.medium}` }} />
                        <button 
                           onClick={() => handleDeleteTask(task.id)}
                           className="glass-hover"
                           style={{ padding: 10, borderRadius: 10, background: 'transparent', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer' }}
                        >
                           <Trash2 size={16} />
                        </button>
                     </div>
                  </motion.div>
               ))}
            </AnimatePresence>
            
            {tasks.length === 0 && (
               <div className="glass" style={{ padding: 64, borderRadius: 32, textAlign: 'center', opacity: 0.5 }}>
                  <ListTodo size={48} style={{ margin: '0 auto 24px' }} />
                  <p style={{ fontWeight: 800 }}>No active execution nodes. Use magic suggest to begin.</p>
               </div>
            )}
         </div>
      </div>
    </div>
  );
}
