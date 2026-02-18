import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Handshake, Search, Mail, DollarSign, Calculator, Send, Copy, Building2, TrendingUp, CheckCircle2, Loader2, Link2, Plus, Trash2, ExternalLink } from 'lucide-react';
import { useCreator } from '../context/CreatorContext';
import { useToast } from '../context/ToastContext';
import { ExportButton } from './ui/ExportButton';
import MediaKit from './MediaKit';
import { generateAnalyticsData } from '../utils/analyticsData';
import { CopyBlock } from './ui/CopyBlock';

export default function DealsTab() {
  const { data, setData, topic, affiliates, setAffiliates } = useCreator();
  const { addToast } = useToast();
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingPitch, setLoadingPitch] = useState(null); // brandName
  const [pitchData, setPitchData] = useState({}); // { brandName: { subject, body } }
  
  // Rate Calculator State
  const [avgViews, setAvgViews] = useState(10000);
  const [engagementRate, setEngagementRate] = useState(2.5); // %
  const [niche, setNiche] = useState('Tech');

  const deals = data?.deals || {};

  const stats = {
    pipelineValue: (deals.brands || []).reduce((acc, b) => acc + (b.estimatedValue || 0), 0),
    activeDeals: (deals.brands || []).filter(b => b.status && b.status !== 'Prospect').length,
  };

  const handleFindSponsors = async () => {
    if (!topic) {
      addToast('error', 'Please enter a topic first');
      return;
    }
    setIsAnalyzing(true);
    try {
      const { generateSponsorships } = await import('../engine/aiService');
      const brands = await generateSponsorships(topic);
      
      
      // Add initial status and value estimate
      const enrichedBrands = brands.map(b => ({
        ...b,
        status: 'Prospect',
        estimatedValue: 0 // Will be updated by calculator
      }));

      setData(prev => ({
        ...prev,
        deals: { ...prev.deals, brands: enrichedBrands }
      }));
      addToast('success', 'Found potential sponsors!');
    } catch (err) {
      console.error(err);
      addToast('error', 'Failed to find sponsors');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGeneratePitch = async (brand) => {
    setLoadingPitch(brand.name);
    try {
      const { generatePitch } = await import('../engine/aiService');
      const pitch = await generatePitch(brand.name, topic, brand.pitchAngle);
      
      setPitchData(prev => ({ ...prev, [brand.name]: pitch }));
      addToast('success', 'Pitch draft generated!');
    } catch (err) {
      console.error(err);
      addToast('error', 'Failed to generate pitch');
    } finally {
      setLoadingPitch(null);
    }
  };

  // CPM Rates: Tech is higher ($25-35), Lifestyle ($15-20), Gaming ($10-15)
  const calculateRates = () => {
    let baseCpm = 20; // Default
    if (niche === 'Tech' || niche === 'Business') baseCpm = 35;
    if (niche === 'Gaming' || niche === 'Vlog') baseCpm = 15;
    if (niche === 'Education') baseCpm = 25;

    // Engagement Multiplier: 2.5% is baseline. 5% = 1.25x rates.
    const erMultiplier = 1 + Math.max(0, (engagementRate - 2.5) / 10);
    const finalCpm = baseCpm * erMultiplier;

    const integration60s = (avgViews / 1000) * finalCpm;
    const shoutout30s = integration60s * 0.6;
    const dedicated = integration60s * 2.5;

    return { integration60s, shoutout30s, dedicated, cpm: finalCpm };
  };

  const rates = calculateRates();
  const formatMoney = (val) => `$${Math.round(val).toLocaleString()}`;

  const currentAffiliates = affiliates.length > 0 ? affiliates : [
    { name: 'Amazon Associates', link: 'https://amazon.com/affiliate', sales: 12, earnings: 450 },
    { name: 'Epidemic Sound', link: 'https://epidemicsound.com', sales: 5, earnings: 125 }
  ];

  const handleAddAffiliate = () => {
    const name = prompt("Enter Affiliate Program Name:");
    const link = prompt("Enter Affiliate Link:");
    if (name && link) {
      setAffiliates([...currentAffiliates, { name, link, sales: 0, earnings: 0 }]);
      addToast('success', 'Affiliate link added!');
    }
  };

  const handleRemoveAffiliate = (index) => {
    const newAffiliates = currentAffiliates.filter((_, i) => i !== index);
    setAffiliates(newAffiliates);
    addToast('info', 'Affiliate link removed');
  };

  if (!deals.brands && !isAnalyzing) {
    return (
      <div className="tab-content center-content">
        <div className="empty-state">
          <div className="empty-state-icon"><Handshake size={32} /></div>
          <h3>Sponsorship & Deal Flow</h3>
          <p>Find brands matching your niche, calculate your rates, and draft winning pitches instantly.</p>
          <button 
            onClick={handleFindSponsors}
            disabled={isAnalyzing}
            className="shiny-button"
            style={{ marginTop: 24, padding: '12px 24px' }}
          >
            {isAnalyzing ? <div className="spinner" /> : <Search size={18} />}
            {isAnalyzing ? 'Scanning Market...' : 'Find Sponsors'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="tab-content">
      <div className="tab-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 className="tab-title text-gradient">Deal Flow Engine</h2>
          <p className="tab-subtitle">Monetize your influence with data-backed deals</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <MediaKit creatorData={{ niche, topic }} analyticsData={generateAnalyticsData()} dealsData={deals} />
          <ExportButton section="deals" data={deals} />
          <button onClick={handleFindSponsors} disabled={isAnalyzing} className="icon-btn" title="Refresh Sponsors">
            <Handshake size={18} className={isAnalyzing ? 'spin' : ''} />
          </button>
        </div>
      </div>

      <div className="deal-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, alignItems: 'start' }}>
        
        {/* Left Column: Brand Matches */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Pipeline Summary */}
          {deals.brands && (
            <div className="card-grid">
              <div className="card" style={{ padding: 16, textAlign: 'center' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>Pipeline Value</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-success)' }}>
                  {formatMoney(stats.pipelineValue)}
                </div>
              </div>
              <div className="card" style={{ padding: 16, textAlign: 'center' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>Active Deals</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>
                  {stats.activeDeals}
                </div>
              </div>
            </div>
          )}

          {deals.brands && deals.brands.map((brand, i) => (
            <div key={i} className="card">
              <div className="card-header" style={{ paddingBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', width: '100%' }}>
                  <div className="card-title-group">
                    <div className="card-icon" style={{ background: 'rgba(236, 72, 153, 0.1)', color: '#ec4899' }}>
                      <Building2 size={18} />
                    </div>
                    <div>
                      <h3 className="card-title">{brand.name}</h3>
                      <div className="badge badge-purple" style={{ marginTop: 4, display: 'inline-block' }}>{brand.industry}</div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <select
                      value={brand.status || 'Prospect'}
                      onChange={(e) => {
                         const newBrands = [...deals.brands];
                         newBrands[i].status = e.target.value;
                         if (e.target.value !== 'Prospect') {
                           newBrands[i].estimatedValue = rates.integration60s; // Assign value when active
                         }
                         setData(prev => ({ ...prev, deals: { ...prev.deals, brands: newBrands } }));
                      }}
                      style={{ padding: '4px 8px', borderRadius: 4, fontSize: '0.75rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-medium)', color: 'var(--text-secondary)' }}
                    >
                      <option value="Prospect">Prospect</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Negotiating">Negotiating</option>
                      <option value="Closed">Closed</option>
                    </select>

                    <button 
                      onClick={() => handleGeneratePitch(brand)}
                      disabled={loadingPitch === brand.name}
                      className="icon-btn-sm"
                      title="Draft Pitch Email"
                      style={{ background: 'var(--bg-tertiary)' }}
                    >
                      {loadingPitch === brand.name ? <Loader2 size={16} className="spin" /> : <Mail size={16} />}
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="card-body" style={{ paddingTop: 0 }}>
                <div style={{ fontSize: '0.9rem', marginBottom: 12 }}>
                  <strong>Why them:</strong> <span style={{ color: 'var(--text-secondary)' }}>{brand.fit}</span>
                </div>
                {brand.status !== 'Prospect' && (
                  <div style={{ marginBottom: 12, padding: 8, background: 'rgba(16, 185, 129, 0.1)', borderRadius: 6, color: 'var(--accent-success)', fontSize: '0.85rem', fontWeight: 600 }}>
                    💰 Est. Deal Value: {formatMoney(rates.integration60s)}
                  </div>
                )}

                <div style={{ fontSize: '0.85rem', background: 'var(--bg-tertiary)', padding: 8, borderRadius: 6, borderLeft: '3px solid var(--accent-primary)' }}>
                  💡 <strong>Hook:</strong> {brand.pitchAngle}
                </div>

                {/* Generated Pitch Display */}
                {pitchData[brand.name] && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    style={{ marginTop: 16, borderTop: '1px solid var(--border-subtle)', paddingTop: 16 }}
                  >
                    <div style={{ marginBottom: 8, fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                      DRAFT EMAIL
                    </div>
                    <div style={{ background: 'var(--bg-primary)', borderRadius: 8, border: '1px solid var(--border-medium)', overflow: 'hidden' }}>
                      <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-subtle)', fontSize: '0.85rem', fontWeight: 500 }}>
                        Subject: {pitchData[brand.name].subject}
                      </div>
                      <div style={{ padding: 12, fontSize: '0.85rem', whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
                        {pitchData[brand.name].body}
                      </div>
                      <div style={{ background: 'var(--bg-tertiary)', padding: '4px 8px', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                        <a 
                          href={`mailto:?subject=${encodeURIComponent(pitchData[brand.name].subject)}&body=${encodeURIComponent(pitchData[brand.name].body)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-btn"
                          style={{ fontSize: '0.75rem', gap: 4, textDecoration: 'none', display: 'flex', alignItems: 'center' }}
                        >
                          <Send size={12} /> Open in Mail
                        </a>
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(`${pitchData[brand.name].subject}\n\n${pitchData[brand.name].body}`);
                            addToast('success', 'Copied email!');
                          }}
                          className="text-btn"
                          style={{ fontSize: '0.75rem', gap: 4 }}
                        >
                          <Copy size={12} /> Copy
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Rate Calculator */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, position: 'sticky', top: 24 }}>
          <div className="card">
            <div className="card-header">
              <div className="card-title-group">
                <div className="card-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                  <Calculator size={18} />
                </div>
                <h3>Rate Calculator</h3>
              </div>
            </div>
            
            <div className="card-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16, marginBottom: 24 }}>
                <div className="input-group">
                  <label>Avg Views / Video</label>
                  <input 
                    type="number" 
                    value={avgViews} 
                    onChange={(e) => setAvgViews(Number(e.target.value))}
                    className="input-field"
                  />
                </div>
                
                <div className="input-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <label>Engagement Rate</label>
                    <span style={{ fontSize: '0.8rem', color: 'var(--accent-primary)' }}>{engagementRate}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0.5" 
                    max="10" 
                    step="0.1" 
                    value={engagementRate} 
                    onChange={(e) => setEngagementRate(Number(e.target.value))}
                    className="range-slider"
                    style={{ width: '100%', marginTop: 8 }}
                  />
                </div>

                <div className="input-group">
                  <label>Niche</label>
                  <select 
                    value={niche} 
                    onChange={(e) => setNiche(e.target.value)}
                    className="input-field"
                  >
                    <option value="Tech">Tech / Business (High CPM)</option>
                    <option value="Lifestyle">Lifestyle / Vlog (Med CPM)</option>
                    <option value="Gaming">Gaming (Vol CPM)</option>
                    <option value="Education">Education (Med-High CPM)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div className="rate-card">
                  <div className="rate-label">Dedicated Video</div>
                  <div className="rate-value">{formatMoney(rates.dedicated)}</div>
                </div>
                <div className="rate-card">
                  <div className="rate-label">60s Integration</div>
                  <div className="rate-value text-gradient">{formatMoney(rates.integration60s)}</div>
                  <div className="rate-sub">Most Common Deal Type</div>
                </div>
                <div className="rate-card">
                  <div className="rate-label">30s Shoutout</div>
                  <div className="rate-value">{formatMoney(rates.shoutout30s)}</div>
                </div>
              </div>
              
              <div style={{ marginTop: 16, fontSize: '0.75rem', color: 'var(--text-tertiary)', textAlign: 'center' }}>
                *Based on calculated CPM of <strong>{formatMoney(rates.cpm)}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Affiliate Link Manager Section */}
        <div style={{ gridColumn: '1 / -1', marginTop: 32 }}>
          <div className="card">
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="card-title-group">
                <div className="card-icon" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
                  <Link2 size={18} />
                </div>
                <h3>Affiliate Link Manager</h3>
              </div>
              <button onClick={handleAddAffiliate} className="shiny-button" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                <Plus size={14} /> Add Link
              </button>
            </div>
            <div className="card-body">
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-subtle)', textAlign: 'left' }}>
                      <th style={{ padding: '12px', color: 'var(--text-secondary)' }}>Program</th>
                      <th style={{ padding: '12px', color: 'var(--text-secondary)' }}>Link</th>
                      <th style={{ padding: '12px', color: 'var(--text-secondary)', textAlign: 'center' }}>Sales</th>
                      <th style={{ padding: '12px', color: 'var(--text-secondary)', textAlign: 'right' }}>Earnings</th>
                      <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentAffiliates.map((aff, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: '12px', fontWeight: 600 }}>{aff.name}</td>
                        <td style={{ padding: '12px', color: 'var(--accent-secondary)' }}>
                          <a href={aff.link} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'inherit', textDecoration: 'none' }}>
                            {aff.link.substring(0, 30)}... <ExternalLink size={12} />
                          </a>
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>{aff.sales}</td>
                        <td style={{ padding: '12px', textAlign: 'right', fontWeight: 700, color: 'var(--accent-success)' }}>{formatMoney(aff.earnings)}</td>
                        <td style={{ padding: '12px', textAlign: 'right' }}>
                          <button onClick={() => handleRemoveAffiliate(i)} className="icon-btn-sm" style={{ color: 'var(--accent-danger)' }}>
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

      </div>

      <style jsx>{`
        .rate-card {
          padding: 16px;
          background: var(--bg-tertiary);
          border-radius: 8px;
          border: 1px solid var(--border-subtle);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
        }
        .rate-label {
          font-weight: 600;
          color: var(--text-secondary);
          width: 50%;
        }
        .rate-value {
          font-weight: 700;
          font-size: 1.2rem;
          color: var(--text-primary);
          text-align: right;
          width: 50%;
        }
        .rate-sub {
          width: 100%;
          font-size: 0.7rem;
          color: var(--text-tertiary);
          margin-top: 4px;
          text-align: right;
        }
      `}</style>
    </div>
  );
}
