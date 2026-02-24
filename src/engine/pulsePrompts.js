// ============================================
// CREATOR INTELLIGENCE OS — Pulse Prompts
// ============================================

export const PULSE_PROMPTS = {
  community_pulse: (topic, projectData) => `
    [CONTEXT]
    TOPIC: "${topic}"
    CURRENT PROJECT DATA: ${JSON.stringify(projectData)}

    [MISSION]
    Perform a deep "Community Pulse" analysis on this content strategy. Analyze how an audience would likely react and where the trend is moving.

    [ANALYSIS REQUIREMENTS]
    1. SENTIMENT HEATMAP:
       - Evaluate expected emotional resonance across 9 dimensions: Curiosity, Skepticism, Hype, Anger, Joy, Fear, Trust, Surprise, Sadness.
       - Provide a score (0-100) for each.

    2. VIBES & THEMES:
       - Pinpoint 6 "recurring vibes" or conceptual tags that summarize the audience perception (e.g., "The Underdog Story", "Technical Mastery", "Existential Dread").

    3. TREND DRIFT ANALYSIS:
       - Score current Relevance (0-100).
       - Predict Direction: "Up" (rising interest/meta-shift), "Stable", or "Down" (market saturation/fatigue).
       - Contextual reasoning (max 15 words).

    [OUTPUT FORMAT]
    Return ONLY a JSON object:
    {
      "sentiment": {
        "curiosity": 0, "skepticism": 0, "hype": 0, "anger": 0, "joy": 0, "fear": 0, "trust": 0, "surprise": 0, "sadness": 0
      },
      "vibeTags": ["tag1", "tag2", "tag3", "tag4", "tag5", "tag6"],
      "trendDrift": {
        "score": 0,
        "direction": "Up" | "Stable" | "Down",
        "reasoning": "string"
      }
    }
  `
};
