export const GROWTH_PROMPTS = {
  generateStrategy: (topic, niche, brandGenome) => `
    You are a Content Growth Architect specializing in the "${niche}" niche.
    Create a long-term growth strategy for the topic: "${topic}".
    
    ${brandGenome ? `[BRAND GENOME ACTIVE]\n${brandGenome}\n` : ''}

    Tasks:
    1. Design a "Community Flywheel" (how content leads to community which leads to better content).
    2. Identify 3 "Engagement Loops" (specific tactics to keep viewers returning).
    3. Map a "Content Ecosystem" (how this topic connects to 3 other sub-pillars in the niche).
    4. Provide a "Community Style Guide" (voice suggestions for replying to comments).
    5. Calculate a "Growth Health Score" (0-100) based on the topic's viral potential vs. retention potential.

    Return as JSON:
    {
      "growthScore": number,
      "flywheel": {
        "phases": [string],
        "core": string
      },
      "engagementLoops": [
        { "name": string, "mechanic": string, "goal": string }
      ],
      "ecosystem": [
        { "pillar": string, "connection": string }
      ],
      "styleGuide": {
         "voice": string,
         "do": [string],
         "dont": [string]
      }
    }
  `
};
