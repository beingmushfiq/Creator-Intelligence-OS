import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, X, Volume2, Download, FastForward } from 'lucide-react';
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
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 left-[var(--sidebar-width)] right-0 bg-bg-card border-t border-accent-primary/20 p-4 z-50 backdrop-blur-lg shadow-[0_-5px_20px_rgba(0,0,0,0.3)]"
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <audio 
            ref={audioRef} 
            src={currentAudio} 
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => setIsPlaying(false)}
          />

          <div className="flex items-center gap-4">
            <button 
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-accent-primary text-white flex items-center justify-center hover:scale-105 transition-transform"
            >
              {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
            </button>
            
            <div>
              <div className="text-sm font-bold text-text-primary">Script Read-Through</div>
              <div className="text-xs text-text-tertiary">AI Voice Narrator</div>
            </div>
          </div>

          <div className="flex-1 mx-4 relative h-1 bg-bg-tertiary rounded-full overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-accent-primary" 
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center gap-2">
            <a 
              href={currentAudio} 
              download="script-audio.mp3"
              className="p-2 text-text-tertiary hover:text-text-primary transition-colors"
              title="Download Audio"
            >
              <Download size={18} />
            </a>
            <button 
              onClick={closePlayer}
              className="p-2 text-text-tertiary hover:text-red-500 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
