export const SPONSORSHIP_PROMPTS = {
  scoutDeals: (topic, script) => `
    You are a Strategic Sponsorship Agent for high-growth creators.
    Analyze this project topic: "${topic}".
    
    Tasks:
    1. Identify 5-7 Brands/Companies that have high thematic alignment with this content.
    2. For each brand, provide:
       - Brand Name
       - Industry
       - "The Why": Why they should sponsor this (alignment reasoning).
       - "Pitch Angle": A specific, unique hook for a cold email.
       - "Estimated Tier": (e.g., $1k-5k, $5k-15k) based on industry standards.

    Return as JSON:
    {
      "leads": [
        { "name": string, "industry": string, "fit": string, "pitchAngle": string, "estimatedValue": string }
      ]
    }
  `,

  negotiationAdvice: (brand, objection, topic) => `
    You are a Master Negotiator for creators.
    A brand ("${brand}") has raised an objection to sponsoring your content about "${topic}".
    
    OBJECTION:
    "${objection}"

    Tasks:
    1. Analyze the hidden concern behind this objection.
    2. Provide 3 "Counter-Points" that emphasize ROI and audience quality.
    3. Generate a "Tactful Response" snippet (1-2 paragraphs) to send to the brand.

    Return as JSON:
    {
      "analysis": string,
      "counterPoints": [string],
      "responseSnippet": string
    }
  `
};
