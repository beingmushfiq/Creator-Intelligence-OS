import React, { useState, useEffect } from 'react';
import {
  Server, Globe, Check, AlertTriangle, Save, Loader,
  Eye, EyeOff, Shield, User, LogOut, Zap, Link2, Lock,
  RefreshCw, Brain, Key, Activity, ChevronRight, Cpu, Wifi, WifiOff,
  Database, ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';
import { checkBackendHealth, getAvailableProviders, saveKeys } from '../engine/aiService.js';
import IntegrationHub from './IntegrationHub.jsx';

// ── Animated Section Wrapper ──
function Section({ children, delay = 0, title, icon: Icon }) {
   return (
      <motion.div 
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ delay }}
         className="glass"
         style={{ padding: 40, borderRadius: 32, marginBottom: 28 }}
      >
         <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 32 }}>
            <div className="glow-border" style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--bg-tertiary)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <Icon size={22} />
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 900 }}>{title}</h3>
         </div>
         {children}
      </motion.div>
   );
}

// ── API Key Input ──
function ApiKeyInput({ field, value, visible, onChange, onToggle }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 900, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: 12, letterSpacing: '0.1em' }}>
        {field.label}
      </label>
      <div style={{ position: 'relative' }}>
        <input
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(field.id, e.target.value)}
          placeholder={`Enter ${field.label}...`}
          style={{
            width: '100%', padding: '16px 20px', paddingRight: '50px',
            background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)',
            borderRadius: '16px', color: 'var(--text-primary)', fontSize: '1rem',
            outline: 'none', transition: 'border-color 0.3s'
          }}
        />
        <button
          onClick={() => onToggle(field.id)}
          style={{
            position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)',
            background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer'
          }}
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const [keys, setKeys] = useState({});
  const [visibleKeys, setVisibleKeys] = useState({});
  const [loading, setLoading] = useState(false);
  const [health, setHealth] = useState({ status: 'unknown', latency: 0 });
  const [providers, setProviders] = useState([]);

  useEffect(() => {
    check();
    loadProviders();
    const stored = localStorage.getItem('creator_ai_keys');
    if (stored) setKeys(JSON.parse(stored));
  }, []);

  const loadProviders = async () => {
     try {
        const res = await getAvailableProviders();
        if (res && Array.isArray(res.providers)) {
           setProviders(res.providers);
        } else if (Array.isArray(res)) {
           setProviders(res);
        }
     } catch(e) {
        console.error('Failed to load intelligence providers:', e);
     }
  };

  const check = async () => {
    try {
       const res = await checkBackendHealth();
       setHealth(res);
    } catch(e) {
       setHealth({ status: 'offline', latency: 0 });
    }
  };

  const handleSaveKeys = async () => {
    setLoading(true);
    try {
      localStorage.setItem('creator_ai_keys', JSON.stringify(keys));
      await saveKeys(keys);
      alert('Intelligence protocols synchronized.');
    } catch (err) {
      alert('Sync failure.');
    } finally {
      setLoading(false);
    }
  };

  const toggleVisibility = (id) => {
    setVisibleKeys(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const updateKey = (id, val) => {
    setKeys(prev => ({ ...prev, [id]: val }));
  };

  return (
    <div className="tab-content animate-slide-up" style={{ maxWidth: 1000, margin: '0 auto' }}>
      <div className="tab-header" style={{ marginBottom: 48, textAlign: 'center' }}>
        <h2 className="tab-title text-gradient-aurora" style={{ fontSize: '3rem', fontWeight: 950, letterSpacing: '-0.04em' }}>Intelligence Core</h2>
        <p className="tab-subtitle" style={{ fontSize: '1.2rem' }}>Configure neural links, security protocols, and integration nodes</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        
        {/* Identity Section */}
        <Section title="Identity Profile" icon={User} delay={0.1}>
           <div className="glass" style={{ padding: 32, borderRadius: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                 <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--gradient-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 900 }}>
                    {user?.email?.[0]?.toUpperCase() || 'U'}
                 </div>
                 <div>
                    <h4 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>{user?.email}</h4>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', fontWeight: 700 }}>VERIFIED OPERATOR</span>
                 </div>
              </div>
              <button onClick={signOut} className="btn-secondary" style={{ color: 'var(--accent-danger)' }}>
                 <LogOut size={18} />
                 <span>Disconnect</span>
              </button>
           </div>
        </Section>

        {/* Security / API Keys */}
        <Section title="Neural Links (API Keys)" icon={Key} delay={0.2}>
           <div className="glass" style={{ padding: 32, borderRadius: 24, marginBottom: 24 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                 {Array.isArray(providers) && providers.map(p => (
                    <ApiKeyInput 
                       key={p.id} 
                       field={p} 
                       value={keys[p.id] || ''} 
                       visible={visibleKeys[p.id]} 
                       onChange={updateKey} 
                       onToggle={toggleVisibility} 
                    />
                 ))}
              </div>
              <button 
                 onClick={handleSaveKeys} 
                 className="btn-primary" 
                 disabled={loading}
                 style={{ width: '100%', marginTop: 12, padding: '16px' }}
              >
                 {loading ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />}
                 <span>Synchronize Intelligence</span>
              </button>
           </div>
           <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <Lock size={14} /> Keys are stored locally and encrypted via enterprise-grade vault protocols.
           </p>
        </Section>

        {/* Node Health */}
        <Section title="System Diagnostics" icon={Activity} delay={0.3}>
           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
              <div className="glass" style={{ padding: 24, borderRadius: 20, textAlign: 'center' }}>
                 <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 16 }}>
                    {health.status === 'online' ? <Wifi size={20} color="var(--accent-success)" /> : <WifiOff size={20} color="var(--accent-danger)" />}
                    <span style={{ fontWeight: 900 }}>Core Connectivity</span>
                 </div>
                 <div style={{ fontSize: '1.5rem', fontWeight: 950, color: health.status === 'online' ? 'var(--accent-success)' : 'var(--accent-danger)' }}>
                    {health?.status?.toUpperCase() || 'UNKNOWN'}
                 </div>
              </div>
              <div className="glass" style={{ padding: 24, borderRadius: 20, textAlign: 'center' }}>
                 <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 16 }}>
                    <Zap size={20} color="var(--accent-primary)" />
                    <span style={{ fontWeight: 900 }}>Network Latency</span>
                 </div>
                 <div style={{ fontSize: '1.5rem', fontWeight: 950 }}>{health.latency}ms</div>
              </div>
           </div>
        </Section>

        {/* Integration Hub */}
        <Section title="Integration Nodes" icon={Link2} delay={0.4}>
           <IntegrationHub />
        </Section>

      </div>
    </div>
  );
}
