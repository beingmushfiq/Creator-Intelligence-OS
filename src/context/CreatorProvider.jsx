import React, { useState, useCallback, useEffect, useRef } from 'react';
import { generateData, generateSection } from '../engine/mockGenerator.js';
import { checkBackendHealth, getCommunityPulse, analyzeWorkload } from '../engine/aiService.js';
import { dbService } from '../services/dbService.js';
import { useAuth } from './AuthContext.jsx';
import { CreatorContext } from './CreatorContext.jsx';

export function CreatorProvider({ children }) {
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('Analytical');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [calendar, setCalendar] = useState(null);
  const [revenue, setRevenue] = useState([]);
  const [assets, setAssets] = useState([]);
  const [currentProjectId, setCurrentProjectId] = useState(null);
  const { user } = useAuth();
  
  // Settings State
  const [provider, setProvider] = useState(null);
  const [backendReady, setBackendReady] = useState(false);

  // Collaboration State
  const [activeWorkspace, setActiveWorkspace] = useState('personal'); // 'personal' | 'team-id'
  const [workspaces, setWorkspaces] = useState([{ id: 'personal', name: 'Personal Workspace', type: 'personal' }]);

  const [comments, setComments] = useState({}); // { contextId: [ { id, user, text, timestamp } ] }
  const [showTeamSettings, setShowTeamSettings] = useState(false);
  const [affiliates, setAffiliates] = useState([]);
  const [currentAudio, setCurrentAudio] = useState(null);

  // Burnout & Pulse State
  const [pulse, setPulse] = useState(null);
  const [workload, setWorkload] = useState(null);
  const [coachFeedback, setCoachFeedback] = useState(null);

  // Real-time subscription refs (so we can clean up)  
  const unsubProjectList = useRef(null);
  const unsubActiveProject = useRef(null);

  // Check backend & Restore session on load
  useEffect(() => {
    checkBackendHealth().then(setBackendReady);
    
    if (user) {
      dbService.getUserTeams(user.id).then(teams => {
        const teamWs = teams.map(t => ({ id: t.id, name: t.name, type: 'team' }));
        setWorkspaces([{ id: 'personal', name: 'Personal Workspace', type: 'personal' }, ...teamWs]);
      });
    }

    const savedSettings = localStorage.getItem('creator_settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        if (parsed.provider) setProvider(parsed.provider);
      } catch (e) { console.error('Failed to restore settings', e); }
    }

    const savedSession = localStorage.getItem('creator_session');
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        if (parsed.topic) setTopic(parsed.topic);
        if (parsed.tone) setTone(parsed.tone);
        if (parsed.data) setData(parsed.data);
        const storedCalendar = localStorage.getItem('creator_calendar');
        if (storedCalendar) setCalendar(JSON.parse(storedCalendar));
        const storedRevenue = localStorage.getItem('creator_revenue');
        if (storedRevenue) setRevenue(JSON.parse(storedRevenue));
        const storedAssets = localStorage.getItem('creator_assets');
        if (storedAssets) setAssets(JSON.parse(storedAssets));
      } catch (e) { console.warn('Persistence recovery failed', e); }
    }
  }, [user]);

  // ── Real-time: subscribe to user's project list ──
  useEffect(() => {
    if (!user) return;
    // Clean up previous subscription
    unsubProjectList.current?.();
    unsubProjectList.current = dbService.subscribeToUserProjects(user.id, (payload) => {
      // When ANY project changes, we don't need to do anything specific here —
      // the app re-loads project data when navigating. This keeps the project list fresh
      // in components that render it.
      console.debug('[RT] Project list changed:', payload.eventType);
    });
    return () => unsubProjectList.current?.();
  }, [user]);

  // ── Real-time: subscribe to the active project's data ──
  useEffect(() => {
    // Clean up previous subscription
    unsubActiveProject.current?.();
    if (!currentProjectId) return;

    unsubActiveProject.current = dbService.subscribeToProject(currentProjectId, {
      onGenerationChange: (payload) => {
        if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
          const { type, content } = payload.new;
          setData(prev => prev ? { ...prev, [type]: content } : prev);
        }
      },
      onTaskChange: (payload) => {
        console.debug('[RT] Task changed:', payload.eventType, payload.new?.id);
        // Tasks are managed by their own component subscriptions
      },
      onAssetChange: (payload) => {
        if (payload.eventType === 'INSERT') {
          setAssets(prev => [payload.new, ...prev]);
        } else if (payload.eventType === 'DELETE') {
          setAssets(prev => prev.filter(a => a.id !== payload.old.id));
        }
      },
      onCommentChange: (payload) => {
        const contextId = payload.new?.context_id || payload.old?.context_id;
        if (!contextId) return;
        if (payload.eventType === 'INSERT') {
          setComments(prev => ({
            ...prev,
            [contextId]: [...(prev[contextId] || []), payload.new]
          }));
        } else if (payload.eventType === 'DELETE') {
          setComments(prev => ({
            ...prev,
            [contextId]: (prev[contextId] || []).filter(c => c.id !== payload.old.id)
          }));
        }
      },
    });

    return () => unsubActiveProject.current?.();
  }, [currentProjectId]);

  // Persist Session
  useEffect(() => {
    if (topic || data || calendar || affiliates.length > 0) {
      localStorage.setItem('creator_session', JSON.stringify({ 
        topic, tone, data, calendar, affiliates 
      }));
    }
  }, [topic, tone, data, calendar, affiliates]);

  useEffect(() => {
    if (provider) localStorage.setItem('creator_settings', JSON.stringify({ provider }));
  }, [provider]);

  useEffect(() => {
    localStorage.setItem('creator_calendar', JSON.stringify(calendar));
    localStorage.setItem('creator_revenue', JSON.stringify(revenue));
    localStorage.setItem('creator_assets', JSON.stringify(assets));
  }, [calendar, revenue, assets]);

  const resetSession = useCallback(() => {
    setTopic('');
    setTone('Analytical');
    setData(null);
    setCalendar(null);
    setRevenue([]);
    setAssets([]);
    setWorkload(null);
    setPulse(null);
    setCurrentProjectId(null);
    setActiveTab('strategy');
    localStorage.removeItem('creator_session');
    localStorage.removeItem('creator_calendar');
    localStorage.removeItem('creator_revenue');
    localStorage.removeItem('creator_assets');
  }, []);

  const addRevenueRecord = useCallback(async (amount, source, date = new Date()) => {
    const record = { amount, source, date: date.toISOString() };
    const newRevenue = [...revenue, record];
    setRevenue(newRevenue);
    if (user && currentProjectId) {
      try {
        await dbService.saveRevenue(user.id, currentProjectId, record);
      } catch (e) { console.error('Failed to sync revenue:', e); }
    }
  }, [user, currentProjectId, revenue]);

  const saveCurrentProject = useCallback(async () => {
    if (!user || !topic) return false;
    setLoading(true);
    try {
      let projectId = currentProjectId;
      if (!projectId) {
        const teamId = activeWorkspace !== 'personal' ? activeWorkspace : null;
        const project = await dbService.createProject(user.id, topic, teamId);
        if (project) {
          projectId = project.id;
          setCurrentProjectId(projectId);
        }
      }
      if (projectId && data) {
        const promises = Object.entries(data).map(([type, content]) => {
          if (type === 'repurposed') return dbService.saveGeneration(user.id, projectId, 'repurposed', JSON.stringify(content));
          return dbService.saveGeneration(user.id, projectId, type, typeof content === 'string' ? content : JSON.stringify(content));
        });
        if (calendar) promises.push(dbService.saveGeneration(user.id, projectId, 'calendar', JSON.stringify(calendar)));
        await Promise.all(promises);
        return true;
      }
    } catch (e) { console.error('Failed to save project:', e); return false; }
    finally { setLoading(false); }
  }, [user, topic, data, currentProjectId, calendar, activeWorkspace]);

  const loadProject = useCallback(async (projectId) => {
    setLoading(true);
    try {
      const fullProject = await dbService.getProjectFull(projectId);
      if (fullProject) {
        setTopic(fullProject.topic);
        setData(fullProject.data);
        setCurrentProjectId(fullProject.id);
        setActiveTab('strategy');
        if (fullProject.calendar) setCalendar(fullProject.calendar);
        const revs = await dbService.getRevenue(user.id);
        setRevenue(revs);
        const projAssets = await dbService.getAssetsByProject(user.id, projectId);
        setAssets(projAssets || []);
      }
    } catch (err) { console.error('Project load error:', err); }
    finally { setLoading(false); }
  }, [user]);

  const generate = useCallback(async (topicInput) => {
    if (!topicInput.trim()) return;
    setLoading(true);
    setTopic(topicInput);
    const dnaSnippet = data?.genome?.dna_snippet;
    const result = await generateData(topicInput, tone, provider, dnaSnippet);
    setData(result);
    if (user) {
      const teamId = activeWorkspace !== 'personal' ? activeWorkspace : null;
      dbService.logActivity(user.id, 'generation', `Started new project: ${topicInput}`, teamId);
    }
    if (provider) {
      const { generateCalendar } = await import('../engine/aiService');
      generateCalendar(topicInput, tone, null, dnaSnippet).then(setCalendar).catch(console.error);
    }
    setLoading(false);
    setActiveTab('strategy');
  }, [tone, provider, data, user, activeWorkspace]);

  const regenerateSection = useCallback(async (section, options = {}) => {
    if (!topic) return;
    setLoading(true);
    const dnaSnippet = data?.genome?.dna_snippet;
    const freshSectionData = await generateSection(section, topic, tone, provider, dnaSnippet, { 
      ...options, 
      productData: data?.product,
      communityData: data?.community
    });
    setData(prev => ({ ...prev, [section]: freshSectionData }));
    if (user) {
      const teamId = activeWorkspace !== 'personal' ? activeWorkspace : null;
      dbService.logActivity(user.id, 'regeneration', `Regenerated ${section} section for "${topic}"`, teamId, currentProjectId);
    }
    setLoading(false);
  }, [topic, tone, provider, data, user, activeWorkspace, currentProjectId]);

  const addComment = useCallback(async (contextId, text) => {
    if (!user) return;
    const optimistic = { id: Date.now(), user: { name: 'You', avatar: null }, text, timestamp: new Date().toISOString() };
    setComments(prev => ({ ...prev, [contextId]: [...(prev[contextId] || []), optimistic] }));
    try {
      const teamId = activeWorkspace !== 'personal' ? activeWorkspace : null;
      await dbService.addComment(user.id, contextId, text, teamId);
    } catch (e) { console.warn('Comment persistence failed:', e.message); }
  }, [user, activeWorkspace]);

  const generatePulse = useCallback(async () => {
    if (!topic) return;
    setLoading(true);
    try {
      const dnaSnippet = data?.genome?.dna_snippet;
      const result = await getCommunityPulse(topic, data, dnaSnippet);
      setPulse(result);
      if (user && currentProjectId) dbService.saveGeneration(user.id, currentProjectId, 'pulse', JSON.stringify(result));
    } catch (err) { console.error('Pulse check failed:', err); }
    finally { setLoading(false); }
  }, [topic, data, user, currentProjectId]);

  const analyzeWorkloadData = useCallback(async () => {
    setLoading(true);
    try {
      const mockHistory = [
        { date: '2024-02-20', projects: 2, difficulty: 'High' },
        { date: '2024-02-21', projects: 1, difficulty: 'Medium' },
      ];
      const result = await analyzeWorkload(mockHistory);
      setWorkload(result);
    } catch (err) { console.error('Workload analysis failed:', err); }
    finally { setLoading(false); }
  }, []);

  const [batchMode, setBatchMode] = useState(false);
  const [batchQueue, setBatchQueue] = useState([]);

  const addToBatch = useCallback((topicInput, toneInput) => {
    if (!topicInput.trim()) return;
    const newItem = { id: Date.now().toString(), topic: topicInput.trim(), tone: toneInput || tone, status: 'pending' };
    setBatchQueue(prev => [...prev, newItem]);
  }, [tone]);

  const removeFromBatch = useCallback((id) => setBatchQueue(prev => prev.filter(item => item.id !== id)), []);
  const clearBatch = useCallback(() => setBatchQueue([]), []);

  const processBatch = useCallback(async () => {
    if (batchQueue.length === 0) return;
    setLoading(true);
    await Promise.allSettled(batchQueue.map(async (item) => {
      setBatchQueue(prev => prev.map(i => i.id === item.id ? { ...i, status: 'generating' } : i));
      try {
        const dnaSnippet = data?.genome?.dna_snippet;
        const result = await generateData(item.topic, item.tone, provider, dnaSnippet);
        if (user) {
          const teamId = activeWorkspace !== 'personal' ? activeWorkspace : null;
          const project = await dbService.createProject(user.id, item.topic, teamId);
          if (project && result) {
            await dbService.saveGeneration(user.id, project.id, 'strategy', JSON.stringify(result));
            dbService.logActivity(user.id, 'generation', `Batch generated: ${item.topic}`, teamId);
          }
        }
        setBatchQueue(prev => prev.map(i => i.id === item.id ? { ...i, status: 'done' } : i));
      } catch (err) {
        console.error(`Batch item ${item.id} failed:`, err);
        setBatchQueue(prev => prev.map(i => i.id === item.id ? { ...i, status: 'error' } : i));
      }
    }));
    setLoading(false);
  }, [batchQueue, data, provider, user, activeWorkspace]);

  const analyzeCoachFeedback = useCallback(async () => {
    if (!topic || !data) return;
    setLoading(true);
    try {
      const { analyzeContentQuality } = await import('../engine/aiService.js');
      const dnaSnippet = data?.genome?.dna_snippet;
      const result = await analyzeContentQuality(topic, data, dnaSnippet);
      setCoachFeedback(result);
    } catch (err) {
      console.error('Coach analysis failed:', err);
    } finally {
      setLoading(false);
    }
  }, [topic, data]);

  const value = {
    topic, setTopic, tone, setTone, data, setData, loading, activeTab, setActiveTab,
    calendar, setCalendar, pulse, setPulse, workload, setWorkload, coachFeedback, 
    analyzeCoachFeedback, generatePulse, analyzeWorkloadData,
    batchMode, setBatchMode, batchQueue, setBatchQueue, addToBatch, removeFromBatch, processBatch, clearBatch,
    generate, regenerateSection, resetSession, provider, setProvider, backendReady, currentProjectId,
    saveCurrentProject, loadProject, currentAudio, setCurrentAudio, activeWorkspace, setActiveWorkspace,
    workspaces, setWorkspaces, comments, addComment, showTeamSettings, setShowTeamSettings,
    affiliates, setAffiliates, addRevenueRecord, revenue, assets, setAssets,
    createTeam: async (name) => {
      if (!user) return null;
      try {
        const newTeam = await dbService.createTeam(user.id, name);
        if (newTeam) {
          const ws = { id: newTeam.id, name: newTeam.name, type: 'team' };
          setWorkspaces(prev => [...prev, ws]);
          setActiveWorkspace(ws.id);
          return newTeam;
        }
      } catch (err) { console.error('Failed to create team:', err); throw err; }
    },
    generateImage: async (prompt, style, ratio) => {
      setLoading(true);
      try {
        const { generateImage } = await import('../engine/aiService');
        const url = await generateImage(prompt, style, ratio);
        const newAsset = { id: Date.now(), type: 'image', url, prompt, style, ratio };
        setAssets(prev => [newAsset, ...prev]);
        if (user && currentProjectId) {
          const teamId = activeWorkspace !== 'personal' ? activeWorkspace : null;
          dbService.saveAsset(user.id, currentProjectId, 'image', url, prompt);
          dbService.logActivity(user.id, 'asset_creation', `Generated new thumbnail for "${topic}"`, teamId, currentProjectId);
        }
        return url;
      } finally { setLoading(false); }
    }
  };

  return <CreatorContext.Provider value={value}>{children}</CreatorContext.Provider>;
}
