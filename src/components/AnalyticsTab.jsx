import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { ArrowUpRight, ArrowDownRight, DollarSign, Users, Eye, Activity, Download } from 'lucide-react';
import { generateAnalyticsData } from '../utils/analyticsData';
import { ExportButton } from './ui/ExportButton';

export default function AnalyticsTab() {
  const data = useMemo(() => generateAnalyticsData(), []);

  const formatCurrency = (val) => `$${val.toLocaleString()}`;
  const formatNumber = (val) => val.toLocaleString();

  return (
    <div className="analytics-dashboard" style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '4px' }}>Analytics Dashboard</h2>
          <p style={{ color: 'var(--text-tertiary)' }}>Performance overview across all connected platforms</p>
        </div>
        <ExportButton section="analytics" data={data} />
      </div>

      {/* KPI Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
        gap: '16px',
        marginBottom: '32px' 
      }}>
        <KPICard 
          title="Total Revenue" 
          value={formatCurrency(data.kpi.totalRevenue.value)} 
          trend={data.kpi.totalRevenue.trend} 
          icon={DollarSign}
          color="#10B981"
        />
        <KPICard 
          title="Total Views" 
          value={formatNumber(data.kpi.totalViews.value)} 
          trend={data.kpi.totalViews.trend} 
          icon={Eye}
          color="#3B82F6"
        />
        <KPICard 
          title="Subscribers" 
          value={formatNumber(data.kpi.subscribers.value)} 
          trend={data.kpi.subscribers.trend} 
          icon={Users}
          color="#8B5CF6"
        />
        <KPICard 
          title="Engagement Rate" 
          value={`${data.kpi.engagementRate.value}%`} 
          trend={data.kpi.engagementRate.trend} 
          icon={Activity}
          color="#F59E0B"
        />
      </div>

      {/* Charts Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '24px',
        marginBottom: '32px'
      }}>
        
        {/* Revenue Chart */}
        <div className="card" style={{ padding: '24px', height: '400px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ marginBottom: '20px', fontSize: '1.1rem' }}>Revenue Growth (30 Days)</h3>
          <div style={{ flex: 1, minHeight: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.revenueHistory}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" />
                <XAxis 
                  dataKey="date" 
                  tick={{fill: 'var(--text-tertiary)', fontSize: 12}} 
                  axisLine={false} 
                  tickLine={false}
                  minTickGap={30}
                />
                <YAxis 
                  tick={{fill: 'var(--text-tertiary)', fontSize: 12}} 
                  axisLine={false} 
                  tickLine={false}
                  tickFormatter={(val) => `$${val}`}
                />
                <Tooltip content={<CustomTooltip type="currency" />} />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="var(--accent-primary)" 
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Platform Distribution */}
        <div className="card" style={{ padding: '24px', height: '400px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ marginBottom: '20px', fontSize: '1.1rem' }}>Audience Split by Platform</h3>
          <div style={{ flex: 1, minHeight: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.platformData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.platformData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(0,0,0,0.2)" />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Content Table */}
      <div className="card" style={{ padding: '24px' }}>
        <h3 style={{ marginBottom: '20px', fontSize: '1.1rem' }}>Recent Top Content</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', textAlign: 'left' }}>
                <th style={{ padding: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>Title</th>
                <th style={{ padding: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>Platform</th>
                <th style={{ padding: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>Type</th>
                <th style={{ padding: '12px', color: 'var(--text-secondary)', fontWeight: 600, textAlign: 'right' }}>Views</th>
                <th style={{ padding: '12px', color: 'var(--text-secondary)', fontWeight: 600, textAlign: 'right' }}>Est. Revenue</th>
              </tr>
            </thead>
            <tbody>
              {data.contentPerformance.map((item, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '12px', color: 'var(--text-primary)', fontWeight: 500 }}>{item.title}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ 
                      padding: '4px 8px', 
                      borderRadius: '4px', 
                      background: 'var(--bg-tertiary)',
                      color: 'var(--text-secondary)',
                      fontSize: '0.8rem'
                    }}>
                      {item.platform}
                    </span>
                  </td>
                  <td style={{ padding: '12px', color: 'var(--text-tertiary)' }}>{item.type}</td>
                  <td style={{ padding: '12px', textAlign: 'right', fontFamily: 'monospace' }}>{formatNumber(item.views)}</td>
                  <td style={{ padding: '12px', textAlign: 'right', fontFamily: 'monospace', color: 'var(--accent-primary)' }}>
                    {formatCurrency(item.revenue)}
                  </td>
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
    <div className="card" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
        <div style={{ 
          width: '36px', 
          height: '36px', 
          borderRadius: '8px', 
          background: `${color}20`, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          <Icon size={18} color={color} />
        </div>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '4px',
          padding: '4px 8px',
          borderRadius: '12px',
          background: isPositive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          color: isPositive ? '#10B981' : '#EF4444',
          fontSize: '0.75rem',
          fontWeight: 600
        }}>
          {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {Math.abs(trend)}%
        </div>
      </div>
      <div style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem', marginBottom: '4px' }}>{title}</div>
      <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>{value}</div>
    </div>
  );
}

function CustomTooltip({ active, payload, label, type }) {
  if (active && payload && payload.length) {
    return (
      <div style={{ 
        background: 'var(--bg-card)', 
        border: '1px solid var(--border-subtle)', 
        padding: '12px', 
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)' 
      }}>
        <p style={{ margin: 0, fontWeight: 600, color: 'var(--text-primary)' }}>{label || payload[0].name}</p>
        <p style={{ margin: '4px 0 0', color: 'var(--accent-primary)' }}>
          {type === 'currency' ? '$' : ''}{payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
}
