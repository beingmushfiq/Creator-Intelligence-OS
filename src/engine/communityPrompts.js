export const COMMUNITY_PROMPTS = {
  generateStrategy: (topic, niche, brandGenome) => `
    You are a Community Architect for elite creators.
    Create a "Community Flywheel" strategy for the topic: "${topic}" in the "${niche}" niche.
    ${brandGenome ? `[BRAND GENOME ACTIVE]\n${brandGenome}\n` : ''}

    Tasks:
    1. Design a "Feedback Loop" with 3 stages:
       - Listener (Passive Consumption)
       - Participant (Active Engagement)
       - Advocate (Community Contribution/Evangelism)
    2. Map "Social Proof Assets": 5 specific ways to showcase community wins for this topic.
    3. Calculate a "Community Health Score" (0-100) based on typical sentiment for ${topic}.
    4. Propose 3 "Community Rituals" (recurring events or engagement triggers).

    Return as JSON:
    {
      "flywheel": {
         "listener": { "action": string, "hook": string },
         "participant": { "action": string, "hook": string },
         "advocate": { "action": string, "hook": string }
      },
      "socialProof": [
        { "type": string, "implementation": string, "impact": string }
      ],
      "healthMetric": {
        "score": number,
        "sentiment": string,
        "risks": [string]
      },
      "rituals": [
        { "name": string, "description": string, "frequency": string }
      ]
    }
  `,

  generateSegments: (topic, scriptData) => `
    Review this script for "${topic}":
    ${JSON.stringify(scriptData)}

    Generate 3 "Community Feedback Segments" to inject into this script.
    These should feel like the creator responding to real viewer questions or showcasing community wins.

    Segments:
    1. "The Auditor Q&A": A technical or deep-dive question.
    2. "The Transformation Story": A brief community success shoutout.
    3. "The Consensus Check": Asking the community for their take on a controversial point in the script.

    Return as JSON:
    {
      "segments": [
        { "id": string, "type": string, "text": string, "insertionPoint": "string - logic for where it fits (e.g., 'After Context')" }
      ]
    }
  `
};
