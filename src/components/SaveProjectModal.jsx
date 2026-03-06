import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Trash2, X, AlertTriangle, Zap, LogOut, ChevronRight } from 'lucide-react';

export function SaveProjectModal({ isOpen, onClose, onSaveAndNew, onDiscardAndNew }) {
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    setIsSaving(true);
    await onSaveAndNew();
    setIsSaving(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[2000] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
        />
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="glass"
          style={{
            width: '100%',
            maxWidth: 480,
            padding: 40,
            borderRadius: 32,
            position: 'relative',
            zIndex: 2010,
            boxShadow: 'var(--shadow-glow)',
            border: '1px solid var(--border-medium)',
            background: 'rgba(15, 15, 20, 0.95)'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div className="glow-border" style={{ 
              width: 80, height: 80, borderRadius: 24, 
              background: 'rgba(245, 158, 11, 0.1)', 
              color: '#f59e0b', 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 32,
              boxShadow: '0 0 30px rgba(245,158,11,0.2)'
            }}>
              <AlertTriangle size={36} />
            </div>
            
            <h3 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: 16, letterSpacing: '-0.02em' }}>Initialize New Project?</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 40, fontSize: '1rem' }}>
              Your current workspace contains active intelligence nodes. Synchronize data before terminating the session?
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 12 }}>
               <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="btn-primary"
                  style={{ padding: '18px', borderRadius: 16, fontSize: '1rem', fontWeight: 900, width: '100%', justifyContent: 'center' }}
               >
                  {isSaving ? (
                     <Zap size={20} className="animate-spin" />
                  ) : (
                     <Save size={20} />
                  )}
                  <span>Save Intelligence & New</span>
               </button>

               <div style={{ display: 'flex', gap: 12 }}>
                  <button
                     onClick={onDiscardAndNew}
                     disabled={isSaving}
                     className="btn-ghost"
                     style={{ flex: 1, padding: '14px', borderRadius: 12, color: 'var(--accent-error)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                  >
                     <Trash2 size={16} />
                     <span style={{ fontWeight: 800 }}>Discard Nodes</span>
                  </button>
                  <button
                     onClick={onClose}
                     disabled={isSaving}
                     className="btn-ghost"
                     style={{ flex: 1, padding: '14px', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                  >
                     <X size={16} />
                     <span style={{ fontWeight: 800 }}>Stay in Loop</span>
                  </button>
               </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
