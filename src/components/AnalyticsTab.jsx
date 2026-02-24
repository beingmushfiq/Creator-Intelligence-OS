import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
  BarChart, Bar
} from 'recharts';
import { 
  ArrowUpRight, ArrowDownRight, DollarSign, Users, Eye, 
  Activity, Download, Brain, Sparkles, AlertCircle, 
  Target, Zap, TrendingUp, BarChart3, PieChart as PieIcon, 
  LineChart as LineIcon, Rocket, FolderOpen, Handshake,
  Calendar, RefreshCw, Info, ChevronRight
} from 'lucide-react';
import { generateAnalyticsData } from '../utils/analyticsData';
import { ExportButton } from './ui/ExportButton';
import { useAuth } from '../context/AuthContext';
import { dbService } from '../services/dbService';
import { estimateRevenue, projectRevenue } from '../utils/RevenueCalculators';
import { exportAnalyticsAsCSV } from '../utils/exportUtils';

export default function AnalyticsTab() {
  const data = useMemo(() => generateAnalyticsData(), []);
  const { user } = useAuth();
  const [usageStats, setUsageStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [coachFeedback, setCoachFeedback] = useState(null);

  const analyzeCoachFeedback = () => {
    // Simulating AI analysis
    setCoachFeedback({
      coachScore: 84,
      quickWins: [
        "Optimize thumbnails for 'Value-Added' scripts",
        "Add secondary monetization hooks to Strategy sessions",
        "Leverage ROI data in Sponsorship decks"
      ],
      hazards: [
        "Content velocity in 'Product' tab is dipping",
        "Burnout risk high: Increase scheduling gap"
      ]
    });
  };

  useEffect(() => {
    if (!user) { setLoadingStats(false); return; }
    const load = async () => {
      try {
        const projects = await dbService.getProjects(user.id);
        const tabCounts = {};
        const topicSet = {};
        const roiData = [];

        for (const p of projects) {
          topicSet[p.topic] = (topicSet[p.topic] || 0) + 1;
          const views = 5000 + Math.floor(Math.random() * 50000);
          const rev = estimateRevenue(views, 'YouTube');
          roiData.push({ topic: p.topic, revenue: rev.total, views });

          try {
            const full = await dbService.getProjectFull(p.id);
            Object.keys(full.data || {}).forEach(tab => {
              tabCounts[tab] = (tabCounts[tab] || 0) + 1;
            });
          } catch (_) {}
        }
        const topTabs = Object.entries(tabCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([tab, count]) => ({ tab, count }));
        const topTopics = Object.entries(topicSet)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([topic, count]) => ({ topic, count }));
        
        const topRoi = roiData.sort((a, b) => b.revenue - a.revenue).slice(0, 5);
        const projection = projectRevenue(data.revenueHistory, 1);
        
        setUsageStats({ 
          totalProjects: projects.length, 
          topTabs, 
          topTopics, 
          topRoi,
          projections: projection
        });
      } catch (e) {
        console.warn('Analytics stats failed:', e.message);
      } finally {
        setLoadingStats(false);
      }
    };
    load();
    if (!coachFeedback) analyzeCoachFeedback();
  }, [user, data.revenueHistory]);

  const formatCurrency = (val) => `$${val.toLocaleString()}`;
  const formatNumber = (val) => val.toLocaleString();

  return (
    <div className="tab-content" style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      
      {/* Tab Header */}
      <div className="tab-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20 }}>
        <div>
          <h2 className="tab-title text-gradient">Analytics Laboratory</h2>
          <p className="tab-subtitle">Cross-platform performance & ROI intelligence center</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={() => exportAnalyticsAsCSV(data, 'Channel')} className="btn-secondary" style={{ padding: '8px 16px' }}>
            <Download size={18} /> CSV
          </button>
          <ExportButton section="analytics" data={data} />
        </div>
      </div>

      {/* KPI Grid */}
      <div className="card-grid">
         <KPICard title="Total Revenue" value={formatCurrency(data.kpi.totalRevenue.value)} trend={data.kpi.totalRevenue.trend} icon={DollarSign} color="var(--accent-success)" />
         <KPICard title="Total Views" value={formatNumber(data.kpi.totalViews.value)} trend={data.kpi.totalViews.trend} icon={Eye} color="var(--accent-info)" />
         <KPICard title="Audience" value={formatNumber(data.kpi.subscribers.value)} trend={data.kpi.subscribers.trend} icon={Users} color="var(--accent-primary)" />
         <KPICard title="Retention" value={`${data.kpi.engagementRate.value}%`} trend={data.kpi.engagementRate.trend} icon={Activity} color="var(--accent-warning)" />
      </div>

      {/* Main Stats Hub */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 24 }}>
         
         {/* Performance Lab */}
         <div className="card" style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <LineIcon size={18} color="var(--accent-primary)" />
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Revenue Velocity</h3>
               </div>
               <div className="badge badge-purple" style={{ fontSize: '0.65rem' }}>+12.4% PROJECTION</div>
            </div>
            
            <div style={{ flex: 1, minHeight: 240, width: '100%' }}>
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={[...data.revenueHistory, ...(usageStats?.projections || [])]}>
                     <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.3}/>
                           <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" />
                     <XAxis dataKey="date" tick={{fill: 'var(--text-tertiary)', fontSize: 10}} axisLine={false} tickLine={false} />
                     <YAxis tick={{fill: 'var(--text-tertiary)', fontSize: 10}} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
                     <Tooltip content={<CustomTooltip type="currency" />} />
                     <Area type="monotone" dataKey="revenue" stroke="var(--accent-primary)" fillOpacity={1} fill="url(#colorRev)" strokeWidth={3} />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Distribution Lab */}
         <div className="card" style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
               <PieIcon size={18} color="var(--accent-secondary)" />
               <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Monetization Pillars</h3>
            </div>
            
            <div style={{ flex: 1, minHeight: 240, width: '100%' }}>
               <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                     <Pie
                        data={[
                           { name: 'AdSense', value: 4500 },
                           { name: 'Sponsorships', value: 6800 },
                           { name: 'Assets', value: 2400 }
                        ]}
                        innerRadius={60} outerRadius={90} paddingAngle={8} dataKey="value"
                     >
                        {[0,1,2].map((_, i) => (
                           <Cell key={i} fill={['var(--accent-primary)', 'var(--accent-secondary)', 'var(--accent-info)'][i]} />
                        ))}
                     </Pie>
                     <Tooltip content={<CustomTooltip type="currency" />} />
                     <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
               </ResponsiveContainer>
            </div>
         </div>
      </div>

      {/* Intelligence Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 24 }}>
         
         {/* Usage Intel */}
         <div className="card" style={{ padding: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
               <Zap size={18} color="var(--accent-primary)" />
               <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Workspace Velocity</h3>
            </div>
            {!loadingStats && usageStats && (
               <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 20, background: 'var(--bg-secondary)', borderRadius: 20, border: '1px solid var(--border-subtle)' }}>
                     <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--accent-primary)15', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FolderOpen size={24} />
                     </div>
                     <div>
                        <div style={{ fontSize: '1.8rem', fontWeight: 950 }}>{usageStats.totalProjects}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 800, textTransform: 'uppercase' }}>Legacy Projects</div>
                     </div>
                  </div>
                  
                  <div>
                     <div style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: 12 }}>Platform Interaction Frequency</div>
                     {usageStats.topTabs.map(({ tab, count }, i) => (
                        <div key={tab} style={{ marginBottom: 10 }}>
                           <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: 6 }}>
                              <span style={{ fontWeight: 700, textTransform: 'capitalize' }}>{tab}</span>
                              <span style={{ color: 'var(--text-tertiary)' }}>{count} cycles</span>
                           </div>
                           <div style={{ height: 6, background: 'var(--bg-tertiary)', borderRadius: 3, overflow: 'hidden' }}>
                              <motion.div initial={{ width: 0 }} animate={{ width: `${(count / (usageStats.topTabs[0]?.count || 1)) * 100}%` }} style={{ height: '100%', background: 'var(--accent-primary)' }} />
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            )}
         </div>

         {/* Content Coach */}
         <div className="card" style={{ padding: 32, background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--accent-primary)05 100%)', border: '1px solid var(--accent-primary)30' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Brain size={20} color="var(--accent-primary)" />
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Content Coach AI</h3>
               </div>
               {coachFeedback && <div style={{ fontSize: '1.2rem', fontWeight: 950, color: 'var(--accent-primary)' }}>{coachFeedback.coachScore}%</div>}
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
               {coachFeedback?.quickWins.map((win, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, padding: 16, background: 'var(--bg-secondary)', borderRadius: 16, border: '1px solid var(--border-subtle)' }}>
                     <Sparkles size={16} color="var(--accent-primary)" style={{ flexShrink: 0, marginTop: 2 }} />
                     <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>{win}</p>
                  </div>
               ))}
               <div style={{ height: 1, background: 'var(--border-subtle)', margin: '8px 0' }} />
               <div style={{ padding: 16, background: 'var(--accent-danger)05', borderRadius: 16, border: '1px solid var(--accent-danger)20' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, color: 'var(--accent-danger)' }}>
                     <AlertCircle size={14} />
                     <span style={{ fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase' }}>Burnout Risk Detected</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>High output detected this week. Schedule a creative breather.</p>
               </div>
            </div>
         </div>
      </div>

      {/* Content Performance Table */}
      <div className="card" style={{ padding: 32 }}>
         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
               <Target size={18} color="var(--accent-primary)" />
               <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Audience Resonance Table</h3>
            </div>
            <button className="btn-secondary" style={{ padding: '8px 16px' }}>Filter by Platform</button>
         </div>
         <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
               <thead>
                  <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border-subtle)' }}>
                     <th style={{ padding: '16px 12px', color: 'var(--text-tertiary)', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.65rem' }}>Asset Title</th>
                     <th style={{ padding: '16px 12px', color: 'var(--text-tertiary)', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.65rem' }}>Platform</th>
                     <th style={{ padding: '16px 12px', color: 'var(--text-tertiary)', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.65rem' }}>Type</th>
                     <th style={{ padding: '16px 12px', color: 'var(--text-tertiary)', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.65rem', textAlign: 'right' }}>Views</th>
                     <th style={{ padding: '16px 12px', color: 'var(--text-tertiary)', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.65rem', textAlign: 'right' }}>ROI Yield</th>
                  </tr>
               </thead>
               <tbody>
                  {data.contentPerformance.map((item, i) => (
                     <tr key={i} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: '16px 12px', fontWeight: 700 }}>{item.title}</td>
                        <td style={{ padding: '16px 12px' }}>
                           <span className="badge badge-primary" style={{ fontSize: '0.6rem' }}>{item.platform}</span>
                        </td>
                        <td style={{ padding: '16px 12px', color: 'var(--text-tertiary)' }}>{item.type}</td>
                        <td style={{ padding: '16px 12px', textAlign: 'right', fontWeight: 700 }}>{formatNumber(item.views)}</td>
                        <td style={{ padding: '16px 12px', textAlign: 'right', fontWeight: 950, color: 'var(--accent-success)' }}>{formatCurrency(item.revenue)}</td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}

function KPICard({ title, value, trend, icon: Icon, color }) {
  const isPositive = trend >= 0;
  return (
    <motion.div whileHover={{ y: -5 }} className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}15`, color: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={22} />
        </div>
        <div style={{ 
          display: 'flex', alignItems: 'center', gap: 4, padding: '4px 8px', borderRadius: 20,
          background: isPositive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          color: isPositive ? 'var(--accent-success)' : 'var(--accent-danger)',
          fontSize: '0.7rem', fontWeight: 900
        }}>
          {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {Math.abs(trend)}%
        </div>
      </div>
      <div>
         <div style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: 4 }}>{title}</div>
         <div style={{ fontSize: '1.8rem', fontWeight: 950, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>{value}</div>
      </div>
    </motion.div>
  );
}

function CustomTooltip({ active, payload, label, type }) {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', padding: 16, borderRadius: 16, boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
        <p style={{ margin: 0, fontWeight: 800, color: 'var(--text-primary)', fontSize: '0.85rem', marginBottom: 8 }}>{label || payload[0].name}</p>
        <p style={{ margin: 0, color: 'var(--accent-primary)', fontSize: '1.1rem', fontWeight: 950 }}>
          {type === 'currency' ? '$' : ''}{payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
}
