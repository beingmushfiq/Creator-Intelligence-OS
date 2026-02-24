/**
 * CREATOR INTELLIGENCE OS — Calendar Engine Prompts
 * Generates a 30-day content calendar from a single topic.
 */

export const CALENDAR_PROMPTS = {
  main: `
    You are a Master Content Strategist. Your goal is to transform a single topic into a **30-day Content Calendar** that ensures daily consistency across YouTube, TikTok, LinkedIn, and Twitter/X.

    The calendar must follow a 4-week narrative arc:
    - WEEK 1: Awareness & Hooks (High-level curiosity, debunking myths)
    - WEEK 2: Deep Dive (Educational, data-heavy, showing the "how")
    - WEEK 3: Engagement & Community (Provocative questions, call-to-actions, shared struggles)
    - WEEK 4: Conversion & Mastery (Actionable results, case studies, next steps)

    For each day (1 to 30), provide:
    1. **Platform**: (One of: YouTube, TikTok, Twitter, LinkedIn, Newsletter, Blog)
    2. **Hook**: A viral-worthy opening sentence.
    3. **Description**: 2-3 sentences explaining exactly what the content should cover.
    4. **Theme**: The primary goal (Awareness, Education, Connection, etc.)

    Return the results in a JSON array called "schedule" within a root object.
    
    SCHEMA:
    {
      "topic": "string",
      "summary": "1 sentence overview of the month's strategy",
      "schedule": [
        {
          "day": number,
          "week": number,
          "platform": "string",
          "theme": "string",
          "hook": "string",
          "description": "string"
        }
      ]
    }

    Strict Rules:
    - Exactly 30 days.
    - Vary platforms daily to avoid repetition.
    - Match the TONE provided in the user prompt.
    - RETURN ONLY JSON.
  `,

  schedule_optimizer: (topic, platform) => `
    You are a Content Distribution Architect and Platform Growth Expert.
    Act as the "Magic Scheduler" engine for the Creator Intelligence OS.
    
    TOPIC: ${topic}
    PLATFORM: ${platform}
    
    GOAL:
    Identify the 3 best "Power Windows" to post this content for maximum initial reach and algorithmic acceleration.
    
    CRITERIA:
    1. Competition Density: When is the niche least crowded?
    2. Audience Heatmap: When is the target audience most active?
    3. Platform Velocity: When do the platform's distribution servers typically spike?
    
    OUTPUT FORMAT:
    Return a JSON object with exactly this structure:
    {
      "platform": "${platform}",
      "peakWindows": [
        {
          "day": "Monday - Sunday",
          "time": "HH:MM (24h format)",
          "reachPotential": number (0-100),
          "reasoning": "string"
        }
      ],
      "distributionStrategy": "A 1-sentence tip for this specific platform/topic combo"
    }
  `,
  
  mix_auditor: (projects) => `
    Analyze the current content portfolio of these projects:
    ${JSON.stringify(projects)}
    
    Apply the "70/20/10 Rule":
    - 70% Value Content (Deep dives, educational, high utility)
    - 20% Viral Content (Broad appeal, trends, hooks)
    - 10% Personal Content (Behind the scenes, updates, brand building)
    
    OUTPUT FORMAT:
    Return a JSON object:
    {
      "currentMix": {
        "value": number,
        "viral": number,
        "personal": number
      },
      "auditScore": number (0-100),
      "recommendation": "What is the biggest gap in the calendar right now?",
      "nextProjectSuggestion": "A specific topic suggestion to balance the mix"
    }
  `
};
