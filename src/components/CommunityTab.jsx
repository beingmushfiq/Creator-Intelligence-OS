import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, UserPlus, Heart, MessageCircle, BarChart3, 
  ShieldCheck, Trophy, Sparkles, RefreshCw, Layers,
  Activity, Target, Calendar, Star, Info,
  Zap, HeartPulse, Compass, ChevronRight
} from 'lucide-react';
import { useCreator } from '../context/CreatorContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { generateCommunityStrategy } from '../engine/aiService.js';

export default function CommunityTab() {
  const { data, loading, regenerateSection, topic } = useCreator();
  const { addToast } = useToast();
  
  const community = data?.community || {};

  if (!community || Object.keys(community).length === 0) return <EmptyState />;

  return (
    <div className="tab-content animate-slide-up">
      <div className="tab-header" style={{ marginBottom: 40 }}>
        <div className="stagger-children">
          <h2 className="tab-title text-gradient-aurora" style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.04em' }}>Community Forge</h2>
          <p className="tab-subtitle" style={{ fontSize: '1.1rem' }}>Architecting recursive engagement loops & high-fidelity ecosystem loyalty</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
           <button onClick={() => regenerateSection('community')} className="btn-secondary" disabled={loading} style={{ padding: '12px' }}>
              {loading ? <RefreshCw className="animate-spin" size={18} /> : <RefreshCw size={18} />}
           </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 28 }}>
         
         <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            
            {/* Strategy Pillars */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
               <h3 style={{ fontSize: '1.2rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Compass size={20} color="var(--accent-primary)" /> Engagement Protocols
               </h3>
               <div className="stagger-children" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  {community.strategies?.map((s, i) => (
                     <div key={i} className="glass glass-hover" style={{ padding: 24, borderRadius: 20 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                           <div className="glass" style={{ width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)' }}>
                              <Zap size={16} />
                           </div>
                           <span style={{ fontSize: '1rem', fontWeight: 800 }}>{s.title}</span>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>{s.description}</p>
                     </div>
                  ))}
               </div>
            </div>

            {/* Retention Milestones */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
               <h3 style={{ fontSize: '1.2rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Star size={20} color="var(--accent-warning)" /> Loyalty Milestones
               </h3>
               <div className="glass" style={{ padding: 32, borderRadius: 28 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                     <MilestoneItem label="Neural Tribe Alignment" status="done" color="var(--accent-success)" />
                     <MilestoneItem label="Engagement Loop Saturation" status="processing" color="var(--accent-primary)" />
                     <MilestoneItem label="Ecosystem Loyalty Sync" status="pending" color="var(--text-tertiary)" />
                  </div>
               </div>
            </div>

         </div>

         {/* Sidebar Stats */}
         <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            <div className="glass" style={{ padding: 32, borderRadius: 28 }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
                  <div className="glow-border" style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--bg-tertiary)', color: 'var(--accent-success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     <HeartPulse size={22} />
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 900 }}>Community Pulse</h3>
               </div>
               <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <StatItem label="Active Vibrancy" value="High" color="var(--accent-success)" />
                  <StatItem label="Member Retention" value="94%" color="var(--accent-primary)" />
                  <StatItem label="Advocacy Lift" value="+12%" color="var(--accent-warning)" />
               </div>
            </div>

            <div className="glass glass-hover" style={{ padding: 32, borderRadius: 28, background: 'var(--gradient-primary)05', border: '1px solid var(--accent-primary)20' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <Trophy size={18} color="var(--accent-primary)" />
                  <span style={{ fontSize: '0.7rem', fontWeight: 950, color: 'var(--accent-primary)', textTransform: 'uppercase' }}>Loyalty Tip</span>
               </div>
               <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                  Introducing a "Member Highlight" module could potentially increase engagement velocity by 22% within your core demographic.
               </p>
            </div>
         </div>

      </div>
    </div>
  );
}

function StatItem({ label, value, color }) {
   return (
      <div className="glass" style={{ padding: '16px 20px', borderRadius: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
         <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-tertiary)' }}>{label}</span>
         <span style={{ fontSize: '1.1rem', fontWeight: 950, color: color }}>{value}</span>
      </div>
   );
}

function MilestoneItem({ label, status, color }) {
   return (
      <div className="glass" style={{ padding: '16px 24px', borderRadius: 16, display: 'flex', alignItems: 'center', gap: 16 }}>
         <div style={{ width: 10, height: 10, borderRadius: '50%', background: color, boxShadow: status !== 'pending' ? `0 0 10px ${color}` : 'none' }} />
         <span style={{ flex: 1, fontSize: '0.95rem', fontWeight: 700, opacity: status === 'pending' ? 0.4 : 1 }}>{label}</span>
         {status === 'processing' && <RefreshCw size={14} className="animate-spin" color="var(--accent-primary)" />}
         <ChevronRight size={14} style={{ opacity: 0.1 }} />
      </div>
   );
}

function EmptyState() {
  return (
    <div className="tab-content center-content" style={{ minHeight: '60vh' }}>
      <div className="glass glass-hover" style={{ maxWidth: 480, padding: 48, borderRadius: 32, textAlign: 'center' }}>
        <div className="glow-border" style={{ width: 80, height: 80, borderRadius: 24, background: 'var(--bg-tertiary)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <Users size={40} />
        </div>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: 16 }}>Community Forge</h3>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>Initialize your strategic foundation to architect recursive engagement loops and high-fidelity loyalty protocols.</p>
      </div>
    </div>
  );
}
