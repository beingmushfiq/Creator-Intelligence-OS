// ============================================
// CREATOR INTELLIGENCE OS — Creator Context
// ============================================

import { createContext, useContext } from 'react';

export const CreatorContext = createContext(null);

export function useCreator() {
  const ctx = useContext(CreatorContext);
  if (!ctx) throw new Error('useCreator must be used within CreatorProvider');
  return ctx;
}
