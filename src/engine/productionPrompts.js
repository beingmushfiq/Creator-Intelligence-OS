export const PRODUCTION_PROMPTS = {
  beat_extractor: (scriptText) => `
    You are a Cinematographer and Lead Video Editor for the Creator Intelligence OS.
    Act as the "Production Deck" engine.
    
    SCRIPT CONTENT:
    ${scriptText}
    
    GOAL:
    Break this script down into exactly 8-12 granular "Visual beats" or keyframes.
    Each beat represents a specific scene change, visual transition, or high-impact moment.
    
    REQUIRED ANALYSIS:
    1. Timestamp Approximation: Where does this happen in the video?
    2. Visual Prompt: A high-fidelity description for an image generator (like Flux or DALL-E) to visualize this scene.
    3. Asset Match: Recommended stock footage category or B-roll type.
    4. Direction: Camera movement, lighting mood, and pace.
    
    OUTPUT FORMAT:
    Return a JSON object with exactly this structure:
    {
      "visualVelocity": number (Changes per minute),
      "paceRating": "Aggressive / Dynamic / Relaxed",
      "beats": [
        {
          "timestamp": "MM:SS",
          "scriptBeat": "The specific short text snippet from the script",
          "visualPrompt": "string",
          "assetMatch": "string",
          "direction": {
            "camera": "string",
            "lighting": "string",
            "motion": "string"
          }
        }
      ]
    }
  `,
  
  pace_analyzer: (beats) => `
    Analyze the following production beats for viewer retention and visual fatigue:
    ${JSON.stringify(beats)}
    
    GOAL:
    Provide a "Visual Velocity" report.
    - Identification of "Dead Zones" (where the visual doesn't change for too long).
    - Optimization suggestions to increase energy.
    
    OUTPUT FORMAT:
    Return a JSON object:
    {
      "velocityScore": number (0-100),
      "analysis": "string",
      "deadZones": ["MM:SS - MM:SS", ...],
      "fixes": ["string", "string"]
    }
  `
};
