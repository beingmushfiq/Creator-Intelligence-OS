import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DollarSign, 
  ShoppingBag, 
  Search, 
  TrendingUp, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Zap, 
  RefreshCw,
  BarChart3,
  Calculator,
  ArrowUpRight,
  Target,
  FileText
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, ResponsiveContainer,
  Cell
} from 'recharts';
import { useCreator } from '../context/CreatorContext';
import { useToast } from '../context/ToastContext';
import { matchAffiliateProducts } from '../engine/aiService';
import { ExportButton } from './ui/ExportButton';

export default function AffiliateTab() {
  const { data, loading, regenerateSection, setData } = useCreator();
  const { addToast } = useToast();
  
  const affiliate = data?.affiliate;
  const script = data?.script;
  const dnaSnippet = data?.genome?.dna_snippet;

  const [isScanning, setIsScanning] = useState(false);
  const [selectedItem, setSelectedItem] = useState(0);

  const handleScanScript = async () => {
    if (!script) {
      addToast('error', 'Please generate a script first');
      return;
    }
    
    setIsScanning(true);
    try {
      const scriptText = script.sections.map(s => s.content).join('\n\n');
      const result = await matchAffiliateProducts(scriptText, dnaSnippet);
      
      setData(prev => ({
        ...prev,
        affiliate: result
      }));
      addToast('success', 'Affiliate scan complete!');
    } catch (err) {
      addToast('error', 'Scan failed');
    } finally {
      setIsScanning(false);
    }
  };

  const revenueData = useMemo(() => {
    if (!affiliate?.items) return [];
    return affiliate.items.map(item => ({
      name: item.name,
      min: item.deals.revenueProjection.lowEstimate,
      max: item.deals.revenueProjection.highEstimate
    }));
  }, [affiliate]);

  if (!affiliate && !loading && !isScanning) {
    return (
      <div className="tab-content center-content">
        <div className="empty-state">
           <div className="empty-state-icon" style={{ background: 'var(--accent-success)20', color: 'var(--accent-success)' }}>
              <ShoppingBag size={32} />
           </div>
           <h3>Automated Affiliate Engine</h3>
           <p>Scan your script for product mentions and match them with high-ROI affiliate programs instantly.</p>
           <button onClick={handleScanScript} className="shiny-button" style={{ marginTop: 24, background: 'var(--accent-success)' }}>
              <Zap size={18} />
              <span>Scan Script for Products</span>
           </button>
        </div>
      </div>
    );
  }

  if (isScanning) {
    return (
      <div className="tab-content center-content">
        <div className="loading-state">
           <RefreshCw size={40} className="spin" color="var(--accent-success)" />
           <h3>Running Product Sleuth...</h3>
           <p>Identifying implicit and explicit monetization opportunities</p>
        </div>
      </div>
    );
  }

  return (
    <div className="tab-content">
      <div className="tab-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 className="tab-title text-gradient">Affiliate Intelligence Dashboard</h2>
          <p className="tab-subtitle">Product matching, revenue estimation, and brand suitability audit</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={handleScanScript} className="btn-secondary">
             <RefreshCw size={14} />
             <span>Re-scan Script</span>
          </button>
          <ExportButton section="affiliate" data={affiliate} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: 24 }}>
        
        {/* Product List Sidebar */}
        <div className="product-sidebar">
           <div className="card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                 <Search size={18} color="var(--accent-primary)" />
                 <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>Detected Opportunities</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                 {affiliate.items.map((item, i) => (
                   <motion.div 
                     key={i}
                     onClick={() => setSelectedItem(i)}
                     whileHover={{ x: 4 }}
                     className={`card product-card ${selectedItem === i ? 'active' : ''}`}
                     style={{ 
                       padding: 12, 
                       cursor: 'pointer',
                       background: selectedItem === i ? 'var(--bg-tertiary)' : 'var(--bg-primary)',
                       border: selectedItem === i ? '1px solid var(--accent-success)' : '1px solid var(--border-subtle)'
                     }}
                   >
                     <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{item.name}</span>
                        <span className={`badge ${item.mentionType === 'Explicit' ? 'badge-blue' : 'badge-dark'}`} style={{ fontSize: '0.6rem' }}>
                           {item.mentionType}
                        </span>
                     </div>
                     <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', fontStyle: 'italic' }}>
                        {item.category}
                     </div>
                   </motion.div>
                 ))}
              </div>
           </div>

           <div className="card" style={{ padding: 20, marginTop: 24, background: 'var(--accent-success)05', border: '1px solid var(--accent-success)20' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                 <TrendingUp size={20} color="var(--accent-success)" />
                 <h3 style={{ fontWeight: 800 }}>Total Revenue Potential</h3>
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--accent-success)' }}>
                 ${affiliate.items.reduce((acc, item) => acc + item.deals.revenueProjection.lowEstimate, 0).toLocaleString()} - ${affiliate.items.reduce((acc, item) => acc + item.deals.revenueProjection.highEstimate, 0).toLocaleString()}
              </div>
              <p style={{ fontSize: '0.75rem', opacity: 0.7, marginTop: 8 }}>
                 Based on average conversion rates (2.4%) and projected views from the Performance tab.
              </p>
           </div>
        </div>

        {/* Main Deal Inspector */}
        <div className="deal-inspector">
           <AnimatePresence mode="wait">
             <motion.div 
               key={selectedItem}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
             >
                <div className="card" style={{ padding: 24, marginBottom: 24 }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                         <div style={{ width: 48, height: 48, background: 'var(--accent-primary)15', color: 'var(--accent-primary)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyCenter: 'center' }}>
                            <ShoppingBag size={24} />
                         </div>
                         <div>
                            <h3 style={{ fontSize: '1.3rem', fontWeight: 900 }}>{affiliate.items[selectedItem].name}</h3>
                            <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>{affiliate.items[selectedItem].monetizationAngle}</span>
                         </div>
                      </div>
                      <div className="suitability-meter">
                         <div style={{ fontSize: '0.65rem', fontWeight: 800, textAlign: 'right', marginBottom: 4, color: 'var(--accent-success)' }}>BRAND FIT</div>
                         <div style={{ display: 'flex', gap: 2 }}>
                            {[1, 2, 3, 4, 5].map(step => (
                              <div key={step} style={{ 
                                width: 12, 
                                height: 6, 
                                borderRadius: 2, 
                                background: step <= (affiliate.items[selectedItem].deals.matches[0].suitabilityScore / 20) ? 'var(--accent-success)' : 'var(--bg-tertiary)' 
                              }} />
                            ))}
                         </div>
                      </div>
                   </div>

                   <div style={{ marginBottom: 24 }}>
                      <label style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: 12, display: 'block' }}>
                         High-Affinity Affiliate Matches
                      </label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
                         {affiliate.items[selectedItem].deals.matches.map((match, i) => (
                           <div key={i} className="card" style={{ padding: 16, background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                                 <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>{match.program}</span>
                                 <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-success)' }}>{match.estimatedCommission} Commission</span>
                              </div>
                              <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 600, marginBottom: 12 }}>
                                 {match.productName}
                              </div>
                              <div style={{ padding: 8, background: 'var(--bg-primary)', borderRadius: 6, fontSize: '0.7rem', fontStyle: 'italic', marginBottom: 16 }}>
                                 "{match.ctaSuggestion}"
                              </div>
                              <button className="btn-ghost-sm" style={{ width: '100%', borderColor: 'var(--accent-primary)', color: 'var(--accent-primary)' }}>
                                 <ExternalLink size={12} /> Generate Link
                              </button>
                           </div>
                         ))}
                      </div>
                   </div>

                   <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                      <div className="card" style={{ padding: 16, background: 'var(--bg-primary)' }}>
                         <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                            <Calculator size={16} color="var(--accent-primary)" />
                            <span style={{ fontSize: '0.8rem', fontWeight: 800 }}>ROI Estimation</span>
                         </div>
                         <div style={{ height: 160 }}>
                            <ResponsiveContainer width="100%" height="100%">
                               <BarChart data={[
                                 { name: 'Low', val: affiliate.items[selectedItem].deals.revenueProjection.lowEstimate },
                                 { name: 'High', val: affiliate.items[selectedItem].deals.revenueProjection.highEstimate }
                               ]}>
                                  <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} />
                                  <RechartsTooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: 8 }} />
                                  <Bar dataKey="val" radius={[4, 4, 0, 0]}>
                                     <Cell fill="var(--accent-primary)30" />
                                     <Cell fill="var(--accent-primary)" />
                                  </Bar>
                               </BarChart>
                            </ResponsiveContainer>
                         </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                         <div className="card" style={{ padding: 16, background: 'var(--bg-primary)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                               <Target size={14} color="var(--accent-warning)" />
                               <span style={{ fontSize: '0.7rem', fontWeight: 800 }}>TRAFFIC THRESHOLD</span>
                            </div>
                            <div style={{ fontSize: '1.2rem', fontWeight: 900 }}>{affiliate.items[selectedItem].deals.revenueProjection.trafficThreshold}</div>
                            <p style={{ margin: 0, fontSize: '0.7rem', opacity: 0.6 }}>Required views to break even on production cost</p>
                         </div>
                         <div className="card" style={{ padding: 16, background: 'var(--bg-primary)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                               <ShieldCheck size={14} color="var(--accent-success)" />
                               <span style={{ fontSize: '0.7rem', fontWeight: 800 }}>BRAND GENOME AUDIT</span>
                            </div>
                            <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>Passes Brand Calibration</div>
                            <p style={{ margin: 0, fontSize: '0.7rem', opacity: 0.6 }}>Keywords and product values align with extracted Style DNA</p>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="card" style={{ padding: 24, borderLeft: '4px solid var(--accent-primary)' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                      <FileText size={18} color="var(--accent-primary)" />
                      <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>Contextual Script Mention</h3>
                   </div>
                   <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontStyle: 'italic', padding: 16, background: 'var(--bg-tertiary)', borderRadius: 8, lineHeight: 1.6 }}>
                      "...{affiliate.items[selectedItem].contextSnippet}..."
                   </div>
                   <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                      <button className="btn-ghost-sm"><RefreshCw size={12} /> Rewrite Clip</button>
                      <button className="btn-ghost-sm"><ExternalLink size={12} /> View in Script</button>
                   </div>
                </div>
             </motion.div>
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
