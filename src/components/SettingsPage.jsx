import React, { useState, useEffect } from 'react';
import { Server, Globe, Check, AlertTriangle, Save, Loader, Eye, EyeOff, Shield, User, LogOut } from 'lucide-react';
import { useCreator } from '../context/CreatorContext';
import { useAuth } from '../context/AuthContext';
import { checkBackendHealth, getAvailableProviders, saveKeys } from '../engine/aiService';
import './SettingsPage.css';

export default function SettingsPage() {
  const { provider, setProvider } = useCreator();
  const { user, signOut } = useAuth();
  
  const [backendStatus, setBackendStatus] = useState('checking');
  const [availableProviders, setAvailableProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showKeys, setShowKeys] = useState({ openai: false, gemini: false, claude: false, elevenlabs: false });
  const [inputKeys, setInputKeys] = useState({
    openai: '',
    gemini: '',
    claude: '',
    elevenlabs: ''
  });

  const check = async () => {
    setLoading(true);
    const isHealthy = await checkBackendHealth();
    setBackendStatus(isHealthy ? 'connected' : 'disconnected');
    
    if (isHealthy) {
      const data = await getAvailableProviders();
      setAvailableProviders(data.providers || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    check();
  }, []);

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

  const toggleShowKey = (key) => {
    setShowKeys(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="settings-container">
      {/* Header */}
      <header className="settings-header">
        <div className="icon-wrapper">
          <Server size={32} color="var(--accent-primary)" />
        </div>
        <div className="settings-title">
          <h1>Settings</h1>
          <p className="settings-subtitle">Manage your account and AI configuration.</p>
        </div>
      </header>
      
      {/* Account Section - NEW */}
      {user && (
        <section className="settings-section-card mb-6 border-accent-primary/20">
          <div className="section-header">
            <User size={20} className="text-accent-primary" />
            <h2 className="section-title">Account</h2>
          </div>
          
          <div className="flex items-center justify-between bg-bg-secondary/50 p-4 rounded-lg border border-border-subtle mt-4">
            <div>
              <div className="text-xs font-bold text-text-tertiary uppercase tracking-wider mb-1">Signed in as</div>
              <div className="text-text-primary font-mono text-sm">{user.email}</div>
            </div>
            <button 
              onClick={signOut}
              className="flex items-center gap-2 px-4 py-2 bg-bg-card hover:bg-bg-tertiary border border-border-medium rounded-md text-text-secondary hover:text-red-400 transition-colors text-sm"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </section>
      )}

      {/* Backend Status */}
      <div className={`status-card ${backendStatus}`}>
        <div className={`status-dot ${backendStatus}`}></div>
        <div className="status-content">
          <h3>
            {backendStatus === 'connected' ? 'Backend Connected' : 'Backend Disconnected'}
          </h3>
          <p className="status-message">
            {backendStatus === 'connected' 
              ? 'Your system is securely connected to the local backend proxy. API requests are handled server-side.' 
              : 'Ensure the server is running on port 3001. Check your terminal for errors.'}
          </p>
          {backendStatus !== 'connected' && (
            <button onClick={check} className="retry-btn">
              <AlertTriangle size={14} /> 
              Retry Connection
            </button>
          )}
        </div>
      </div>

      {/* API Keys Configuration */}
      <section className="settings-section-card">
        <div className="section-header">
          <Shield size={20} className="text-accent" color="var(--accent-primary)" />
          <h2 className="section-title">API Credentials</h2>
          <span className="secure-badge">Stored securely in .env</span>
        </div>
        
        <div className="api-keys-form">
          {[
            { id: 'openai', label: 'OpenAI API Key', placeholder: 'sk-...', hint: 'Used for GPT-4o, DALL-E 3 image generation' },
            { id: 'gemini', label: 'Gemini API Key', placeholder: 'AIza...', hint: 'Used for Gemini 2.0 Flash' },
            { id: 'claude', label: 'Claude API Key', placeholder: 'sk-ant-...', hint: 'Used for Claude 3.5 Sonnet' },
            { id: 'elevenlabs', label: 'ElevenLabs API Key', placeholder: 'xi-...', hint: 'Used for Text-to-Speech audio generation' }
          ].map((field) => (
            <div key={field.id} className="input-group">
              <label className="input-label">{field.label}</label>
              <div className="input-wrapper">
                <input 
                  type={showKeys[field.id] ? "text" : "password"}
                  placeholder={field.placeholder}
                  className="api-input"
                  value={inputKeys[field.id]}
                  onChange={e => setInputKeys({...inputKeys, [field.id]: e.target.value})}
                />
                <button
                  onClick={() => toggleShowKey(field.id)}
                  className="toggle-visibility-btn"
                  title={showKeys[field.id] ? "Hide API Key" : "Show API Key"}
                >
                  {showKeys[field.id] ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {field.hint && (
                <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', marginTop: 4, display: 'block' }}>{field.hint}</span>
              )}
            </div>
          ))}

          <div className="save-actions">
            <button 
              onClick={handleSaveKeys}
              disabled={saving || (!inputKeys.openai && !inputKeys.gemini && !inputKeys.claude && !inputKeys.elevenlabs) || backendStatus !== 'connected'}
              className="save-btn"
              title={backendStatus !== 'connected' ? 'Connect backend first' : ''}
            >
              {saving ? <Loader size={18} className="spin" /> : <Save size={18} />}
              {saving ? 'Saving...' : 'Save Configuration'}
            </button>
            
            {backendStatus !== 'connected' && (
              <p className="error-text">
                Cannot save keys while backend is disconnected.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Provider Selection (Only if connected) */}
      {backendStatus === 'connected' && availableProviders.length > 0 && (
        <section className="settings-section-card">
          <div className="section-header">
            <Globe size={20} color="var(--accent-secondary)" />
            <h2 className="section-title">Active AI Engine</h2>
          </div>
          
          <div className="provider-grid">
            {availableProviders.map(p => (
              <div
                key={p.id}
                onClick={() => setProvider(p.id)}
                className={`provider-card ${provider === p.id ? 'active' : ''}`}
              >
                <div className="provider-info">
                  <div className="provider-icon">
                    <Globe size={20} />
                  </div>
                  <div>
                    <div className="provider-name">{p.name}</div>
                    <div className="provider-model">{p.model}</div>
                  </div>
                </div>
                {provider === p.id && (
                  <div className="check-badge">
                    <Check size={14} strokeWidth={3} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
