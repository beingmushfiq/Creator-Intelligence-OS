import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Users, User, Plus, Settings, Loader2, Zap, Shield } from 'lucide-react';
import { useCreator } from '../context/CreatorContext';

export default function TeamSwitcher() {
  const { activeWorkspace, setActiveWorkspace, workspaces, setShowTeamSettings, createTeam } = useCreator();
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const currentWs = workspaces.find(w => w.id === activeWorkspace) || workspaces[0];

  return (
    <div style={{ position: 'relative', marginBottom: 24 }}>
      <motion.button 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="glass glass-hover"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '12px 16px',
          width: '100%',
          borderRadius: 16,
          border: `1px solid ${isOpen ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
          cursor: 'pointer',
          transition: 'all 0.3s var(--ease-premium)'
        }}
      >
        <div className="glow-border" style={{
          width: 36, height: 36,
          borderRadius: 10,
          background: currentWs.type === 'personal' ? 'var(--gradient-primary)' : 'var(--gradient-aurora)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff'
        }}>
          {currentWs.type === 'personal' ? <Zap size={18} /> : <Users size={18} />}
        </div>
        <div style={{ flex: 1, textAlign: 'left' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 850, color: 'var(--text-primary)' }}>{currentWs.name}</div>
          <div style={{ fontSize: '0.65rem', fontWeight: 900, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
             {currentWs.type === 'personal' ? 'Solo Operative' : 'Syndicate Unit'}
          </div>
        </div>
        <ChevronDown size={14} style={{ color: 'var(--text-tertiary)', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ position: 'fixed', inset: 0, zIndex: 1000 }} 
              onClick={() => setIsOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="glass"
              style={{
                position: 'absolute',
                top: '100%', left: 0, right: 0,
                marginTop: 12,
                borderRadius: 20,
                padding: 10,
                zIndex: 1010,
                boxShadow: 'var(--shadow-glow)',
                border: '1px solid var(--border-medium)',
                overflow: 'hidden'
              }}
            >
              <div style={{ padding: '8px 12px', fontSize: '0.65rem', fontWeight: 950, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Neural Nodes</div>
              {workspaces.map(ws => (
                <button
                  key={ws.id}
                  onClick={() => { setActiveWorkspace(ws.id); setIsOpen(false); }}
                  className="glass-hover"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    width: '100%',
                    padding: '12px',
                    background: activeWorkspace === ws.id ? 'var(--bg-tertiary)' : 'transparent',
                    border: 'none',
                    borderRadius: 12,
                    color: activeWorkspace === ws.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{
                    width: 28, height: 28,
                    borderRadius: 8,
                    background: ws.type === 'personal' ? 'var(--accent-primary)20' : 'var(--accent-secondary)20',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: ws.type === 'personal' ? 'var(--accent-primary)' : 'var(--accent-secondary)',
                  }}>
                    {ws.type === 'personal' ? <Zap size={14} /> : <Users size={14} />}
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: activeWorkspace === ws.id ? 800 : 600 }}>{ws.name}</span>
                  {activeWorkspace === ws.id && (
                     <div style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-primary)', boxShadow: '0 0 10px var(--accent-primary)' }} />
                  )}
                </button>
              ))}
              
              <div style={{ height: 1, background: 'var(--border-subtle)', margin: '8px 4px' }} />
              
              <button
                 onClick={() => { setShowTeamSettings(true); setIsOpen(false); }}
                 className="glass-hover"
                 style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  width: '100%',
                  padding: '12px',
                  background: 'transparent',
                  border: 'none',
                  borderRadius: 12,
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <div style={{ width: 28, height: 28, display: 'flex', justifyContent: 'center', alignItems: 'center' }}><Settings size={16} /></div>
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Manage Syndicates</span>
              </button>
              
              <button
                 disabled={isCreating}
                 onClick={async () => {
                   const name = prompt('Establish new syndicate unit:');
                   if (name) {
                     setIsCreating(true);
                     try {
                       await createTeam(name);
                       setIsOpen(false);
                     } catch (e) {
                       alert('Link establishment failed');
                     } finally {
                       setIsCreating(false);
                     }
                   }
                 }}
                 className="glass-hover"
                 style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  width: '100%',
                  padding: '12px',
                  background: 'transparent',
                  border: 'none',
                  borderRadius: 12,
                  color: 'var(--accent-primary)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  opacity: isCreating ? 0.5 : 1
                }}
              >
                <div style={{ width: 28, height: 28, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  {isCreating ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>{isCreating ? 'Synchronizing...' : 'New Syndicate'}</span>
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
