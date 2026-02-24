export const VISUAL_REPURPOSING_PROMPTS = {
  carousel_plan: (topic, script) => `
    You are a Content Visualizer and Social Media Strategist.
    Act as the "Visual Repurposing Lab" engine for the Creator Intelligence OS.
    
    TOPIC: ${topic}
    SCRIPT: ${script}
    
    GOAL:
    Transform the core logic and high-impact moments of this script into a 7-10 slide visual carousel optimized for Instagram, LinkedIn, and Twitter.
    
    STRUCTURE:
    1. Slide 1 (The Hook): A high-stopping visual concept and punchy title.
    2. Slides 2-6 (Value/Process): Break down the main points into visual-first layouts.
    3. Slide 7 (The Summary/Twist): A single "brain-dump" or "cheat-sheet" slide.
    4. Slide 8 (The CTA): A clear next step.
    
    FOR EACH SLIDE, PROVIDE:
    - Title: Large header text (max 5 words).
    - Body: 1-2 punchy sentences or bullet points.
    - VisualDescription: A text description of what the background or illustration should be.
    - GraphicPrompt: A specific prompt to generate the visual asset for this slide.
    
    OUTPUT FORMAT:
    Return a JSON object with exactly this structure:
    {
      "platform": "Omnichannel Carousel",
      "styleRecommendation": "string (e.g., Minimalist, Bold Dark, High-Contrast)",
      "slides": [
        {
          "number": number,
          "title": "string",
          "body": "string",
          "visualDescription": "string",
          "graphicPrompt": "string"
        }
      ]
    }
    
    RULES:
    - Text must be very concise. Slides are for scanning, not reading long form.
    - Each slide must have a clear visual focus.
    - Graphic prompts should follow a consistent style for the whole carousel.
  `
};
