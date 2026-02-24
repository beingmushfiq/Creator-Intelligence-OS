export const MEDIA_KIT_PROMPTS = {
  generateCaseStudies: (projects) => `
    You are a professional Talent Manager. 
    Analyze these past content projects and create 2-3 "Case Studies" for a Media Kit.
    
    Projects:
    ${JSON.stringify(projects)}

    For each case study, include:
    1. "Project Name"
    2. "The Result" (Key metrics like views, growth, or engagement)
    3. "Value Story" (Why this was successful and what it offered to a potential brand)
    4. "Brand Synergy" (The type of brand that would have thrived here)

    Return as JSON:
    {
      "caseStudies": [
        {
          "name": string,
          "result": string,
          "story": string,
          "synergy": string
        }
      ]
    }
  `,

  portfolioStory: (niche, topic) => `
    Write a compelling 2-sentence "About Me" blurb for a content creator in the "${niche}" niche, currently focusing on "${topic}". 
    Make it sound professional, data-driven, and attractive to sponsors.
    
    Return as JSON: { "aboutMe": string }
  `
};
