import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, Target, Rocket, Lightbulb, ArrowUpRight, 
  Layers, ListChecks, Calendar, DollarSign, Wand2, 
  RefreshCw, CheckCircle2, ChevronRight, Zap, Sparkles,
  Search, Info, CreditCard
} from 'lucide-react';
import { useCreator } from '../context/CreatorContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { generateProductStrategy } from '../engine/aiService.js';

export default function ProductTab() {
  const { data, setData, topic } = useCreator();
  const { addToast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const p = data?.product;

  const fetchProductStrategy = async () => {
    if (!topic) {
      addToast('error', 'Start a project first!');
      return;
    }
    setLoading(true);
    try {
      const result = await generateProductStrategy(topic, data?.strategy);
      setData(prev => ({ ...prev, product: result }));
      addToast('success', 'Monetization architecture synthesized');
    } catch (err) {
      addToast('error', 'Strategy failed');
    } finally {
      setLoading(false);
    }
  };

  if (!p) return (
    <div className="tab-content center-content" style={{ minHeight: '60vh' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass glass-hover" style={{ maxWidth: 540, padding: 48, textAlign: 'center', borderRadius: 32 }}>
        <div className="glow-border" style={{ width: 80, height: 80, borderRadius: 24, background: 'var(--bg-tertiary)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <ShoppingBag size={40} />
        </div>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: 16 }}>Economic Architecture</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6, marginBottom: 32 }}>Engineer your backend ecosystem. Generate digital products, service offerings, and high-convert funnels aligned with your audience DNA.</p>
        <button onClick={fetchProductStrategy} className="btn-primary" style={{ padding: '16px 32px' }}>
          <Sparkles size={18} /> Initialize Product Strategy
        </button>
      </motion.div>
    </div>
  );

  return (
    <div className="tab-content animate-slide-up">
      <div className="tab-header" style={{ marginBottom: 40 }}>
        <div className="stagger-children">
          <h2 className="tab-title text-gradient-aurora" style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.04em' }}>Product Ecosystem</h2>
          <p className="tab-subtitle" style={{ fontSize: '1.1rem' }}>Backend monetization architecture & high-fidelity funnel mapping</p>
        </div>
        <button onClick={fetchProductStrategy} className="btn-secondary" style={{ padding: '12px 20px' }}>
          {loading ? <RefreshCw className="animate-spin" size={18} /> : <RefreshCw size={18} />}
        </button>
      </div>

      <div className="stagger-children" style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        
        {/* Flagship Product */}
        <motion.div 
           whileHover={{ y: -6 }}
           className="glass" 
           style={{ 
             padding: 64, borderRadius: 32, background: 'var(--gradient-primary)', color: '#fff', border: 'none', position: 'relative', overflow: 'hidden'
           }}
        >
           <div style={{ position: 'absolute', right: -40, top: -40, opacity: 0.1, transform: 'rotate(15deg)' }}>
              <Rocket size={320} />
           </div>

           <div style={{ position: 'relative', zIndex: 1, maxWidth: 800 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
                 <div style={{ width: 44, height: 44, background: 'rgba(255,255,255,0.2)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Target size={24} />
                 </div>
                 <span style={{ fontSize: '0.85rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em' }}>Flagship Offering</span>
              </div>
              <h3 style={{ fontSize: '2.8rem', fontWeight: 950, marginBottom: 16, lineHeight: 1.1, letterSpacing: '-0.03em' }}>{p.flagship.name}</h3>
              <p style={{ fontSize: '1.2rem', opacity: 0.9, lineHeight: 1.6, marginBottom: 40 }}>{p.flagship.concept}</p>
              
              <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                 <div className="glass" style={{ background: 'rgba(255,255,255,0.1)', padding: '16px 32px', borderRadius: 16 }}>
                    <div style={{ fontSize: '0.65rem', fontWeight: 900, opacity: 0.6, textTransform: 'uppercase', marginBottom: 4 }}>Price Tier</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 950 }}>{p.flagship.price}</div>
                 </div>
                 <div className="glass" style={{ background: 'rgba(255,255,255,0.1)', padding: '16px 32px', borderRadius: 16 }}>
                    <div style={{ fontSize: '0.65rem', fontWeight: 900, opacity: 0.6, textTransform: 'uppercase', marginBottom: 4 }}>Impact Projection</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 950 }}>High ROI</div>
                 </div>
              </div>
           </div>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 28 }}>
           {/* Digital Assets */}
           <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass" style={{ padding: 40, borderRadius: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 32 }}>
                 <div className="glow-border" style={{ width: 48, height: 48, borderRadius: 14, background: 'var(--bg-tertiary)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ListChecks size={24} />
                 </div>
                 <h3 style={{ fontSize: '1.3rem', fontWeight: 900 }}>Low-Ticket Assets</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                 {p.digitalAssets.map((asset, i) => (
                    <div key={i} className="glass glass-hover" style={{ padding: 24, borderRadius: 20 }}>
                       <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                          <h4 style={{ fontWeight: 800, fontSize: '1.1rem' }}>{asset.name}</h4>
                          <span style={{ color: 'var(--accent-success)', fontWeight: 900 }}>{asset.price}</span>
                       </div>
                       <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>{asset.vibe}</p>
                    </div>
                 ))}
              </div>
           </motion.div>

           {/* Funnel Map */}
           <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass" style={{ padding: 40, borderRadius: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 32 }}>
                 <div className="glow-border" style={{ width: 48, height: 48, borderRadius: 14, background: 'var(--bg-tertiary)', color: 'var(--accent-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Layers size={24} />
                 </div>
                 <h3 style={{ fontSize: '1.3rem', fontWeight: 900 }}>Ascension Funnel</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                 {p.funnel.map((step, i) => (
                    <div key={i} style={{ position: 'relative' }}>
                       <div className="glass glass-hover" style={{ padding: 20, borderRadius: 16, borderLeft: '4px solid var(--accent-primary)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                             <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--bg-tertiary)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 900 }}>{i + 1}</div>
                             <p style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>{step}</p>
                          </div>
                       </div>
                       {i < p.funnel.length - 1 && (
                          <div style={{ display: 'flex', justifyContent: 'center', margin: '4px 0' }}>
                             <ChevronRight size={16} style={{ transform: 'rotate(90deg)', opacity: 0.3 }} />
                          </div>
                       )}
                    </div>
                 ))}
              </div>
           </motion.div>
        </div>

        {/* Integration Hub */}
        <div className="glass" style={{ padding: 40, borderRadius: 32 }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 32 }}>
              <div className="glow-border" style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--bg-tertiary)', color: 'var(--accent-warning)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <CreditCard size={20} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 900 }}>Economic Integration</h3>
           </div>
           <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <div className="glass glass-hover" style={{ padding: '16px 28px', borderRadius: 14, display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                 <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--accent-success)' }} />
                 <span style={{ fontWeight: 800 }}>Stripe Connect</span>
              </div>
              <div className="glass glass-hover" style={{ padding: '16px 28px', borderRadius: 14, display: 'flex', alignItems: 'center', gap: 10, opacity: 0.5 }}>
                 <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--text-tertiary)' }} />
                 <span style={{ fontWeight: 800 }}>LemonSqueezy</span>
              </div>
              <div className="glass glass-hover" style={{ padding: '16px 28px', borderRadius: 14, display: 'flex', alignItems: 'center', gap: 10, opacity: 0.5 }}>
                 <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--text-tertiary)' }} />
                 <span style={{ fontWeight: 800 }}>Shopify Sync</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
