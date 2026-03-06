import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, UserPlus, Shield, Trash2, Mail, Users, Loader2, 
  Settings, Zap, ShieldCheck, User, ChevronRight,
  RefreshCw, Plus
} from 'lucide-react';
import { useCreator } from '../context/CreatorContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { dbService } from '../services/dbService';

export default function TeamSettingsModal() {
  const { showTeamSettings, setShowTeamSettings, workspaces, activeWorkspace } = useCreator();
  const { user } = useAuth();
  const { addToast } = useToast();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviting, setInviting] = useState(false);

  const team = workspaces.find(w => w.id === activeWorkspace);
  const isOwner = team?.created_by === user?.id;

  useEffect(() => {
    if (showTeamSettings && team && team.type !== 'personal') {
      setLoading(true);
      dbService.getTeamMembers(team.id).then(data => {
        setMembers(data);
        setLoading(false);
      });
    }
  }, [showTeamSettings, team]);

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!inviteEmail.trim() || inviting) return;
    setInviting(true);
    try {
      await dbService.inviteToTeam(team.id, inviteEmail);
      addToast('success', `Manifesto sent to ${inviteEmail}`);
      setInviteEmail('');
      const data = await dbService.getTeamMembers(team.id);
      setMembers(data);
    } catch (err) { addToast('error', 'Link establishment failed'); }
    finally { setInviting(false); }
  };

  if (!showTeamSettings || !team || team.type === 'personal') return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[2000] flex items-center justify-center">
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           exit={{ opacity: 0 }}
           onClick={() => setShowTeamSettings(false)}
           style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)' }}
        />
        <motion.div
           initial={{ scale: 0.9, opacity: 0, y: 30 }}
           animate={{ scale: 1, opacity: 1, y: 0 }}
           exit={{ scale: 0.9, opacity: 0, y: 30 }}
           transition={{ type: 'spring', damping: 25, stiffness: 200 }}
           className="glass"
           style={{
              width: '100%',
              maxWidth: 720,
              maxHeight: '85vh',
              background: 'rgba(12, 12, 18, 0.98)',
              borderRadius: 40,
              border: '1px solid var(--accent-primary)20',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: 'var(--shadow-glow)',
              position: 'relative',
              zIndex: 2010
           }}
        >
           {/* Header */}
           <div style={{ padding: '40px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                 <div className="glow-border" style={{ width: 52, height: 52, borderRadius: 16, background: 'var(--gradient-aurora)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Users size={26} />
                 </div>
                 <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 900, margin: 0 }}>Syndicate Configuration</h2>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>{team.name} Unit Nodes</p>
                 </div>
              </div>
              <button onClick={() => setShowTeamSettings(false)} className="btn-ghost" style={{ padding: 12, borderRadius: '50%' }}><X size={24} /></button>
           </div>

           <div style={{ flex: 1, overflowY: 'auto', padding: '40px' }} className="custom-scrollbar">
              
              {/* Invite Section */}
              {isOwner && (
                 <div className="glass" style={{ padding: 32, borderRadius: 24, marginBottom: 40, border: '1px solid var(--accent-primary)10' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                       <UserPlus size={18} color="var(--accent-primary)" />
                       <h4 style={{ fontSize: '0.8rem', fontWeight: 950, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Establish Link</h4>
                    </div>
                    <form onSubmit={handleInvite} style={{ display: 'flex', gap: 12 }}>
                       <input 
                          type="email"
                          value={inviteEmail}
                          onChange={(e) => setInviteEmail(e.target.value)}
                          placeholder="Operative Email..."
                          style={{ flex: 1, background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: '0 20px', fontSize: '1rem', color: 'var(--text-primary)', outline: 'none' }}
                       />
                       <button type="submit" disabled={inviting} className="btn-primary" style={{ padding: '14px 28px', borderRadius: 12 }}>
                          {inviting ? <RefreshCw className="animate-spin" size={18} /> : <Plus size={18} />}
                          <span>Invite</span>
                       </button>
                    </form>
                 </div>
              )}

              {/* Members List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <ShieldCheck size={18} color="var(--accent-success)" />
                    <h4 style={{ fontSize: '0.8rem', fontWeight: 950, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Neural Cohorts</h4>
                 </div>

                 {loading ? (
                    <div style={{ textAlign: 'center', padding: 40, opacity: 0.5 }}><Loader2 className="animate-spin" size={32} /></div>
                 ) : (
                    members.map(member => (
                       <div key={member.id} className="glass glass-hover" style={{ padding: 20, borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                             <div className="glow-border" style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--accent-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1rem', fontWeight: 950 }}>
                                {member.user?.email?.[0]?.toUpperCase() || '?'}
                             </div>
                             <div>
                                <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>{member.user?.email}</div>
                                <div style={{ fontSize: '0.75rem', fontWeight: 900, color: member.role === 'owner' ? 'var(--accent-warning)' : 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                                   {member.role}
                                </div>
                             </div>
                          </div>
                          {isOwner && member.user?.id !== user?.id && (
                             <button className="btn-ghost" style={{ padding: 10, borderRadius: 12, color: 'var(--accent-error)' }}><Trash2 size={18} /></button>
                          )}
                       </div>
                    ))
                 )}
              </div>
           </div>

           <div style={{ padding: '32px 40px', borderTop: '1px solid var(--border-subtle)', textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>Syndicate Protocol v1.0 • E2E Link Encryption Enabled</p>
           </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
