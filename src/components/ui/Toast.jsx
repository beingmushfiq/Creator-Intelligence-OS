import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, AlertCircle, Info, X } from 'lucide-react';

const variants = {
  initial: { opacity: 0, y: 50, scale: 0.9 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
};

const icons = {
  success: <Check size={18} />,
  error: <AlertCircle size={18} />,
  info: <Info size={18} />
};

const colors = {
  success: 'var(--accent-primary)', // Using global theme color for success usually, or specifically green
  error: '#ff4d4d',
  info: '#3b82f6'
};

const bgColors = {
  success: 'rgba(0, 255, 128, 0.1)',
  error: 'rgba(255, 77, 77, 0.1)',
  info: 'rgba(59, 130, 246, 0.1)'
};

const borderColors = {
  success: 'rgba(0, 255, 128, 0.2)',
  error: 'rgba(255, 77, 77, 0.2)',
  info: 'rgba(59, 130, 246, 0.2)'
};

export default function Toast({ id, message, type = 'info', onClose }) {
  // Map 'success' to our brand neon green if not defined elsewhere, 
  // but let's stick to specific distinct colors for alerts.
  // Actually, let's use the theme variables where possible.
  
  const getStyles = (t) => {
    switch(t) {
      case 'success': return { icon: <Check size={18} color="#00ff80" />, border: '1px solid rgba(0, 255, 128, 0.3)', bg: 'rgba(0, 20, 10, 0.9)' };
      case 'error': return { icon: <AlertCircle size={18} color="#ff4d4d" />, border: '1px solid rgba(255, 77, 77, 0.3)', bg: 'rgba(20, 0, 0, 0.9)' }; 
      default: return { icon: <Info size={18} color="#3b82f6" />, border: '1px solid rgba(59, 130, 246, 0.3)', bg: 'rgba(0, 10, 20, 0.9)' };
    }
  };

  const style = getStyles(type);

  return (
    <motion.div
      layout
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        background: style.bg,
        border: style.border,
        backdropFilter: 'blur(10px)',
        padding: '12px 16px',
        borderRadius: '8px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        minWidth: '280px',
        maxWidth: '400px',
        pointerEvents: 'auto', // Re-enable clicks
        cursor: 'default'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {style.icon}
      </div>
      <p style={{ margin: 0, fontSize: '0.9rem', color: '#fff', flex: 1 }}>{message}</p>
      <button 
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          color: 'rgba(255,255,255,0.5)',
          cursor: 'pointer',
          padding: 4,
          display: 'flex'
        }}
      >
        <X size={14} />
      </button>
    </motion.div>
  );
}
