import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, MessageSquare } from 'lucide-react';
import { useCreator } from '../context/CreatorContext';
import { useAuth } from '../context/AuthContext';

export default function CommentsSidebar({ isOpen, onClose, contextId = 'general' }) {
  const { comments, addComment } = useCreator();
  const { user } = useAuth();
  const [newComment, setNewComment] = useState('');

  const contextComments = comments[contextId] || [];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    addComment(contextId, newComment);
    setNewComment('');
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
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 90 }}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="comments-sidebar"
            style={{
              position: 'fixed',
              top: 0, bottom: 0, right: 0,
              width: 350,
              background: 'var(--bg-secondary)',
              borderLeft: '1px solid var(--border-medium)',
              zIndex: 100,
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '-4px 0 20px rgba(0,0,0,0.3)'
            }}
          >
            <div style={{ 
              padding: 16, 
              borderBottom: '1px solid var(--border-subtle)', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              background: 'var(--bg-primary)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <MessageSquare size={18} />
                <h3 style={{ margin: 0, fontSize: '1rem' }}>Team Chat</h3>
              </div>
              <button onClick={onClose} className="icon-btn"><X size={18} /></button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
              {contextComments.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-tertiary)', marginTop: 40 }}>
                  <p>No comments yet.</p>
                  <p style={{ fontSize: '0.8rem' }}>Start the conversation!</p>
                </div>
              ) : (
                contextComments.map(comment => (
                  <div key={comment.id} style={{ display: 'flex', gap: 10 }}>
                    <div style={{ 
                      width: 32, height: 32, 
                      borderRadius: '50%', 
                      background: 'var(--accent-primary)', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff', fontSize: '0.8rem', fontWeight: 600
                    }}>
                      {comment.user.name[0]}
                    </div>
                    <div>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{comment.user.name}</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
                          {new Date(comment.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.9rem', marginTop: 2, color: 'var(--text-secondary)' }}>
                        {comment.text}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div style={{ padding: 16, borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-primary)' }}>
              <form onSubmit={handleSubmit} style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Type a message..."
                  style={{
                    width: '100%',
                    padding: '10px 40px 10px 12px',
                    borderRadius: 20,
                    border: '1px solid var(--border-medium)',
                    background: 'var(--bg-tertiary)',
                    color: 'var(--text-primary)'
                  }}
                />
                <button 
                  type="submit"
                  disabled={!newComment.trim()}
                  style={{
                    position: 'absolute',
                    right: 8,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: newComment.trim() ? 'var(--accent-primary)' : 'var(--text-tertiary)',
                    cursor: newComment.trim() ? 'pointer' : 'default'
                  }}
                >
                  <Send size={16} />
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
