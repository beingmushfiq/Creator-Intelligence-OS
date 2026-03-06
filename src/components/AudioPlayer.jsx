import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, X, Download, AudioWaveform, Sparkles } from 'lucide-react';
import { useCreator } from '../context/CreatorContext';

export default function AudioPlayer() {
  const { currentAudio, setCurrentAudio } = useCreator();
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (currentAudio) {
      if (audioRef.current) {
        audioRef.current.play().catch(e => console.error("Auto-play blocked", e));
        setIsPlaying(true);
      }
    }
  }, [currentAudio]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) audioRef.current.pause();
      else audioRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      setProgress((current / duration) * 100);
    }
  };

  const closePlayer = () => {
    if (audioRef.current) audioRef.current.pause();
    setCurrentAudio(null);
    setIsPlaying(false);
  };

  if (!currentAudio) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 100, opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        style={{
          position: 'fixed',
          bottom: 40,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '90%',
          maxWidth: 720,
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pointerEvents: 'none'
        }}
      >
        <div 
          className="glass glass-strong" 
          style={{ 
            width: '100%', 
            padding: '16px 24px', 
            borderRadius: 24, 
            display: 'flex', 
            alignItems: 'center', 
            gap: 20,
            boxShadow: 'var(--shadow-glow)',
            border: '1px solid var(--accent-primary)30',
            pointerEvents: 'auto'
          }}
        >
          <audio 
            ref={audioRef} 
            src={currentAudio} 
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => setIsPlaying(false)}
          />

          {/* Icon / Play Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={togglePlay}
              className="glow-border"
              style={{
                width: 48, height: 48, borderRadius: 16,
                background: 'var(--gradient-aurora)',
                color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 20px rgba(124, 92, 252, 0.4)',
                border: 'none', cursor: 'pointer'
              }}
            >
              {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" style={{ marginLeft: 3 }} />}
            </motion.button>
            
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: '0.95rem', fontWeight: 900, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6, letterSpacing: '-0.02em' }}>
                Neural Voice Synthesis <Sparkles size={12} color="var(--accent-secondary)" />
              </div>
              <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                 Playing Script Audio
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 12 }}>
             <AudioWaveform size={18} color="var(--accent-primary)" className={isPlaying ? 'animate-pulse' : ''} style={{ opacity: isPlaying ? 1 : 0.5 }} />
             <div style={{ flex: 1, position: 'relative', height: 6, background: 'var(--bg-tertiary)', borderRadius: 100, overflow: 'hidden' }}>
               <div 
                 style={{ 
                   position: 'absolute', top: 0, left: 0, height: '100%', 
                   background: 'var(--gradient-primary)', 
                   width: `${progress}%`,
                   transition: 'width 0.1s linear'
                 }}
               />
             </div>
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <a 
              href={currentAudio} 
              download="neural-audio.mp3"
              className="glass-hover"
              style={{ padding: 12, borderRadius: 12, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
              title="Download Audio"
            >
              <Download size={18} />
            </a>
            <button 
              onClick={closePlayer}
              className="glass-hover"
              style={{ padding: 12, borderRadius: 12, color: 'var(--accent-danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
            >
              <X size={18} />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
