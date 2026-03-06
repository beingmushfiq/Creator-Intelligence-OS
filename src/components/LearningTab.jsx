import React from 'react';
import { motion } from 'framer-motion';
import { 
  GraduationCap, PlayCircle, BookOpen, Target, Zap, 
  ArrowRight, Star, Clock, Trophy, Users, Sparkles,
  ChevronRight, Brain, Briefcase, Rocket, ShieldCheck
} from 'lucide-react';

const COURSES = [
  {
    title: 'Narrative Architecture',
    description: 'Master the high-tension script structures that maximize retention velocity.',
    icon: Brain,
    duration: '15 min',
    lessons: 6,
    color: 'var(--accent-primary)',
    progress: 80
  },
  {
    title: 'Visual Retention DNA',
    description: 'Advanced pacing mechanics and visual interest index optimization.',
    icon: Rocket,
    duration: '22 min',
    lessons: 8,
    color: 'var(--accent-secondary)',
    progress: 35
  },
  {
    title: 'Community Equilibrium',
    description: 'Building sustainable engagement loops and flywheel orchestration.',
    icon: Users,
    duration: '18 min',
    lessons: 5,
    color: 'var(--accent-warning)',
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
    <div className="tab-content animate-slide-up">
      <div className="tab-header" style={{ marginBottom: 40 }}>
        <div className="stagger-children">
          <h2 className="tab-title text-gradient-aurora" style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.04em' }}>Intelligence Academy</h2>
          <p className="tab-subtitle" style={{ fontSize: '1.1rem' }}>Saturate your creator IQ with precision-engineered operational modules</p>
        </div>
        <div className="glass" style={{ padding: '8px 20px', borderRadius: 100, fontSize: '0.8rem', fontWeight: 900, color: 'var(--accent-success)', background: 'rgba(34, 197, 94, 0.05)', display: 'flex', alignItems: 'center', gap: 8 }}>
           <Trophy size={14} />
           <span>MASTER RANK 08</span>
        </div>
      </div>

      <div className="stagger-children" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: 28 }}>
         {COURSES.map((course, i) => (
            <motion.div 
               key={i} 
               whileHover={{ y: -8 }}
               className="glass glass-hover" 
               style={{ padding: 40, borderRadius: 32, position: 'relative', overflow: 'hidden' }}
            >
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
                  <div className="glow-border" style={{ width: 56, height: 56, borderRadius: 16, background: 'var(--bg-tertiary)', color: course.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     <course.icon size={28} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-tertiary)', fontSize: '0.8rem', fontWeight: 800 }}>
                     <Clock size={14} />
                     <span>{course.duration}</span>
                  </div>
               </div>

               <h3 style={{ fontSize: '1.5rem', fontWeight: 950, marginBottom: 16, lineHeight: 1.2 }}>{course.title}</h3>
               <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 32 }}>{course.description}</p>

               <div style={{ marginBottom: 32 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                     <span style={{ fontSize: '0.7rem', fontWeight: 950, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Module Progress</span>
                     <span style={{ fontSize: '0.7rem', fontWeight: 950, color: course.color }}>{course.progress}%</span>
                  </div>
                  <div style={{ width: '100%', height: 6, background: 'var(--bg-tertiary)', borderRadius: 10, overflow: 'hidden' }}>
                     <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${course.progress}%` }}
                        transition={{ duration: 1, delay: i * 0.1 }}
                        style={{ height: '100%', background: course.color, boxShadow: `0 0 10px ${course.color}40` }} 
                     />
                  </div>
               </div>

               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-tertiary)', fontSize: '0.8rem', fontWeight: 800 }}>
                     <PlayCircle size={14} />
                     <span>{course.lessons} Modules</span>
                  </div>
                  <button 
                     className="btn-secondary" 
                     style={{ padding: '10px 24px', borderRadius: 100, fontSize: '0.85rem', fontWeight: 900, background: course.progress > 0 ? 'var(--bg-tertiary)' : 'var(--accent-primary)', color: course.progress > 0 ? 'var(--text-primary)' : '#fff', border: 'none' }}
                  >
                     <span>{course.progress > 0 ? 'Resume' : 'Initiate'}</span>
                     <ChevronRight size={16} />
                  </button>
               </div>
            </motion.div>
         ))}
      </div>

      {/* Featured Insight Section */}
      <motion.div 
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         className="glass" 
         style={{ marginTop: 40, padding: 40, borderRadius: 32, background: 'var(--gradient-primary)05', border: '1px solid var(--accent-primary)20', position: 'relative', overflow: 'hidden' }}
      >
         <div style={{ position: 'absolute', right: -20, top: -20, opacity: 0.1 }}>
            <Sparkles size={160} color="var(--accent-primary)" />
         </div>
         
         <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
            <Zap size={20} color="var(--accent-primary)" />
            <h4 style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--accent-primary)' }}>Tactical Alpha</h4>
         </div>
         <p style={{ fontSize: '1rem', color: 'var(--text-primary)', fontWeight: 600, maxWidth: 800, lineHeight: 1.7, margin: 0 }}>
            Analysis of 500+ top-performing videos shows that using a "pattern interrupt" within the first 8 seconds increases retention by up to 34%. Explore the "Visual Retention DNA" module to master this mechanic.
         </p>
      </motion.div>
    </div>
  );
}
