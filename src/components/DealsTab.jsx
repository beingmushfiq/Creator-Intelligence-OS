import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Handshake, Search, Mail, DollarSign, 
  Calculator, Send, Copy, Building2, 
  TrendingUp, CheckCircle2, Loader2, 
  ChevronRight, RefreshCw, Zap, Star, ShieldCheck,
  Globe, MessageSquare
} from 'lucide-react';
import { useCreator } from '../context/CreatorContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { 
  scoutBrandLeads, 
  getNegotiationAdvice,
  generateMonetizationEstimate 
} from '../engine/aiService.js';

const STATUS_CONFIG = [
  { id: 'lead', label: 'Potential Lead', color: 'var(--text-tertiary)' },
  { id: 'contacted', label: 'Contacted', color: 'var(--accent-primary)' },
  { id: 'negotiating', label: 'Negotiating', color: 'var(--accent-warning)' },
  { id: 'closed', label: 'Closed/Won', color: 'var(--accent-success)' }
];

export default function DealsTab() {
  const { topic, data, setData } = useCreator();
  const { addToast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [adviceLoading, setAdviceLoading] = useState(false);
  const [selectedBrandId, setSelectedBrandId] = useState(null);

  const leads = data?.deals?.leads || [];
  const estimate = data?.deals?.estimate || null;

  const handleScoutLeads = async () => {
    if (!topic) {
      addToast('error', 'Start a project first!');
      return;
    }
    setLoading(true);
    try {
      const result = await scoutBrandLeads(topic, data?.strategy);
      setData(prev => ({
        ...prev,
        deals: { ...prev.deals, leads: result.leads }
      }));
      addToast('success', 'Found 5 high-alignment brand leads');
    } catch (err) {
      addToast('error', 'Scouting failed');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = (brandId, newStatus) => {
    setData(prev => ({
      ...prev,
      deals: {
        ...prev.deals,
        leads: prev.deals.leads.map(l => l.id === brandId ? { ...l, status: newStatus } : l)
      }
    }));
    addToast('success', `Lead status updated to ${newStatus}`);
  };

  const handleGetNegotiationAdvice = async (brand) => {
    setAdviceLoading(true);
    setSelectedBrandId(brand.id);
    try {
      const advice = await getNegotiationAdvice(brand, data?.strategy);
      setData(prev => ({
        ...prev,
        deals: { ...prev.deals, negotiationAdvice: advice }
      }));
    } catch (err) {
      addToast('error', 'Advice failed');
    } finally {
      setAdviceLoading(false);
    }
  };

  if (leads.length === 0) return (
    <div className="tab-content center-content" style={{ minHeight: '60vh' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass glass-hover" style={{ maxWidth: 540, padding: 48, textAlign: 'center', borderRadius: 32 }}>
        <div className="glow-border" style={{ width: 80, height: 80, borderRadius: 24, background: 'var(--bg-tertiary)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <Handshake size={40} />
        </div>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: 16 }}>Sponsorship Intelligence</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6, marginBottom: 32 }}>AI scouting for high-alignment brand partners. Analyze deal sizes, generate outreach copy, and receive expert negotiation advice.</p>
        <button onClick={handleScoutLeads} className="btn-primary" style={{ padding: '16px 32px' }}>
          <Search size={18} /> Scout Brand Leads
        </button>
      </motion.div>
    </div>
  );

  return (
    <div className="tab-content animate-slide-up">
      <div className="tab-header" style={{ marginBottom: 40 }}>
        <div className="stagger-children">
          <h2 className="tab-title text-gradient-aurora" style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.04em' }}>Deal Station</h2>
          <p className="tab-subtitle" style={{ fontSize: '1.1rem' }}>Brand outreach automation & high-stakes negotiation intelligence</p>
        </div>
        <button onClick={handleScoutLeads} className="btn-secondary" style={{ padding: '12px 20px' }}>
           {loading ? <RefreshCw className="animate-spin" size={18} /> : <RefreshCw size={18} />}
        </button>
      </div>

      <div className="stagger-children" style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 28, alignItems: 'start' }}>
        
        {/* Leads Vault */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
           {leads.map((brand, i) => (
              <motion.div 
                 key={brand.id || i}
                 whileHover={{ y: -4 }}
                 className="glass glass-hover"
                 style={{ padding: 40, borderRadius: 32, position: 'relative' }}
              >
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                       <div className="glow-border" style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--bg-tertiary)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Building2 size={22} />
                       </div>
                       <div>
                          <h3 style={{ fontSize: '1.3rem', fontWeight: 900, margin: 0 }}>{brand.brandName}</h3>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                             <Globe size={12} color="var(--text-tertiary)" />
                             <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>{brand.alignmentScore}% Strategic Alignment</span>
                          </div>
                       </div>
                    </div>
                    <select 
                       value={brand.status || 'lead'} 
                       onChange={(e) => handleUpdateStatus(brand.id, e.target.value)}
                       className="glass"
                       style={{ 
                          padding: '8px 16px', borderRadius: 100, fontSize: '0.75rem', fontWeight: 800,
                          background: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: 'none'
                       }}
                    >
                       {STATUS_CONFIG.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                    </select>
                 </div>

                 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 32, marginBottom: 32 }}>
                    <div>
                       <div style={{ fontSize: '0.65rem', fontWeight: 900, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: 12, letterSpacing: '0.1em' }}>Strategic Rationale</div>
                       <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>{brand.rationale}</p>
                    </div>
                    <div>
                       <div style={{ fontSize: '0.65rem', fontWeight: 900, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: 12, letterSpacing: '0.1em' }}>Target Product</div>
                       <div className="glass" style={{ padding: '16px 20px', borderRadius: 16 }}>
                          <p style={{ fontSize: '1rem', fontWeight: 800, margin: 0, color: 'var(--accent-primary)' }}>{brand.offeringSuggested}</p>
                       </div>
                    </div>
                 </div>

                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: 12 }}>
                       <button onClick={() => handleGetNegotiationAdvice(brand)} className="btn-secondary" style={{ padding: '10px 20px' }}>
                          {adviceLoading && selectedBrandId === brand.id ? <RefreshCw className="animate-spin" size={16} /> : <Zap size={16} />}
                          <span>Negotiation AI</span>
                       </button>
                       <button className="btn-secondary" style={{ padding: '10px 20px' }}>
                          <Mail size={16} />
                          <span>Outreach Copy</span>
                       </button>
                    </div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 950, color: 'var(--accent-success)' }}>
                       {brand.estimatedDealValue || '$0'}
                    </div>
                 </div>

                 {/* Negotiation Advice Inline Expansion */}
                 <AnimatePresence>
                    {data?.deals?.negotiationAdvice && selectedBrandId === brand.id && (
                       <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
                          <div className="glass" style={{ marginTop: 28, padding: 32, borderRadius: 24, borderLeft: '4px solid var(--accent-warning)', background: 'rgba(255,165,0,0.02)' }}>
                             <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                                <MessageSquare size={18} color="var(--accent-warning)" />
                                <h4 style={{ fontSize: '1rem', fontWeight: 900, margin: 0 }}>AI Negotiation Strategy</h4>
                             </div>
                             <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>{data.deals.negotiationAdvice}</p>
                          </div>
                       </motion.div>
                    )}
                 </AnimatePresence>
              </motion.div>
           ))}
        </div>

        {/* Intelligence Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
           <div className="glass" style={{ padding: 32, borderRadius: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
                 <div className="glow-border" style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--bg-tertiary)', color: 'var(--accent-success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <DollarSign size={22} />
                 </div>
                 <h3 style={{ fontSize: '1.1rem', fontWeight: 900 }}>Rev Revenue Map</h3>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                 <div className="glass" style={{ padding: 24, borderRadius: 20, textAlign: 'center' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: 8 }}>Scouted Pipeline</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 950, color: 'var(--accent-success)' }}>$24,500</div>
                 </div>
                 
                 <div style={{ padding: 24, borderRadius: 20, background: 'var(--gradient-primary)10', border: '1px solid var(--accent-primary)20' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                       <Target size={16} color="var(--accent-primary)" />
                       <span style={{ fontSize: '0.8rem', fontWeight: 900, color: 'var(--accent-primary)' }}>Optimal Deal Pace</span>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
                       Closing 1.2 deals per month at this price point will maintain production sustainability.
                    </p>
                 </div>
              </div>
           </div>

           <div className="glass glass-hover" style={{ padding: 32, borderRadius: 28, background: 'var(--gradient-primary)', color: '#fff', border: 'none' }}>
              <Star size={40} style={{ marginBottom: 16, opacity: 0.8 }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: 12 }}>Media Kit Sync</h3>
              <p style={{ fontSize: '0.85rem', opacity: 0.9, marginBottom: 24, lineHeight: 1.6 }}>Generate a custom high-fidelity media kit for this specific project trajectory.</p>
              <button style={{ width: '100%', padding: '14px', borderRadius: 12, border: 'none', background: '#fff', color: 'var(--accent-primary)', fontWeight: 900, cursor: 'pointer' }}>
                 Export Media Kit
              </button>
           </div>
        </div>

      </div>
    </div>
  );
}
