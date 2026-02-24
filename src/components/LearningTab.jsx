import React from 'react';
import { motion } from 'framer-motion';
import { 
  GraduationCap, PlayCircle, BookOpen, Target, Zap, 
  ArrowRight, Star, Clock, Trophy, Users, Sparkles,
  ChevronRight, Brain, Briefcase, Rocket, ShieldCheck
} from 'lucide-react';

const COURSES = [
  {
    title: 'Viral Hook Architecture',
    description: 'Master the high-stakes first 3 seconds to maximize algorithmic retention.',
    icon: Zap,
    duration: '15 min',
    lessons: 5,
    color: 'var(--accent-warning)',
    progress: 45
  },
  {
    title: 'Algorithmic Psychology',
    description: 'Deep-dive into platform behavioral systems and reward mechanisms.',
    icon: Brain,
    duration: '25 min',
    lessons: 8,
    color: 'var(--accent-primary)',
    progress: 12
  },
  {
    title: 'The Multi-Asset Flywheel',
    description: 'Repurpose high-signal content into a self-sustaining 20-asset ecosystem.',
    icon: Rocket,
    duration: '20 min',
    lessons: 6,
    color: 'var(--accent-secondary)',
    progress: 0
  },
  {
    title: 'Monetization Mastery 2.0',
    description: 'Constructing high-ticket value ladders beyond standard advertising.',
    icon: Briefcase,
    duration: '30 min',
    lessons: 10,
    color: 'var(--accent-success)',
    progress: 0
  }
];

export default function LearningTab() {
  return (
    <div className="tab-content">
      <div className="tab-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20 }}>
        <div>
          <h2 className="tab-title text-gradient">Creator Academy</h2>
          <p className="tab-subtitle">High-fidelity skill ascension & algorithmic strategy library</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
           <div className="badge badge-purple" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Trophy size={14} />
              <span>Lvl 12 Creator</span>
           </div>
        </div>
      </div>

      <div className="stagger-children" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, marginBottom: 40 }}>
        {COURSES.map((course, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -8, borderColor: `${course.color}40` }}
            className="card"
            style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 20, background: 'var(--bg-secondary)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
               <div style={{ padding: 12, borderRadius: 14, background: `${course.color}15`, color: course.color }}>
                  <course.icon size={24} />
               </div>
               {course.progress > 0 && (
                 <div style={{ fontSize: '0.7rem', fontWeight: 900, color: course.color, background: `${course.color}10`, padding: '4px 10px', borderRadius: 20 }}>
                    {course.progress}% COMPLETE
                 </div>
               )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
               <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-primary)' }}>{course.title}</h3>
               <p style={{ fontSize: '0.9rem', color: 'var(--text-tertiary)', lineHeight: 1.5 }}>{course.description}</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
               <div style={{ height: 6, background: 'var(--bg-tertiary)', borderRadius: 3, overflow: 'hidden' }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${course.progress}%` }} style={{ height: '100%', background: course.color }} />
               </div>
               
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 700 }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Clock size={12} /> {course.duration}
                     </div>
                     <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--border-subtle)' }} />
                     <span>{course.lessons} UNITS</span>
                  </div>
                  <button 
                    className="btn-ghost-sm" 
                    style={{ color: course.color, display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', border: `1px solid ${course.color}20` }}
                  >
                     <span>{course.progress > 0 ? 'Resume' : 'Begin'}</span>
                     <ChevronRight size={14} />
                  </button>
               </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Premium Mastermind Anchor */}
      <motion.div 
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         className="card" 
         style={{ 
           padding: '40px 60px', 
           background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
           color: '#fff', border: 'none', position: 'relative', overflow: 'hidden',
           display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 40, flexWrap: 'wrap'
         }}
      >
         <div style={{ position: 'absolute', right: -40, top: -40, opacity: 0.1 }}>
            <BookOpen size={280} />
         </div>

         <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
               <ShieldCheck size={24} />
               <span style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Pro Member Access</span>
            </div>
            <h3 style={{ fontSize: '2.2rem', fontWeight: 950, marginBottom: 12, lineHeight: 1.1 }}>Join the Creator Mastermind</h3>
            <p style={{ fontSize: '1.1rem', opacity: 0.9, marginBottom: 0, maxWidth: 500, lineHeight: 1.5 }}>
               Network with high-velocity creators and receive direct strategic audits from our elite Content Intelligence team.
            </p>
         </div>

         <button className="shiny-button" style={{ background: '#fff', color: 'var(--accent-primary)', padding: '16px 40px', fontSize: '1rem', fontWeight: 900, border: 'none', position: 'relative', zIndex: 1 }}>
            <Sparkles size={18} />
            <span>Unlock Executive Access</span>
         </button>
      </motion.div>

      {/* Academy Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 24, marginTop: 40 }}>
         <div className="card" style={{ padding: 24, display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ padding: 12, borderRadius: 12, background: 'var(--bg-tertiary)', color: 'var(--accent-info)' }}>
               <Users size={20} />
            </div>
            <div>
               <div style={{ fontSize: '1.5rem', fontWeight: 950 }}>1,240</div>
               <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Active Scholars</div>
            </div>
         </div>
         <div className="card" style={{ padding: 24, display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ padding: 12, borderRadius: 12, background: 'var(--bg-tertiary)', color: 'var(--accent-success)' }}>
               <Trophy size={20} />
            </div>
            <div>
               <div style={{ fontSize: '1.5rem', fontWeight: 950 }}>84</div>
               <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Blueprints Mastered</div>
            </div>
         </div>
         <div className="card" style={{ padding: 24, display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ padding: 12, borderRadius: 12, background: 'var(--bg-tertiary)', color: 'var(--accent-warning)' }}>
               <Target size={20} />
            </div>
            <div>
               <div style={{ fontSize: '1.5rem', fontWeight: 950 }}>2.4M</div>
               <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Total Retention Lift</div>
            </div>
         </div>
      </div>
    </div>
  );
}
