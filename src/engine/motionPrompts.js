export const MOTION_PROMPTS = {
  generatePlan: (topic, script) => `
    You are a Director of Photography and Cinematic Visualist.
    Analyze this script for the topic: "${topic}".
    
    SCRIPT:
    ${JSON.stringify(script)}

    Tasks:
    1. Create a "Cinematic Shot Sequence": For each major scene, define camera movement (Pan, Tilt, Dolly, Orbit), focal length (Wide, Medium, Tight/Macro), and depth of field.
    2. Define a "Lighting & Color Script": Suggest lighting setups (Rembrandt, Flat, High-key) and a color grading vibe (e.g., "Warm Sunset", "Cool Tech Blue").
    3. Calculate "Motion Energy Mapping": Provide an intensity score (0-100) for each scene and suggest a "Visual Beat" (e.g., "Fast Cut", "Slow Reveal").
    4. Calculate "Overall Motion Energy": An average score from 0-100 reflecting the visual pace of the entire production.

    Return as JSON:
    {
      "sequences": [
        { "scene": string, "shotType": string, "movement": string, "focalLength": string, "lighting": string, "energyScore": number, "visualBeat": string }
      ],
      "colorGrade": {
        "vibe": string,
        "palette": [string],
        "saturation": string
      },
      "overallEnergy": number
    }
  `
};
