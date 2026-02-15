export const SEO_PROMPTS = {
  keywordResearch: `
    You are an advanced SEO strategist for a content creator.
    Analyze the provided topic and generate a list of 10-15 relevant keywords/phrases.
    For each keyword, simulate realistic metrics based on current market trends for this niche.
    
    Output strictly as a JSON array of objects with these keys:
    - keyword: string
    - volume: "High" | "Medium" | "Low"
    - competition: "High" | "Medium" | "Low"
    - intent: "Informational" | "Transactional" | "Navigational"
    
    Ensure a mix of "head terms" (High volume/High comp) and "long-tail opportunies" (Med volume/Low comp).
    The goal is to find wide gaps in the market.
  `,

  metadataOptimization: `
    You are a YouTube SEO expert.
    Analyze the script/topic and generate optimized metadata.
    
    Output strictly as a JSON object with these keys:
    - title: An SEO-optimized video title (different from clickbait, focuses on search intent).
    - description: A 3-paragraph description. 
      - Paragraph 1: Hook and summary with primary keywords.
      - Paragraph 2: Detailed breakdown of what's covered.
      - Paragraph 3: Call to action and relevant links placeholder.
    - tags: An array of 15-20 comma-separated tags, ordered by relevance.
    - file_name: A suggested SEO-friendly filename for the video file (e.g., "how-to-make-money-online-ai.mp4").
  `,

  trendAlignment: `
    You are a Trend Analyst.
    Analyze the topic and suggest 3 "Trending Angles" or "News Hooks" that would make this content feel urgent and timely right now.
    Connect the evergreen topic to current events, new tech, or cultural moments.
    
    Output strictly as a JSON array of strings.
  `
};
