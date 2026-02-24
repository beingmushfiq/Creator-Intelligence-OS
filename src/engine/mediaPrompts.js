export const MEDIA_PROMPTS = {
  generatePlan: (topic, script) => `
    You are a Visual Director for high-end digital content.
    Analyze this script for the topic: "${topic}".
    
    SCRIPT:
    ${JSON.stringify(script)}

    Tasks:
    1. Create a "Scene-by-Scene B-Roll Map": Suggest specific visuals for every 30 seconds of script.
    2. Define "Stock Search Terms": Provide 3 optimized search tags for each visual.
    3. Design an "Audio Palette": Suggest background music style (e.g., Lofi, Orchestral) and 3 key SFX cues.
    4. Estimate "Media Readiness": A score from 0-100 based on the coverage of visuals vs dialogue.

    Return as JSON:
    {
      "brollMap": [
        { "scene": string, "dialogueSnippet": string, "visualSuggestion": string, "searchTerms": [string], "vibe": string }
      ],
      "audioPalette": {
        "musicStyle": string,
        "sfxCues": [
          { "time": string, "sound": string, "purpose": string }
        ]
      },
      "readinessScore": number
    }
  `
};
