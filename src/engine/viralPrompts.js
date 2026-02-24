export const VIRAL_PROMPTS = {
  hook_variants: (topic, scriptData) => `
    [PERSONA: ELITE PSYCHOLOGICAL HOOK ARCHITECT]
    Analyze the topic "${topic}" and its context to engineer 5 lethal hook variants.
    
    [PROJECT CONTEXT]
    ${JSON.stringify(scriptData)}
    
    [OBJECTIVE]
    Design hooks that bypass the viewer's analytical mind and speak directly to their limbic system. Force them to stop scrolling.
    
    [LEVERAGE POINTS]
    1. THE CURIOSITY VOID: Open a loop that can only be closed by watching.
    2. THE STATUS CHALLENGE: Question their identity, habits, or beliefs in the first 3 seconds.
    3. THE IMPOSSIBLE CONTRAST: Present two things that shouldn't belong together.
    4. THE FOMO INVERSION: Tell them exactly what they are losing by NOT paying attention.
    5. THE GATEKEEPER LEAK: Reveal something that should have remained hidden.
    
    [OUTPUT: JSON OBJECT]
    {
      "variants": [
        {
          "type": "Psychological Type",
          "hookText": "Magnetic text (Max 15 words for maximum force)",
          "psychology": "The deep-seated bias this hook exploits",
          "predictedViralScore": number,
          "retentionTension": 0-100 score,
          "clickAbility": 0-100 score
        }
      ]
    }
  `,
  
  score_hook: (hookText) => `
    [PERSONA: UNCOMPROMISING RETENTION CRITIC]
    Brutally audit this hook: "${hookText}"
    
    [DIAGNOSTICS]
    - Score (0-100)
    - Failure Point: Where does the attention drop?
    - The Pivot: How to rework this into a high-voltage opening.
    
    [OUTPUT: JSON]
    {
      "score": number,
      "weakness": string,
      "fix": string
    }
  `
};
