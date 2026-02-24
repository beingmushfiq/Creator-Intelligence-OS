export const BURNOUT_PROMPTS = {
  analyzeWorkload: (history) => `
    Analyze the following creator workload history and provide a "Sustainability Report".
    History: ${JSON.stringify(history)}

    Tasks:
    1. Calculate a "Cognitive Load Score" (0-100) based on project complexity and frequency.
    2. Estimate "Days of Content Safety" (how long the current buffer lasts).
    3. Identify "Burnout Risk Level" (Low, Moderate, High, Critical).
    4. Provide 3 specific "Sustainability Tips" (e.g., "Schedule a rest day", "Simplify the next script").

    Return as JSON:
    {
      "loadScore": number,
      "bufferDays": number,
      "riskLevel": string,
      "tips": [string],
      "analysis": string
    }
  `,

  getEvergreenRecycleIdeas: (pastProjects) => `
    Review these past high-performing projects and suggest 3 "Low-Energy Recycle" ideas.
    Projects: ${JSON.stringify(pastProjects)}

    Ideas should focus on:
    - Turning a long video into a thread.
    - Re-hooking an old successful topic with a new angle.
    - Commmunity poll ideas based on the topic.

    Return as JSON array:
    [
      { "originalTopic": string, "recycleAngle": string, "complexity": "Low" | "Medium" }
    ]
  `
};
