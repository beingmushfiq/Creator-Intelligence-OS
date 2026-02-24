export const AUTOMATION_PROMPTS = {
  generateWorkflow: (topic, niche, brandGenome) => `
    You are a Production Operations Architect for high-growth creators.
    Create a "Production Pipeline" for the topic: "${topic}" in the "${niche}" niche.
    ${brandGenome ? `[BRAND GENOME ACTIVE]\n${brandGenome}\n` : ''}

    Tasks:
    1. Define 5 "Production Stages" (e.g., Ideation, Prep, Capture, Post, Distribution).
    2. Suggest 3 "Automation Wins": Specific steps that can be handled by AI or scripts.
    3. Create a "Delegation Matrix": Categorize typical production tasks into "Do", "Delegate", or "Delete".
    4. Estimate "Production Velocity": How long each stage should take for a pro-level result.

    Return as JSON:
    {
      "pipeline": [
        { "stage": string, "tasks": [string], "estimatedTime": string, "automationPotential": "Low" | "Medium" | "High" }
      ],
      "delegation": {
        "do": [string],
        "delegate": [string],
        "automate": [string]
      },
      "bottlenecks": [
        { "area": string, "solution": string }
      ],
      "velocityScore": number
    }
  `,

  analyzeBottlenecks: (topic, data) => `
    Analyze the production data for "${topic}":
    ${JSON.stringify(data)}

    Identify 3 major production bottlenecks and provide "Scale Solutions" for each.
    Focus on moving from "Solo Creator" to "Production House" efficiency.

    Return as JSON:
    {
      "bottlenecks": [
        { "id": string, "issue": string, "impact": "High" | "Medium", "scaleSolution": string }
      ]
    }
  `,

  generateYouTubeMetadata: (topic, script) => `
    You are a YouTube Growth Strategist.
    Analyze this project topic: "${topic}" and its script content.
    
    Tasks:
    1. Generate 3 "Viral Titles": Use psychological triggers (Curiosity, Loss Aversion, Benefit) and keep under 70 characters.
    2. Create a "Search-Optimized Description":
       - First 2 lines: High CTR hook with keywords.
       - Timestamps placeholder: Structure for 5 key segments.
       - Social/Links placeholder.
    3. Suggest 15 "High-Volume Tags": Focus on long-tail and broad keywords.
    4. Provide a "Thumbnail Concept": Visual strategy for high CTR.

    Return as JSON:
    {
      "titles": [string],
      "description": string,
      "tags": [string],
      "thumbnailConcept": string
    }
  `
};
