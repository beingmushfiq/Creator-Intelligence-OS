// ============================================
// CREATOR INTELLIGENCE OS — AI Generator
// ============================================
// Handles generation via real LLM (if configured) or mock data (fallback).

import { generateContent } from './aiService';
import { buildSystemPrompt, buildUserPrompt } from './prompts';

// Main entry point
export async function generateData(topic, tone, provider = null, dnaSnippet = null) {
  // If provider is set, try real AI generation
  if (provider) {
    try {
      console.log(`Generating with AI (${provider})...`);
      return await generateWithAI(topic, tone, provider, dnaSnippet);
    } catch (error) {
      console.error('AI Generation failed, falling back to mock data:', error);
      // Fallback to mock data on error
    }
  }

  // Mock data fallback
  return generateMockData(topic, tone);
}

// Single Section Generation (with fallback)
export async function generateSection(section, topic, tone, provider = null, dnaSnippet = null, options = {}) {
  if (provider) {
    try {
      console.log(`Generating ${section} with AI (${provider})...`);
      return await generateSectionWithAI(section, topic, tone, provider, dnaSnippet, options);
    } catch (error) {
      console.error(`AI Generation for ${section} failed, falling back:`, error);
    }
  }
  return generateMockSection(section, topic, tone);
}

function generateMockSection(section, topic, tone) {
  const t = topic || 'Untitled Topic';
  switch (section) {
    case 'narrative': return generateNarrative(t, tone);
    case 'script': return generateScript(t, tone);
    case 'research': return generateResearch(t);
    case 'titles': return generateTitles(t);
    case 'thumbnails': return generateThumbnails(t);
    case 'series': return generateSeries(t);
    case 'optimization': return generateOptimization(t);
    case 'motionPrompts': return generateMotionPrompts(t);
    case 'seo': return generateMockSeo(t);
    case 'calendar': return generateMockCalendar(t);
    default: return {};
  }
}

function generateMockSeo(topic) {
  return {
    keywords: [
      { keyword: topic, volume: 'High', competition: 'High' },
      { keyword: `${topic} guide`, volume: 'Medium', competition: 'Low' },
      { keyword: `future of ${topic}`, volume: 'Medium', competition: 'Medium' }
    ],
    metadata: {
      title: `The Ultimate Guide to ${topic}`,
      description: `Discover everything you need to know about ${topic}. We dive deep into the mechanics and future shifts.`,
      tags: [topic, 'education', 'analysis'],
      file_name: `${topic.toLowerCase().replace(/ /g, '-')}.mp4`
    },
    trends: [`Rising interest in ${topic} among Gen Z`, `${topic} mentioned in recent tech keynote`],
    tiktok: {
      trendingSounds: ['Minimalist Synth Pulse', 'Corporate Lofi', 'Dramatic Reveal Bass'],
      hashtags: ['#creator', `#${topic.replace(/ /g, '')}`, '#learnontiktok', '#insight'],
      hookStyles: ['The truth about...', 'I wish I knew this earlier', 'Stop scrolling!']
    },
    google: {
      score: 82,
      recommendations: ['Add more internal links', 'Optimize meta description', 'Increase keyword density in H2s']
    },
    predictions: [
      { trend: 'AI-Driven Personalization', timeFrame: '3-6 months', impactScore: 9 },
      { trend: 'Decentralized Distribution', timeFrame: '6-12 months', impactScore: 7 }
    ]
  };
}

// Real AI Generation
async function generateWithAI(topic, tone, provider, dnaSnippet) {
  // Parallelize the requests for speed, or do them sequentially if rate limits are a concern.
  // For better UX, we can do them in parallel batches.
  
  // 1. Core Strategy & Script (Most important)
  const [narrative, script] = await Promise.all([
    generateSectionWithAI('narrative', topic, tone, provider, dnaSnippet),
    generateSectionWithAI('script', topic, tone, provider, dnaSnippet)
  ]);

  // 2. The rest (Parallel)
  const [research, titles, thumbnails, series, optimization] = await Promise.all([
    generateSectionWithAI('research', topic, tone, provider, dnaSnippet),
    generateSectionWithAI('titles', topic, tone, provider, dnaSnippet),
    generateSectionWithAI('thumbnails', topic, tone, provider, dnaSnippet),
    generateSectionWithAI('series', topic, tone, provider, dnaSnippet),
    generateSectionWithAI('optimization', topic, tone, provider, dnaSnippet),
    generateSectionWithAI('calendar', topic, tone, provider, dnaSnippet)
  ]);
  
  // Motion prompts are derived from the script, but we can also generate them explicitly
  // or extract them. For now, let's generate them explicitly to match the schema.
  const motionPrompts = await generateSectionWithAI('motionPrompts', topic, tone, provider, dnaSnippet);

  return {
    narrative,
    script,
    research,
    titles,
    thumbnails,
    series,
    optimization,
    motionPrompts,
    calendar: await generateSectionWithAI('calendar', topic, tone, provider, dnaSnippet)
  };
}

export async function generateSectionWithAI(section, topic, tone, provider, dnaSnippet, options = {}) {
  const systemPrompt = buildSystemPrompt(section, tone);
  const userPrompt = buildUserPrompt(topic, section, options);
  
  return await generateContent(systemPrompt, userPrompt, provider, dnaSnippet);
}

// Mock Data Generator (Legacy/Fallback)
export function generateMockData(topic, tone = 'Analytical') {
  const t = topic || 'Untitled Topic';

  return {
    narrative: generateNarrative(t, tone),
    script: generateScript(t, tone),
    research: generateResearch(t),
    titles: generateTitles(t),
    thumbnails: generateThumbnails(t),
    series: generateSeries(t),
    optimization: generateOptimization(t),
    motionPrompts: generateMotionPrompts(t),
    calendar: generateMockCalendar(t),
  };
}

// ── Engine 1: Narrative Intelligence ──
function generateNarrative(topic, tone) {
  return {
    interpretation: `This topic explores "${topic}" through a lens of power dynamics, hidden incentives, and systemic forces that most audiences never consider. The core investigation reveals how surface-level narratives mask deeper structural mechanisms.`,
    contentType: 'Investigative Hybrid',
    contentTypeReasoning: 'This topic combines elements of investigative journalism with explainer mechanics — ideal for high-authority positioning.',
    coreTension: `The fundamental tension lies between what the public has been told about "${topic}" and what the underlying data actually reveals. There is a significant gap between perceived reality and operational truth.`,
    hiddenIncentives: [
      'Financial stakeholders benefit from public misunderstanding of key mechanisms',
      'Media incentives align with simplified narratives over structural analysis',
      'Regulatory capture prevents meaningful transparency frameworks',
      'Audience psychological comfort creates demand for surface-level explanations',
    ],
    emotionalLeverage: [
      { emotion: 'Betrayal', description: 'Audience trusted conventional explanation — the reveal creates visceral dissonance' },
      { emotion: 'Curiosity', description: 'Structural complexity gives "rabbit hole" retention power' },
      { emotion: 'Empowerment', description: 'Understanding the real system gives the viewer an edge' },
      { emotion: 'Urgency', description: 'Timing relevance creates a "need to know now" psychological trigger' },
    ],
    marketContext: `Search volume for topics related to "${topic}" has increased 340% over the past 6 months. Competitor coverage remains surface-level, creating a significant authority gap for evidence-based, structural analysis.`,
    psychologicalContext: 'Audience is in a state of informational distrust — high appetite for "connecting the dots" content that validates their suspicion that things are not as they seem.',
  };
}

// ── Engine 2: Master Script ──
function generateScript(topic, tone) {
  const toneModifier = {
    Neutral: 'measured and balanced',
    Analytical: 'precise and data-driven',
    Aggressive: 'confrontational and urgent',
    Philosophical: 'reflective and nuanced',
    Satirical: 'darkly humorous and cutting',
  }[tone] || 'analytical';

  return {
    tone: toneModifier,
    estimatedDuration: '12–15 minutes',
    sections: [
      {
        id: 'hook',
        title: 'The Hook',
        subtitle: 'Pattern Interruption + Tension',
        content: `There's a number most people have never seen. It doesn't appear in any headline, any quarterly report, or any public statement. But this single figure explains almost everything about "${topic}" — and why what you've been told about it is structurally misleading.\n\nToday, we're going to trace the money, the mechanics, and the motive. And by the end, you'll understand not just what happened — but why it was always going to happen this way.`,
        sceneDescription: 'Open on a dark screen. A single data point fades in — glowing white text against pure black. Camera slowly pushes in. The number pulses subtly.',
        cameraMovement: 'Slow push-in, 2% zoom over 8 seconds',
        lighting: 'High contrast, single key light from above, deep shadows',
        musicCue: 'Low drone, building tension, no melody — think Hans Zimmer pre-drop',
        aiVideoPrompt: `4K, photorealistic, 35mm lens, cinematic lighting. A dark minimalist room, a single glowing data screen showing financial figures, volumetric fog, dramatic shadows, film grain, shallow depth of field.`,
      },
      {
        id: 'context',
        title: 'The Context',
        subtitle: 'Why This Matters Now',
        content: `To understand "${topic}", you have to go back further than most people want to. Not to last quarter. Not to last year. But to the structural moment when the incentives shifted.\n\nHere's what happened: the system that was supposed to create accountability instead created camouflage. The metrics everyone watches — they were redesigned. Not to measure what matters, but to obscure it.\n\nThis isn't a conspiracy. It's an incentive structure doing exactly what incentive structures do: optimizing for survival, not truth.`,
        sceneDescription: 'Timeline visualization. Key dates appear as floating nodes connected by glowing threads. Camera transitions between historical moments.',
        cameraMovement: 'Smooth lateral dolly, 35mm lens equivalent',
        lighting: 'Cool blue ambient with warm accent highlights on key data points',
        musicCue: 'Atmospheric pads, subtle urgency building, pulsing bass at 92 BPM',
        aiVideoPrompt: `4K, photorealistic, 35mm lens, cinematic lighting. An animated timeline floating in dark space, glowing blue connection lines between data nodes, particles floating, volumetric light beams, ultra detailed.`,
      },
      {
        id: 'mechanics',
        title: 'System Mechanics',
        subtitle: 'How It Actually Works',
        content: `Let me show you the machine.\n\nStep one: the inputs get defined by stakeholders who benefit from specific outputs. This isn't unusual — it's standard institutional behavior. But the second-order effect is where it gets interesting.\n\nWhen you control the measurement, you control the narrative. When you control the narrative, you control capital allocation. And when you control capital allocation — you control everything downstream.\n\nThe public sees the output. The insiders designed the input. That gap? That's where the real story of "${topic}" lives.`,
        sceneDescription: 'Infographic animation: a machine diagram with labeled inputs and outputs. Data flows through the system. Certain pathways glow red to indicate manipulation points.',
        cameraMovement: 'Top-down isometric view, slow rotation',
        lighting: 'Neon-accented dark environment, data visualization glow',
        musicCue: 'Mechanical rhythm, ticking clock undertone, building orchestral tension',
        aiVideoPrompt: `4K, photorealistic, 35mm lens, cinematic lighting. A complex mechanical system diagram floating in dark space, glowing data paths, red warning highlights, isometric perspective, ultra detailed, sci-fi control room aesthetic.`,
      },
      {
        id: 'fracture',
        title: 'The Fracture Point',
        subtitle: 'Where It Breaks Down',
        content: `Now here's the part no one talks about.\n\nEvery self-reinforcing system has a fracture point — a moment where the gap between internal reality and external narrative becomes unsustainable. For "${topic}", that fracture is happening right now.\n\nThe early signals are already visible if you know where to look: declining trust metrics, increasing insider exits, and a growing body of contradictory evidence that the primary narrative simply cannot absorb.\n\nThis isn't speculation. These are structural indicators.`,
        sceneDescription: 'Glass surface with hairline cracks spreading. Camera finds each crack and zooms into micro-level detail. Data overlays appear at each fracture point.',
        cameraMovement: 'Macro lens close-up, dramatic rack focus between elements',
        lighting: 'High contrast dramatic, red accents bleeding through cracks',
        musicCue: 'Tension break — silence then deep bass hit, dissonant strings',
        aiVideoPrompt: `4K, photorealistic, macro lens, cinematic lighting. A pristine glass surface developing cracks, red light bleeding through fracture lines, extreme detail, dramatic shadows, volumetric dust particles.`,
      },
      {
        id: 'evidence',
        title: 'Evidence & Data',
        subtitle: 'The Receipts',
        content: `Let's look at the actual data.\n\nFirst: the financial flows. Between 2019 and 2024, capital movement in this sector shifted by 47% — but not in the direction the public narrative suggests. The money moved laterally, into subsidiary structures that don't appear on standard reporting.\n\nSecond: the personnel rotation. When you track executive movement across the key institutions involved, a pattern emerges. The same twelve decision-makers rotate between regulator, operator, and advisor roles.\n\nThird: the timing. Every major public statement coincided with a private restructuring event. Every single one.`,
        sceneDescription: 'Data dashboard visualization. Charts animate in sequence. Document excerpts appear with highlighted sections. Connection lines draw between entities.',
        cameraMovement: 'Steady-cam documentary style, slight handheld movement for urgency',
        lighting: 'Cold office lighting, screens providing primary illumination',
        musicCue: 'Investigative pulse — urgent but controlled, deep synth bass line',
        aiVideoPrompt: `4K, photorealistic, 35mm lens, cinematic lighting. A dark investigation room with multiple screens showing data visualizations, financial charts, connection diagrams, dramatic blue screen glow, ultra detailed.`,
      },
      {
        id: 'impact',
        title: 'Impact Analysis',
        subtitle: 'What This Means For You',
        content: `So what does this actually mean?\n\nIf you're a consumer of mainstream analysis on "${topic}", you've been operating with approximately 30% of the relevant information. Not because anyone actively hid it from you — but because the incentive structure of information distribution doesn't reward structural depth.\n\nThe practical implications: every major prediction framework currently in use is based on incomplete inputs. The outputs look authoritative. They're beautifully formatted. But they're structurally compromised.\n\nHere's what actually matters going forward — and this is what the insiders already know...`,
        sceneDescription: 'Split screen: left side shows the "public version" in clean corporate aesthetics. Right side shows the "structural version" with raw data. The contrast is stark.',
        cameraMovement: 'Wipe transition between two realities, then slow crane up to reveal full picture',
        lighting: 'Left: clean corporate white. Right: dramatic investigative dark',
        musicCue: 'Emotional turn — piano enters, strings swell, moment of clarity',
        aiVideoPrompt: `4K, photorealistic, 35mm lens, cinematic lighting. Split screen composition — left side shows clean corporate presentation, right side shows dark investigative room with raw data, dramatic contrast, ultra detailed.`,
      },
      {
        id: 'conclusion',
        title: 'The Power Shift',
        subtitle: 'Reframing the Narrative',
        content: `"${topic}" is not what it appears to be on the surface.\n\nIt's not a failure of information — it's a success of narrative architecture. The system is working exactly as designed. It's just not designed for you.\n\nBut understanding the machine gives you something most people don't have: the ability to see the next move before it happens. Not because you're smarter. Because you're seeing the actual inputs instead of the curated outputs.\n\nIf this kind of structural analysis is valuable to you, subscribe. I don't promise simple answers. I promise the right questions.\n\nBecause in a world optimized for surface-level certainty — structural thinking is the ultimate competitive advantage.`,
        sceneDescription: 'Camera pulls back to reveal the full system diagram from the episode. Elements transform from red to blue as the "decoded" version becomes clear. End on the creator at a desk, looking directly at camera.',
        cameraMovement: 'Grand crane shot pulling back, then intimate close-up for final line',
        lighting: 'Warm amber transitioning to confident blue — dawn metaphor',
        musicCue: 'Resolution chord — orchestral swell, clean piano melodic line, satisfying conclusion',
        aiVideoPrompt: `4K, photorealistic, 35mm lens, cinematic lighting. A confident figure at a modern desk in a dark studio, multiple screens behind showing decoded data, warm amber and blue lighting, dramatic silhouette, film grain.`,
      },
    ],
  };
}

// ── Engine 3: Research & Scale ──
function generateResearch(topic) {
  return {
    activated: true,
    mythMatrix: [
      { myth: `"${topic}" is primarily driven by market forces`, reality: 'Regulatory and institutional inputs account for 60%+ of directional movement', confidence: 92 },
      { myth: 'Public data provides sufficient analytical basis', reality: 'Critical data asymmetries exist between institutional and retail information access', confidence: 87 },
      { myth: 'Expert consensus reflects analytical consensus', reality: 'Incentive alignment means consensus often reflects career-safety, not evidence-weight', confidence: 78 },
      { myth: 'Historical patterns are the best predictor', reality: 'Structural regime changes have invalidated 3 of the top 5 historical frameworks', confidence: 85 },
    ],
    incentiveMap: [
      { actor: 'Institutional Analysts', incentive: 'Maintain relationship access', behavior: 'Softened criticism, delayed warnings', impact: 'High' },
      { actor: 'Media Outlets', incentive: 'Engagement metrics & advertising revenue', behavior: 'Sensationalized peaks, ignored structural trends', impact: 'High' },
      { actor: 'Regulators', incentive: 'Minimize political friction', behavior: 'Performative action at moments of maximum visibility', impact: 'Medium' },
      { actor: 'Retail Audience', incentive: 'Confirmation of existing positions', behavior: 'Selective information consumption, echo chamber deepening', impact: 'Medium' },
    ],
    cognitiveBiases: [
      { bias: 'Authority Bias', description: 'Audiences over-weight credentials over evidence quality', exploitedBy: 'Institutional commentators', severity: 'High' },
      { bias: 'Anchoring Effect', description: 'First-reported numbers dominate perception regardless of accuracy', exploitedBy: 'Media outlets & PR teams', severity: 'High' },
      { bias: 'Narrative Fallacy', description: 'Complex systemic events reduced to simple causal stories', exploitedBy: 'Content creators & journalists', severity: 'Medium' },
      { bias: 'Survivorship Bias', description: 'Successful predictions cited, failed ones forgotten', exploitedBy: 'Financial influencers', severity: 'Medium' },
    ],
    algorithmicAmplification: [
      'Fear-based framing receives 2.3x more initial distribution than analytical framing',
      'Videos that confirm existing popular narratives receive 40% higher recommendation weight',
      'Provocative thumbnail/title combinations override content quality signals in first 48 hours',
      'Multi-part series receive algorithmic escalation benefits after part 2 performance signals',
    ],
  };
}

// ── Engine 4: Title Psychology ──
function generateTitles(topic) {
  return {
    variants: [
      {
        trigger: 'Curiosity Gap',
        title: `The Hidden System Behind ${topic} (Nobody's Talking About This)`,
        ctr: 'High (8.2% predicted)',
        emotionalTrigger: 'Information asymmetry creates urgent curiosity — viewer feels they\'re missing critical knowledge',
        audience: 'Information seekers, 25-44, college educated',
      },
      {
        trigger: 'Authority Challenge',
        title: `Why Every Expert Is Wrong About ${topic}`,
        ctr: 'Very High (9.1% predicted)',
        emotionalTrigger: 'Challenges established authority — triggers "I knew it" validation impulse',
        audience: 'Contrarian thinkers, skeptics, experienced professionals',
      },
      {
        trigger: 'Fear of Loss',
        title: `${topic}: What They're Not Telling You (And Why It Matters)`,
        ctr: 'High (7.8% predicted)',
        emotionalTrigger: 'Loss aversion + information withholding = compulsive click response',
        audience: 'Risk-aware individuals, investors, decision-makers',
      },
      {
        trigger: 'Insider Revelation',
        title: `I Spent 200 Hours Investigating ${topic}. Here's What I Found.`,
        ctr: 'High (8.5% predicted)',
        emotionalTrigger: 'Effort-signaling creates perceived value — viewer gets 200 hours of research in 15 minutes',
        audience: 'Deep-dive content consumers, research-oriented viewers',
      },
      {
        trigger: 'Data-Driven',
        title: `The Data Behind ${topic} Changes Everything`,
        ctr: 'Medium-High (7.2% predicted)',
        emotionalTrigger: 'Data authority + paradigm shift language = credibility + curiosity combination',
        audience: 'Analytically-minded, data professionals, educated audience',
      },
      {
        trigger: 'Contrarian',
        title: `${topic} Is a Lie. Here's Proof.`,
        ctr: 'Very High (9.8% predicted — volatile)',
        emotionalTrigger: 'Maximum cognitive dissonance — forces click to resolve internal conflict',
        audience: 'Broad, skews younger, high engagement but polarizing',
      },
      {
        trigger: 'Narrative Hook',
        title: `The Untold Story of ${topic}`,
        ctr: 'Medium (6.5% predicted)',
        emotionalTrigger: 'Story frame creates completion desire — viewer wants narrative resolution',
        audience: 'Story-driven consumers, documentary fans',
      },
      {
        trigger: 'Short-Form Viral',
        title: `${topic} explained in 60 seconds`,
        ctr: 'High for Shorts (11.2% predicted)',
        emotionalTrigger: 'Low time commitment + high perceived value ratio — frictionless click',
        audience: 'Mobile-first, Gen Z, attention-scarce viewers',
      },
    ],
    abSets: {
      primary: [
        `The Hidden System Behind ${topic} (Nobody's Talking About This)`,
        `Why Every Expert Is Wrong About ${topic}`,
        `I Spent 200 Hours Investigating ${topic}. Here's What I Found.`,
      ],
      highRisk: [
        `${topic} Is a Lie. Here's Proof.`,
        `The ${topic} Scam Nobody Sees Coming`,
      ],
      safeEvergreen: `Understanding ${topic}: A Complete Structural Analysis`,
    },
    algorithmCheck: {
      flaggedWords: [
        { word: 'Lie', risk: 'May trigger reduced ad suitability in some verticals', suggestion: 'Replace with "Myth" or "Misconception"' },
        { word: 'Scam', risk: 'High-risk flagging term — may limit monetization', suggestion: 'Replace with "System" or "Mechanism"' },
      ],
      overusedPhrases: [
        '"Nobody\'s talking about this" — used in 23% of viral titles in this niche',
        '"Changes everything" — declining CTR performance, down 15% YoY',
      ],
      adSuitability: 'Primary headline candidates are ad-safe. High-risk options may face limited monetization in finance/health verticals.',
    },
  };
}

// ── Engine 5: Thumbnail Psychology ──
function generateThumbnails(topic) {
  return {
    visualConcept: {
      primaryEmotion: 'Controlled shock — the "wait, what?" moment between disbelief and curiosity',
      colorPsychology: 'Dark navy/black background with electric cyan and warning amber accents. High contrast creates visual urgency. Red used sparingly as danger signal.',
      compositionStructure: 'Rule of thirds with focal point at left-center intersection. Background depth creates layered information hierarchy.',
      depthLayering: 'Layer 1: Dark gradient background. Layer 2: Data/evidence elements (semi-transparent). Layer 3: Primary subject/text (sharp focus).',
      eyeDirectionFlow: 'Left-to-right Z-pattern: Face/emotion → Text overlay → Data element → Implied continuation',
      focalTensionPoint: 'The gap between the confident subject and the contradicting data creates unresolved visual tension that compels the click.',
    },
    archetype: {
      selected: 'Data Exposure',
      reasoning: 'For investigative/analytical content, the Data Exposure archetype outperforms Face + Shock by 23% in CTR for audiences over 25. It signals depth without sensationalism, attracting high-retention viewers.',
      alternatives: [
        { name: 'Face + Shock', fit: 'Good for emotional topics, lower audience age', note: 'Higher CTR but lower retention trade-off' },
        { name: 'Redacted Document', fit: 'Excellent for conspiracy/investigation framing', note: 'May attract wrong audience segment' },
        { name: 'Before/After Split', fit: 'Best for transformation narratives', note: 'Less suitable for systemic analysis' },
        { name: 'Confrontation Frame', fit: 'Good for debate/challenge content', note: 'Requires recognizable opposing figure' },
        { name: 'Pattern Interrupt', fit: 'Strong for scroll-stopping in feeds', note: 'Lower perceived authority' },
        { name: 'Minimalist Symbol', fit: 'Premium positioning', note: 'Lower CTR but strongest brand building' },
      ],
    },
    textOverlay: {
      text: topic.length > 20 ? topic.split(' ').slice(0, 3).join(' ').toUpperCase() + '?' : topic.toUpperCase() + '?',
      maxWords: '1–4 words maximum for thumbnail readability at all sizes',
      placement: 'Right-center, vertically centered. Clear separation from background elements.',
      fontPersonality: 'Bold condensed sans-serif (Impact/Oswald family). Weight 900. Slight letter-spacing reduction for density.',
      capitalization: 'ALL CAPS for maximum scan-ability at small sizes. Single word emphasis through color shift.',
      contrast: 'White text with 2px dark drop shadow + subtle outer glow. Must pass readability test at 120x67px.',
    },
    aiPrompt: {
      midjourney: `Dark investigative scene, scattered documents and data visualizations glowing on multiple screens, dramatic overhead lighting casting sharp shadows, evidence pins connected by red threads on a dark board, 8K, ultra detailed, dramatic lighting, high contrast, cinematic color grading, cool blue and amber accent lighting, shallow depth of field, photorealistic, shot on RED camera --ar 16:9 --s 750 --q 2`,
      sdxl: `(masterpiece, best quality, 8K, ultra detailed), dark investigative workspace, multiple glowing data screens, scattered evidence documents, dramatic lighting from above, cool blue and warm amber color palette, high contrast, cinematic composition, volumetric fog, film grain, photorealistic, shallow depth of field, 16:9 aspect ratio`,
      lighting: 'Three-point dramatic: strong overhead key light, blue fill from screens, amber accent from desk lamp',
      lens: '35mm equivalent, f/2.8, shallow depth of field for background separation',
      mood: 'Controlled tension — professional but urgent, discovery moment',
      colorScheme: 'Primary: #0a1628 (deep navy), Accent 1: #00d4ff (electric cyan), Accent 2: #f59e0b (warning amber), Danger: #ef4444',
      compositionAngle: 'Slight high angle (15°) — gives viewer "overview" psychological position',
    },
  };
}

// ── Series & Brand Builder ──
function generateSeries(topic) {
  return {
    sequels: [
      { title: `${topic} — Part 2: Following the Money`, description: 'Deep-dive into the financial architecture. Track capital flows, subsidiary structures, and the economic incentives driving behavior.', timing: '1 week after Part 1' },
      { title: `${topic} — Part 3: The Players`, description: 'Profile the key decision-makers. Map the network of influence, revolving doors, and strategic positioning.', timing: '2 weeks after Part 1' },
      { title: `The ${topic} Aftermath: What Happened Next`, description: 'Follow-up analysis after initial audience reaction. Incorporate community research and new developments.', timing: '1 month after Part 1' },
    ],
    contentArcs: [
      'Discovery Arc: Surface → Mechanics → Evidence → Implications (4 episodes)',
      'Challenge Arc: Industry claim → Investigation → Counter-evidence → Resolution (3 episodes)',
      'Deep Dive Arc: Single element expanded to feature-length treatment (1-2 episodes)',
    ],
    escalationRoadmap: [
      { phase: 'Authority Establishment', episodes: '1-3', goal: 'Establish analytical credibility and evidence standards' },
      { phase: 'Audience Investment', episodes: '4-8', goal: 'Build recurring viewer base through serial narrative hooks' },
      { phase: 'Platform Expansion', episodes: '9-15', goal: 'Cross-platform content adaptation, guest collaborations' },
      { phase: 'Monetization Scaling', episodes: '16+', goal: 'Premium content, community, consulting, partnerships' },
    ],
    authorityPositioning: 'Position as the structural analyst who "shows the machine" — not an opinion creator, but an evidence architect. Differentiation through depth, not personality.',
    contentFunnel: [
      'Top of funnel: Short-form clips (60s) highlighting single shocking data points',
      'Mid funnel: Full-length investigative episodes (10-15 min)',
      'Bottom funnel: Extended analysis, community discussions, premium breakdowns',
    ],
  };
}

// ── Motion Prompts (extracted for tab) ──
function generateMotionPrompts(topic) {
  return [
    { scene: 'Opening — Data Reveal', prompt: `4K, photorealistic, 35mm lens, cinematic lighting. A dark minimalist room, a single glowing data screen showing financial figures, volumetric fog, dramatic shadows, film grain, shallow depth of field.`, platforms: ['Runway', 'Veo', 'Pictory'], duration: '5-8s' },
    { scene: 'Timeline Visualization', prompt: `4K, photorealistic, 35mm lens, cinematic lighting. An animated timeline floating in dark space, glowing blue connection lines between data nodes, particles floating, volumetric light beams, ultra detailed.`, platforms: ['Runway', 'Veo', 'CapCut'], duration: '6-10s' },
    { scene: 'System Mechanics', prompt: `4K, photorealistic, 35mm lens, cinematic lighting. A complex mechanical system diagram floating in dark space, glowing data paths, red warning highlights, isometric perspective, ultra detailed, sci-fi control room aesthetic.`, platforms: ['Runway', 'Veo'], duration: '8-12s' },
    { scene: 'Fracture Point', prompt: `4K, photorealistic, macro lens, cinematic lighting. A pristine glass surface developing cracks, red light bleeding through fracture lines, extreme detail, dramatic shadows, volumetric dust particles.`, platforms: ['Runway', 'Veo', 'DaVinci'], duration: '4-6s' },
    { scene: 'Investigation Room', prompt: `4K, photorealistic, 35mm lens, cinematic lighting. A dark investigation room with multiple screens showing data visualizations, financial charts, connection diagrams, dramatic blue screen glow, ultra detailed.`, platforms: ['Runway', 'Veo', 'Pictory'], duration: '6-8s' },
    { scene: 'Split Reality', prompt: `4K, photorealistic, 35mm lens, cinematic lighting. Split screen composition — left side shows clean corporate presentation, right side shows dark investigative room with raw data, dramatic contrast, ultra detailed.`, platforms: ['Runway', 'CapCut', 'DaVinci'], duration: '5-8s' },
    { scene: 'Closing — Authority Shot', prompt: `4K, photorealistic, 35mm lens, cinematic lighting. A confident figure at a modern desk in a dark studio, multiple screens behind showing decoded data, warm amber and blue lighting, dramatic silhouette, film grain.`, platforms: ['Runway', 'Veo'], duration: '6-10s' },
  ];
}

// ── Optimization / Self-Critique ──
function generateOptimization(topic) {
  return {
    weakTensionZones: [
      { section: 'Context', issue: 'Historical background section risks losing momentum after strong hook', suggestion: 'Add a micro-tension element — tease a specific shocking figure that will be revealed later' },
      { section: 'Evidence', issue: 'Data-heavy section may flatten emotional engagement', suggestion: 'Interleave data points with human-impact anecdotes for emotional anchoring' },
    ],
    pacingRisks: [
      { section: 'System Mechanics', risk: 'Medium', detail: 'Abstract systemic explanation may lose viewers under 25. Consider adding a concrete analogy or real-world example.' },
      { section: 'Impact Analysis', risk: 'Low', detail: 'Strong personal relevance framing maintains pacing. No adjustments needed.' },
    ],
    legalFlags: [
      { concern: 'Defamation Risk', detail: 'Avoid naming specific individuals without documented evidence. Use institutional references instead of personal attribution.', severity: 'Medium' },
      { concern: 'Financial Advice', detail: 'Include disclaimer if content could be interpreted as financial guidance. Use "analysis" framing, not "recommendation."', severity: 'Low' },
    ],
    ctrImprovements: [
      'Add a specific number to the hook — "The $47 Billion Problem" outperforms abstract framing by 34%',
      'Consider testing a question-format title variant — questions perform 12% better in this niche',
      'First 3 seconds of thumbnail visibility are critical — ensure text overlay is legible at 120px width',
    ],
    thumbnailRefinements: [
      'Increase text-to-background contrast ratio — current design scores 4.2:1, target 7:1+',
      'Add subtle red accent element to create visual tension without overwhelming the composition',
      'Test face + data hybrid archetype against pure data exposure — face variants typically get 15% more impressions',
    ],
  };
}
