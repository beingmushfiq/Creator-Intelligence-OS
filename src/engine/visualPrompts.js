export const VISUAL_STYLES = {
  mrbeast: {
    id: 'mrbeast',
    label: 'High Emotion (MrBeast)',
    prompt: 'Hyper-realistic YouTube thumbnail style, high saturation, extreme facial expressions, dramatic lighting, 4k resolution, sharp focus, vibrant colors, "MrBeast style", wide angle lens.'
  },
  minimalist: {
    id: 'minimalist',
    label: 'Clean Minimalist',
    prompt: 'Minimalist design, plenty of negative space, bold solid colors, single focal point, clean typography, apple-style aesthetic, soft even lighting, professional and sleek.'
  },
  render3d: {
    id: 'render3d',
    label: '3D Render',
    prompt: '3D Pixar-style render, glossy textures, soft rounded shapes, warm lighting, cute and friendly aesthetic, high fidelity, octane render, unreal engine 5 style.'
  },
  comic: {
    id: 'comic',
    label: 'Comic / Anime',
    prompt: 'Cel-shaded anime style, dramatic action lines, bold black outlines, vibrant pop-art colors, intense lighting, manga aesthetic, dynamic composition.'
  },
  cinematic: {
    id: 'cinematic',
    label: 'Cinematic Movie',
    prompt: 'Cinematic film still, anamorphic lens flare, moody lighting, teal and orange color grading, dramatic shadows, 8k resolution, movie poster quality.'
  }
};

export const ASPECT_RATIOS = {
  landscape: { id: 'landscape', label: '16:9 (YouTube)', size: '1024x1024' }, // DALL-E 3 standard is sq/landscape/portrait
  portrait: { id: 'portrait', label: '9:16 (Shorts)', size: '1024x1792' }
};

export const MAGIC_ENHANCE_PROMPT = `
  You are a professional Prompt Engineer for DALL-E 3.
  Rewrite the user's simple image idea into a highly detailed, descriptive prompt that will generate a viral YouTube thumbnail.
  Focus on: composition, lighting, mood, color palette, and key visual elements.
  Keep it under 50 words.
  Input Idea: 
`;
