// ============================================
// CREATOR INTELLIGENCE OS — Creator Context
// ============================================

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { generateData, generateSection } from '../engine/mockGenerator';
import { checkBackendHealth } from '../engine/aiService';
import { dbService } from '../services/dbService';
import { useAuth } from './AuthContext';

const CreatorContext = createContext(null);

export function CreatorProvider({ children }) {
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('Analytical');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('strategy');
  const [currentProjectId, setCurrentProjectId] = useState(null);
  const { user } = useAuth();
  
  // Settings State
  const [provider, setProvider] = useState(null);
  const [backendReady, setBackendReady] = useState(false);

  // Collaboration State
  const [activeWorkspace, setActiveWorkspace] = useState('personal'); // 'personal' | 'team-id'
  const [workspaces, setWorkspaces] = useState([
    { id: 'personal', name: 'Personal Workspace', type: 'personal', members: [1] }, // 1 = current user
    { id: 'team-1', name: 'Creator Team', type: 'team', members: [1, 2, 3] }
  ]);

  const [comments, setComments] = useState({}); // { contextId: [ { id, user, text, timestamp } ] }
  const [showTeamSettings, setShowTeamSettings] = useState(false);

  // Check backend on load
  // Check backend & Restore session on load
  const [affiliates, setAffiliates] = useState([]);

  // Check backend & Restore session on load
  useEffect(() => {
    checkBackendHealth().then(setBackendReady);
    
    // Load Settings (Provider)
    const savedSettings = localStorage.getItem('creator_settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        if (parsed.provider) setProvider(parsed.provider);
      } catch (e) { console.error('Failed to restore settings', e); }
    }

    // Load Session (Data)
    const savedSession = localStorage.getItem('creator_session');
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        if (parsed.topic) setTopic(parsed.topic);
        if (parsed.tone) setTone(parsed.tone);
        if (parsed.data) setData(parsed.data);
        if (parsed.affiliates) setAffiliates(parsed.affiliates);
      } catch (e) { console.error('Failed to restore session', e); }
    }
  }, []);

  // Persist Session
  useEffect(() => {
    if (topic || data || affiliates.length > 0) {
      localStorage.setItem('creator_session', JSON.stringify({ topic, tone, data, affiliates }));
    }
  }, [topic, tone, data, affiliates]);

  // Persist Settings
  useEffect(() => {
    if (provider) {
      localStorage.setItem('creator_settings', JSON.stringify({ provider }));
    }
  }, [provider]);

  const resetSession = useCallback(() => {
    setTopic('');
    setTone('Analytical');
    setData(null);
    setCurrentProjectId(null);
    setActiveTab('strategy');
    localStorage.removeItem('creator_session');
  }, []);

  const saveCurrentProject = useCallback(async () => {
    if (!user || !topic) return false;
    
    setLoading(true);
    try {
      let projectId = currentProjectId;
      
      // Create new project if doesn't exist
      if (!projectId) {
        const project = await dbService.createProject(user.id, topic);
        if (project) {
          projectId = project.id;
          setCurrentProjectId(projectId);
        }
      }

      if (projectId && data) {
        // Save all data sections
        const promises = Object.entries(data).map(([type, content]) => {
          if (type === 'repurposed') {
             // For repurposed content, we might want to save individual pieces or the whole object
             // dbService expects 'type' and 'content'. 
             // Let's JSON stringify complex objects if dbService handles text, 
             // but wait, dbService.saveGeneration checks type.
             // We should adapt dbService or here. 
             // Assuming dbService saves strings/json to a text column?
             // Let's check dbService schema... it's likely a text column.
             return dbService.saveGeneration(user.id, projectId, 'repurposed', JSON.stringify(content));
          }
          return dbService.saveGeneration(user.id, projectId, type, typeof content === 'string' ? content : JSON.stringify(content));
        });
        
        await Promise.all(promises);
        return true;
      }
    } catch (e) {
      console.error('Failed to save project:', e);
      return false;
    } finally {
      setLoading(false);
    }
  }, [user, topic, data, currentProjectId]);

  const loadProject = useCallback(async (projectId) => {
    setLoading(true);
    try {
      const project = await dbService.getProjectFull(projectId);
      if (project) {
        setTopic(project.topic);
        setData(project.data);
        setCurrentProjectId(project.id);
        setActiveTab('strategy');
      }
    } catch (e) {
      console.error('Failed to load project:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  const generate = useCallback(async (topicInput) => {
    if (!topicInput.trim()) return;
    setLoading(true);
    setTopic(topicInput);
    
    // Uses real AI if provider is set, otherwise mock
    const result = await generateData(topicInput, tone, provider);
    
    setData(result);
    setLoading(false);
    setActiveTab('strategy');
  }, [tone, provider]);

  const regenerateSection = useCallback(async (section) => {
    if (!topic) return;
    setLoading(true);
    
    // Optimized: Regenerate only the specific section
    const freshSectionData = await generateSection(section, topic, tone, provider);
    
    setData(prev => ({
      ...prev,
      [section]: freshSectionData,
    }));
    setLoading(false);
  }, [topic, tone, provider]);

  const addComment = useCallback((contextId, text) => {
    if (!user) return;
    const newComment = {
      id: Date.now(),
      user: { name: 'You', avatar: null }, // Mock user
      text,
      timestamp: new Date().toISOString()
    };
    setComments(prev => ({
      ...prev,
      [contextId]: [...(prev[contextId] || []), newComment]
    }));
  }, [user]);

  const value = {
    topic, setTopic,
    tone, setTone,
    data, setData,
    loading,
    activeTab, setActiveTab,
    generate,
    regenerateSection,
    resetSession,
    provider, setProvider,
    backendReady,
    currentProjectId,
    saveCurrentProject,
    loadProject,
    // Collaboration
    activeWorkspace, setActiveWorkspace,
    workspaces, setWorkspaces,
    comments, addComment,
    showTeamSettings, setShowTeamSettings,
    affiliates, setAffiliates
  };

  return (
    <CreatorContext.Provider value={value}>
      {children}
    </CreatorContext.Provider>
  );
}

export function useCreator() {
  const ctx = useContext(CreatorContext);
  if (!ctx) throw new Error('useCreator must be used within CreatorProvider');
  return ctx;
}
