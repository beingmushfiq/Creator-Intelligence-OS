export const AFFILIATE_PROMPTS = {
  product_sleuth: (scriptText) => `
    You are a Monetization Strategist and Affiliate Marketing Expert for the Creator Intelligence OS.
    Act as the "Product Sleuth" engine.
    
    SCRIPT CONTENT:
    ${scriptText}
    
    GOAL:
    Scan this script for every opportunity to mention a physical or digital product.
    Identify both implicit (e.g., "I used a lens with great bokeh") and explicit (e.g., "The Sony A7SIII is great") mentions.
    
    REQUIRED ANALYSIS:
    1. Product Category: What kind of item is it?
    2. Context: How is it being used in the script?
    3. Mention Type: Explicit or Apparitional (good for an overlay/link).
    4. Revenue High-Point: Why would a viewer buy this after hearing this specific line?
    
    OUTPUT FORMAT:
    Return a JSON object with exactly this structure:
    {
      "potentialItems": [
        {
          "name": "string",
          "category": "string",
          "contextSnippet": "The text from the script",
          "mentionType": "Explicit / Implicit",
          "monetizationAngle": "string (Why it fits here)"
        }
      ]
    }
  `,
  
  deal_matcher: (item, niche, dnaSnippet) => `
    Act as a "High-Affinity Matcher".
    
    ITEM: ${item.name}
    NICHE: ${niche}
    CREATOR DNA: ${dnaSnippet || 'Standard'}
    
    GOAL:
    Match this item with 3 high-converting affiliate programs or specific products that fit the creator's brand.
    
    CRITERIA:
    1. Commission Rate: High ROI.
    2. Brand Alignment: Does it fit the creator's style and values?
    3. Market Demand: Is this a currently trending/reliable product?
    
    OUTPUT FORMAT:
    Return a JSON object:
    {
      "itemName": "${item.name}",
      "matches": [
        {
          "program": "Amazon / BH / Shopify / Custom",
          "productName": "string",
          "estimatedCommission": "string (e.g., 5-10%)",
          "suitabilityScore": number (0-100),
          "ctaSuggestion": "A catchy 1-sentence CTA for the description"
        }
      ],
      "revenueProjection": {
        "lowEstimate": number,
        "highEstimate": number,
        "trafficThreshold": "Views needed for ROI"
      }
    }
  `
};
