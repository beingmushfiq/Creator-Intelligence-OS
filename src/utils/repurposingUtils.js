// Multi-Platform Content Repurposing Utilities

/**
 * Transform master script content into platform-optimized formats
 */

// YouTube Shorts / TikTok / Reels (15-60s)
export function generateShortFormClips(scriptData, count = 5) {
  if (!scriptData?.script?.scenes) return [];
  
  const clips = [];
  const scenes = scriptData.script.scenes;
  
  // Extract viral-worthy moments
  for (let i = 0; i < Math.min(count, scenes.length); i++) {
    const scene = scenes[i];
    clips.push({
      platform: 'Short-Form (TikTok/Reels/Shorts)',
      duration: '15-60s',
      hook: scene.hook || extractHook(scene.description),
      content: truncateForShortForm(scene.description),
      caption: generateShortFormCaption(scene),
      hashtags: generateHashtags(scriptData.topic, 'short-form'),
      soundSuggestion: 'Trending upbeat music',
    });
  }
  
  return clips;
}

// LinkedIn Post (Professional tone)
export function generateLinkedInPost(scriptData) {
  if (!scriptData?.narrative) return null;
  
  const { topic, narrative } = scriptData;
  
  return {
    platform: 'LinkedIn',
    format: 'Professional Post',
    hook: `${narrative.coreQuestion || topic}`,
    body: `
${narrative.coreQuestion || topic}

${narrative.hiddenIncentive ? `Most people don't realize: ${narrative.hiddenIncentive}` : ''}

Here's what the data actually shows:

${narrative.coreTension ? `• ${narrative.coreTension}` : ''}
${narrative.psychologicalFramework ? `• ${narrative.psychologicalFramework}` : ''}

The implications are significant for anyone in [your industry].

What's your take on this?

#ThoughtLeadership #Industry #Insights
    `.trim(),
    cta: 'Engage with your network',
  };
}

// Twitter/X Thread (10-15 tweets)
export function generateTwitterThread(scriptData) {
  if (!scriptData?.narrative) return [];
  
  const { topic, narrative } = scriptData;
  const thread = [];
  
  // Tweet 1: Hook
  thread.push({
    number: 1,
    type: 'Hook',
    content: `${topic}\n\nA thread 🧵`,
    characterCount: `${topic}\n\nA thread 🧵`.length,
  });
  
  // Tweet 2: Core Question
  if (narrative.coreQuestion) {
    thread.push({
      number: 2,
      type: 'Setup',
      content: narrative.coreQuestion,
      characterCount: narrative.coreQuestion.length,
    });
  }
  
  // Tweet 3: Hidden Incentive
  if (narrative.hiddenIncentive) {
    thread.push({
      number: 3,
      type: 'Revelation',
      content: `Here's what most people miss:\n\n${narrative.hiddenIncentive}`,
      characterCount: `Here's what most people miss:\n\n${narrative.hiddenIncentive}`.length,
    });
  }
  
  // Tweet 4: Core Tension
  if (narrative.coreTension) {
    thread.push({
      number: 4,
      type: 'Tension',
      content: narrative.coreTension,
      characterCount: narrative.coreTension.length,
    });
  }
  
  // Final Tweet: CTA
  thread.push({
    number: thread.length + 1,
    type: 'CTA',
    content: `If you found this valuable:\n\n1. Follow me for more insights\n2. Retweet the first tweet to share\n3. Drop your thoughts below 👇`,
    characterCount: 'If you found this valuable:\n\n1. Follow me for more insights\n2. Retweet the first tweet to share\n3. Drop your thoughts below 👇'.length,
  });
  
  return thread;
}

// Blog Post (1500-2000 words)
export function generateBlogPost(scriptData) {
  if (!scriptData?.script || !scriptData?.narrative) return null;
  
  const { topic, narrative, script } = scriptData;
  
  return {
    platform: 'Blog / Medium',
    format: 'Long-Form Article',
    title: topic,
    metaDescription: narrative.coreQuestion?.substring(0, 155) || topic.substring(0, 155),
    structure: {
      h1: topic,
      introduction: narrative.coreQuestion || '',
      h2Sections: script.scenes?.map((scene, i) => ({
        heading: `${i + 1}. ${scene.hook || `Key Point ${i + 1}`}`,
        content: scene.description,
      })) || [],
      conclusion: 'Wrapping up these insights...',
    },
    seoKeywords: generateHashtags(topic, 'blog').map(tag => tag.replace('#', '')),
    internalLinks: [],
    wordCount: 'Est. 1500-2000 words',
  };
}

// Email Newsletter
export function generateEmailNewsletter(scriptData) {
  if (!scriptData?.narrative) return null;
  
  const { topic, narrative } = scriptData;
  
  return {
    platform: 'Email Newsletter',
    subject: `${topic} - You won't believe this`,
    preheader: narrative.coreQuestion?.substring(0, 100) || '',
    body: `
Hey there,

${narrative.coreQuestion || topic}

I've been researching this topic, and what I found surprised me.

${narrative.hiddenIncentive ? `Most people think one thing, but the reality is: ${narrative.hiddenIncentive}` : ''}

${narrative.coreTension ? `Here's the tension: ${narrative.coreTension}` : ''}

I've put together a full breakdown that you can read here: [LINK]

Let me know what you think - just hit reply!

Best,
[Your Name]
    `.trim(),
    cta: 'Read the full article',
  };
}

// Instagram Caption
export function generateInstagramCaption(scriptData) {
  if (!scriptData?.narrative) return null;
  
  const { topic, narrative } = scriptData;
  
  return {
    platform: 'Instagram',
    caption: `
${topic} 🤯

${narrative.coreQuestion || ''}

${narrative.hiddenIncentive ? `💡 ${narrative.hiddenIncentive}` : ''}

Double tap if this surprised you! 👇

${generateHashtags(topic, 'instagram').join(' ')}
    `.trim(),
    hashtags: generateHashtags(topic, 'instagram'),
    storyPrompt: 'Share this to your story with your thoughts!',
  };
}

// Podcast Script
export function generatePodcastScript(scriptData) {
  if (!scriptData?.script) return null;
  
  const { topic, script } = scriptData;
  
  return {
    platform: 'Podcast',
    format: 'Conversational Script',
    intro: `
[INTRO MUSIC]

Hey everyone, welcome back to the show! Today we're diving into something fascinating: ${topic}.

This is one of those topics that seems simple on the surface, but when you dig deeper... wow.

Let's get into it.
    `.trim(),
    mainContent: script.scenes?.map(scene => ({
      segment: scene.hook || 'Next point',
      script: `So, ${scene.description}`,
    })) || [],
    outro: `
[OUTRO]

Alright, that's it for today's episode. If you enjoyed this, make sure to subscribe and leave a review.

Next week, we're talking about [NEXT TOPIC].

See you then!

[OUTRO MUSIC]
    `.trim(),
  };
}

// Helper Functions
function extractHook(text) {
  const sentences = text.split(/[.!?]/);
  return sentences[0] + (sentences[0].endsWith('.') ? '' : '.');
}

function truncateForShortForm(text, maxLength = 200) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

function generateShortFormCaption(scene) {
  return `${scene.hook || 'Watch this!'} 👀 #viral #fyp`;
}

function generateHashtags(topic, platform) {
  const baseHashtags = ['#contentcreation', '#insights', '#learn'];
  
  // Extract keywords from topic
  const keywords = topic
    .toLowerCase()
    .split(' ')
    .filter(word => word.length > 4)
    .slice(0, 3)
    .map(word => `#${word.replace(/[^a-z0-9]/g, '')}`);
  
  const platformSpecific = {
    'short-form': ['#fyp', '#viral', '#trending'],
    'instagram': ['#instagood', '#photooftheday', '#explore'],
    'blog': [], // No hashtags for blogs
    'linkedin': ['#thoughtleadership', '#professional', '#business'],
  };
  
  return [...keywords, ...baseHashtags, ...(platformSpecific[platform] || [])].slice(0, 10);
}

// Main export function
export function repurposeContent(scriptData) {
  return {
    shortFormClips: generateShortFormClips(scriptData),
    linkedInPost: generateLinkedInPost(scriptData),
    twitterThread: generateTwitterThread(scriptData),
    blogPost: generateBlogPost(scriptData),
    emailNewsletter: generateEmailNewsletter(scriptData),
    instagramCaption: generateInstagramCaption(scriptData),
    podcastScript: generatePodcastScript(scriptData),
  };
}
