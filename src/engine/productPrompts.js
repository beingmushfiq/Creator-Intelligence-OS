export const PRODUCT_PROMPTS = {
  generateStrategy: (topic, niche, brandGenome) => `
    You are a Digital Product Architect for high-growth creators.
    Create a comprehensive digital product strategy for the topic: "${topic}" in the "${niche}" niche.
    ${brandGenome ? `[BRAND GENOME ACTIVE]\n${brandGenome}\n` : ''}

    Tasks:
    1. Design a "Value Ladder" with 4 steps:
       - Lead Magnet (Free)
       - Order Bump/Tripwire ($7-27)
       - Core Product ($97-497)
       - High-Ticket/Backend ($997+)
    2. Build a "Product Blueprint" (curriculum/outline) for the Core Product.
    3. Map a 4-week "Launch Runway" (specific actions for each week).
    4. Calculate the "Revenue Potential" based on a 1% conversion rate for ${topic}.

    Return as JSON:
    {
      "valueLadder": [
        { "level": string, "name": string, "price": string, "deliverable": string }
      ],
      "blueprint": {
        "title": string,
        "modules": [{ "title": string, "lessons": [string] }]
      },
      "launchRunway": [
        { "week": number, "theme": string, "actions": [string] }
      ],
      "revenueModel": {
         "projection": string,
         "logic": string
      }
    }
  `,

  generateSalesCopy: (productName, benefits, topic) => `
    You are a Direct Response Copywriter.
    Write a high-conversion sales letter section for the product: "${productName}".
    Focusing on the benefits: ${benefits}.
    Topic context: ${topic}.

    Structure:
    1. Attention-Grabbing Headline
    2. The "Problem" (Agitate the pain)
    3. The "Solution" (Introduce the product)
    4. 5 Bulleted "Benefit-Driven" Features
    5. The "Guarantee" / Risk Reversal

    Return as JSON:
    {
      "headline": string,
      "problem": string,
      "solution": string,
      "features": [string],
      "guarantee": string
    }
  `
};
