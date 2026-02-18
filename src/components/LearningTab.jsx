import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, PlayCircle, BookOpen, Target, Zap, ArrowRight, Star } from 'lucide-react';

const COURSES = [
  {
    title: 'The Viral Hook Formula',
    description: 'Master the first 3 seconds of your videos to maximize retention.',
    icon: Zap,
    duration: '15 min',
    lessons: 5,
    color: '#F59E0B'
  },
  {
    title: 'Algorithmic Psychology',
    description: 'Understand how platforms prioritize content based on human behavior.',
    icon: Target,
    duration: '25 min',
    lessons: 8,
    color: '#8B5CF6'
  },
  {
    title: 'Multi-Platform Scaling',
    description: 'How to repurpose one master piece of content into a 20-asset ecosystem.',
    icon: PlayCircle,
    duration: '20 min',
    lessons: 6,
    color: '#10B981'
  },
  {
    title: 'Creator Monetization 2.0',
    description: 'Moving beyond AdSense to high-ticket sponsorships and affiliate networks.',
    icon: Star,
    duration: '30 min',
    lessons: 10,
    color: '#3B82F6'
  }
];

export default function LearningTab() {
  return (
    <div className="tab-content" style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div className="tab-header" style={{ marginBottom: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <GraduationCap size={28} className="text-gradient" />
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>Creator Academy</h2>
        </div>
        <p style={{ color: 'var(--text-tertiary)', fontSize: '1rem' }}>
          Master the art and science of high-performance content creation.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginBottom: 48 }}>
        {COURSES.map((course, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="card hover-glow"
            style={{
              padding: 24,
              display: 'flex',
              flexDirection: 'column',
              cursor: 'pointer',
              border: '1px solid var(--border-subtle)',
              transition: 'transform 0.2s ease'
            }}
            whileHover={{ y: -5 }}
          >
            <div style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: `${course.color}20`,
              color: course.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 20
            }}>
              <course.icon size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 12 }}>{course.title}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, flex: 1, marginBottom: 20 }}>
              {course.description}
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', display: 'flex', gap: 12 }}>
                <span>{course.duration}</span>
                <span>•</span>
                <span>{course.lessons} lessons</span>
              </div>
              <ArrowRight size={18} style={{ color: course.color }} />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="card" style={{ padding: '32px', background: 'var(--gradient-primary)', borderRadius: 20, color: '#fff', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '600px' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 12 }}>Join the Private Mastermind</h3>
          <p style={{ fontSize: '1rem', opacity: 0.9, marginBottom: 24, lineHeight: 1.6 }}>
            Connect with 5,000+ high-performance creators, get weekly deep-dives, and receive direct feedback from our AI Content Coach.
          </p>
          <button style={{
            background: '#fff',
            color: 'var(--accent-primary)',
            padding: '12px 24px',
            borderRadius: 12,
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer'
          }}>
            Unlock Pro Access
          </button>
        </div>
        <BookOpen size={200} style={{ position: 'absolute', right: -40, bottom: -40, opacity: 0.1, transform: 'rotate(-15deg)' }} />
      </div>
    </div>
  );
}
