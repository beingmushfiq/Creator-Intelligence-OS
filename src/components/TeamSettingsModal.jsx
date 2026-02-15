import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UserPlus, Shield, Trash2, Mail, Users } from 'lucide-react';
import { useCreator } from '../context/CreatorContext';
import { useToast } from '../context/ToastContext';

export default function TeamSettingsModal() {
  const { showTeamSettings, setShowTeamSettings, activeWorkspace, workspaces } = useCreator();
  const { addToast } = useToast();
  
  const [inviteEmail, setInviteEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState('editor');
  
  // Mock members for the team
  const [members, setMembers] = useState([
    { id: 1, name: 'You', email: 'creator@example.com', role: 'owner', avatar: null },
    { id: 2, name: 'Alex Editor', email: 'alex@example.com', role: 'editor', avatar: 'A' },
    { id: 3, name: 'Sarah Manager', email: 'sarah@example.com', role: 'admin', avatar: 'S' },
  ]);

  if (!showTeamSettings) return null;

  const currentWs = workspaces.find(w => w.id === activeWorkspace);

  const handleInvite = (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    
    addToast('success', `Invitation sent to ${inviteEmail}`);
    setInviteEmail('');
  };

  const handleRemoveMember = (id) => {
    setMembers(prev => prev.filter(m => m.id !== id));
    addToast('info', 'Member removed');
  };

  const handleRoleChange = (id, newRole) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, role: newRole } : m));
    addToast('success', 'Role updated');
  };

  return (
    <AnimatePresence>
      {showTeamSettings && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowTeamSettings(false)}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 100
            }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            style={{
              position: 'fixed',
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '90%', maxWidth: 600,
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-medium)',
              borderRadius: 16,
              boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
              zIndex: 101,
              overflow: 'hidden'
            }}
          >
            <div style={{ padding: 24, borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ 
                  width: 40, height: 40, 
                  borderRadius: 8, 
                  background: 'rgba(124, 92, 252, 0.1)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--accent-primary)'
                }}>
                  <Users size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Team Settings</h3>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>
                    Manage members for <strong style={{ color: 'var(--text-primary)' }}>{currentWs?.name}</strong>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setShowTeamSettings(false)}
                className="icon-btn"
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: 24 }}>
              {/* Invite Section */}
              <div style={{ marginBottom: 32 }}>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: 8 }}>Invite New Member</label>
                <form onSubmit={handleInvite} style={{ display: 'flex', gap: 12 }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <Mail size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-tertiary)' }} />
                    <input
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="Enter email address"
                      style={{ paddingLeft: 36, width: '100%' }}
                    />
                  </div>
                  <select 
                    value={selectedRole} 
                    onChange={(e) => setSelectedRole(e.target.value)}
                    style={{ width: 120 }}
                  >
                    <option value="admin">Admin</option>
                    <option value="editor">Editor</option>
                    <option value="viewer">Viewer</option>
                  </select>
                  <button type="submit" className="btn-primary" disabled={!inviteEmail}>
                    <UserPlus size={16} />
                    Invite
                  </button>
                </form>
              </div>

              {/* Members List */}
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: 12 }}>Team Members ({members.length})</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {members.map(member => (
                    <div key={member.id} className="card" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ 
                          width: 36, height: 36, 
                          borderRadius: '50%', 
                          background: member.avatar ? 'var(--bg-tertiary)' : 'var(--accent-primary)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: '#fff', fontWeight: 600, fontSize: '0.9rem'
                        }}>
                          {member.avatar || member.name[0]}
                        </div>
                        <div>
                          <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>{member.name} {member.role === 'owner' && <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>(You)</span>}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>{member.email}</div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Shield size={14} color={member.role === 'owner' ? 'var(--accent-warning)' : 'var(--text-tertiary)'} />
                          {member.role === 'owner' ? (
                            <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Owner</span>
                          ) : (
                            <select 
                              value={member.role}
                              onChange={(e) => handleRoleChange(member.id, e.target.value)}
                              style={{ 
                                padding: '4px 8px', 
                                fontSize: '0.85rem', 
                                background: 'transparent', 
                                border: 'none',
                                color: 'var(--text-primary)',
                                cursor: 'pointer'
                              }}
                            >
                              <option value="admin">Admin</option>
                              <option value="editor">Editor</option>
                              <option value="viewer">Viewer</option>
                            </select>
                          )}
                        </div>
                        
                        {member.role !== 'owner' && (
                          <button 
                            onClick={() => handleRemoveMember(member.id)}
                            className="icon-btn-sm"
                            style={{ color: 'var(--accent-danger)' }}
                            title="Remove Member"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div style={{ padding: 16, background: 'var(--bg-tertiary)', borderTop: '1px solid var(--border-subtle)', textAlign: 'right' }}>
              <button onClick={() => setShowTeamSettings(false)} className="btn-ghost">Done</button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
