import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Trash2, X, AlertTriangle } from 'lucide-react';

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
      <motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
>
  <motion.div
    initial={{ scale: 0.95, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    exit={{ scale: 0.95, opacity: 0 }}
    className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl p-6 w-full max-w-md shadow-2xl"
  >
    <div className="flex items-start gap-4 mb-6">
      <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
        <AlertTriangle size={24} className="text-amber-500" />
      </div>
      <div>
        <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Save Current Project?</h3>
        <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
          You are about to start a new project. Would you like to save your current work first?
          <br /><br />
          <span className="text-[var(--text-tertiary)] italic">Unsaved changes will be lost forever.</span>
        </p>
      </div>
    </div>

    <div className="flex justify-end gap-3">
      <button
        onClick={onClose}
        disabled={isSaving}
        className="px-4 py-2 rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors"
      >
        Cancel
      </button>

      <button
        onClick={onDiscardAndNew}
        disabled={isSaving}
        className="px-4 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2"
      >
        <Trash2 size={16} />
        Discard
      </button>

      <button
        onClick={handleSave}
        disabled={isSaving}
        className="px-4 py-2 rounded-lg text-sm font-medium bg-[var(--accent-primary)] text-white hover:opacity-90 transition-opacity flex items-center gap-2 shadow-lg shadow-[var(--accent-primary)]/20"
      >
        {isSaving ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Save size={16} />
            Save & New
          </>
        )}
      </button>
    </div>
  </motion.div>
</motion.div>
    </AnimatePresence>
  );
}
