/**
 * CREATOR INTELLIGENCE OS — Revenue Calculation Engine
 */

export const REVENUE_CONFIG = {
  YOUTUBE_RPM: 18.5,     // Revenue per 1000 views (average)
  TIKTOK_RPM: 0.04,     // TikTok creator fund is notoriously low
  BLOG_RPM: 12.0,       // Display ads + affiliate
  LINKEDIN_VALUE_PER_VIEW: 0.15, // Indirect value: Leads/Brand
  SPONSOR_BASE_RATE: 25.0 // $25 per 1000 views for sponsorships
};

/**
 * Estimates potential revenue for a piece of content
 * @param {number} predictedViews 
 * @param {string} platform 
 * @returns {object} { adSense, sponsorship, total }
 */
export const estimateRevenue = (predictedViews, platform) => {
  let rpm = REVENUE_CONFIG.YOUTUBE_RPM;
  if (platform === 'TikTok') rpm = REVENUE_CONFIG.TIKTOK_RPM;
  if (platform === 'Blog') rpm = REVENUE_CONFIG.BLOG_RPM;
  if (platform === 'LinkedIn') rpm = REVENUE_CONFIG.LINKEDIN_VALUE_PER_VIEW * 1000;

  const adSense = (predictedViews / 1000) * rpm;
  const sponsorship = (predictedViews / 1000) * REVENUE_CONFIG.SPONSOR_BASE_RATE;

  return {
    adSense: Math.round(adSense),
    sponsorship: Math.round(sponsorship),
    total: Math.round(adSense + sponsorship)
  };
};

/**
 * Projects future revenue based on growth velocity
 * @param {Array} history - Array of { date, revenue }
 * @param {number} months - How many months to project
 */
export const projectRevenue = (history, months = 3) => {
  if (history.length < 2) return history;
  
  const last = history[history.length - 1].revenue;
  const first = history[0].revenue;
  const growthRate = (last - first) / history.length;
  
  const projections = [];
  for (let i = 1; i <= months * 30; i++) {
    const projectedDate = new Date();
    projectedDate.setDate(projectedDate.getDate() + i);
    projections.push({
      date: projectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      revenue: Math.round(last + (growthRate * i)),
      isProjection: true
    });
  }
  
  return projections;
};
