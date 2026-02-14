
// ============================================
// CREATOR INTELLIGENCE OS — Analytics Data Generator
// ============================================
// Generates realistic mock data for the analytics dashboard

export const generateAnalyticsData = () => {
  // 1. KPI Metrics
  const kpi = {
    totalRevenue: { value: 12450, trend: 12.5, period: 'vs last month' },
    totalViews: { value: 845000, trend: 8.2, period: 'vs last month' },
    subscribers: { value: 42500, trend: 5.4, period: 'vs last month' },
    engagementRate: { value: 5.8, trend: -1.2, period: 'vs last month' }
  };

  // 2. Revenue History (Last 30 Days)
  const revenueHistory = [];
  const viewsHistory = [];
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    // Random fluctuation with upward trend
    const baseRevenue = 300 + (Math.random() * 200);
    const trendFactor = 1 + ((30 - i) * 0.02); 
    
    revenueHistory.push({
      date: dateStr,
      revenue: Math.round(baseRevenue * trendFactor)
    });

    // Views correlation
    viewsHistory.push({
      date: dateStr,
      views: Math.round((baseRevenue * trendFactor) * 45) // roughly $22 RPM/CPM equivalent logic
    });
  }

  // 3. Platform Distribution
  const platformData = [
    { name: 'YouTube', value: 45, color: '#FF0000' },
    { name: 'Instagram', value: 25, color: '#C13584' },
    { name: 'TikTok', value: 20, color: '#00F2EA' },
    { name: 'LinkedIn', value: 10, color: '#0077B5' },
  ];

  // 4. Recent Content Performance
  const contentPerformance = [
    { title: 'AI Automation Guide 2026', views: 45200, revenue: 1200, platform: 'YouTube', type: 'Video' },
    { title: 'Content Repurposing Secrets', views: 28000, revenue: 850, platform: 'YouTube', type: 'Video' },
    { title: 'The Death of SEO?', views: 156000, revenue: 0, platform: 'TikTok', type: 'Short' },
    { title: 'My $10k/mo Stack', views: 12000, revenue: 0, platform: 'LinkedIn', type: 'Post' },
    { title: 'Creator Economy Trends', views: 3400, revenue: 150, platform: 'Blog', type: 'Article' },
  ];

  return {
    kpi,
    revenueHistory,
    viewsHistory,
    platformData,
    contentPerformance
  };
};
