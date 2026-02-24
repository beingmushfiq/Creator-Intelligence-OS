export const DASHBOARD_PROMPTS = {
  project_pulse: (topic, data) => `
    Provide a concise, cinematic executive summary of this project's local "health" and the single most important "Next Step".
    
    OUTPUT FORMAT:
    Return a JSON object with exactly this structure:
    {
      "healthScore": 0-100,
      "statusLabel": "Drafting" | "Pre-Prod" | "Ready" | "Incomplete",
      "summary": "1-2 sentence executive summary of project momentum",
      "recommendation": "The #1 most critical missing piece or next action",
      "insights": ["3 short bullet points about project strengths or gaps"]
    }
    
    RULES:
    - Be brutally honest but encouraging.
    - Focus on momentum and completeness.
    - Tone: Professional, cinematic, visionary.
  `
};
