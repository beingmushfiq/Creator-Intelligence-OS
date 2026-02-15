// ============================================
// CREATOR INTELLIGENCE OS — Frontend AI Service
// ============================================
// Communicates with the backend proxy to generate content.

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
import { VISUAL_STYLES, ASPECT_RATIOS } from './visualPrompts';

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

import { REPURPOSING_PROMPTS } from './repurposingPrompts';

export async function repurposeContent(scriptData, onProgress) {
  const platforms = [
    { key: 'shortFormClips', promptKey: 'shortFormClips' },
    { key: 'linkedInPost', promptKey: 'linkedInPost' },
    { key: 'twitterThread', promptKey: 'twitterThread' },
    { key: 'blogPost', promptKey: 'blogPost' },
    { key: 'emailNewsletter', promptKey: 'emailNewsletter' },
    { key: 'instagramCaption', promptKey: 'instagramCaption' },
  ];

  const results = {};
  const fullScript = scriptData.script.scenes 
    ? scriptData.script.scenes.map(s => s.description).join('\n\n') 
    : scriptData.rawText || '';

  const userPrompt = `
    TOPIC: ${scriptData.topic}
    SCRIPT:
    ${fullScript}
  `;

  // Parallel Execution with Progress Tracking
  await Promise.allSettled(platforms.map(async (p) => {
    try {
      const result = await generateContent(REPURPOSING_PROMPTS[p.promptKey], userPrompt);
      results[p.key] = result;
      if (onProgress) onProgress(p.key, result);
    } catch (err) {
      console.warn(`Failed to generate ${p.key}:`, err);
      results[p.key] = null; // Mark as failed but don't break others
    }
  }));

  // Podcast Script is a simple rule-based fallback for now to save tokens, 
  // or we can add it to AI later. keeping it simple.
  results.podcastScript = generatePodcastScriptRuleBased(scriptData);

  return results;
}

export async function generateSeoData(topic, onProgress) {
  const { SEO_PROMPTS } = await import('./seoPrompts');
  const results = {};
  
  const tasks = [
    { key: 'keywords', prompt: SEO_PROMPTS.keywordResearch },
    { key: 'metadata', prompt: SEO_PROMPTS.metadataOptimization },
    { key: 'trends', prompt: SEO_PROMPTS.trendAlignment }
  ];

  await Promise.allSettled(tasks.map(async (task) => {
    try {
      const result = await generateContent(task.prompt, `TOPIC: ${topic}`);
      results[task.key] = result;
      if (onProgress) onProgress(task.key, result);
    } catch (err) {
      console.warn(`Failed to generate SEO ${task.key}:`, err);
      results[task.key] = null;
    }
  }));

  return results;
}

export async function generateSponsorships(topic) {
  const { SPONSORSHIP_PROMPTS } = await import('./sponsorshipPrompts');
  try {
    const brands = await generateContent(SPONSORSHIP_PROMPTS.brandMatching, `TOPIC: ${topic}`);
    return brands;
  } catch (err) {
    console.error('Failed to generate sponsorships:', err);
    throw err;
  }
}

export async function generatePitch(brandName, topic, pitchAngle) {
  const { SPONSORSHIP_PROMPTS } = await import('./sponsorshipPrompts');
  const prompt = SPONSORSHIP_PROMPTS.pitchGenerator
    .replace('{brandName}', brandName)
    .replace('{topic}', topic)
    .replace('{pitchAngle}', pitchAngle);
    
  return generateContent(prompt, '');
}

function generatePodcastScriptRuleBased(scriptData) {
  return {
    intro: `Welcome back! Today we're discussing ${scriptData.topic}.`,
    mainContent: [{ script: "Here are the key insights..." }],
    outro: "Thanks for listening!"
  };
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

export async function generateImage(prompt, styleId = 'mrbeast', ratioId = 'landscape') {
  try {
    const stylePrompt = VISUAL_STYLES[styleId]?.prompt || '';
    const size = ASPECT_RATIOS[ratioId]?.size || '1024x1024';
    const fullPrompt = `${stylePrompt} ${prompt}`;

    const response = await fetch(`${API_URL}/generate-image`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        prompt: fullPrompt,
        size
      }),
    });

    if (!response.ok) throw new Error('Failed to generate image');
    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error('Image Gen Error:', error);
    throw error;
  }
}

export async function enhanceImagePrompt(userIdea) {
  const { MAGIC_ENHANCE_PROMPT } = await import('./visualPrompts');
  return generateContent(MAGIC_ENHANCE_PROMPT + userIdea);
}

export async function generateSpeech(text, voiceId) {
  try {
    const response = await fetch(`${API_URL}/generate-speech`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, voiceId }),
    });

    if (!response.ok) throw new Error('Failed to generate speech');
    
    // Return a Blob URL for the audio
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Voice Gen Error:', error);
    throw error;
  }
}
