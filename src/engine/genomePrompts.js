export const GENOME_PROMPTS = {
  extract_dna: (samples) => `
    You are a Forensic Linguistic Expert and Brand Architect for the Creator Intelligence OS.
    Act as the "Brand Genome" engine.
    
    SAMPLES OF CREATOR CONTENT:
    ${samples.map((s, i) => `Sample ${i+1}:\n${s}`).join('\n\n---\n\n')}
    
    GOAL:
    Perform a deep structural and linguistic analysis of these samples to extract the creator's "Style DNA".
    
    REQUIRED ANALYSIS:
    1. Signature Vocabulary: 5-7 words or phrases the creator uses frequently.
    2. Forbidden Styles: What does this creator explicitly avoid (e.g., "AI-speak", "formal jargon")?
    3. Structural Rhythm: How does the creator pace their content? (e.g., "Short punchy hooks followed by long data deep-dives")
    4. Humor/Vibe: Analytical, Aggressive, Empathetic, Sarcastic, etc.
    5. Quantitative Metrics (0-100):
       - Professional vs Casual
       - Data-Driven vs Story-First
       - Direct vs Suggestive
       - Hype vs Skeptical
    
    OUTPUT FORMAT:
    Return a JSON object with exactly this structure:
    {
      "personaName": "string (A creative name for this persona based on the samples)",
      "metrics": {
        "professional_v_casual": number,
        "data_v_story": number,
        "direct_v_suggestive": number,
        "hype_v_skeptical": number
      },
      "vocabulary": ["string", "string", ...],
      "forbidden": ["string", "string", ...],
      "rhythm": "string",
      "voiceDescription": "A 2-sentence technical summary of this voice for an LLM to follow",
      "dna_snippet": "A concise 'System Instruction' block that can be prepended to other prompts to emulate this exact style"
    }
  `,
  
  synthesize_instruction: (dna) => `
    [STYLE OVERRIDE CALIBRATION]
    Adopt the following Brand Genome DNA:
    ${dna.voiceDescription}
    
    KEY RULES:
    - Keywords to emphasize: ${dna.vocabulary.join(', ')}
    - Avoid: ${dna.forbidden.join(', ')}
    - Structural Rhythm: ${dna.rhythm}
    
    NEVER use generic transition phrases. Maintain the specific tension-to-release ratio defined in the rhythm.
  `
};
