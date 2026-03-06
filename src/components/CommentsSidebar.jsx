import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, MessageSquare, Loader2, RefreshCw, Send as SendIcon, Share2 } from 'lucide-react';
import { useCreator } from '../context/CreatorContext';
import { useAuth } from '../context/AuthContext';
import { dbService } from '../services/dbService';

export default function CommentsSidebar({ isOpen, onClose, contextId = 'general' }) {
  const { comments, setComments, activeWorkspace } = useCreator();
  const { user } = useAuth();
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      const teamId = activeWorkspace !== 'personal' ? activeWorkspace : null;
      dbService.getComments(contextId, teamId).then(data => {
        setComments(prev => ({
          ...prev,
          [contextId]: data
        }));
      });
    }
  }, [isOpen, contextId, activeWorkspace, user, setComments]);

  const contextComments = comments[contextId] || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;
    setLoading(true);
    try {
      const teamId = activeWorkspace !== 'personal' ? activeWorkspace : null;
      const comment = await dbService.addComment(user.id, contextId, newComment, teamId);
      const displayComment = { ...comment, user: { name: user.email.split('@')[0] } };
      setComments(prev => ({ ...prev, [contextId]: [displayComment, ...(prev[contextId] || [])] }));
      dbService.logActivity(user.id, 'comment', `Commented on ${contextId}: "${newComment.substring(0, 30)}..."`, teamId);
      setNewComment('');
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 1100 }}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="glass"
            style={{
              position: 'fixed',
              top: 0, bottom: 0, right: 0,
              width: 400,
              background: 'rgba(15, 15, 20, 0.98)',
              borderLeft: '1px solid var(--accent-primary)20',
              zIndex: 1200,
              display: 'flex',
              flexDirection: 'column',
              boxShadow: 'var(--shadow-glow)'
            }}
          >
            {/* Header */}
            <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div className="glow-border" style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--bg-tertiary)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                   <MessageSquare size={18} />
                </div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900 }}>Ecosystem Chat</h3>
              </div>
              <button onClick={onClose} className="btn-ghost" style={{ padding: 8, borderRadius: '50%' }}><X size={20} /></button>
            </div>

            {/* Chat Feed */}
            <div style={{ flex: 1, overflowY: 'auto', padding: 32, display: 'flex', flexDirection: 'column', gap: 24 }} className="custom-scrollbar">
              {contextComments.length === 0 ? (
                <div style={{ textAlign: 'center', marginTop: 60, opacity: 0.3 }}>
                  <Share2 size={40} style={{ marginBottom: 16 }} />
                  <p style={{ fontWeight: 800 }}>Neural Feed Silent</p>
                  <p style={{ fontSize: '0.8rem' }}>Establish interaction protocols below.</p>
                </div>
              ) : (
                contextComments.map(comment => (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={comment.id} style={{ display: 'flex', gap: 12 }}>
                    <div className="glow-border" style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.8rem', fontWeight: 950, flexShrink: 0 }}>
                      {comment.user?.name?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                        <span style={{ fontWeight: 850, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{comment.user?.name || 'Operative'}</span>
                        <span style={{ fontSize: '0.65rem', fontWeight: 900, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>{new Date(comment.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div className="glass" style={{ padding: '12px 16px', borderRadius: '0 16px 16px 16px', fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                        {comment.text}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Input Area */}
            <div style={{ padding: 32, borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-tertiary)30' }}>
              <form onSubmit={handleSubmit} style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Sync directive..."
                  style={{
                    width: '100%',
                    padding: '16px 56px 16px 20px',
                    borderRadius: 16,
                    border: '1px solid var(--border-subtle)',
                    background: 'var(--bg-tertiary)50',
                    color: 'var(--text-primary)',
                    fontSize: '1rem',
                    fontWeight: 600,
                    outline: 'none'
                  }}
                />
                <button 
                  type="submit" 
                  disabled={!newComment.trim() || loading}
                  className="btn-primary"
                  style={{ 
                    position: 'absolute',
                    right: 8, top: '50%',
                    transform: 'translateY(-50%)',
                    width: 40, height: 40,
                    borderRadius: 12,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: 0
                  }}
                >
                  {loading ? <RefreshCw className="animate-spin" size={16} /> : <SendIcon size={16} />}
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
