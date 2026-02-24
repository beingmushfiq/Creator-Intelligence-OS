// ============================================
// CREATOR INTELLIGENCE OS — Frontend AI Service
// ============================================
// Communicates with the backend proxy to generate content.

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
import { VISUAL_STYLES, ASPECT_RATIOS } from './visualPrompts.js';

/**
 * Robust JSON parser that handles markdown blocks and whitespace
 */
const parseAIResponse = (text) => {
  if (typeof text !== 'string') return text;
  
  // Remove markdown code blocks if present
  const cleaned = text.replace(/```json\n?|```/g, '').trim();
  
  try {
    return JSON.parse(cleaned);
  } catch (e) {
    console.error('JSON Parse Failed. Attempting fuzzy match...', e);
    // If it's a list or object, try to find the first { or [ and last } or ]
    const startIdx = Math.min(
      cleaned.indexOf('{') === -1 ? Infinity : cleaned.indexOf('{'),
      cleaned.indexOf('[') === -1 ? Infinity : cleaned.indexOf('[')
    );
    const endIdx = Math.max(
      cleaned.lastIndexOf('}'),
      cleaned.lastIndexOf(']')
    );
    
    if (startIdx !== Infinity && endIdx !== -1) {
      try {
        return JSON.parse(cleaned.substring(startIdx, endIdx + 1));
      } catch (innerE) {
        console.error('Fuzzy parse failed:', innerE);
        return cleaned; // Fallback to raw text
      }
    }
    return cleaned;
  }
};

export async function generateContent(systemPrompt, userPrompt, provider, dnaSnippet) {
  try {
    // Explicit Persona Grounding
    const personaHeader = `[SYSTEM ROLE: ELITE CREATIVE INTELLIGENCE OS]\n[STATUS: MASTER PRODUCTION MODE]\n\n`;
    
    // Brand Genome grounding
    const genomeContext = dnaSnippet 
      ? `[BRAND DNA ACTIVE - ADHERE STRICTLY TO THIS STYLE]:\n${dnaSnippet}\n\n`
      : '';

    const groundedSystemPrompt = personaHeader + genomeContext + systemPrompt;

    console.log(`[AI SERVICE] Dispatching to ${provider || 'Default'} Provider...`);

    const response = await fetch(`${API_URL}/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ systemPrompt: groundedSystemPrompt, userPrompt, provider }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Upstream API failure: ${response.status}`);
    }

    const data = await response.json();
    return parseAIResponse(data.result);
  } catch (error) {
    console.error('Critical AI Failure:', error);
    throw error;
  }
}

import { REPURPOSING_PROMPTS } from './repurposingPrompts.js';

export async function repurposeContent(scriptData, onProgress, dnaSnippet) {
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
      const result = await generateContent(REPURPOSING_PROMPTS[p.promptKey], userPrompt, null, dnaSnippet);
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

export async function generateSeoData(topic, onProgress, dnaSnippet) {
  const { SEO_PROMPTS } = await import('./seoPrompts.js');
  const results = {};
  
  const tasks = [
    { key: 'keywords', prompt: SEO_PROMPTS.keywordResearch },
    { key: 'metadata', prompt: SEO_PROMPTS.metadataOptimization },
    { key: 'trends', prompt: SEO_PROMPTS.trendAlignment },
    { key: 'tiktok', prompt: SEO_PROMPTS.tiktokInsights },
    { key: 'google', prompt: SEO_PROMPTS.googleSearchVisibility },
    { key: 'predictions', prompt: SEO_PROMPTS.trendPrediction }
  ];

  await Promise.allSettled(tasks.map(async (task) => {
    try {
      const result = await generateContent(task.prompt, `TOPIC: ${topic}`, null, dnaSnippet);
      results[task.key] = result;
      if (onProgress) onProgress(task.key, result);
    } catch (err) {
      console.warn(`Failed to generate SEO ${task.key}:`, err);
      results[task.key] = null;
    }
  }));

  return results;
}

export async function generateSponsorships(topic, dnaSnippet) {
  const { SPONSORSHIP_PROMPTS } = await import('./sponsorshipPrompts.js');
  try {
    const brands = await generateContent(SPONSORSHIP_PROMPTS.brandMatching, `TOPIC: ${topic}`);
    return brands;
  } catch (err) {
    console.error('Failed to generate sponsorships:', err);
    throw err;
  }
}

export async function generatePitch(brandName, topic, pitchAngle) {
  const { SPONSORSHIP_PROMPTS } = await import('./sponsorshipPrompts.js');
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
  const { MAGIC_ENHANCE_PROMPT } = await import('./visualPrompts.js');
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
export async function generateCalendar(topic, tone, onProgress, dnaSnippet) {
  const { CALENDAR_PROMPTS } = await import('./calendarPrompts.js');
  try {
    const systemPrompt = CALENDAR_PROMPTS.main;
    const userPrompt = `TOPIC: "${topic}"\nTONE: ${tone}\n\nGenerate a meticulous 30-day production calendar.`;
    
    return await generateContent(systemPrompt, userPrompt, null, dnaSnippet);
  } catch (error) {
    console.error('Calendar generation failed:', error);
    throw error;
  }
}

export async function suggestTasks(topic, projectData) {
  const { TASK_PROMPTS } = await import('./taskPrompts.js');
  try {
    const scriptText = projectData.script?.scenes 
      ? projectData.script.scenes.map(s => s.description).join('\n')
      : (typeof projectData.script === 'string' ? projectData.script : '');

    const systemPrompt = TASK_PROMPTS.suggest_production_tasks(topic, {
      ...projectData,
      script: scriptText
    });

    return await generateContent(systemPrompt, '');
  } catch (error) {
    console.error('Task suggestion failed:', error);
    throw error;
  }
}

export async function getProjectPulse(topic, projectData, dnaSnippet) {
  const { DASHBOARD_PROMPTS } = await import('./dashboardPrompts.js');
  try {
    const systemPrompt = DASHBOARD_PROMPTS.project_pulse(topic, projectData);
    const result = await generateContent(systemPrompt, '', null, dnaSnippet);
    return typeof result === 'string' ? JSON.parse(result) : result;
  } catch (err) {
    console.error('Pulse generation failed:', err);
    return null;
  }
}

export async function generateAudience(topic, projectData, dnaSnippet) {
  const { AUDIENCE_PROMPTS } = await import('./audiencePrompts.js');
  try {
    const systemPrompt = AUDIENCE_PROMPTS.generate_avatars(topic, projectData);
    const result = await generateContent(systemPrompt, '', null, dnaSnippet);
    return typeof result === 'string' ? JSON.parse(result) : result;
  } catch (error) {
    console.error('Audience generation failed:', error);
    throw error;
  }
}

export async function reframeForPersona(persona, topic, hook) {
  const { AUDIENCE_PROMPTS } = await import('./audiencePrompts.js');
  try {
    const systemPrompt = AUDIENCE_PROMPTS.reframe_hook(persona, topic, hook);
    return await generateContent(systemPrompt, '');
  } catch (error) {
    console.error('Hook reframing failed:', error);
    throw error;
  }
}

export async function generateMarketAnalysis(topic, projectData, dnaSnippet) {
  const { COMPETITIVE_PROMPTS } = await import('./competitivePrompts.js');
  try {
    const systemPrompt = COMPETITIVE_PROMPTS.market_analysis(topic, projectData);
    const result = await generateContent(systemPrompt, '', null, dnaSnippet);
    return typeof result === 'string' ? JSON.parse(result) : result;
  } catch (error) {
    console.error('Market analysis failed:', error);
    throw error;
  }
}

export async function getPerformanceProjection(topic, projectData, dnaSnippet) {
  const { PREDICTION_PROMPTS } = await import('./predictionPrompts.js');
  try {
    const systemPrompt = PREDICTION_PROMPTS.performance_projection(topic, projectData);
    const result = await generateContent(systemPrompt, '', null, dnaSnippet);
    return typeof result === 'string' ? JSON.parse(result) : result;
  } catch (error) {
    console.error('Performance projection failed:', error);
    throw error;
  }
}

export async function getMonetizationStrategy(topic, projectData, dnaSnippet) {
  const { MONETIZATION_PROMPTS } = await import('./monetizationPrompts.js');
  try {
    const systemPrompt = MONETIZATION_PROMPTS.revenue_strategy(topic, projectData);
    const result = await generateContent(systemPrompt, '', null, dnaSnippet);
    return typeof result === 'string' ? JSON.parse(result) : result;
  } catch (error) {
    console.error('Monetization strategy failed:', error);
    throw error;
  }
}

export async function getVisualRepurposingPlan(topic, script, dnaSnippet) {
  const { VISUAL_REPURPOSING_PROMPTS } = await import('./visualRepurposingPrompts.js');
  try {
    const systemPrompt = VISUAL_REPURPOSING_PROMPTS.carousel_plan(topic, script);
    const result = await generateContent(systemPrompt, '', null, dnaSnippet);
    return typeof result === 'string' ? JSON.parse(result) : result;
  } catch (error) {
    console.error('Visual repurposing failed:', error);
    throw error;
  }
}

export async function getTrendForecast(topic, dnaSnippet) {
  const { TREND_PROMPTS } = await import('./trendPrompts.js');
  try {
    const systemPrompt = TREND_PROMPTS.forecast(topic);
    const result = await generateContent(systemPrompt, '', null, dnaSnippet);
    return typeof result === 'string' ? JSON.parse(result) : result;
  } catch (error) {
    console.error('Trend forecast failed:', error);
    throw error;
  }
}

export async function extractStyleDNA(samples) {
  const { GENOME_PROMPTS } = await import('./genomePrompts.js');
  try {
    const systemPrompt = GENOME_PROMPTS.extract_dna(samples);
    const result = await generateContent(systemPrompt, 'Analyze these samples and extract the DNA.');
    return typeof result === 'string' ? JSON.parse(result) : result;
  } catch (error) {
    console.error('Style extraction failed:', error);
    throw error;
  }
}

export async function generateHookVariants(topic, scriptData, dnaSnippet) {
  const { VIRAL_PROMPTS } = await import('./viralPrompts.js');
  try {
    const systemPrompt = VIRAL_PROMPTS.hook_variants(topic, scriptData);
    const result = await generateContent(systemPrompt, '', null, dnaSnippet);
    return typeof result === 'string' ? JSON.parse(result) : result;
  } catch (error) {
    console.error('Hook generation failed:', error);
    throw error;
  }
}

export async function scoreHookVariant(hookText, dnaSnippet) {
  const { VIRAL_PROMPTS } = await import('./viralPrompts.js');
  try {
    const systemPrompt = VIRAL_PROMPTS.score_hook(hookText);
    const result = await generateContent(systemPrompt, '', null, dnaSnippet);
    return typeof result === 'string' ? JSON.parse(result) : result;
  } catch (error) {
    console.error('Hook scoring failed:', error);
    throw error;
  }
}

export async function optimizeScheduling(topic, platform, dnaSnippet) {
  const { CALENDAR_PROMPTS } = await import('./calendarPrompts.js');
  try {
    const systemPrompt = CALENDAR_PROMPTS.schedule_optimizer(topic, platform);
    const result = await generateContent(systemPrompt, '', null, dnaSnippet);
    return typeof result === 'string' ? JSON.parse(result) : result;
  } catch (error) {
    console.error('Scheduling optimization failed:', error);
    throw error;
  }
}

export async function auditContentMix(projects, dnaSnippet) {
  const { CALENDAR_PROMPTS } = await import('./calendarPrompts.js');
  try {
    const systemPrompt = CALENDAR_PROMPTS.mix_auditor(projects);
    const result = await generateContent(systemPrompt, '', null, dnaSnippet);
    return typeof result === 'string' ? JSON.parse(result) : result;
  } catch (error) {
    console.error('Content mix audit failed:', error);
    throw error;
  }
}

export async function generateProductionDeck(scriptText, dnaSnippet) {
  const { PRODUCTION_PROMPTS } = await import('./productionPrompts.js');
  try {
    const systemPrompt = PRODUCTION_PROMPTS.beat_extractor(scriptText);
    const result = await generateContent(systemPrompt, '', null, dnaSnippet);
    return typeof result === 'string' ? JSON.parse(result) : result;
  } catch (error) {
    console.error('Production deck generation failed:', error);
    throw error;
  }
}

export async function analyzeVisualPace(beats, dnaSnippet) {
  const { PRODUCTION_PROMPTS } = await import('./productionPrompts.js');
  try {
    const systemPrompt = PRODUCTION_PROMPTS.pace_analyzer(beats);
    const result = await generateContent(systemPrompt, '', null, dnaSnippet);
    return typeof result === 'string' ? JSON.parse(result) : result;
  } catch (error) {
    console.error('Visual pace analysis failed:', error);
    throw error;
  }
}

export async function matchAffiliateProducts(scriptText, dnaSnippet) {
  const { AFFILIATE_PROMPTS } = await import('./affiliatePrompts.js');
  try {
    const systemPrompt = AFFILIATE_PROMPTS.product_sleuth(scriptText);
    const result = await generateContent(systemPrompt, '', null, dnaSnippet);
    const parsed = typeof result === 'string' ? JSON.parse(result) : result;
    
    // For each found item, get matches
    const itemsWithMatches = await Promise.all(
      parsed.potentialItems.map(async (item) => {
        const matchPrompt = AFFILIATE_PROMPTS.deal_matcher(item, 'general', dnaSnippet);
        const matchResult = await generateContent(matchPrompt, '', null, dnaSnippet);
        return {
          ...item,
          deals: typeof matchResult === 'string' ? JSON.parse(matchResult) : matchResult
        };
      })
    );
    
    return { items: itemsWithMatches };
  } catch (error) {
    console.error('Affiliate matching failed:', error);
    throw error;
  }
}

export async function getCommunityPulse(topic, projectData, dnaSnippet) {
  const { PULSE_PROMPTS } = await import('./pulsePrompts.js');
  const prompt = PULSE_PROMPTS.analyzeCommunity(topic, projectData, dnaSnippet);
  return await generateContent(prompt, 'Pulse analysis failed');
}

export async function analyzeWorkload(history) {
  const { BURNOUT_PROMPTS } = await import('./burnoutPrompts.js');
  const prompt = BURNOUT_PROMPTS.analyzeWorkload(history);
  return await generateContent(prompt, 'Workload analysis failed');
}

export async function getEvergreenRecycleIdeas(pastProjects) {
  const { BURNOUT_PROMPTS } = await import('./burnoutPrompts.js');
  const prompt = BURNOUT_PROMPTS.getEvergreenRecycleIdeas(pastProjects);
  return await generateContent(prompt, 'Recycle analysis failed');
}

export async function analyzeContentQuality(topic, data, dnaSnippet) {
  const { COACH_PROMPTS } = await import('./coachPrompts.js');
  const prompt = COACH_PROMPTS.analyzeQuality(topic, data, dnaSnippet);
  return await generateContent(prompt, 'Coach analysis failed');
}

export async function generateCaseStudies(projects) {
  const { MEDIA_KIT_PROMPTS } = await import('./mediaKitPrompts.js');
  const prompt = MEDIA_KIT_PROMPTS.generateCaseStudies(projects);
  const result = await generateContent(prompt, 'Case study generation failed');
  return typeof result === 'string' ? JSON.parse(result) : result;
}

export async function translateContent(content, targetLanguage, niche) {
  const { TRANSLATION_PROMPTS } = await import('./translationPrompts.js');
  const prompt = TRANSLATION_PROMPTS.translateContent(content, targetLanguage, niche);
  const result = await generateContent(prompt, `Translation to ${targetLanguage} failed`);
  return typeof result === 'string' ? JSON.parse(result) : result;
}

export async function getGlobalMarketStrategy(topic, niche) {
  const { TRANSLATION_PROMPTS } = await import('./translationPrompts.js');
  const prompt = TRANSLATION_PROMPTS.globalStrategy(topic, niche);
  const result = await generateContent(prompt, 'Global strategy analysis failed');
  return typeof result === 'string' ? JSON.parse(result) : result;
}

export async function generateGrowthStrategy(topic, niche, genome) {
  const { GROWTH_PROMPTS } = await import('./growthPrompts.js');
  const prompt = GROWTH_PROMPTS.generateStrategy(topic, niche, genome);
  const result = await generateContent(prompt, 'Growth strategy generation failed');
  return typeof result === 'string' ? JSON.parse(result) : result;
}

export async function generateCommentResponses(comment, tone, genome) {
  const { ENGAGEMENT_PROMPTS } = await import('./engagementPrompts.js');
  const prompt = ENGAGEMENT_PROMPTS.generateResponses(comment, tone, genome);
  const result = await generateContent(prompt, 'Comment response generation failed');
  return typeof result === 'string' ? JSON.parse(result) : result;
}

export async function generateProductStrategy(topic, niche, genome) {
  const { PRODUCT_PROMPTS } = await import('./productPrompts.js');
  const prompt = PRODUCT_PROMPTS.generateStrategy(topic, niche, genome);
  const result = await generateContent(prompt, 'Product strategy generation failed');
  return typeof result === 'string' ? JSON.parse(result) : result;
}

export async function generateSalesCopy(productName, benefits, topic) {
  const { PRODUCT_PROMPTS } = await import('./productPrompts.js');
  const prompt = PRODUCT_PROMPTS.generateSalesCopy(productName, benefits, topic);
  const result = await generateContent(prompt, 'Sales copy generation failed');
  return typeof result === 'string' ? JSON.parse(result) : result;
}

export async function generateCommunityStrategy(topic, niche, genome) {
  const { COMMUNITY_PROMPTS } = await import('./communityPrompts.js');
  const prompt = COMMUNITY_PROMPTS.generateStrategy(topic, niche, genome);
  const result = await generateContent(prompt, 'Community strategy generation failed');
  return typeof result === 'string' ? JSON.parse(result) : result;
}

export async function generateCommunitySegments(topic, script) {
  const { COMMUNITY_PROMPTS } = await import('./communityPrompts.js');
  const prompt = COMMUNITY_PROMPTS.generateSegments(topic, script);
  const result = await generateContent(prompt, 'Community segments generation failed');
  return typeof result === 'string' ? JSON.parse(result) : result;
}

export async function generateProductionWorkflow(topic, niche, genome) {
  const { AUTOMATION_PROMPTS } = await import('./automationPrompts.js');
  const prompt = AUTOMATION_PROMPTS.generateWorkflow(topic, niche, genome);
  const result = await generateContent(prompt, 'Production workflow generation failed');
  return typeof result === 'string' ? JSON.parse(result) : result;
}

export async function analyzeProductionBottlenecks(topic, data) {
  const { AUTOMATION_PROMPTS } = await import('./automationPrompts.js');
  const prompt = AUTOMATION_PROMPTS.analyzeBottlenecks(topic, data);
  const result = await generateContent(prompt, 'Bottleneck analysis failed');
  return typeof result === 'string' ? JSON.parse(result) : result;
}

export async function generateMediaPlan(topic, script) {
  const { MEDIA_PROMPTS } = await import('./mediaPrompts.js');
  const prompt = MEDIA_PROMPTS.generatePlan(topic, script);
  const result = await generateContent(prompt, 'Media plan generation failed');
  return typeof result === 'string' ? JSON.parse(result) : result;
}

export async function generateMotionPlan(topic, script) {
  const { MOTION_PROMPTS } = await import('./motionPrompts.js');
  const prompt = MOTION_PROMPTS.generatePlan(topic, script);
  const result = await generateContent(prompt, 'Motion plan generation failed');
  return typeof result === 'string' ? JSON.parse(result) : result;
}

export async function generateSponsorshipLeads(topic, script) {
  const { SPONSORSHIP_PROMPTS } = await import('./sponsorshipPrompts.js');
  const prompt = SPONSORSHIP_PROMPTS.scoutDeals(topic, script);
  const result = await generateContent(prompt, 'Sponsorship lead generation failed');
  return typeof result === 'string' ? JSON.parse(result) : result;
}

export async function getNegotiationAdvice(brand, objection, topic) {
  const { SPONSORSHIP_PROMPTS } = await import('./sponsorshipPrompts.js');
  const prompt = SPONSORSHIP_PROMPTS.negotiationAdvice(brand, objection, topic);
  const result = await generateContent(prompt, 'Negotiation advice generation failed');
  return typeof result === 'string' ? JSON.parse(result) : result;
}

export async function generateYouTubeMetadata(topic, script) {
  const { AUTOMATION_PROMPTS } = await import('./automationPrompts.js');
  const prompt = AUTOMATION_PROMPTS.generateYouTubeMetadata(topic, script);
  const result = await generateContent(prompt, 'YouTube metadata generation failed');
  return typeof result === 'string' ? JSON.parse(result) : result;
}
