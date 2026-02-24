import React, { useState } from 'react';
import { ChevronDown, Users, User, Plus, Settings, Loader2 } from 'lucide-react';
import { useCreator } from '../context/CreatorContext';

export default function TeamSwitcher() {
  const { activeWorkspace, setActiveWorkspace, workspaces, setShowTeamSettings, createTeam } = useCreator();
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const currentWs = workspaces.find(w => w.id === activeWorkspace) || workspaces[0];

  return (
    <div style={{ position: 'relative', marginBottom: 16 }}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '8px 12px',
          width: '100%',
          background: 'var(--bg-tertiary)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 8,
          color: 'var(--text-primary)',
          cursor: 'pointer',
        }}
      >
        <div style={{
          width: 32, height: 32,
          borderRadius: 6,
          background: currentWs.type === 'personal' ? 'var(--accent-primary)' : 'var(--accent-secondary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff'
        }}>
          {currentWs.type === 'personal' ? <User size={18} /> : <Users size={18} />}
        </div>
        <div style={{ flex: 1, textAlign: 'left' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{currentWs.name}</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>{currentWs.type === 'personal' ? 'Free Plan' : 'Team Plan'}</div>
        </div>
        <ChevronDown size={14} style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>

      {isOpen && (
        <>
          <div 
            style={{ position: 'fixed', inset: 0, zIndex: 40 }} 
            onClick={() => setIsOpen(false)}
          />
          <div 
            className="team-switcher-dropdown"
            style={{
            position: 'absolute',
            top: '100%', left: 0, right: 0,
            marginTop: 4,
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-medium)',
            borderRadius: 8,
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            zIndex: 50,
            padding: 4,
            overflow: 'hidden'
          }}>
            {workspaces.map(ws => (
              <button
                key={ws.id}
                onClick={() => { setActiveWorkspace(ws.id); setIsOpen(false); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  width: '100%',
                  padding: '8px',
                  background: activeWorkspace === ws.id ? 'var(--bg-tertiary)' : 'transparent',
                  border: 'none',
                  borderRadius: 6,
                  color: activeWorkspace === ws.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <div style={{
                  width: 24, height: 24,
                  borderRadius: 4,
                  background: ws.type === 'personal' ? 'rgba(124, 92, 252, 0.2)' : 'rgba(236, 72, 153, 0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: ws.type === 'personal' ? 'var(--accent-primary)' : 'var(--accent-secondary)',
                }}>
                  {ws.type === 'personal' ? <User size={14} /> : <Users size={14} />}
                </div>
                <span style={{ fontSize: '0.85rem' }}>{ws.name}</span>
              </button>
            ))}
            <div style={{ height: 1, background: 'var(--border-subtle)', margin: '4px 0' }} />
            <button
               onClick={() => { setShowTeamSettings(true); setIsOpen(false); }}
               style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                width: '100%',
                padding: '8px',
                background: 'transparent',
                border: 'none',
                borderRadius: 6,
                color: 'var(--text-tertiary)',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <div style={{ width: 24, display: 'flex', justifyContent: 'center' }}><Settings size={14} /></div>
              <span style={{ fontSize: '0.85rem' }}>Manage Team</span>
            </button>
            <button
               disabled={isCreating}
               onClick={async () => {
                 const name = prompt('Enter team name:');
                 if (name) {
                   setIsCreating(true);
                   try {
                     await createTeam(name);
                     setIsOpen(false);
                   } catch (e) {
                     alert('Failed to create team');
                   } finally {
                     setIsCreating(false);
                   }
                 }
               }}
               style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                width: '100%',
                padding: '8px',
                background: 'transparent',
                border: 'none',
                borderRadius: 6,
                color: 'var(--text-tertiary)',
                cursor: 'pointer',
                textAlign: 'left',
                opacity: isCreating ? 0.5 : 1
              }}
            >
              <div style={{ width: 24, display: 'flex', justifyContent: 'center' }}>
                {isCreating ? <Loader2 size={14} className="spin" /> : <Plus size={14} />}
              </div>
              <span style={{ fontSize: '0.85rem' }}>{isCreating ? 'Creating...' : 'Create Team'}</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
