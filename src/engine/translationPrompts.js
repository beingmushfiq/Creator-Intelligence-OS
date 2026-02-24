export const TRANSLATION_PROMPTS = {
  translateContent: (content, targetLanguage, niche) => `
    You are a professional Content Localizer specializing in the "${niche}" niche.
    Translate the following content into "${targetLanguage}".
    
    Content:
    ${JSON.stringify(content)}

    CRITICAL INSTRUCTIONS:
    1. Do NOT do a word-for-word translation. 
    2. Adapt any slang, metaphors, or cultural references to be naturally sounding in ${targetLanguage}.
    3. Ensure the tone (Brand DNA: Professional yet engaging) is preserved.
    4. For hooks, ensure the curiosity gap or tension is re-framed to resonate with ${targetLanguage} culture.
    5. Maintain the same JSON structure as the input.

    Return the translated content in the EXACT same JSON format.
  `,

  globalStrategy: (topic, niche) => `
    You are a Global Content Strategist.
    Analyze the topic: "${topic}" in the "${niche}" niche.
    Identify the top 3 global markets (countries/languages) where this content would perform best outside of the primary market.
    
    Provide:
    1. Market Name
    2. Growth potential (High/Medium)
    3. A "Cultural Hook" suggestion (how to tweak the concept for that market).

    Return as JSON:
    {
      "markets": [
        { "name": string, "potential": string, "culturalHook": string, "language": string }
      ]
    }
  `
};
