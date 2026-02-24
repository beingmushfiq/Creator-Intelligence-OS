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
  CheckCircle2,
  Zap,
  Layout,
  Menu,
  BarChart2,
  BarChart3,
  Cpu,
  Clock,
  FolderOpen,
  Loader2,
  Handshake,
  MessageSquare,
  Users,
  Calendar,
  Activity,
  TrendingUp,
  ListTodo,
  RefreshCw,
  Layers,
  Globe,
  Grid,
  Film,
  Library,
  BookOpen,
  Eye,
  Dna,
  Brain,
  AlertCircle,
  Coffee,
  ShoppingBag,
  HeartPulse,
  Home,
  Target,
  Wand2,
  BarChart,
  FastForward,
  Copy,
  Briefcase,
  Store,
  Fingerprint,
  Sparkles,
  Send,
  BatteryCharging,
  ChevronRight
} from 'lucide-react';
import { CreatorProvider } from './context/CreatorProvider.jsx';
import { useCreator } from './context/CreatorContext.jsx';
import { ToastProvider } from './context/ToastProvider.jsx';
import { useToast } from './context/ToastContext.jsx';
import { AuthProvider } from './context/AuthProvider.jsx';
import { useAuth } from './context/AuthContext.jsx';
import { AuthPage } from './components/AuthPage.jsx';
import { dbService } from './services/dbService.js';
import AudioPlayer from './components/AudioPlayer.jsx';
import { SaveProjectModal } from './components/SaveProjectModal.jsx';

import TopicInput from './components/TopicInput.jsx';
import CommandPalette from './components/ui/CommandPalette.jsx';
import { ExportButton } from './components/ui/ExportButton.jsx';

// Lazy-loaded tab components (code splitting)
const DashboardTab = lazy(() => import('./components/DashboardTab.jsx'));
const GrowthTab = lazy(() => import('./components/GrowthTab.jsx'));
const CommunityTab = lazy(() => import('./components/CommunityTab.jsx'));
const MediaTab = lazy(() => import('./components/MediaTab.jsx'));
const AutomationTab = lazy(() => import('./components/AutomationTab.jsx'));
const EngagementTab = lazy(() => import('./components/EngagementTab.jsx'));
const ProductTab = lazy(() => import('./components/ProductTab.jsx'));
const StrategyTab = lazy(() => import('./components/StrategyTab.jsx'));
const ScriptTab = lazy(() => import('./components/ScriptTab.jsx'));
const ResearchTab = lazy(() => import('./components/ResearchTab.jsx'));
const TitlesTab = lazy(() => import('./components/TitlesTab.jsx'));
const ThumbnailsTab = lazy(() => import('./components/ThumbnailsTab.jsx'));
const VisualsTab = lazy(() => import('./components/VisualsTab.jsx'));
const SeriesTab = lazy(() => import('./components/SeriesTab.jsx'));
const OptimizationTab = lazy(() => import('./components/OptimizationTab.jsx'));
const MotionPromptsTab = lazy(() => import('./components/MotionPromptsTab.jsx'));
const RepurposingTab = lazy(() => import('./components/RepurposingTab.jsx'));
const SeoTab = lazy(() => import('./components/SeoTab.jsx'));
const DealsTab = lazy(() => import('./components/DealsTab.jsx'));
const AffiliateTab = lazy(() => import('./components/AffiliateTab.jsx'));
const PulseTab = lazy(() => import('./components/PulseTab.jsx'));
const AudienceTab = lazy(() => import('./components/AudienceTab.jsx'));
const MarketTab = lazy(() => import('./components/MarketTab.jsx'));
const PerformanceTab = lazy(() => import('./components/PerformanceTab.jsx'));
const TrendTab = lazy(() => import('./components/TrendTab.jsx'));
const GenomeTab = lazy(() => import('./components/GenomeTab.jsx'));
const ViralTab = lazy(() => import('./components/ViralTab.jsx'));
const CalendarTab = lazy(() => import('./components/CalendarTab.jsx'));
const DeckTab = lazy(() => import('./components/DeckTab.jsx'));
const OmnichannelTab = lazy(() => import('./components/OmnichannelTab.jsx'));
const AnalyticsTab = lazy(() => import('./components/AnalyticsTab.jsx'));
const AssetLibrary = lazy(() => import('./components/AssetLibrary.jsx'));
const BurnoutTab = lazy(() => import('./components/BurnoutTab.jsx'));
const SettingsPage = lazy(() => import('./components/SettingsPage.jsx'));
const LearningTab = lazy(() => import('./components/LearningTab.jsx'));
const HistoryTab = lazy(() => import('./components/HistoryTab.jsx'));
const TeamSwitcher = lazy(() => import('./components/TeamSwitcher.jsx'));
const CommentsSidebar = lazy(() => import('./components/CommentsSidebar.jsx'));
const TeamSettingsModal = lazy(() => import('./components/TeamSettingsModal.jsx'));
const ActivityFeed = lazy(() => import('./components/ActivityFeed.jsx'));
const TasksTab = lazy(() => import('./components/TasksTab.jsx'));
import CoachSidebar from './components/CoachSidebar.jsx';




const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'growth', label: 'Growth', icon: TrendingUp },
  { id: 'engagement', label: 'Engagement', icon: MessageSquare },
  { id: 'community', label: 'Community', icon: Users },
  { id: 'automation', label: 'Automation', icon: Cpu },
  { id: 'media', label: 'Media', icon: Film },
  { id: 'products', label: 'Products', icon: ShoppingBag },
  { id: 'strategy', label: 'Strategy', icon: Target },
  { id: 'script', label: 'Script', icon: FileText },
  { id: 'research', label: 'Research', icon: Search },
  { id: 'titles', label: 'Titles', icon: Type },
  { id: 'thumbnails', label: 'Thumbnails', icon: Image },
  { id: 'visuals', label: 'Visuals', icon: Wand2 },
  { id: 'series', label: 'Series', icon: Layers },
  { id: 'optimization', label: 'Optimization', icon: BarChart },
  { id: 'motion', label: 'Motion', icon: FastForward },
  { id: 'repurpose', label: 'Repurpose', icon: Copy },
  { id: 'seo', label: 'SEO', icon: Globe },
  { id: 'deals', label: 'Sponsorship', icon: Briefcase },
  { id: 'affiliate', label: 'Products', icon: ShoppingBag },
  { id: 'pulse', label: 'Pulse', icon: Activity },
  { id: 'audience', label: 'Audience', icon: Users },
  { id: 'market', label: 'Market', icon: Store },
  { id: 'performance', label: 'Viral Lab', icon: Zap },
  { id: 'trends', label: 'Radar', icon: Compass },
  { id: 'genome', label: 'Genome', icon: Fingerprint },
  { id: 'viral', label: 'Hooks', icon: Sparkles },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'deck', label: 'Deck', icon: Film },
  { id: 'omnichannel', label: 'Omni', icon: Send },
  { id: 'analytics', label: 'Analytics', icon: BarChart2 },
  { id: 'library', label: 'Library', icon: Library },
  { id: 'burnout', label: 'Burnout', icon: BatteryCharging },
];

const TAB_COMPONENTS = {
  dashboard: DashboardTab,
  growth: GrowthTab,
  engagement: EngagementTab,
  community: CommunityTab,
  media: MediaTab,
  automation: AutomationTab,
  products: ProductTab,
  strategy: StrategyTab,
  script: ScriptTab,
  research: ResearchTab,
  titles: TitlesTab,
  thumbnails: ThumbnailsTab,
  visuals: VisualsTab,
  series: SeriesTab,
  optimization: OptimizationTab,
  motion: MotionPromptsTab,
  repurpose: RepurposingTab,
  omnichannel: OmnichannelTab,
  seo: SeoTab,
  deals: DealsTab,
  affiliate: AffiliateTab,
  pulse: PulseTab,
  audience: AudienceTab,
  market: MarketTab,
  performance: PerformanceTab,
  trends: TrendTab,
  genome: GenomeTab,
  viral: ViralTab,
  calendar: CalendarTab,
  deck: DeckTab,
  analytics: AnalyticsTab,
  library: AssetLibrary,
  academy: LearningTab,
  history: HistoryTab,
  activity: ActivityFeed,
  burnout: BurnoutTab,
  tasks: TasksTab,
  settings: SettingsPage,
};

// Loading fallback for lazy components
function TabLoader() {
  return (
    <div className="center-content" style={{ height: '50vh', gap: 16 }}>
       <motion.div 
         animate={{ rotate: 360 }}
         transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
         style={{ width: 40, height: 40, border: '4px solid var(--accent-primary)20', borderTopColor: 'var(--accent-primary)', borderRadius: '50%' }}
       />
       <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Synchronizing</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>Fetching strategic intelligence...</span>
       </div>
    </div>
  );
}

function AppContent() {
  const { user, loading } = useAuth();
  
  // Use CreatorContext for session persistence
  const { 
    activeTab, setActiveTab, data, backendReady, resetSession, 
    saveCurrentProject, comments, loading: creatorLoading,
    activeWorkspace
  } = useCreator();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showCoach, setShowCoach] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('creator-theme') || 'dark');
  const { addToast } = useToast();

  // Theme Persistence
  useEffect(() => {
    localStorage.setItem('creator-theme', theme);
    document.documentElement.className = theme === 'light' ? 'light-theme' : '';
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    addToast('info', `Switched to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`);
  };

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
  
  const ActiveComponent = TAB_COMPONENTS[activeTab] || DashboardTab;

  // Show loading state or login screen
  if (loading) return (
    <div className="center-content" style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
       <motion.div 
         initial={{ opacity: 0, scale: 0.9 }}
         animate={{ opacity: 1, scale: 1 }}
         style={{ textAlign: 'center' }}
       >
          <div className="sidebar-logo-icon" style={{ width: 64, height: 64, margin: '0 auto 32px' }}>
             <Zap size={32} color="#fff" />
          </div>
          <div style={{ fontSize: '0.85rem', fontWeight: 950, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 12 }}>System Initializing</div>
          <div style={{ width: 200, height: 4, background: 'var(--bg-tertiary)', borderRadius: 2, margin: '0 auto', overflow: 'hidden' }}>
             <motion.div 
               animate={{ x: [-200, 200] }}
               transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
               style={{ width: 100, height: '100%', background: 'var(--gradient-primary)' }} 
             />
          </div>
       </motion.div>
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
  
  // Real-time Collaborative Alerts (Simulated via Polling)
  const [lastSeenActivity, setLastSeenActivity] = useState(null);
  
  useEffect(() => {
    if (!user) return;
    
    const pollActivity = async () => {
      try {
        const teamId = activeWorkspace !== 'personal' ? activeWorkspace : null;
        const latest = await dbService.getActivityLog(user.id, teamId, 1);
        
        if (latest && latest.length > 0) {
          const item = latest[0];
          // If we haven't seen this ID yet, and it's NOT our own action
          if (lastSeenActivity && item.id !== lastSeenActivity && item.user_id !== user.id) {
            addToast('info', `${item.description}`);
          }
          setLastSeenActivity(item.id);
        }
      } catch (err) {
        console.error('Activity polling failed:', err);
      }
    };
    
    // Initial check
    pollActivity();
    
    const interval = setInterval(pollActivity, 10000); // Check every 10s
    return () => clearInterval(interval);
  }, [user, activeWorkspace, lastSeenActivity, addToast]);

  return (
    <div className="app-layout">
      {/* Global Progress Bar */}
      {creatorLoading && <div className="global-loading-bar" />}
      
      {/* ── Mobile Top Bar (Only visible < 768px) ── */}
      <div className="mobile-topbar">
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        <div className="sidebar-logo" style={{ flex: 1, justifyContent: 'center' }}>
        <div 
          className="flex items-center gap-3 cursor-pointer" 
          onClick={() => {
            setActiveTab('home');
            setMobileOpen(false);
          }}
        >
          <div className="sidebar-logo-icon"><Zap size={16} color="#fff" /></div>
          <div className="sidebar-logo-text">Creator<span className="text-gradient"> Intelligence</span></div>
        </div>
        </div>
        <button
          onClick={() => setShowComments(!showComments)}
          style={{ position: 'relative', width: 40, height: 40, borderRadius: '50%', background: 'var(--accent-primary)', border: 'none', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
        >
          <MessageSquare size={18} />
          {comments[activeTab]?.length > 0 && (
            <div style={{ position: 'absolute', top: -4, right: -4, background: '#ef4444', color: 'white', fontSize: '0.65rem', fontWeight: 700, minWidth: 16, height: 16, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--bg-primary)' }}>
              {comments[activeTab].length}
            </div>
          )}
        </button>
      </div>

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
              setActiveTab('home');
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
          {/* ── Neural Intelligence Hub ── HERO CARD ── */}
          <div style={{ padding: '0 10px 20px 10px' }}>
            <motion.button
              onClick={() => setShowCoach(!showCoach)}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.97 }}
              style={{
                width: '100%',
                textAlign: 'left',
                background: showCoach
                  ? 'linear-gradient(135deg, rgba(124,92,252,0.18) 0%, rgba(99,179,237,0.08) 100%)'
                  : 'linear-gradient(135deg, rgba(124,92,252,0.06) 0%, rgba(0,0,0,0.2) 100%)',
                border: `1px solid ${showCoach ? 'rgba(124,92,252,0.5)' : 'rgba(124,92,252,0.15)'}`,
                borderRadius: 20,
                padding: '18px 16px 16px',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
                boxShadow: showCoach
                  ? '0 0 40px rgba(124,92,252,0.2), inset 0 1px 0 rgba(255,255,255,0.06)'
                  : '0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)',
              }}
            >
              {/* Animated scan-line overlay */}
              <motion.div
                animate={{ y: ['-100%', '200%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear', repeatDelay: 2 }}
                style={{
                  position: 'absolute', left: 0, right: 0, height: '30%',
                  background: 'linear-gradient(180deg, transparent, rgba(124,92,252,0.04), transparent)',
                  pointerEvents: 'none',
                }}
              />

              {/* Background neural mesh */}
              <div style={{
                position: 'absolute', inset: 0, opacity: 0.04,
                backgroundImage: `linear-gradient(rgba(124,92,252,1) 1px, transparent 1px), linear-gradient(90deg, rgba(124,92,252,1) 1px, transparent 1px)`,
                backgroundSize: '16px 16px',
                pointerEvents: 'none',
              }} />

              {/* Top row: label + live badge */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{
                  fontSize: '0.6rem', fontWeight: 900, letterSpacing: '0.2em',
                  textTransform: 'uppercase', color: 'var(--accent-primary)', opacity: 0.8
                }}>
                  Neural Engine
                </span>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  padding: '2px 8px', borderRadius: 100,
                  background: showCoach ? 'rgba(124,92,252,0.2)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${showCoach ? 'rgba(124,92,252,0.4)' : 'rgba(255,255,255,0.06)'}`,
                }}>
                  <motion.div
                    animate={{ opacity: showCoach ? [1, 0.3, 1] : [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    style={{ width: 5, height: 5, borderRadius: '50%', background: showCoach ? 'var(--accent-primary)' : '#22c55e' }}
                  />
                  <span style={{ fontSize: '0.55rem', fontWeight: 800, color: showCoach ? 'var(--accent-primary)' : 'rgba(34,197,94,0.9)', letterSpacing: '0.1em' }}>
                    {showCoach ? 'ACTIVE' : 'READY'}
                  </span>
                </div>
              </div>

              {/* Centre: Brain icon with pulse ring + title */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                {/* Animated icon cluster */}
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  {/* Outer pulse ring */}
                  <motion.div
                    animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    style={{
                      position: 'absolute', inset: -6,
                      borderRadius: '50%',
                      border: '1px solid var(--accent-primary)',
                      pointerEvents: 'none',
                    }}
                  />
                  {/* Inner icon box */}
                  <div style={{
                    width: 44, height: 44, borderRadius: 14,
                    background: showCoach
                      ? 'var(--accent-primary)'
                      : 'linear-gradient(135deg, rgba(124,92,252,0.15), rgba(124,92,252,0.05))',
                    border: `1px solid ${showCoach ? 'var(--accent-primary)' : 'rgba(124,92,252,0.3)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: showCoach ? '#fff' : 'var(--accent-primary)',
                    boxShadow: showCoach ? '0 0 20px rgba(124,92,252,0.5)' : '0 0 10px rgba(124,92,252,0.1)',
                    transition: 'all 0.4s ease',
                  }}>
                    <Brain size={22} />
                  </div>
                </div>

                {/* Title block */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: '0.85rem', fontWeight: 900, letterSpacing: '-0.02em',
                    color: 'var(--text-primary)', lineHeight: 1.2, marginBottom: 3,
                    fontFamily: 'var(--font-display)',
                  }}>
                    Intelligence Hub
                  </div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', fontWeight: 500, letterSpacing: '0.02em' }}>
                    {showCoach ? 'Daemon running...' : 'AI-powered creator audit'}
                  </div>
                </div>

                {/* Score chip */}
                {data?.coachScore && (
                  <div style={{
                    padding: '4px 8px', borderRadius: 8,
                    background: 'rgba(124,92,252,0.1)',
                    border: '1px solid rgba(124,92,252,0.2)',
                    fontSize: '0.72rem', fontWeight: 900,
                    color: 'var(--accent-primary)',
                    fontFamily: 'var(--font-mono)',
                    flexShrink: 0,
                  }}>
                    {data.coachScore}%
                  </div>
                )}
              </div>

              {/* Bottom: micro stat bar */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '9px 10px', borderRadius: 10,
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid rgba(255,255,255,0.04)',
              }}>
                <Sparkles size={11} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
                <span style={{ fontSize: '0.62rem', fontWeight: 700, color: 'var(--text-tertiary)', flex: 1 }}>
                  {showCoach ? 'Click to collapse panel' : 'Launch Neural Audit →'}
                </span>
                <ChevronRight size={11} style={{
                  color: 'var(--accent-primary)',
                  transform: showCoach ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s ease',
                  flexShrink: 0,
                }} />
              </div>
            </motion.button>
          </div>


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
          
          <div 
            style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', lineHeight: 1.5, cursor: 'pointer' }}
            onClick={() => {
              setActiveTab('home');
              setMobileOpen(false);
            }}
          >
            <div style={{ fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 2 }}>Creator Intelligence OS</div>
            Built for creators who think in systems.
          </div>
        </div>
      </aside>

      <main className="main-content">
        {/* Elite Command Header (Desktop Only) */}
        <div className="hidden md:flex items-center justify-end px-12 py-6 relative z-[990]">
           <motion.button
             onClick={toggleTheme}
             whileHover={{ scale: 1.05 }}
             whileTap={{ scale: 0.95 }}
             className="glass-strong w-12 h-12 flex items-center justify-center relative overflow-hidden group border-white/5 shadow-2xl"
             style={{
               background: theme === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
               borderRadius: 'var(--radius-lg)',
             }}
             title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
           >
             <AnimatePresence mode="wait">
               <motion.div
                 key={theme}
                 initial={{ y: 20, opacity: 0, rotate: -45 }}
                 animate={{ y: 0, opacity: 1, rotate: 0 }}
                 exit={{ y: -20, opacity: 0, rotate: 45 }}
                 transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                 className="text-[var(--accent-primary)]"
               >
                 {theme === 'dark' ? <Sparkles size={20} /> : <Zap size={20} />}
               </motion.div>
             </AnimatePresence>
             <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-primary)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
           </motion.button>
        </div>

        {/* Global Team Chat FAB (Desktop Only) */}
        <div className="hidden md:block" style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
        }}>
          <motion.button
            onClick={() => setShowComments(!showComments)}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className={`glass-strong relative ${showComments ? 'active-glow border-[var(--accent-primary)]' : 'border-white/5'}`}
            style={{
              width: 56,
              height: 56,
              borderRadius: 'var(--radius-xl)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: showComments ? 'rgba(124, 92, 252, 0.1)' : 'var(--bg-secondary)',
              boxShadow: showComments ? 'var(--shadow-glow-strong)' : 'var(--shadow-lg)',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <MessageSquare size={24} className={showComments ? 'text-[var(--accent-primary)]' : 'text-white/40'} />
            
            {comments[activeTab]?.length > 0 && (
              <div className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-500 rounded-full border-2 border-[var(--bg-secondary)] flex items-center justify-center text-[10px] font-black text-white">
                {comments[activeTab].length}
              </div>
            )}
          </motion.button>
        </div>

        {activeTab !== 'settings' && <TopicInput />}

        {/* Content Actions Strip */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: '0 20px 20px' }}>
          {activeTab !== 'settings' && activeTab !== 'home' && (
            <ExportButton section={activeTab} data={data?.[activeTab]} />
          )}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -10 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
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

      <CoachSidebar isOpen={showCoach} onClose={() => setShowCoach(false)} />
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
