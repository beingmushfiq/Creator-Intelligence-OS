import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, Shuffle, Wand2, X, Check, Layers, Zap, FileText, ListChecks, Trash2, Play, Plus, RefreshCw, AlertCircle } from 'lucide-react';
import { useCreator } from '../context/CreatorContext.jsx';

const RANDOM_TOPICS = [
  'Why the diamond industry is a manufactured illusion',
  'The hidden economics of free-to-play mobile games',
  'How social media algorithms exploit cognitive biases',
  'The psychology behind luxury brand pricing',
  'Why most productivity advice is designed to fail',
  'The real reason streaming services are raising prices',
  'How dark patterns manipulate user behavior online',
  'The truth about "organic" food labeling',
  'Why college textbooks cost so much',
  'The hidden costs of fast fashion',
  'How insurance companies calculate risk',
  'The psychology of FOMO in cryptocurrency',
  'Why airport food is so expensive',
  'The business model behind free VPNs',
  'How influencer marketing actually works',
];

const PRESET_TONES = [
  { value: 'Neutral',       label: '🎯 Neutral' },
  { value: 'Analytical',    label: '📊 Analytical' },
  { value: 'Aggressive',    label: '🔥 Aggressive' },
  { value: 'Philosophical', label: '🧠 Philosophical' },
  { value: 'Satirical',     label: '😏 Satirical' },
];

const GENERATION_MODES = [
  { id: 'full',   label: 'Full Strategy', icon: Layers   },
  { id: 'quick',  label: 'Quick Outline', icon: Zap      },
  { id: 'script', label: 'Script Focus',  icon: FileText },
  { id: 'custom', label: 'Custom',        icon: Wand2    },
];

const STARTER_HINTS = [
  'Like a late-night documentary narrator who never sugarcoats',
  'Think of a skeptical economist meets stand-up comedian',
  'Conversational but data-heavy — like a podcast you can\'t pause',
  'As if a philosophy professor is writing YouTube titles',
  'Bold, punchy, and slightly provocative — like MrBeast meets Veritasium',
];

export default function TopicInput() {
  const { 
    tone, setTone, generate, loading,
    batchMode, setBatchMode, batchQueue, addToBatch, 
    removeFromBatch, processBatch, clearBatch 
  } = useCreator();
  const [input, setInput] = useState('');
  const [mode, setMode] = useState('full');
  const [focused, setFocused] = useState(false);

  // Custom tone state
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customDraft, setCustomDraft] = useState('');
  const [customLabel, setCustomLabel] = useState('');    // display label
  const [customActive, setCustomActive] = useState(false);
  const textareaRef = useRef(null);

  // Focus textarea when modal opens
  useEffect(() => {
    if (showCustomModal && textareaRef.current) {
      setTimeout(() => textareaRef.current?.focus(), 50);
    }
  }, [showCustomModal]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      if (batchMode) {
        addToBatch(input.trim(), tone);
        setInput('');
      } else {
        generate(input.trim());
      }
    }
  };

  const handleRandomTopic = () => {
    setInput(RANDOM_TOPICS[Math.floor(Math.random() * RANDOM_TOPICS.length)]);
  };

  // When a preset tone is selected, clear custom
  const handlePresetTone = (val) => {
    setTone(val);
    setCustomActive(false);
    setCustomLabel('');
  };

  // Apply custom tone — store as 'custom:<description>'
  const handleApplyCustom = () => {
    if (!customDraft.trim()) return;
    setTone(`custom:${customDraft.trim()}`);
    setCustomLabel(customDraft.trim().slice(0, 40) + (customDraft.trim().length > 40 ? '…' : ''));
    setCustomActive(true);
    setShowCustomModal(false);
    setCustomDraft('');
  };

  const handleClearCustom = () => {
    setCustomActive(false);
    setCustomLabel('');
    setTone('Analytical');
  };

  const displayTone = customActive
    ? customLabel
    : (PRESET_TONES.find(t => t.value === tone)?.label || tone);

  return (
    <div className="hero-input-section">
      <form onSubmit={handleSubmit}>
        {/* ── Main Input Pill ── */}
        <motion.div
          className={`hero-input-card ${focused ? 'focused' : ''}`}
          animate={{
            boxShadow: focused
              ? '0 0 0 2px var(--accent-primary), 0 8px 40px rgba(124,92,252,0.2)'
              : '0 4px 20px rgba(0,0,0,0.3)',
          }}
          transition={{ duration: 0.2 }}
        >
          {/* Sparkle icon */}
          <div className="hero-input-icon">
            <Sparkles size={18} color="var(--accent-primary)" />
          </div>

          {/* Text input */}
          <input
            type="text"
            className="hero-input-field"
            placeholder="Enter your core content idea or deep-dive topic..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            disabled={loading}
          />

          {/* Random shuffle */}
          <button
            type="button"
            onClick={handleRandomTopic}
            disabled={loading}
            className="hero-shuffle-btn"
            title="Random Topic"
          >
            <Shuffle size={15} />
          </button>

          {/* Divider */}
          <div className="hero-input-divider" />

          {/* Tone selector */}
          {customActive ? (
            /* Custom tone badge */
            <div className="custom-tone-badge">
              <Wand2 size={12} />
              <span title={tone.slice(7)}>{displayTone}</span>
              <button
                type="button"
                className="custom-tone-clear"
                onClick={handleClearCustom}
                title="Remove custom tone"
              >
                <X size={11} />
              </button>
            </div>
          ) : (
            <select
              className="hero-tone-select"
              value={tone}
              onChange={e => handlePresetTone(e.target.value)}
            >
              {PRESET_TONES.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          )}

          <button
            type="button"
            className={`custom-tone-btn ${customActive ? 'active' : ''}`}
            onClick={() => setShowCustomModal(true)}
            title="Define custom tone"
          >
            <Wand2 size={14} />
          </button>

          {/* Batch Mode Toggle */}
          <button
            type="button"
            className={`custom-tone-btn ml-1 ${batchMode ? 'active text-[var(--accent-primary)]' : ''}`}
            onClick={() => setBatchMode(!batchMode)}
            title="Toggle Batch Mode"
          >
            <Layers size={14} />
          </button>

          {/* Divider */}
          <div className="hero-input-divider" />

          {/* Generate */}
          <motion.button
            type="submit"
            className={`hero-generate-btn ${batchMode ? 'bg-[var(--bg-tertiary)] border-[var(--border-subtle)]' : ''}`}
            disabled={loading || !input.trim()}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {loading ? (
              <><div className="spinner" style={{ width: 14, height: 14 }} /><span>{batchMode ? 'Adding…' : 'Generating…'}</span></>
            ) : (
              <>{batchMode ? <Plus size={15} /> : <Send size={15} />}<span>{batchMode ? 'Queue' : 'Generate'}</span></>
            )}
          </motion.button>
        </motion.div>

        {/* ── Batch Queue Info ── */}
        <AnimatePresence>
          {batchMode && batchQueue.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] shadow-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <ListChecks size={16} className="text-[var(--accent-primary)]" />
                  <span>Batch Queue ({batchQueue.length})</span>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    type="button"
                    onClick={clearBatch}
                    className="text-xs text-[var(--text-tertiary)] hover:text-red-400 transition-colors"
                  >
                    Clear All
                  </button>
                  <motion.button
                    type="button"
                    onClick={processBatch}
                    disabled={loading}
                    className="px-4 py-1.5 rounded-lg bg-[var(--accent-primary)] text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-[var(--accent-primary)]/20"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Play size={12} fill="white" />
                    Process Batch
                  </motion.button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                {batchQueue.map((item) => (
                  <div 
                    key={item.id}
                    className="group relative px-3 py-1.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] text-xs flex items-center gap-2 animate-in fade-in slide-in-from-left-2"
                  >
                    <span className="max-w-[120px] truncate opacity-80">{item.topic}</span>
                    <span className="text-[10px] opacity-40 uppercase font-bold">{item.tone}</span>
                    {item.status === 'generating' && <RefreshCw size={10} className="animate-spin text-[var(--accent-primary)]" />}
                    {item.status === 'done' && <Check size={10} className="text-green-500" />}
                    {item.status === 'error' && <AlertCircle size={10} className="text-red-500" />}
                    <button
                      type="button"
                      onClick={() => removeFromBatch(item.id)}
                      className="opacity-0 group-hover:opacity-100 hover:text-red-400 transition-all ml-1"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Generation Mode Chips ── */}
        <div className="gen-mode-row">
          {GENERATION_MODES.map(m => {
            const Icon = m.icon;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setMode(m.id)}
                className={`gen-mode-chip ${mode === m.id ? 'active' : ''}`}
              >
                <Icon size={13} />
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>
      </form>

      {/* ══════════════════════════════════
          Custom Tone Modal (Portaled)
          ══════════════════════════════════ */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {showCustomModal && (
            <div className="modal-backdrop">
              {/* Overlay for closing */}
              <motion.div
                className="modal-backdrop-overlay"
                style={{ position: 'absolute', inset: 0 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowCustomModal(false)}
              />

              {/* Modal */}
              <motion.div
                className="custom-tone-modal"
                initial={{ opacity: 0, scale: 0.92, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 20 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              >
                {/* Header */}
                <div className="ctm-header">
                  <div className="ctm-header-left">
                    <div className="ctm-icon"><Wand2 size={16} color="var(--accent-primary)" /></div>
                    <div>
                      <div className="ctm-title">Custom Tone</div>
                      <div className="ctm-subtitle">Describe how you want the AI to think & write</div>
                    </div>
                  </div>
                  <button className="icon-btn" onClick={() => setShowCustomModal(false)}>
                    <X size={16} />
                  </button>
                </div>

                {/* Textarea */}
                <div className="ctm-body">
                  <textarea
                    ref={textareaRef}
                    className="ctm-textarea"
                    placeholder="e.g. 'Think like a skeptical economist meets stand-up comedian — challenge every assumption, use dark humor, cite obscure data points, and always end with a provocative question the audience didn't expect.'"
                    value={customDraft}
                    onChange={e => setCustomDraft(e.target.value)}
                    rows={5}
                    maxLength={600}
                  />
                  <div className="ctm-char-count">{customDraft.length}/600</div>

                  {/* Starter hints */}
                  <div className="ctm-hints-label">Try a starter:</div>
                  <div className="ctm-hints">
                    {STARTER_HINTS.map((h, i) => (
                      <button
                        key={i}
                        type="button"
                        className="ctm-hint-chip"
                        onClick={() => setCustomDraft(h)}
                      >
                        {h}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="ctm-footer">
                  <button
                    type="button"
                    className="btn-ghost"
                    onClick={() => setShowCustomModal(false)}
                  >
                    Cancel
                  </button>
                  <motion.button
                    type="button"
                    className="btn-primary"
                    onClick={handleApplyCustom}
                    disabled={!customDraft.trim()}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Check size={14} />
                    Apply Tone
                  </motion.button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
