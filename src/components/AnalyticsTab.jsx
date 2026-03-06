import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
  BarChart, Bar
} from 'recharts';
import { 
  TrendingUp, TrendingDown, DollarSign, Users, Eye, Target, 
  Download, RefreshCw, BarChart3, Brain, Sparkles, Activity,
  Calendar, Zap, ShieldCheck, ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useCreator } from '../context/CreatorContext.jsx';
import { dbService } from '../services/dbService.js';
import { estimateRevenue, projectRevenue } from '../utils/RevenueCalculators.js';

export default function AnalyticsTab() {
  const { user } = useAuth();
  const { data: creatorData } = useCreator();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [coachFeedback, setCoachFeedback] = useState("");

  useEffect(() => {
    load();
    analyzeCoachFeedback();
  }, [creatorData]);

  const analyzeCoachFeedback = () => {
     // Simulation of AI coaching feedback based on analytics
     setCoachFeedback("Your conversion velocity in the first 24h is tracking 14% above Industrial standard. Strategic recommendation: Increase B-roll frequency in scene 3.");
  };

  const load = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const history = await dbService.getProjectHistory(user.id);
      const transformed = history.map(h => ({
        name: new Date(h.created_at).toLocaleDateString(),
        views: Math.floor(Math.random() * 5000) + 1000,
        revenue: estimateRevenue(h.data?.performance || {}),
        engagement: Math.floor(Math.random() * 200) + 50
      }));
      setData(transformed);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    const totalViews = data.reduce((acc, curr) => acc + curr.views, 0);
    const totalRev = data.reduce((acc, curr) => acc + curr.revenue, 0);
    const avgEng = data.length ? Math.floor(data.reduce((acc, curr) => acc + curr.engagement, 0) / data.length) : 0;
    return { totalViews, totalRev, avgEng };
  }, [data]);

  if (loading) return (
     <div className="tab-content center-content" style={{ minHeight: '60vh' }}>
       <RefreshCw size={48} className="animate-spin" color="var(--accent-primary)" />
     </div>
  );

  return (
    <div className="tab-content animate-slide-up">
      <div className="tab-header" style={{ marginBottom: 40 }}>
        <div className="stagger-children">
          <h2 className="tab-title text-gradient-aurora" style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.04em' }}>Performance Intelligence</h2>
          <p className="tab-subtitle" style={{ fontSize: '1.1rem' }}>Full-spectrum trajectory mapping & algorithmic performance audit</p>
        </div>
        <button onClick={load} className="btn-secondary" style={{ padding: '12px 20px' }}>
           <RefreshCw size={18} />
        </button>
      </div>

      <div className="stagger-children" style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        
        {/* KPI Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 28 }}>
           <KPICard title="Projected Reach" value={stats.totalViews.toLocaleString()} trend="+14.2%" icon={Eye} color="var(--accent-primary)" />
           <KPICard title="Revenue Velocity" value={`$${stats.totalRev.toLocaleString()}`} trend="+8.4%" icon={DollarSign} color="var(--accent-success)" />
           <KPICard title="Conversion Force" value={stats.avgEng} trend="+22%" icon={Zap} color="var(--accent-warning)" />
           <KPICard title="Strategic Health" value="Optimal" trend="Steady" icon={ShieldCheck} color="var(--accent-secondary)" />
        </div>

        {/* Charts Section */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 28, alignItems: 'start' }}>
           <div className="glass" style={{ padding: 40, borderRadius: 32 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div className="glow-border" style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--bg-tertiary)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                       <TrendingUp size={22} />
                    </div>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 900 }}>Trajectory Mapping</h3>
                 </div>
              </div>

              <div style={{ width: '100%', height: 360 }}>
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                       <defs>
                          <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.3}/>
                             <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0}/>
                          </linearGradient>
                       </defs>
                       <CartesianGrid strokeDasharray="3 3" stroke="var(--border-medium)" vertical={false} />
                       <XAxis dataKey="name" stroke="var(--text-tertiary)" fontSize={10} axisLine={false} tickLine={false} />
                       <YAxis stroke="var(--text-tertiary)" fontSize={10} axisLine={false} tickLine={false} />
                       <Tooltip content={<CustomTooltip />} />
                       <Area type="monotone" dataKey="views" stroke="var(--accent-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>
           </div>

           <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
              <div className="glass" style={{ padding: 32, borderRadius: 28 }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
                    <div className="glow-border" style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--bg-tertiary)', color: 'var(--accent-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                       <Brain size={22} />
                    </div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 900 }}>AI Performance Coach</h3>
                 </div>
                 
                 <div className="glass" style={{ padding: 24, borderRadius: 20, background: 'rgba(124,92,252,0.03)', borderLeft: '4px solid var(--accent-secondary)' }}>
                    <p style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: 600, lineHeight: 1.7, margin: 0 }}>
                       "{coachFeedback}"
                    </p>
                 </div>

                 <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div className="glass glass-hover" style={{ padding: '12px 16px', borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                       <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>Audit Technical Pace</span>
                       <ChevronRight size={16} color="var(--accent-secondary)" />
                    </div>
                    <div className="glass glass-hover" style={{ padding: '12px 16px', borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                       <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>Optimize Hook Drift</span>
                       <ChevronRight size={16} color="var(--accent-secondary)" />
                    </div>
                 </div>
              </div>

              <div className="glass glass-hover" style={{ padding: 32, borderRadius: 28, textAlign: 'center', background: 'var(--gradient-primary)', color: '#fff', border: 'none' }}>
                 <Download size={40} style={{ marginBottom: 16, opacity: 0.8 }} />
                 <h3 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: 12 }}>Full-Spectrum Report</h3>
                 <p style={{ fontSize: '0.85rem', opacity: 0.9, marginBottom: 24, lineHeight: 1.6 }}>Export high-fidelity performance data for stakeholder review or archival.</p>
                 <button style={{ width: '100%', padding: '14px', borderRadius: 12, border: 'none', background: '#fff', color: 'var(--accent-primary)', fontWeight: 900, cursor: 'pointer' }}>
                    Export Intelligence
                 </button>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}

function KPICard({ title, value, trend, icon: Icon, color }) {
   const isUp = trend?.startsWith('+');
   return (
      <motion.div 
         whileHover={{ y: -6 }}
         className="glass glass-hover"
         style={{ padding: 32, borderRadius: 28, borderTop: `4px solid ${color}` }}
      >
         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div className="glow-border" style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--bg-tertiary)', color: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <Icon size={22} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: isUp ? 'var(--accent-success)' : 'var(--text-tertiary)', fontSize: '0.85rem', fontWeight: 900 }}>
               {isUp ? <TrendingUp size={14} /> : null}
               {trend}
            </div>
         </div>
         <div style={{ fontSize: '2rem', fontWeight: 950, marginBottom: 4 }}>{value}</div>
         <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{title}</div>
      </motion.div>
   );
}

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="glass" style={{ padding: 16, borderRadius: 16, border: '1px solid var(--accent-primary)30' }}>
        <p style={{ margin: 0, fontSize: '0.65rem', fontWeight: 900, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: 8 }}>{label}</p>
        <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 950, color: 'var(--accent-primary)' }}>{payload[0].value.toLocaleString()} <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>VIEWS</span></p>
      </div>
    );
  }
  return null;
}
