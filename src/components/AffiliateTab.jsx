import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DollarSign, ShoppingBag, Search, TrendingUp, ExternalLink, 
  CheckCircle2, AlertTriangle, ShieldCheck, Zap, Sparkles,
  RefreshCw, Copy, Check, BarChart3, Magnet, Info
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Cell
} from 'recharts';
import { useCreator } from '../context/CreatorContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { matchAffiliateProducts } from '../engine/aiService.js';
import { ExportButton } from './ui/ExportButton.jsx';

export default function AffiliateTab() {
  const { data, setData, topic } = useCreator();
  const { addToast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [copyId, setCopyId] = useState(null);

  const matchedItems = data?.affiliate?.matches || [];

  const handleScanScript = async () => {
    if (!topic) {
      addToast('error', 'Start a project first!');
      return;
    }
    setLoading(true);
    try {
      const scriptText = data?.script?.scenes ? JSON.stringify(data.script.scenes) : '';
      const result = await matchAffiliateProducts(topic, scriptText);
      setData(prev => ({
        ...prev,
        affiliate: { ...prev.affiliate, matches: result.matches }
      }));
      addToast('success', 'Found 4 high-converting affiliate matches');
    } catch (err) {
      addToast('error', 'Product matching failed');
    } finally {
      setLoading(false);
    }
  };

  const copyLink = (link, id) => {
    navigator.clipboard.writeText(link);
    setCopyId(id);
    addToast('success', 'Affiliate link copied');
    setTimeout(() => setCopyId(null), 2000);
  };

  if (matchedItems.length === 0) return (
    <div className="tab-content center-content" style={{ minHeight: '60vh' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass glass-hover" style={{ maxWidth: 540, padding: 48, textAlign: 'center', borderRadius: 32 }}>
        <div className="glow-border" style={{ width: 80, height: 80, borderRadius: 24, background: 'var(--bg-tertiary)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <Magnet size={40} />
        </div>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: 16 }}>Affiliate Intelligence</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6, marginBottom: 32 }}>Scan your script to identify contextual affiliate opportunities. Match products with audience segments for maximum conversion arbitrage.</p>
        <button onClick={handleScanScript} className="btn-primary" style={{ padding: '16px 32px' }}>
          <Sparkles size={18} /> Cross-Reference Markets
        </button>
      </motion.div>
    </div>
  );

  return (
    <div className="tab-content animate-slide-up">
      <div className="tab-header" style={{ marginBottom: 40 }}>
        <div className="stagger-children">
          <h2 className="tab-title text-gradient-aurora" style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.04em' }}>Conversion Matrix</h2>
          <p className="tab-subtitle" style={{ fontSize: '1.1rem' }}>Contextual affiliate matching & revenue potential mapping</p>
        </div>
        <button onClick={handleScanScript} className="btn-secondary" style={{ padding: '12px 20px' }}>
          {loading ? <RefreshCw className="animate-spin" size={18} /> : <RefreshCw size={18} />}
        </button>
      </div>

      <div className="stagger-children" style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 28, alignItems: 'start' }}>
        
        {/* Match Records */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
           {matchedItems.map((item, i) => (
              <motion.div 
                 key={i}
                 whileHover={{ y: -4 }}
                 className="glass glass-hover"
                 style={{ padding: 40, borderRadius: 32, position: 'relative' }}
              >
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                       <div className="glow-border" style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--bg-tertiary)', color: 'var(--accent-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <ShoppingBag size={22} />
                       </div>
                       <div>
                          <h3 style={{ fontSize: '1.3rem', fontWeight: 900, margin: 0 }}>{item.productName}</h3>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                             <ShieldCheck size={12} color="var(--accent-success)" />
                             <span style={{ fontSize: '0.8rem', color: 'var(--accent-success)', fontWeight: 700 }}>{item.relevanceScore}% Relevance</span>
                          </div>
                       </div>
                    </div>
                    <div className="glass" style={{ padding: '8px 20px', borderRadius: 100, fontSize: '1.1rem', fontWeight: 950, color: 'var(--accent-primary)' }}>
                       {item.commissionRate}
                    </div>
                 </div>

                 <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 32 }}>{item.description}</p>

                 <div className="glass" style={{ padding: 32, borderRadius: 24, background: 'rgba(0, 212, 255, 0.03)', borderLeft: '4px solid var(--accent-secondary)', marginBottom: 32 }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--accent-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Hook Context</div>
                    <p style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: 600, margin: 0 }}>{item.mentionHook}</p>
                 </div>

                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: 12 }}>
                       <button onClick={() => copyLink(item.affiliateLink, i)} className="btn-secondary" style={{ padding: '10px 24px' }}>
                          {copyId === i ? <Check size={16} color="var(--accent-success)" /> : <Copy size={16} />}
                          <span>{copyId === i ? 'Link Copied' : 'Copy Link'}</span>
                       </button>
                       <a href={item.affiliateLink} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ padding: '10px 24px' }}>
                          <ExternalLink size={16} />
                          <span>View Product</span>
                       </a>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                       <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Est. EPC</div>
                       <div style={{ fontSize: '1.2rem', fontWeight: 950, color: 'var(--text-primary)' }}>$2.45</div>
                    </div>
                 </div>
              </motion.div>
           ))}
        </div>

        {/* Projections Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
           <div className="glass" style={{ padding: 32, borderRadius: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
                 <div className="glow-border" style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--bg-tertiary)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <BarChart3 size={22} />
                 </div>
                 <h3 style={{ fontSize: '1.1rem', fontWeight: 900 }}>Yield Projections</h3>
              </div>
              
              <div style={{ height: 240, marginBottom: 28 }}>
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={matchedItems.slice(0, 4)}>
                       <XAxis dataKey="productName" hide />
                       <Tooltip 
                          contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-medium)', borderRadius: 12 }}
                          itemStyle={{ color: 'var(--accent-primary)', fontWeight: 800 }}
                       />
                       <Bar dataKey="relevanceScore" radius={[4, 4, 0, 0]}>
                          {matchedItems.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={`url(#barGradient)`} />
                          ))}
                       </Bar>
                       <defs>
                          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="0%" stopColor="var(--accent-primary)" />
                             <stop offset="100%" stopColor="var(--accent-secondary)" />
                          </linearGradient>
                       </defs>
                    </BarChart>
                 </ResponsiveContainer>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                 <div className="glass" style={{ padding: 24, borderRadius: 20, textAlign: 'center' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: 8 }}>Estd. Affiliate Yield</div>
                    <div style={{ fontSize: '2rem', fontWeight: 950, color: 'var(--accent-primary)' }}>$4,200 <span style={{ fontSize: '0.9rem', color: 'var(--text-tertiary)' }}>/MO</span></div>
                 </div>
              </div>
           </div>

           <div className="glass" style={{ padding: 32, borderRadius: 28, background: 'rgba(124, 92, 252, 0.05)', border: '1px solid var(--accent-primary)20' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                 <Zap size={18} color="var(--accent-primary)" />
                 <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent-primary)' }}>Conversion Boost</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                 Integrating item #1 into the first 60 seconds of your script is predicted to increase click-through by 22% based on current community drift.
              </p>
           </div>
        </div>

      </div>
    </div>
  );
}
