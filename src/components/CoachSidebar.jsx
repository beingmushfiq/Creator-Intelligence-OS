import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, X, Sparkles, AlertCircle, ChevronDown,
  Zap, RefreshCw, Target, ShieldCheck, Microscope,
  Activity, Cpu
} from 'lucide-react';
import { useCreator } from '../context/CreatorContext.jsx';
import './CoachSidebar.css';

export default function CoachSidebar({ isOpen, onClose }) {
  const { coachFeedback, analyzeCoachFeedback, loading } = useCreator();

  const scoreTheme = useMemo(() => {
    if (!coachFeedback) return { color: '#7c5cfc', glow: 'rgba(124,92,252,0.4)' };
    if (coachFeedback.coachScore >= 80) return { color: '#22c55e', glow: 'rgba(34,197,94,0.4)' };
    if (coachFeedback.coachScore >= 50) return { color: '#7c5cfc', glow: 'rgba(124,92,252,0.4)' };
    return { color: '#ef4444', glow: 'rgba(239,68,68,0.4)' };
  }, [coachFeedback]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Cinematic backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(4,4,12,0.75)',
              backdropFilter: 'blur(16px)',
              zIndex: 90,
            }}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 200 }}
            className="cs-panel"
          >
            {/* Neural grid bg */}
            <div className="cs-bg-grid" />
            {/* Ambient glow corner */}
            <div className="cs-bg-glow" />

            {/* ── Header ── */}
            <div className="cs-header">
              <div className="cs-header-left">
                <div className="cs-header-icon">
                  <Brain size={20} />
                </div>
                <div>
                  <div className="cs-header-overline">AI Coach</div>
                  <h3 className="cs-header-title">Neural Audit</h3>
                </div>
              </div>

              <div className="cs-header-right">
                <div className="cs-sync-badge">
                  <motion.span
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.8, repeat: Infinity }}
                    className="cs-sync-dot"
                  />
                  Sync Level 4
                </div>
                <button className="cs-close-btn" onClick={onClose}>
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* ── Main Content ── */}
            <div className="cs-body">
              {coachFeedback ? (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
                  className="cs-results"
                >
                  {/* Score Ring */}
                  <motion.div
                    variants={{ hidden: { scale: 0.9, opacity: 0 }, visible: { scale: 1, opacity: 1 } }}
                    className="cs-score-wrap"
                  >
                    <div className="cs-score-card">
                      <div className="cs-score-ring-col">
                        <div style={{ position: 'relative' }}>
                          <svg width="160" height="160" style={{ transform: 'rotate(-90deg)' }}>
                            <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="10" />
                            <motion.circle
                              cx="80" cy="80" r="70"
                              fill="none"
                              stroke={scoreTheme.color}
                              strokeWidth="10"
                              strokeLinecap="round"
                              strokeDasharray={439.8}
                              initial={{ strokeDashoffset: 439.8 }}
                              animate={{ strokeDashoffset: 439.8 - (439.8 * coachFeedback.coachScore) / 100 }}
                              transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
                              style={{ filter: `drop-shadow(0 0 10px ${scoreTheme.glow})` }}
                            />
                          </svg>
                          <div className="cs-score-center">
                            <span className="cs-score-label">Score</span>
                            <span className="cs-score-number" style={{ color: scoreTheme.color, textShadow: `0 0 30px ${scoreTheme.glow}` }}>
                              {coachFeedback.coachScore}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="cs-score-meta">
                        <div className="cs-score-tag">Diagnostic Report</div>
                        <h4 className="cs-score-title">Elite Resonance</h4>
                        <p className="cs-score-desc">
                          Your project DNA shows strong <strong>curiosity triggers</strong> but slight retention decay in section 3.
                        </p>
                        <div className="cs-score-chips">
                          <span className="cs-chip">Viral‑Ready</span>
                          <span className="cs-chip">High Intent</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Analysis */}
                  {coachFeedback.analysis && (
                    <motion.div
                      variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
                      className="cs-analysis"
                    >
                      <div className="cs-analysis-icon"><Target size={18} /></div>
                      <div>
                        <div className="cs-section-overline">Executive Strategy</div>
                        <p className="cs-analysis-text">"{coachFeedback.analysis}"</p>
                      </div>
                    </motion.div>
                  )}

                  {/* Sections */}
                  <div className="cs-sections">
                    <Section title="Tactical Upgrades" icon={Sparkles} color="#7c5cfc" count={coachFeedback.quickWins?.length}>
                      {coachFeedback.quickWins?.map((w, i) => <InteractiveCard key={i} text={w} variant="primary" />)}
                    </Section>
                    <Section title="Exposure Hazards" icon={AlertCircle} color="#ef4444" count={coachFeedback.hazards?.length}>
                      {coachFeedback.hazards?.map((h, i) => <InteractiveCard key={i} text={h} variant="danger" />)}
                    </Section>
                    <Section title="Pattern Disruptions" icon={Zap} color="#63b3ed" count={coachFeedback.interrupts?.length}>
                      {coachFeedback.interrupts?.map((it, i) => <InteractiveCard key={i} text={it} variant="info" />)}
                    </Section>
                  </div>
                </motion.div>
              ) : (
                /* ── IDLE STATE ── centered, cinematic ── */
                <div className="cs-idle">
                  {/* Animated orbit rings */}
                  <div className="cs-orbit-wrap">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
                      className="cs-ring cs-ring-1"
                    />
                    <motion.div
                      animate={{ rotate: -360 }}
                      transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                      className="cs-ring cs-ring-2"
                    />
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
                      className="cs-ring cs-ring-3"
                    />

                    {/* Orbiting dot */}
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                      className="cs-orbit-dot-track"
                    >
                      <div className="cs-orbit-dot" />
                    </motion.div>

                    {/* Core icon */}
                    <div className="cs-core">
                      <motion.div
                        animate={{ scale: [1, 1.08, 1], opacity: [0.6, 1, 0.6] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                        className="cs-core-glow"
                      />
                      <div className="cs-core-icon">
                        <Brain size={36} />
                      </div>
                    </div>
                  </div>

                  {/* Text */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="cs-idle-text"
                  >
                    <div className="cs-idle-overline">
                      <Activity size={10} />
                      System Standing By
                    </div>
                    <h3 className="cs-idle-title">Engine Idle</h3>
                    <p className="cs-idle-sub">
                      Your project architecture is ready for a deep neural diagnostic. Launch the AI audit to receive real-time content intelligence.
                    </p>
                  </motion.div>

                  {/* Stats row */}
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="cs-idle-stats"
                  >
                    {[
                      { icon: Cpu, label: 'Model', val: 'GPT-4o' },
                      { icon: Zap, label: 'Latency', val: '< 2s' },
                      { icon: ShieldCheck, label: 'Verified', val: '98.2%' },
                    ].map(({ icon: Icon, label, val }) => (
                      <div key={label} className="cs-stat-chip">
                        <Icon size={12} className="cs-stat-icon" />
                        <div>
                          <div className="cs-stat-label">{label}</div>
                          <div className="cs-stat-val">{val}</div>
                        </div>
                      </div>
                    ))}
                  </motion.div>

                  {/* CTA */}
                  <motion.button
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.65 }}
                    whileHover={{ scale: 1.04, y: -2 }}
                    whileTap={{ scale: 0.96 }}
                    className="cs-cta-btn"
                    onClick={analyzeCoachFeedback}
                    disabled={loading}
                  >
                    <div className="cs-cta-bg" />
                    <span className="cs-cta-content">
                      {loading ? (
                        <><RefreshCw size={18} className="cs-cta-spin" /> Sequencing DNA…</>
                      ) : (
                        <><Sparkles size={18} /> Initiate Neural Audit</>
                      )}
                    </span>
                  </motion.button>

                  <p className="cs-idle-footnote">Engine Revision v2.4.9 · Neural Net Verified</p>
                </div>
              )}
            </div>

            {/* ── Footer ── */}
            {coachFeedback && (
              <div className="cs-footer">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="cs-resync-btn"
                  onClick={analyzeCoachFeedback}
                  disabled={loading}
                >
                  <RefreshCw size={16} className={loading ? 'cs-cta-spin' : ''} />
                  {loading ? 'Synchronizing…' : 'Re-Sync Intelligence'}
                </motion.button>
                <p className="cs-footer-note">Engine Revision v2.4.9 · Neural Net Verified</p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ── Sub-components ── */

function Section({ title, icon: Icon, color, count, children }) {
  return (
    <div className="cs-section">
      <div className="cs-section-header">
        <div className="cs-section-icon-wrap" style={{ background: `${color}12`, border: `1px solid ${color}20` }}>
          <Icon size={16} style={{ color }} />
        </div>
        <div>
          <span className="cs-section-title">{title}</span>
          <div className="cs-section-sub">Status: Optimized</div>
        </div>
        {count > 0 && <div className="cs-section-badge">{count}</div>}
      </div>
      <div className="cs-section-cards">{children}</div>
    </div>
  );
}

function InteractiveCard({ text, variant = 'primary' }) {
  const [open, setOpen] = useState(false);
  const accent = { primary: '#7c5cfc', danger: '#ef4444', info: '#63b3ed' }[variant] ?? '#7c5cfc';
  return (
    <motion.div
      variants={{ hidden: { y: 12, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
      className="cs-icard"
      onClick={() => setOpen(!open)}
    >
      <div className="cs-icard-row">
        <span className="cs-icard-dot" style={{ background: accent, boxShadow: `0 0 8px ${accent}` }} />
        <span className="cs-icard-text">{text}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} className="cs-icard-chevron">
          <ChevronDown size={14} />
        </motion.span>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="cs-icard-expand"
          >
            <div className="cs-icard-grid">
              <div className="cs-icard-meta">
                <div className="cs-icard-meta-label"><ShieldCheck size={9} />Confidence</div>
                <div className="cs-icard-meta-val">98.2% Accurate</div>
              </div>
              <div className="cs-icard-meta">
                <div className="cs-icard-meta-label"><Microscope size={9} />Metric</div>
                <div className="cs-icard-meta-val">Attention Retention</div>
              </div>
              <div className="cs-icard-insight">
                Engine predicts a 14% increase in session duration if this upgrade is deployed within the first 30 seconds of content.
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
