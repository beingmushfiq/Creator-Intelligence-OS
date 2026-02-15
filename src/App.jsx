import React, { useState, useEffect, Suspense, lazy } from 'react';
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
  BarChart2,
  Clock,
  FolderOpen,
  Loader2,
  Handshake,
  MessageSquare,
  Users
} from 'lucide-react';
import { CreatorProvider, useCreator } from './context/CreatorContext';
import { ToastProvider, useToast } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthPage } from './components/AuthPage';
import AudioPlayer from './components/AudioPlayer';

import TopicInput from './components/TopicInput';
import CommandPalette from './components/ui/CommandPalette';

// Lazy-loaded tab components (code splitting)
const StrategyTab = lazy(() => import('./components/StrategyTab'));
const ScriptTab = lazy(() => import('./components/ScriptTab'));
const RepurposingTab = lazy(() => import('./components/RepurposingTab'));
const MotionPromptsTab = lazy(() => import('./components/MotionPromptsTab'));
const TitlesTab = lazy(() => import('./components/TitlesTab'));
const ThumbnailsTab = lazy(() => import('./components/ThumbnailsTab'));
const ResearchTab = lazy(() => import('./components/ResearchTab'));
const SeriesTab = lazy(() => import('./components/SeriesTab'));
const OptimizationTab = lazy(() => import('./components/OptimizationTab'));
const SeoTab = lazy(() => import('./components/SeoTab'));
const DealsTab = lazy(() => import('./components/DealsTab'));
const SettingsPage = lazy(() => import('./components/SettingsPage'));
const AnalyticsTab = lazy(() => import('./components/AnalyticsTab'));
const HistoryTab = lazy(() => import('./components/HistoryTab'));
const AssetLibrary = lazy(() => import('./components/AssetLibrary'));
const TeamSwitcher = lazy(() => import('./components/TeamSwitcher'));
const CommentsSidebar = lazy(() => import('./components/CommentsSidebar'));
const TeamSettingsModal = lazy(() => import('./components/TeamSettingsModal'));
import { SaveProjectModal } from './components/SaveProjectModal';



const TABS = [
  { id: 'strategy', label: 'Strategy', icon: Compass },
  { id: 'script', label: 'Script', icon: FileText },
  { id: 'repurposing', label: 'Repurposing', icon: Layout },
  { id: 'motion', label: 'Motion Prompts', icon: Video },
  { id: 'titles', label: 'Titles', icon: Type },
  { id: 'thumbnails', label: 'Thumbnails', icon: Image },
  { id: 'research', label: 'Research Mode', icon: Search },
  { id: 'series', label: 'Series Builder', icon: GitBranch },
  { id: 'seo', label: 'SEO Engine', icon: Search },
  { id: 'deals', label: 'Deal Flow', icon: Handshake }, // Handshake is not imported yet!
  { id: 'optimization', label: 'Optimization', icon: Settings },
  { id: 'analytics', label: 'Analytics', icon: BarChart2 },
  { id: 'history', label: 'History', icon: Clock },
  { id: 'assets', label: 'Asset Library', icon: FolderOpen },
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
  seo: SeoTab,
  deals: DealsTab,
  optimization: OptimizationTab,
  analytics: AnalyticsTab,
  history: HistoryTab,
  assets: AssetLibrary,
  settings: SettingsPage,
};

// Loading fallback for lazy components
function TabLoader() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '50vh',
      gap: 12,
      color: 'var(--text-tertiary)',
    }}>
      <Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} />
      <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Loading...</span>
    </div>
  );
}

function AppContent() {
  const { user, loading } = useAuth();
  
  // Use CreatorContext for session persistence
  const { activeTab, setActiveTab, data, backendReady, resetSession, saveCurrentProject, comments } = useCreator();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const { addToast } = useToast();

  const handleNewProject = () => {
    if (data) {
      setShowSaveModal(true);
    } else {
      resetSession();
      addToast('info', 'New project started');
    }
    setMobileOpen(false);
  };

  const onSaveAndNew = async () => {
    const success = await saveCurrentProject();
    if (success) {
      addToast('success', 'Project saved successfully');
      resetSession();
      setShowSaveModal(false);
    } else {
      addToast('error', 'Failed to save project');
    }
  };

  const onDiscardAndNew = () => {
    resetSession();
    setShowSaveModal(false);
    addToast('info', 'New project started (unsaved changes discarded)');
  };
  
  const ActiveComponent = TAB_COMPONENTS[activeTab] || StrategyTab;

  // Show loading state or login screen
  if (loading) return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'var(--bg-primary)',
    }}>
      <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', color: 'var(--accent-primary)' }} />
    </div>
  );
  
  if (!user) return <AuthPage />;

  // Keyboard Shortcuts
  useEffect(() => {
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
        handleNewProject();
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
          <div style={{ marginTop: 16 }}>
            <Suspense fallback={<div style={{ height: 40 }} />}>
              <TeamSwitcher />
            </Suspense>
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
            onClick={handleNewProject}
            className="card"
            style={{
              width: '100%',
              padding: '14px',
              marginBottom: '16px',
              cursor: 'pointer',
              border: '1px solid var(--border-subtle)',
              transition: 'all 0.2s ease',
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

          {/* Settings Button */}
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
                  Settings
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>
                  AI & Account
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

      <main className="main-content">
        <button
          onClick={() => setShowComments(!showComments)}
          style={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            width: 56,
            height: 56,
            zIndex: 50,
            borderRadius: '50%',
            background: 'var(--accent-primary)',
            border: 'none',
            boxShadow: '0 4px 14px rgba(124, 92, 252, 0.4)',
            cursor: 'pointer',
            color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          title="Team Chat"
        >
          <MessageSquare size={24} />
          {comments[activeTab]?.length > 0 && (
            <div style={{
              position: 'absolute',
              top: -6, right: -6,
              background: '#ef4444',
              color: 'white',
              fontSize: '0.75rem',
              fontWeight: 700,
              minWidth: 20, height: 20,
              borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '2px solid var(--bg-primary)'
            }}>
              {comments[activeTab].length}
            </div>
          )}
        </button>

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

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <Suspense fallback={<TabLoader />}>
              <ActiveComponent />
            </Suspense>
          </motion.div>
        </AnimatePresence>
        
        <Suspense fallback={null}>
          <CommentsSidebar 
            isOpen={showComments} 
            onClose={() => setShowComments(false)} 
            contextId={activeTab} 
          />
        </Suspense>
      </main>
      
      {/* Command Palette */}
      {commandPaletteOpen && (
        <CommandPalette
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onClose={() => setCommandPaletteOpen(false)}
        />
      )}
      
      {/* Global Audio Player */}
      <AudioPlayer />

      <SaveProjectModal 
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onSaveAndNew={onSaveAndNew}
        onDiscardAndNew={onDiscardAndNew}
      />
      
      <Suspense fallback={null}>
        <TeamSettingsModal />
      </Suspense>
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CreatorProvider>
          <AppContent />
        </CreatorProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
