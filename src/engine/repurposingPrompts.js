export const REPURPOSING_PROMPTS = {
  shortFormClips: `
    Analyze the provided script and extract 3-5 distinct "viral" segments suitable for TikTok/Reels/Shorts (15-60s each).
    For each segment, provide:
    1. A hook (the first 3 seconds, extremely punchy)
    2. The script segment (word-for-word from source or slightly tweaked for standalone context)
    3. A suggested visual cue (what should be on screen)
    4. A caption with 3-5 relevant hashtags
    
    Format output as a JSON array of objects with keys: hook, script, visualCue, caption.
  `,

  linkedInPost: `
    Rewrite the provided script methodology into a high-performing LinkedIn text post.
    Style: "Broetry" / spacing for readability, professional but conversational tone.
    Structure:
    - Powerful one-line hook
    - The "meat" of the insight (3-4 short paragraphs/bullet points)
    - A counter-intuitive takeaway
    - A clear CTA (e.g., "Thoughts?")
    
    Format output as a JSON object with keys: hook, body, cta.
  `,

  twitterThread: `
    Transform the provided script into a Twitter/X thread (6-12 tweets).
    Structure:
    - Tweet 1: The Hook + "A thread 🧵"
    - Tweet 2-N: The core insights, broken down into tweet-sized chunks (max 280 chars). Use bullet points '•' where helpful.
    - Final Tweet: CTA (Follow/Retweet).
    
    Format output as a JSON array of objects with keys: content (string).
  `,

  blogPost: `
    Expand the provided script into a structured SEO blog post (1000+ words).
    Structure:
    - H1 Title (SEO optimized)
    - Introduction (The Hook + The Problem)
    - H2 Headers for main points
    - Detailed paragraphs for each point
    - Conclusion
    - 5 SEO Keywords
    
    Format output as a JSON object with keys: title, introduction, sections (array of {heading, content}), conclusion, keywords (array).
  `,

  emailNewsletter: `
    Rewrite the provided script into a personal email newsletter.
    Tone: Intimate, "Isolating the Signal", helpful friend.
    Structure:
    - Subject Line (High open rate style)
    - Preheader
    - Salutation
    - Story/Bridge to the topic
    - The Core Insight (Bulleted list)
    - The "Why it matters"
    - Sign-off
    
    Format output as a JSON object with keys: subject, preheader, body.
  `,
  
  instagramCaption: `
    Write an engaging Instagram caption for a post about this topic.
    Structure:
    - Hook (first line visible before 'more')
    - Value proposition (3-4 lines)
    - CTA (Double tap / Save / Share)
    - 30 Hashtags block
    
    Format output as a JSON object with keys: caption, hashtags (array).
  `
};
