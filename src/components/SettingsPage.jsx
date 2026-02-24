import React, { useState, useEffect } from 'react';
import {
  Server, Globe, Check, AlertTriangle, Save, Loader,
  Eye, EyeOff, Shield, User, LogOut, Zap, Link2, Lock,
  RefreshCw, Brain, Key, Activity, ChevronRight, Cpu, Wifi, WifiOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCreator } from '../context/CreatorContext';
import { useAuth } from '../context/AuthContext';
import { checkBackendHealth, getAvailableProviders, saveKeys } from '../engine/aiService';
import IntegrationHub from './IntegrationHub';
import './SettingsPage.css';

// ── Animated Section Wrapper ──
const Section = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
  >
    {children}
  </motion.div>
);

// ── API Key Input ──
const ApiKeyInput = ({ field, value, visible, onChange, onToggle }) => (
  <div className="sp-input-group">
    <div className="sp-input-label-row">
      <span className="sp-input-label">{field.label}</span>
      <span className="sp-input-hint">{field.hint}</span>
    </div>
    <div className="sp-input-wrapper">
      <div className="sp-input-prefix">
        <Key size={14} className="text-[var(--accent-primary)]" />
      </div>
      <input
        type={visible ? 'text' : 'password'}
        placeholder={field.placeholder}
        className="sp-api-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="off"
      />
      <button onClick={onToggle} className="sp-input-eye">
        {visible ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  </div>
);

export default function SettingsPage() {
  const { provider, setProvider } = useCreator();
  const { user, signOut } = useAuth();

  const [backendStatus, setBackendStatus] = useState('checking');
  const [availableProviders, setAvailableProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showKeys, setShowKeys] = useState({ openai: false, gemini: false, claude: false, elevenlabs: false });
  const [inputKeys, setInputKeys] = useState({ openai: '', gemini: '', claude: '', elevenlabs: '' });
  const [activeSection, setActiveSection] = useState('ai');

  const check = async () => {
    setLoading(true);
    try {
      const isHealthy = await checkBackendHealth();
      setBackendStatus(isHealthy ? 'connected' : 'disconnected');
      if (isHealthy) {
        const data = await getAvailableProviders();
        setAvailableProviders(data.providers || []);
      }
    } catch {
      setBackendStatus('disconnected');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { check(); }, []);

  const handleSaveKeys = async () => {
    setSaving(true);
    const success = await saveKeys({
      OPENAI_API_KEY: inputKeys.openai || undefined,
      GEMINI_API_KEY: inputKeys.gemini || undefined,
      CLAUDE_API_KEY: inputKeys.claude || undefined,
      ELEVENLABS_API_KEY: inputKeys.elevenlabs || undefined,
    });
    if (success) {
      setInputKeys({ openai: '', gemini: '', claude: '', elevenlabs: '' });
      await check();
    }
    setSaving(false);
  };

  const API_FIELDS = [
    { id: 'openai', label: 'OpenAI', placeholder: 'sk-proj-...', hint: 'GPT-4o & DALL-E 3' },
    { id: 'gemini', label: 'Gemini 2.0', placeholder: 'AIzaSy...', hint: 'Multimodal reasoning' },
    { id: 'claude', label: 'Claude', placeholder: 'sk-ant-api...', hint: 'Elite creative writing' },
    { id: 'elevenlabs', label: 'ElevenLabs', placeholder: 'xi-api-...', hint: 'Voice synthesis' },
  ];

  const NAV_ITEMS = [
    { id: 'ai', label: 'AI Engine', icon: Brain },
    { id: 'integrations', label: 'Integrations', icon: Link2 },
    { id: 'account', label: 'Account', icon: User },
  ];

  const isConnected = backendStatus === 'connected';

  return (
    <div className="sp-root">
      {/* ── Page Header ── */}
      <Section delay={0}>
        <div className="sp-header">
          <div className="sp-header-icon">
            <Cpu size={28} />
          </div>
          <div className="sp-header-text">
            <h1 className="sp-header-title">System Intelligence</h1>
            <p className="sp-header-sub">Configure your AI infrastructure &amp; platform connections</p>
          </div>
          <div className={`sp-status-pill ${isConnected ? 'connected' : 'disconnected'}`}>
            {isConnected ? <Wifi size={12} /> : <WifiOff size={12} />}
            <span>{isConnected ? 'Neural Link Active' : 'System Offline'}</span>
            <button onClick={check} className="sp-status-refresh" title="Re-check connection">
              <RefreshCw size={10} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>
      </Section>

      {/* ── Navigation Tabs ── */}
      <Section delay={0.05}>
        <div className="sp-tabs">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`sp-tab ${activeSection === item.id ? 'active' : ''}`}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </Section>

      {/* ── Section: AI Engine ── */}
      <AnimatePresence mode="wait">
        {activeSection === 'ai' && (
          <motion.div
            key="ai"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="sp-section-content"
          >
            <div className="sp-two-col">
              {/* Left: API Keys */}
              <div className="sp-card sp-card-keys">
                <div className="sp-card-header">
                  <div className="sp-card-icon">
                    <Lock size={18} className="text-[var(--accent-primary)]" />
                  </div>
                  <div>
                    <h2 className="sp-card-title">Encrypted Credentials</h2>
                    <p className="sp-card-sub">Keys are injected into server env vars and never stored client-side.</p>
                  </div>
                </div>

                <div className="sp-key-grid">
                  {API_FIELDS.map(field => (
                    <ApiKeyInput
                      key={field.id}
                      field={field}
                      value={inputKeys[field.id]}
                      visible={showKeys[field.id]}
                      onChange={(v) => setInputKeys(p => ({ ...p, [field.id]: v }))}
                      onToggle={() => setShowKeys(p => ({ ...p, [field.id]: !p[field.id] }))}
                    />
                  ))}
                </div>

                <div className="sp-save-row">
                  <motion.button
                    onClick={handleSaveKeys}
                    disabled={saving || (!inputKeys.openai && !inputKeys.gemini && !inputKeys.claude && !inputKeys.elevenlabs) || !isConnected}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="sp-save-btn"
                  >
                    {saving ? <Loader size={18} className="animate-spin" /> : <Save size={18} />}
                    {saving ? 'Syncing Vault...' : 'Save Configuration'}
                  </motion.button>
                  {!isConnected && (
                    <div className="sp-warning-text">
                      <AlertTriangle size={12} />
                      Backend required to persist credentials.
                    </div>
                  )}
                </div>
              </div>

              {/* Right: Active Engine + System Health */}
              <div className="sp-sidebar-col">
                {/* Active Provider Selection */}
                {isConnected && availableProviders.length > 0 && (
                  <div className="sp-card">
                    <div className="sp-card-label">
                      <Globe size={14} />
                      <span>Active Engine</span>
                    </div>
                    <div className="sp-provider-list">
                      {availableProviders.map(p => (
                        <motion.button
                          key={p.id}
                          onClick={() => setProvider(p.id)}
                          whileHover={{ x: 2 }}
                          className={`sp-provider-item ${provider === p.id ? 'active' : ''}`}
                        >
                          <div className={`sp-provider-dot ${provider === p.id ? 'active' : ''}`} />
                          <div className="flex-1 text-left">
                            <div className="sp-provider-name">{p.name}</div>
                            <div className="sp-provider-model">{p.model}</div>
                          </div>
                          {provider === p.id && (
                            <div className="sp-check-badge">
                              <Check size={10} strokeWidth={3.5} />
                            </div>
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {/* System Health */}
                <div className="sp-card">
                  <div className="sp-card-label">
                    <Activity size={14} />
                    <span>System Health</span>
                  </div>
                  <div className="sp-health-grid">
                    {[
                      { label: 'Core Proxy', value: isConnected ? 'Connected' : 'Offline', ok: isConnected },
                      { label: 'Session DB', value: 'Stable', ok: true },
                      { label: 'AI Latency', value: '~120ms', ok: true },
                      { label: 'Auth Verif.', value: user ? 'Active' : 'None', ok: !!user },
                    ].map(item => (
                      <div key={item.label} className="sp-health-row">
                        <span className="sp-health-label">{item.label}</span>
                        <span className={`sp-health-val ${item.ok ? 'ok' : 'err'}`}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                  {!isConnected && (
                    <div className="sp-alert-block">
                      <AlertTriangle size={12} />
                      Backend on port 3001 is unreachable. Start the development server.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Section: Integrations ── */}
        {activeSection === 'integrations' && (
          <motion.div
            key="integrations"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="sp-section-content"
          >
            <IntegrationHub />
          </motion.div>
        )}

        {/* ── Section: Account ── */}
        {activeSection === 'account' && (
          <motion.div
            key="account"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="sp-section-content"
          >
            {user ? (
              <div className="sp-account-grid">
                {/* Profile Card */}
                <div className="sp-card sp-profile-card">
                  <div className="sp-profile-avatar">
                    {user.email?.charAt(0).toUpperCase()}
                  </div>
                  <div className="sp-profile-info">
                    <h2 className="sp-profile-email">{user.email}</h2>
                    <div className="sp-profile-badge">
                      <Zap size={10} />
                      Pro Strategist
                    </div>
                  </div>
                  <div className="sp-profile-bar">
                    <div className="sp-profile-bar-fill" />
                  </div>
                  <div className="sp-profile-meta">
                    <span>Verified Tier</span>
                    <span className="sp-profile-meta-val">Active</span>
                  </div>
                  <button onClick={signOut} className="sp-signout-btn">
                    <LogOut size={16} />
                    Terminate Session
                  </button>
                </div>

                {/* Security Info */}
                <div className="sp-card">
                  <div className="sp-card-label">
                    <Shield size={14} />
                    <span>Security &amp; Privacy</span>
                  </div>
                  <div className="sp-health-grid">
                    {[
                      { label: 'Auth Method', value: 'Email', ok: true },
                      { label: 'Encryption', value: 'AES-256', ok: true },
                      { label: 'Data Region', value: 'Global', ok: true },
                      { label: '2FA Status', value: 'Recommended', ok: false },
                    ].map(item => (
                      <div key={item.label} className="sp-health-row">
                        <span className="sp-health-label">{item.label}</span>
                        <span className={`sp-health-val ${item.ok ? 'ok' : 'warn'}`}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="sp-card sp-empty-state">
                <User size={40} className="opacity-20" />
                <p>Sign in to manage your account.</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
