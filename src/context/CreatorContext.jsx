// ============================================
// CREATOR INTELLIGENCE OS — Creator Context
// ============================================

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { generateData, generateSection } from '../engine/mockGenerator';
import { checkBackendHealth } from '../engine/aiService';

const CreatorContext = createContext(null);

export function CreatorProvider({ children }) {
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('Analytical');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('strategy');
  
  // Settings State
  const [provider, setProvider] = useState(null);
  const [backendReady, setBackendReady] = useState(false);

  // Check backend on load
  // Check backend & Restore session on load
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
      } catch (e) { console.error('Failed to restore session', e); }
    }
  }, []);

  // Persist Session
  useEffect(() => {
    if (topic || data) {
      localStorage.setItem('creator_session', JSON.stringify({ topic, tone, data }));
    }
  }, [topic, tone, data]);

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
    setActiveTab('strategy');
    localStorage.removeItem('creator_session');
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
