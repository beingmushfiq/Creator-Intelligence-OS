export const ENGAGEMENT_PROMPTS = {
  generateResponses: (comment, tone, brandGenome) => `
    You are a Community Manager for a high-growth creator.
    Generate 3 suggested replies to the following comment using a "${tone}" tone.
    ${brandGenome ? `[BRAND GENOME ACTIVE]\n${brandGenome}\n` : ''}

    Comment:
    "${comment}"

    CRITICAL INSTRUCTIONS:
    1. Preserve the Brand DNA while matching the requested tone.
    2. Ensure replies are engaging, human-sounding, and encourage further conversation.
    3. If the tone is "Debunking", use logic and evidence without being toxic.
    4. If the tone is "Witty", use clever wordplay or cultural references.
    5. If the tone is "Professional", be helpful, polite, and authoritative.
    6. If the tone is "Supportive", show genuine appreciation and community spirit.

    Return as JSON:
    {
      "sentiment": "Positive" | "Neutral" | "Negative" | "Constructive",
      "replies": [
        { "text": string, "rationale": string }
      ]
    }
  `
};
