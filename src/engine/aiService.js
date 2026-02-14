// ============================================
// CREATOR INTELLIGENCE OS — Frontend AI Service
// ============================================
// Communicates with the backend proxy to generate content.

const API_URL = 'http://localhost:3001/api';

export async function generateContent(systemPrompt, userPrompt, provider) {
  try {
    const response = await fetch(`${API_URL}/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ systemPrompt, userPrompt, provider }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Server error: ${response.status}`);
    }

    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error('AI Generation failed:', error);
    throw error;
  }
}

export async function checkBackendHealth() {
  try {
    const response = await fetch(`${API_URL}/health`);
    return response.ok;
  } catch (e) {
    return false;
  }
}

export async function getAvailableProviders() {
  try {
    const response = await fetch(`${API_URL}/providers`);
    if (!response.ok) return { providers: [], default: null };
    return await response.json();
  } catch (e) {
    return { providers: [], default: null };
  }
}

export async function saveKeys(keys) {
  try {
    const response = await fetch(`${API_URL}/config/keys`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(keys),
    });
    return response.ok;
  } catch (error) {
    console.error('Failed to save keys:', error);
    return false;
  }
}
