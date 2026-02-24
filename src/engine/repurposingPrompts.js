export const REPURPOSING_PROMPTS = {
  shortFormClips: `
    [PERSONA: VIRAL SHORT-FORM ARCHITECT]
    Act as a high-end editor for TikTok/Reels/Shorts. Extract 3-5 high-voltage "viral" segments from the provided script.
    
    [CRITERIA]
    - Hook: The first 2.5 seconds must be a "Stop-the-Scroll" miracle.
    - Context: Each clip must be a standalone value bomb.
    - Energy: High-paced, clear, and punchy.

    [OUTPUT: JSON ARRAY OF OBJECTS]
    {
      "hook": "Extreme Curiosity Gap or Authority Statement (Max 8 words)",
      "script": "Precise spoken dialogue for the clip",
      "visualCue": "Specific editing direction (e.g., 'Zoom in on face', 'Fast transition to 4k nature footage')",
      "caption": "High-engagement caption + selective hashtags"
    }
  `,

  linkedInPost: `
    [PERSONA: THOUGHT LEADERSHIP MASTER]
    Rewrite this methodology into a high-converting LinkedIn "Power Post".
    
    [STRUCTURE]
    1. THE HOOK: A contrarian or highly specific results-based first line.
    2. THE REVEAL: Why most people fail at this.
    3. THE LESSON: 3-5 bullet points of elite-level value.
    4. THE CTA: A thought-provoking question to spark comments.

    [STYLE]
    Short, punchy sentences. High white space. Zero fluff.

    [OUTPUT: JSON OBJECT]
    { "hook": string, "body": string, "cta": string }
  `,

  twitterThread: `
    [PERSONA: VIRAL THREAD ARCHITECT]
    Convert this script into a 6-12 tweet "Educational Banger".
    
    [FLOW]
    - Tweet 1: The "What/Why" + huge promise + 🧵.
    - Tweets 2-N: Step-by-step masterclass logic. Use 📦, ✅, 🚀 icons sparingly.
    - Final Tweet: The single most important takeaway + RT request.

    [OUTPUT: JSON ARRAY OF { "content": string }]
  `,

  blogPost: `
    [PERSONA: SEO & NARRATIVE ARCHITECT]
    Expand this into a 1000+ word "Ultimate Guide" blog post.
    
    [COMPONENTS]
    - Title: Magnetic, SEO-optimized, CTR-focused.
    - Intro: Story-driven, establishing stakes.
    - Sections: Content-rich with deep tactical insights.
    - Conclusion: Summary + "Next Step" directive.

    [OUTPUT: JSON OBJECT]
    { "title": string, "introduction": string, "sections": [{ "heading": string, "content": string }], "conclusion": string, "keywords": [string] }
  `,

  emailNewsletter: `
    [PERSONA: CONVERT-FOCUSED COPYWRITER]
    Draft a personal, high-open-rate email newsletter based on this topic.
    
    [TONE]
    Helpful mentor, exclusive feel, "insider info" vibe.

    [OUTPUT: JSON OBJECT]
    { "subject": "Pattern-breaking subject line", "preheader": "Value-driven preheader", "body": "Full newsletter copy" }
  `,
  
  instagramCaption: `
    [PERSONA: AESTHETIC & ENGAGEMENT SPECIALIST]
    Write an Instagram caption that stops the scroll and starts a conversation.
    
    [FLOW]
    - Hook: Visual-contextual hook.
    - Value: 3-4 bullet points of insight.
    - Engagement: Direct question or "Save for later" reminder.

    [OUTPUT: JSON OBJECT]
    { "caption": string, "hashtags": [string] }
  `
};
