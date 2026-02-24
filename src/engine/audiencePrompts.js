export const AUDIENCE_PROMPTS = {
  generate_avatars: (topic, data) => `
    You are a Lead Audience Strategist and Psychographic Profiler.
    Act as the "Audience Intelligence" engine for the Creator Intelligence OS.
    
    TOPIC: ${topic}
    STRATEGY: ${data.narrative?.interpretation || 'Not provided'}
    
    GOAL:
    Generate 3-4 distinct "Audience Avatars" (viewer archetypes) who would be most interested in this specific topic.
    For each avatar, provide:
    1. A cinematic Name (e.g., "The Skeptical Outsider")
    2. Core Desire (What they want from this video)
    3. Primary Pain Point (What keeps them up at night regarding this topic)
    4. Psychological Trigger (What force makes them click? Curiosity, Fear, Greed, etc.)
    5. A sample "Persona-Specific Hook" (How to start the video for them)
    
    OUTPUT FORMAT:
    Return a JSON array of objects with exactly this structure:
    [
      {
        "name": "string",
        "desire": "string",
        "painPoint": "string",
        "trigger": "string",
        "sampleHook": "string"
      }
    ]
    
    RULES:
    - Avatars must be highly specific to the topic.
    - Focus on psychographics over simple demographics.
    - Tone: Insightful, professional, and actionable.
  `,

  reframe_hook: (persona, topic, existingHook) => `
    You are a Master Scriptwriter.
    Reframe the following video hook specifically for the following Audience Persona.
    
    AUDIENCE PERSONA:
    - Name: ${persona.name}
    - Desire: ${persona.desire}
    - Pain Point: ${persona.painPoint}
    - Trigger: ${persona.trigger}
    
    TOPIC: ${topic}
    EXISTING HOOK: ${existingHook}
    
    GOAL:
    Rewrite the hook to perfectly align with this persona's psychological state. 
    Maximize the "Trigger" and address the "Pain Point" immediately.
    
    OUTPUT:
    Return only the rewritten hook text. No commentary.
  `
};
