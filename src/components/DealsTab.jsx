import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Handshake, Search, Mail, DollarSign, 
  Calculator, Send, Copy, Building2, 
  TrendingUp, CheckCircle2, Loader2, 
  Link2, Plus, Trash2, ExternalLink, 
  PiggyBank, Briefcase, Zap, AlertCircle, 
  ArrowUpRight, Star, ChevronRight, 
  MessageSquare, ShieldCheck, Target, RefreshCw, X, Info
} from 'lucide-react';
import { useCreator } from '../context/CreatorContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { ExportButton } from './ui/ExportButton.jsx';
import MediaKit from './MediaKit.jsx';
import { CopyBlock } from './ui/CopyBlock.jsx';
import { 
  generateSponsorshipLeads, 
  getNegotiationAdvice,
  getMonetizationStrategy 
} from '../engine/aiService.js';

const PIPELINE_STAGES = [
  { id: 'scouted', label: 'Scouted Leads', color: 'var(--text-tertiary)' },
  { id: 'contacted', label: 'Contacted', color: 'var(--accent-primary)' },
  { id: 'negotiating', label: 'Negotiating', color: 'var(--accent-warning)' },
  { id: 'closed', label: 'Closed/Won', color: 'var(--accent-success)' }
];

export default function DealsTab() {
  const { data, setData, topic, script, setActiveTab } = useCreator();
  const { addToast } = useToast();
  
  const [isScouting, setIsScouting] = useState(false);
  const [isStratLoading, setIsStratLoading] = useState(false);
  const [showMediaKit, setShowMediaKit] = useState(false);
  const [activeNegotiation, setActiveNegotiation] = useState(null);
  const [objectionText, setObjectionText] = useState('');
  const [isGettingAdvice, setIsGettingAdvice] = useState(false);

  const deals = data?.deals || { brands: [] };
  const mon = data?.monetization;

  const handleScoutLeads = async () => {
    if (!topic || isScouting) return;
    setIsScouting(true);
    try {
      const result = await generateSponsorshipLeads(topic, script);
      const enrichedLeads = result.leads.map(l => ({
        ...l,
        id: Math.random().toString(36).substr(2, 9),
        status: 'scouted',
        history: [{ date: new Date().toISOString(), action: 'Scouted lead' }]
      }));

      setData(prev => ({
        ...prev,
        deals: { 
          ...prev.deals, 
          brands: [...(prev.deals?.brands || []), ...enrichedLeads] 
        }
      }));
      addToast('success', `Found ${result.leads.length} high-alignment leads!`);
    } catch (err) {
      addToast('error', 'Failed to scout sponsorship leads.');
    } finally {
      setIsScouting(false);
    }
  };

  const handleUpdateStatus = (brandId, newStatus) => {
    const updatedBrands = deals.brands.map(b => 
      b.id === brandId ? { 
        ...b, 
        status: newStatus,
        history: [...(b.history || []), { date: new Date().toISOString(), action: `Moved to ${newStatus}` }]
      } : b
    );
    setData(prev => ({ ...prev, deals: { ...prev.deals, brands: updatedBrands } }));
    addToast('info', `Deal moved to ${newStatus}`);
  };

  const handleGetNegotiationAdvice = async (brand) => {
    if (!objectionText || isGettingAdvice) return;
    setIsGettingAdvice(true);
    try {
      const advice = await getNegotiationAdvice(brand.name, objectionText, topic);
      setActiveNegotiation({ brand, objection: objectionText, advice });
      addToast('success', 'Negotiation strategy ready!');
    } catch (err) {
      addToast('error', 'Failed to generate negotiation advice.');
    } finally {
      setIsGettingAdvice(false);
    }
  };

  const handleRunMonetization = async () => {
    if (!topic || isStratLoading) return;
    setIsStratLoading(true);
    try {
      const result = await getMonetizationStrategy(topic, data);
      setData(prev => ({ ...prev, monetization: result }));
      addToast('success', 'ROI Matrix generated!');
    } catch (err) {
      addToast('error', 'Monetization analysis failed.');
    } finally {
      setIsStratLoading(false);
    }
  };

  if (!deals.brands.length && !isScouting) {
    return (
      <div className="tab-content center-content">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="empty-state" 
          style={{ maxWidth: 600 }}
        >
          <div className="empty-state-icon" style={{ background: 'var(--accent-primary)15', color: 'var(--accent-primary)' }}>
            <Handshake size={32} />
          </div>
          <h3>Sponsorship Engine</h3>
          <p>Transform your script into a revenue stream. Scout high-paying sponsors and manage your deal pipeline with AI-backed negotiation intelligence.</p>
          <button onClick={handleScoutLeads} className="shiny-button" style={{ marginTop: 24, padding: '16px 32px' }}>
            <Zap size={18} /> Scout Brand Leads
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="tab-content">
      <div className="tab-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20 }}>
        <div>
          <h2 className="tab-title text-gradient">Sponsorship Command</h2>
          <p className="tab-subtitle">High-performance deal pipeline & negotiation intelligence</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={handleRunMonetization} className="btn-secondary" style={{ fontSize: '0.8rem' }}>
             {isStratLoading ? <Loader2 size={16} className="spin" /> : <TrendingUp size={16} />} 
             ROI Matrix
          </button>
          <button onClick={() => setShowMediaKit(true)} className="btn-secondary" style={{ fontSize: '0.8rem' }}>
             <Star size={16} /> Media Kit
          </button>
          <button onClick={handleScoutLeads} className="shiny-button" style={{ padding: '8px 20px', fontSize: '0.8rem' }}>
             {isScouting ? <Loader2 size={18} className="spin" /> : <RefreshCw size={18} />} Scout Leads
          </button>
        </div>
      </div>

      {/* ROI Bar */}
      {mon && (
        <div className="card-grid" style={{ marginBottom: 32, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
           <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ padding: 24, borderLeft: '4px solid var(--accent-success)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                 <div style={{ fontSize: '0.7rem', color: 'var(--accent-success)', fontWeight: 800, textTransform: 'uppercase' }}>Growth Potential</div>
                 <div className="badge badge-green">RANK {mon.roiScore}/100</div>
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900 }}>{mon.valuePerView} Value</div>
           </motion.div>
           <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card" style={{ padding: 24, borderLeft: '4px solid var(--accent-primary)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--accent-primary)', fontWeight: 800, textTransform: 'uppercase', marginBottom: 12 }}>Est. Campaign Revenue</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900 }}>{mon.revenuePotential.sponsorship}</div>
           </motion.div>
           <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card" style={{ padding: 24, borderLeft: '4px solid var(--accent-warning)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--accent-warning)', fontWeight: 800, textTransform: 'uppercase', marginBottom: 12 }}>Active Opportunities</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900 }}>{deals.brands.filter(b => b.status !== 'scouted').length} In Pipeline</div>
           </motion.div>
        </div>
      )}

      {/* Kanban Pipeline */}
      <div className="pipeline-container" style={{ overflowX: 'auto', paddingBottom: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(280px, 1fr))', gap: 20 }}>
          {PIPELINE_STAGES.map(stage => (
            <div key={stage.id} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                   <div style={{ width: 8, height: 8, borderRadius: '50%', background: stage.color }} />
                   <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stage.label}</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 700, padding: '2px 8px', background: 'var(--bg-tertiary)', borderRadius: 10 }}>
                  {deals.brands.filter(b => b.status === stage.id).length}
                </div>
              </div>
              
              <div style={{ minHeight: '50vh', background: 'var(--bg-secondary)50', borderRadius: 24, padding: 12, border: '1px solid var(--border-subtle)' }}>
                <AnimatePresence mode="popLayout">
                   {deals.brands.filter(b => b.status === stage.id).map((brand, index) => (
                     <motion.div 
                       key={brand.id}
                       layout
                       initial={{ opacity: 0, y: 10 }}
                       animate={{ opacity: 1, y: 0 }}
                       exit={{ opacity: 0, scale: 0.95 }}
                       transition={{ delay: index * 0.05 }}
                       whileHover={{ y: -4, borderColor: 'var(--accent-primary)40' }}
                       className="card"
                       style={{ 
                         padding: 20, cursor: 'pointer', marginBottom: 12, border: '1px solid var(--border-subtle)',
                         background: 'var(--bg-primary)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                       }}
                       onClick={() => setActiveNegotiation({ brand, advice: null })}
                     >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                           <h4 style={{ margin: 0, fontWeight: 800, fontSize: '1rem' }}>{brand.name}</h4>
                           <Star size={14} color="var(--accent-warning)" />
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginBottom: 16, fontWeight: 600 }}>{brand.industry}</div>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                           <div style={{ fontWeight: 800, color: 'var(--accent-success)', fontSize: '0.9rem' }}>{brand.estimatedValue}</div>
                           {stage.id !== 'closed' && (
                             <button 
                               onClick={(e) => {
                                 e.stopPropagation();
                                 const nextIdx = PIPELINE_STAGES.findIndex(s => s.id === stage.id) + 1;
                                 handleUpdateStatus(brand.id, PIPELINE_STAGES[nextIdx].id);
                               }}
                               className="btn-mini"
                               style={{ borderRadius: 8 }}
                             >
                                <ChevronRight size={14} />
                             </button>
                           )}
                        </div>
                     </motion.div>
                   ))}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Negotiation Sidebar */}
      <AnimatePresence>
         {activeNegotiation && (
            <>
               <motion.div 
                 initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                 onClick={() => { setActiveNegotiation(null); setObjectionText(''); }}
                 style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 1000 }}
               />
               <motion.div 
                 initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                 transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                 style={{ 
                   position: 'fixed', top: 0, right: 0, width: 'min(500px, 100vw)', height: '100vh', 
                   background: 'var(--bg-primary)', zIndex: 1001, borderLeft: '1px solid var(--border-subtle)',
                   display: 'flex', flexDirection: 'column', boxShadow: '-24px 0 80px rgba(0,0,0,0.5)'
                 }}
               >
                  <div style={{ padding: '32px 40px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-secondary)30' }}>
                     <div>
                       <h3 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: 4 }}>{activeNegotiation.brand.name}</h3>
                       <div className="badge badge-purple" style={{ fontSize: '0.7rem' }}>DEAL INTELLIGENCE</div>
                     </div>
                     <button onClick={() => { setActiveNegotiation(null); setObjectionText(''); }} className="btn-mini" style={{ padding: 10 }}><X size={20} /></button>
                  </div>

                  <div style={{ flex: 1, overflowY: 'auto', padding: '40px' }}>
                     <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
                        <section>
                           <div style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', color: 'var(--accent-primary)', marginBottom: 16 }}>Sponsorship Angle</div>
                           <div style={{ padding: 24, background: 'var(--bg-tertiary)', borderRadius: 20, border: '1px solid var(--accent-primary)20', fontSize: '1rem', color: 'var(--text-primary)', lineHeight: 1.7 }}>
                              "{activeNegotiation.brand.pitchAngle}"
                           </div>
                        </section>

                        <section>
                           <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                              <ShieldCheck size={20} color="var(--accent-warning)" />
                              <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0 }}>Negotiation Coach</h3>
                           </div>
                           
                           <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                              <div style={{ position: 'relative' }}>
                                 <textarea 
                                    value={objectionText}
                                    onChange={(e) => setObjectionText(e.target.value)}
                                    placeholder="Enter the brand's pivot or objection..."
                                    style={{
                                       width: '100%', minHeight: 120, padding: 20, background: 'var(--bg-tertiary)',
                                       border: '1px solid var(--border-subtle)', borderRadius: 16, fontSize: '0.9rem',
                                       color: 'var(--text-primary)', outline: 'none', resize: 'none'
                                    }}
                                 />
                                 <button 
                                    onClick={() => handleGetNegotiationAdvice(activeNegotiation.brand)}
                                    disabled={!objectionText || isGettingAdvice}
                                    className="shiny-button"
                                    style={{ width: '100%', marginTop: 12, padding: '16px' }}
                                 >
                                    {isGettingAdvice ? <Loader2 size={20} className="spin" /> : <MessageSquare size={20} />}
                                    <span>{isGettingAdvice ? 'Strategizing...' : 'Calculate Counter-Pitch'}</span>
                                 </button>
                              </div>

                              <AnimatePresence>
                                 {activeNegotiation.advice && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                                       <div style={{ background: 'var(--accent-warning)05', padding: 24, borderRadius: 20, border: '1px solid var(--accent-warning)20' }}>
                                          <div style={{ fontSize: '0.75rem', fontWeight: 900, marginBottom: 12, color: 'var(--accent-warning)', display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <Info size={14} /> OBJECTION ANALYSIS
                                          </div>
                                          <div style={{ fontSize: '0.95rem', lineHeight: 1.7 }}>{activeNegotiation.advice.analysis}</div>
                                       </div>
                                       
                                       <div style={{ padding: 24, background: 'var(--bg-tertiary)', borderRadius: 20, border: '1px solid var(--border-subtle)' }}>
                                          <div style={{ fontSize: '0.75rem', fontWeight: 900, marginBottom: 16, color: 'var(--text-tertiary)' }}>LEVERAGE POINTS</div>
                                          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                             {activeNegotiation.advice.counterPoints.map((cp, i) => (
                                                <div key={i} style={{ display: 'flex', gap: 12, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                                   <Target size={16} color="var(--accent-primary)" style={{ flexShrink: 0, marginTop: 2 }} /> {cp}
                                                </div>
                                             ))}
                                          </div>
                                       </div>

                                       <CopyBlock content={activeNegotiation.advice.responseSnippet} label="OPTIMIZED DM/EMAIL RESPONSE" />
                                    </motion.div>
                                 )}
                              </AnimatePresence>
                           </div>
                        </section>
                     </div>
                  </div>
               </motion.div>
            </>
         )}
      </AnimatePresence>

      <MediaKit isOpen={showMediaKit} onClose={() => setShowMediaKit(false)} creatorData={{ niche: 'Tech', topic }} dealsData={deals} />
    </div>
  );
}
