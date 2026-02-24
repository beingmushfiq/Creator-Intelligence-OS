import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { 
  Eye, TrendingUp, Zap, Target, Loader2, RefreshCw, 
  Calendar, AlertCircle, Sparkles, Map, Activity,
  Info, BarChart3, ChevronRight, Magnet, Compass
} from 'lucide-react';
import { useCreator } from '../context/CreatorContext';
import { useToast } from '../context/ToastContext';
import { getTrendForecast } from '../engine/aiService';

export default function TrendTab() {
  const { data, setData, topic } = useCreator();
  const { addToast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const trend = data?.trends || null;

  const handleForecast = async () => {
    if (!topic || isLoading) return;
    setIsLoading(true);
    try {
      const forecast = await getTrendForecast(topic);
      setData(prev => ({ ...prev, trends: forecast }));
      addToast('success', 'Trend forecast generated!');
    } catch (err) {
      addToast('error', 'Failed to generate forecast.');
    } finally {
      setIsLoading(false);
    }
  };

  const saturationColor = {
    Low: 'var(--accent-success)',
    Medium: 'var(--accent-warning)',
    High: 'var(--accent-danger)'
  };

  if (isLoading) return (
     <div className="tab-content center-content">
        <div style={{ textAlign: 'center' }}>
           <RefreshCw size={48} className="spin" color="var(--accent-primary)" style={{ marginBottom: 24 }} />
           <h3 className="text-gradient" style={{ fontSize: '1.5rem', fontWeight: 800 }}>Simulating Market Drift</h3>
           <p style={{ color: 'var(--text-tertiary)' }}>Calculating interest velocity and competitive saturation...</p>
        </div>
     </div>
  );

  if (!trend) return (
    <div className="tab-content center-content">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="empty-state" 
        style={{ maxWidth: 600 }}
      >
        <div className="empty-state-icon" style={{ background: 'var(--accent-info)15', color: 'var(--accent-info)' }}>
          <Eye size={32} />
        </div>
        <h3>The Trend Radar</h3>
        <p>Go beyond today's headlines. Forecast search velocity, topic saturation, and the 30-day trajectory of your content concept.</p>
        <button onClick={handleForecast} className="shiny-button" style={{ marginTop: 24, padding: '16px 32px' }}>
          <Sparkles size={18} /> Forecast Market Trajectory
        </button>
      </motion.div>
    </div>
  );

  return (
    <div className="tab-content">
      <div className="tab-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20 }}>
        <div>
          <h2 className="tab-title text-gradient">Predictive Intelligence</h2>
          <p className="tab-subtitle">30-day topic trajectory & market gap analysis for {topic}</p>
        </div>
        <button onClick={handleForecast} className="btn-secondary" style={{ padding: '8px 16px' }}>
          <RefreshCw size={18} /> Refresh Radar
        </button>
      </div>

      <div className="stagger-children" style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24, alignItems: 'start' }}>
        
        {/* Main Radar Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
           <motion.div 
             initial={{ opacity: 0, y: 15 }}
             animate={{ opacity: 1, y: 0 }}
             className="card" 
             style={{ padding: 32, background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%)' }}
           >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ padding: 10, borderRadius: 12, background: 'var(--accent-primary)15', color: 'var(--accent-primary)' }}>
                       <Activity size={24} />
                    </div>
                    <div>
                       <h3 style={{ fontSize: '1.2rem', fontWeight: 900 }}>Interest Index Radar</h3>
                       <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>30-day predictive growth model</p>
                    </div>
                 </div>
                 <div className="badge badge-purple" style={{ padding: '6px 16px', fontSize: '0.7rem', fontWeight: 900 }}>PREDICTIVE AI MODEL</div>
              </div>
              
              <div style={{ width: '100%', height: 340 }}>
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trend?.simulation}>
                       <defs>
                          <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.3}/>
                             <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0}/>
                          </linearGradient>
                       </defs>
                       <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                       <XAxis 
                         dataKey="day" 
                         stroke="var(--text-tertiary)" 
                         fontSize={10} 
                         axisLine={false} tickLine={false}
                         tickFormatter={(v) => `D${v}`}
                       />
                       <YAxis stroke="var(--text-tertiary)" fontSize={10} axisLine={false} tickLine={false} />
                       <RechartsTooltip content={<CustomTooltip />} />
                       <Area 
                         type="monotone" 
                         dataKey="value" 
                         stroke="var(--accent-primary)" 
                         strokeWidth={4} 
                         fillOpacity={1} 
                         fill="url(#trendGrad)" 
                       />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>
           </motion.div>

           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
              {/* Golden Windows */}
              <motion.div 
                 initial={{ opacity: 0, x: -20 }}
                 animate={{ opacity: 1, x: 0 }}
                 className="card" 
                 style={{ padding: 32 }}
              >
                 <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                    <div style={{ padding: 8, borderRadius: 10, background: 'var(--bg-tertiary)', color: 'var(--accent-secondary)' }}>
                       <Calendar size={20} />
                    </div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 900 }}>Golden Windows</h3>
                 </div>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {trend?.goldenWindows.map((win, i) => (
                      <div key={i} style={{ padding: 20, background: 'var(--bg-secondary)', borderRadius: 16, borderLeft: '4px solid var(--accent-secondary)' }}>
                         <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent-secondary)', marginBottom: 6 }}>{win.label}</div>
                         <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', margin: 0, lineHeight: 1.5 }}>{win.reason}</p>
                      </div>
                    ))}
                 </div>
              </motion.div>

              {/* Viral Catalysts */}
              <motion.div 
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 className="card" 
                 style={{ padding: 32 }}
              >
                 <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                    <div style={{ padding: 8, borderRadius: 10, background: 'var(--bg-tertiary)', color: 'var(--accent-warning)' }}>
                       <Zap size={20} />
                    </div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 900 }}>Market Catalysts</h3>
                 </div>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {trend?.catalysts.map((cat, i) => (
                      <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                         <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-warning)', marginTop: 8, boxShadow: '0 0 10px var(--accent-warning)40' }} />
                         <div>
                            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)' }}>{cat.title}</div>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginTop: 4, margin: 0 }}>{cat.description}</p>
                         </div>
                      </div>
                    ))}
                 </div>
              </motion.div>
           </div>
        </div>

        {/* Intelligence Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
           <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="card" 
              style={{ padding: 32 }}
           >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                 <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 900 }}>Interest Velocity</h3>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Topic growth speed</p>
                 </div>
                 <div style={{ fontSize: '2.2rem', fontWeight: 950, color: 'var(--accent-primary)', lineHeight: 1 }}>{trend?.velocity}%</div>
              </div>
              <div style={{ height: 10, background: 'var(--bg-tertiary)', borderRadius: 5, overflow: 'hidden', marginBottom: 20 }}>
                 <motion.div initial={{ width: 0 }} animate={{ width: `${trend?.velocity}%` }} style={{ height: '100%', background: 'var(--accent-primary)' }} />
              </div>
              <div style={{ padding: 20, background: 'var(--bg-secondary)', borderRadius: 16, border: '1px solid var(--border-subtle)' }}>
                 <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5, fontStyle: 'italic' }}>
                    "Interest is accelerating faster than **84%** of topics in this niche. Strong signal for early-mover advantage."
                 </p>
              </div>
           </motion.div>

           <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="card" 
              style={{ padding: 32 }}
           >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                 <Target size={20} color={saturationColor[trend?.saturation]} />
                 <h3 style={{ fontSize: '1.1rem', fontWeight: 900 }}>Saturation Map</h3>
              </div>
              <div style={{ 
                background: `${saturationColor[trend?.saturation]}15`, color: saturationColor[trend?.saturation],
                fontSize: '1rem', fontWeight: 950, padding: '12px 24px', borderRadius: 16,
                textAlign: 'center', marginBottom: 20, border: '1px solid'
              }}>
                {trend?.saturation.toUpperCase()} DENSITY
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                 {trend?.saturationReason}
              </p>
           </motion.div>

           <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card" 
              style={{ padding: 32, background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--accent-info)05 100%)', border: '1px solid var(--accent-info)30' }}
           >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                 <Compass size={20} color="var(--accent-info)" />
                 <div style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', color: 'var(--accent-info)', letterSpacing: '0.05em' }}>Market Gap Angle</div>
              </div>
              <div style={{ padding: 24, background: 'var(--bg-primary)80', borderRadius: 20, border: '1px solid var(--border-subtle)', marginBottom: 16 }}>
                 <p style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.5, margin: 0, fontStyle: 'italic' }}>
                    "{trend?.marketGap}"
                 </p>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', margin: 0, lineHeight: 1.5 }}>
                 Covering this angle triggers "Topic Hybridization" bonuses, effectively bypassing saturated competitive pools.
              </p>
           </motion.div>
        </div>

      </div>
    </div>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', padding: 16, borderRadius: 16, boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
        <p style={{ margin: 0, fontWeight: 800, color: 'var(--text-tertiary)', fontSize: '0.65rem', marginBottom: 4, textTransform: 'uppercase' }}>INDEX DAY {label}</p>
        <p style={{ margin: 0, color: 'var(--accent-primary)', fontSize: '1.4rem', fontWeight: 950 }}>{payload[0].value.toFixed(1)}</p>
      </div>
    );
  }
  return null;
}
