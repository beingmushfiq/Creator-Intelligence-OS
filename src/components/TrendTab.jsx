import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, 
  Tooltip as RechartsTooltip 
} from 'recharts';
import { 
  Eye, TrendingUp, Zap, Target, RefreshCw, 
  Calendar, Sparkles, Activity, Compass,
  ChevronRight, ArrowUpRight, Clock
} from 'lucide-react';
import { useCreator } from '../context/CreatorContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { ExportButton } from './ui/ExportButton.jsx';

export default function TrendTab() {
  const { data, loading, regenerateSection } = useCreator();
  const t = data?.trend || {};

  if (!t || Object.keys(t).length === 0) return <EmptyState />;

  return (
    <div className="tab-content animate-slide-up">
      <div className="tab-header" style={{ marginBottom: 40 }}>
        <div className="stagger-children">
          <h2 className="tab-title text-gradient-aurora" style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.04em' }}>Trend Telemetry</h2>
          <p className="tab-subtitle" style={{ fontSize: '1.1rem' }}>Predictive engagement mapping & market velocity diagnostics</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
           <ExportButton section="trend" data={t} />
           <button onClick={() => regenerateSection('trend')} className="btn-secondary" disabled={loading} style={{ padding: '12px' }}>
              {loading ? <RefreshCw className="animate-spin" size={18} /> : <RefreshCw size={18} />}
           </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 28, marginBottom: 48 }}>
         
         {/* Main Chart Area */}
         <div className="glass" style={{ padding: 40, borderRadius: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div className="glow-border" style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--bg-tertiary)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     <Activity size={22} />
                  </div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 900 }}>Projected Growth Velocity</h3>
               </div>
               <div className="glass" style={{ padding: '6px 14px', borderRadius: 100, fontSize: '0.65rem', fontWeight: 900, color: 'var(--accent-success)', background: 'rgba(34, 197, 94, 0.05)' }}>
                  +24% MOM
               </div>
            </div>

            <div style={{ width: '100%', height: 350, position: 'relative' }}>
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={t.volumeHistory || []}>
                     <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.3}/>
                           <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                     <XAxis dataKey="day" stroke="var(--text-tertiary)" fontSize={10} axisLine={false} tickLine={false} />
                     <YAxis stroke="var(--text-tertiary)" fontSize={10} axisLine={false} tickLine={false} />
                     <RechartsTooltip content={<CustomTooltip />} />
                     <Area type="monotone" dataKey="value" stroke="var(--accent-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* KPI Cluster */}
         <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <KpiItem icon={Eye} label="Estimated Impressions" value="1.2M" color="var(--accent-primary)" />
            <KpiItem icon={Target} label="Conversion Index" value="4.8%" color="var(--accent-secondary)" />
            <KpiItem icon={Zap} label="Peak Velocity" value="84%+" color="var(--accent-warning)" />
            
            <div className="glass glass-hover" style={{ padding: 28, borderRadius: 24, background: 'var(--gradient-primary)05', border: '1px solid var(--accent-primary)20', marginTop: 'auto' }}>
               <h4 style={{ fontSize: '0.9rem', fontWeight: 900, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Compass size={16} /> Market Sentiment
               </h4>
               <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                  Current market trends indicate a high resonance for "How-to" narratives within your niche. Pacing is optimal.
               </p>
            </div>
         </div>
      </div>

      {/* Seasonal Opportunities / Trends */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
         <h3 style={{ fontSize: '1.3rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: 12 }}>
            <TrendingUp size={22} color="var(--accent-success)" /> Narrative Pivot Points
         </h3>
         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
            {t.trends?.map((item, i) => (
               <motion.div key={i} whileHover={{ y: -6 }} className="glass glass-hover" style={{ padding: 28, borderRadius: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                     <div className="glass" style={{ padding: '6px 12px', borderRadius: 8, fontSize: '0.65rem', fontWeight: 950, color: 'var(--accent-primary)' }}>TRENDING</div>
                     <ArrowUpRight size={16} color="var(--text-tertiary)" />
                  </div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 12 }}>{item.title}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>{item.description}</p>
               </motion.div>
            ))}
         </div>
      </div>
    </div>
  );
}

function KpiItem({ icon: Icon, label, value, color }) {
   return (
      <div className="glass glass-hover" style={{ padding: 24, borderRadius: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
         <div className="glow-border" style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--bg-tertiary)', color: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon size={18} />
         </div>
         <div>
            <div style={{ fontSize: '0.65rem', fontWeight: 900, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: 2 }}>{label}</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 950 }}>{value}</div>
         </div>
      </div>
   );
}

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="glass" style={{ padding: '12px 16px', borderRadius: 12, border: '1px solid var(--accent-primary)' }}>
        <p style={{ fontSize: '0.7rem', fontWeight: 900, margin: 0, color: 'var(--text-tertiary)' }}>{`DAY ${label}`}</p>
        <p style={{ fontSize: '1rem', fontWeight: 900, margin: 0, color: 'var(--accent-primary)' }}>{`${payload[0].value.toLocaleString()} UNIT VELOCITY`}</p>
      </div>
    );
  }
  return null;
}

function EmptyState() {
  return (
    <div className="tab-content center-content" style={{ minHeight: '60vh' }}>
      <div className="glass glass-hover" style={{ maxWidth: 480, padding: 48, borderRadius: 32, textAlign: 'center' }}>
        <div className="glow-border" style={{ width: 80, height: 80, borderRadius: 24, background: 'var(--bg-tertiary)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <TrendingUp size={40} />
        </div>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: 16 }}>Trend Telemetry</h3>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>Generate a strategic foundation to synchronize with real-time market velocity and engagement telemetry.</p>
      </div>
    </div>
  );
}
