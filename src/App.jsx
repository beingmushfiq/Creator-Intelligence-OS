import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Settings,
  Compass,
  FileText,
  Video,
  Type,
  Image,
  Search,
  GitBranch,
  MonitorPlay,
  CheckCircle2,
  Zap,
  Layout,
  Menu,
  BarChart2
} from 'lucide-react';
import { CreatorProvider, useCreator } from './context/CreatorContext';
import TopicInput from './components/TopicInput';
import StrategyTab from './components/StrategyTab';
import ScriptTab from './components/ScriptTab';
import MotionPromptsTab from './components/MotionPromptsTab';
import TitlesTab from './components/TitlesTab';
import ThumbnailsTab from './components/ThumbnailsTab';
import ResearchTab from './components/ResearchTab';
import SeriesTab from './components/SeriesTab';
import OptimizationTab from './components/OptimizationTab';
import SettingsPage from './components/SettingsPage';
import CommandPalette from './components/ui/CommandPalette';
import RepurposingTab from './components/RepurposingTab';
import AnalyticsTab from './components/AnalyticsTab';

const TABS = [
  { id: 'strategy', label: 'Strategy', icon: Compass },
  { id: 'script', label: 'Script', icon: FileText },
  { id: 'repurposing', label: 'Repurposing', icon: Layout },
  { id: 'motion', label: 'Motion Prompts', icon: Video },
  { id: 'titles', label: 'Titles', icon: Type },
  { id: 'thumbnails', label: 'Thumbnails', icon: Image },
  { id: 'research', label: 'Research Mode', icon: Search },
  { id: 'series', label: 'Series Builder', icon: GitBranch },
  { id: 'optimization', label: 'Optimization', icon: Settings },
  { id: 'analytics', label: 'Analytics', icon: BarChart2 },
];

const TAB_COMPONENTS = {
  strategy: StrategyTab,
  script: ScriptTab,
  repurposing: RepurposingTab,
  motion: MotionPromptsTab,
  titles: TitlesTab,
  thumbnails: ThumbnailsTab,
  research: ResearchTab,
  series: SeriesTab,
  optimization: OptimizationTab,
  analytics: AnalyticsTab,
  settings: SettingsPage,
};

import { ToastProvider } from './context/ToastContext';

export default function App() {
  return (
    <CreatorProvider>
      <ToastProvider>
        <AppShell />
      </ToastProvider>
    </CreatorProvider>
  );
}

function AppShell() {
  const { activeTab, setActiveTab, data, backendReady, resetSession } = useCreator();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const ActiveComponent = TAB_COMPONENTS[activeTab] || StrategyTab;

  // Global keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      // Cmd/Ctrl + K for command palette
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
      // Cmd/Ctrl + 1-8 for tab switching
      if ((e.metaKey || e.ctrlKey) && e.key >= '1' && e.key <= '8') {
        e.preventDefault();
        const tabIndex = parseInt(e.key) - 1;
        if (TABS[tabIndex]) {
          setActiveTab(TABS[tabIndex].id);
        }
      }
      // Cmd/Ctrl + N for new project
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        e.preventDefault();
        if (confirm('Start a new project? This will clear your current session.')) {
          resetSession();
        }
      }
      // Cmd/Ctrl + , for settings
      if ((e.metaKey || e.ctrlKey) && e.key === ',') {
        e.preventDefault();
        setActiveTab('settings');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setActiveTab, resetSession]);

  return (
    <div className="app-layout">
      {/* Mobile menu button */}
      <button
        className="mobile-menu-btn"
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      {/* Sidebar overlay (mobile) */}
      {mobileOpen && (
        <div className="sidebar-overlay visible" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div 
            className="sidebar-logo cursor-pointer hover:opacity-80 transition-opacity" 
            onClick={() => {
              console.log('Sidebar Logo Clicked -> Navigate Home');
              setActiveTab('strategy');
              setMobileOpen(false);
            }}
            title="Go to Home"
          >
            <div className="sidebar-logo-icon">
              <Zap size={18} color="#fff" />
            </div>
            <div>
              <div className="sidebar-logo-text">Creator<span className="text-gradient"> Intelligence</span></div>
              <div className="sidebar-logo-sub">OS v1.0</div>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {TABS.map(tab => {
            const Icon = tab.icon;
            return (
              <div
                key={tab.id}
                className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab(tab.id);
                  setMobileOpen(false);
                }}
              >
                <Icon size={18} className="nav-icon" />
                <span>{tab.label}</span>
                {data && activeTab === tab.id && (
                  <div style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: 'var(--accent-success)',
                    marginLeft: 'auto',
                    boxShadow: '0 0 8px var(--accent-success)',
                  }} />
                )}
              </div>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          {/* New Project Button */}
          <button
            onClick={() => {
              if (window.confirm('Start a new project? This will clear current data.')) {
                resetSession();
                setMobileOpen(false);
              }
            }}
            className="card"
            style={{
              width: '100%',
              padding: '14px',
              marginBottom: '16px',
              cursor: 'pointer',
              border: '1px solid var(--border-subtle)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent-primary)';
              e.currentTarget.style.background = 'var(--bg-tertiary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-subtle)';
              e.currentTarget.style.background = 'var(--bg-card)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: 'var(--bg-tertiary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Plus size={18} className="text-[var(--accent-primary)]" />
              </div>
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: 2 }}>
                  New Project
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>
                  Clear current session
                </div>
              </div>
            </div>
          </button>

          {/* AI Settings Button */}
          <button
            onClick={() => {
              setActiveTab('settings');
              setMobileOpen(false);
            }}
            className="card"
            style={{
              width: '100%',
              padding: '14px',
              marginBottom: '16px',
              cursor: 'pointer',
              border: '1px solid var(--border-subtle)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent-primary)';
              e.currentTarget.style.background = 'var(--bg-tertiary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-subtle)';
              e.currentTarget.style.background = 'var(--bg-card)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: 'var(--bg-tertiary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Settings size={18} className="text-[var(--accent-secondary)]" />
              </div>
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: 2 }}>
                  AI Settings
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>
                  Configure API keys
                </div>
              </div>
              <div className={`w-2 h-2 rounded-full ${
                backendReady ? 'bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.4)]' : 'bg-red-500'
              }`} />
            </div>
          </button>
          
          <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', lineHeight: 1.5 }}>
            <div style={{ fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 2 }}>Creator Intelligence OS</div>
            Built for creators who think in systems.
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="main-content">
        {activeTab !== 'settings' && <TopicInput />}

        {/* Active tab indicator bar */}
        {activeTab !== 'settings' && (
        <div style={{
          display: 'flex',
          gap: 0,
          background: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border-subtle)',
          overflowX: 'auto',
          scrollbarWidth: 'none',
        }}>
          {TABS.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '10px 16px',
                  fontSize: '0.78rem',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? 'var(--text-primary)' : 'var(--text-tertiary)',
                  borderBottom: isActive ? '2px solid var(--accent-primary)' : '2px solid transparent',
                  background: 'transparent',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease',
                }}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>
        )}

        {/* Loading overlay */}
        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <ActiveComponent />
          </motion.div>
        </AnimatePresence>
      </main>
      {/* Settings Modal Removed */}
      
      {/* Command Palette */}
      {commandPaletteOpen && (
        <CommandPalette
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onClose={() => setCommandPaletteOpen(false)}
        />
      )}
    </div>
  );
}
