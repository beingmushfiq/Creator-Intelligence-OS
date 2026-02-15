import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Hash, Globe, TrendingUp, Copy, RefreshCw, Zap, Check } from 'lucide-react';
import { useCreator } from '../context/CreatorContext';
import { useToast } from '../context/ToastContext';
import { ExportButton } from './ui/ExportButton';

export default function SeoTab() {
  const { data, setData, topic, loading } = useCreator();
  const { addToast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  const seoData = data?.seo || {};

  const handleGenerate = async () => {
    if (!topic) {
      addToast('error', 'Please enter a topic first');
      return;
    }
    setIsGenerating(true);
    try {
      const { generateSeoData } = await import('../engine/aiService');
      const onProgress = (key, result) => {
        setData(prev => ({
          ...prev,
          seo: { ...prev.seo, [key]: result }
        }));
      };
      
      await generateSeoData(topic, onProgress);
      addToast('success', 'SEO Analysis Complete!');
    } catch (err) {
      console.error(err);
      addToast('error', 'SEO Generation Failed');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    addToast('success', 'Copied to clipboard');
  };

  if (!seoData.keywords && !seoData.metadata && !isGenerating) {
    return (
      <div className="tab-content center-content">
        <div className="empty-state">
          <div className="empty-state-icon"><Search size={32} /></div>
          <h3>SEO & Discovery Engine</h3>
          <p>Uncover high-volume keywords, generate optimized metadata, and find trending angles.</p>
          <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className="shiny-button"
            style={{ marginTop: 24, padding: '12px 24px' }}
          >
            {isGenerating ? <div className="spinner" /> : <Zap size={18} fill="currentColor" />}
            {isGenerating ? 'Analyzing Market...' : 'Run SEO Analysis'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="tab-content">
      <div className="tab-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 className="tab-title text-gradient">SEO & Discovery Engine</h2>
          <p className="tab-subtitle">Data-driven insights to maximize reach</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <ExportButton section="seo" data={seoData} />
          <button onClick={handleGenerate} disabled={isGenerating} className="icon-btn" title="Refresh Analysis">
            <RefreshCw size={18} className={isGenerating ? 'spin' : ''} />
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repaet(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
        
        {/* Left Column: Keywords & Trends */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          {/* Trends Card */}
          <div className="card">
            <div className="card-header">
              <div className="card-title-group">
                <div className="card-icon" style={{ background: 'rgba(236, 72, 153, 0.1)', color: '#ec4899' }}>
                  <TrendingUp size={18} />
                </div>
                <h3>Trending Angles</h3>
              </div>
            </div>
            <div className="card-body">
              {seoData.trends ? (
                <ul className="space-y-2">
                  {seoData.trends.map((trend, i) => (
                    <li key={i} style={{ fontSize: '0.9rem', padding: '8px', background: 'var(--bg-tertiary)', borderRadius: 6 }}>
                      🔥 {trend}
                    </li>
                  ))}
                </ul>
              ) : <SkeletonLines count={3} />}
            </div>
          </div>

          {/* Keyword Research */}
          <div className="card">
             <div className="card-header">
              <div className="card-title-group">
                <div className="card-icon" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
                  <Globe size={18} />
                </div>
                <h3>Keyword Opportunities</h3>
              </div>
            </div>
            <div className="card-body" style={{ padding: 0 }}>
              {seoData.keywords ? (
                <div className="table-container">
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                    <thead>
                      <tr style={{ background: 'var(--bg-tertiary)', textAlign: 'left' }}>
                        <th style={{ padding: 12 }}>Keyword</th>
                        <th style={{ padding: 12 }}>Vol</th>
                        <th style={{ padding: 12 }}>Comp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {seoData.keywords.map((k, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                          <td style={{ padding: 12, fontWeight: 500 }}>{k.keyword}</td>
                          <td style={{ padding: 12 }}>
                            <Badge val={k.volume} type="vol" />
                          </td>
                          <td style={{ padding: 12 }}>
                            <Badge val={k.competition} type="comp" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : <SkeletonTable />}
            </div>
          </div>
        </div>

        {/* Right Column: Metadata */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
           <div className="card">
            <div className="card-header">
              <div className="card-title-group">
                <div className="card-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                  <Search size={18} />
                </div>
                <h3>Optimized Metadata</h3>
              </div>
              {seoData.metadata && (
                <button onClick={() => copyToClipboard(JSON.stringify(seoData.metadata, null, 2))} className="icon-btn-sm">
                  <Copy size={14} />
                </button>
              )}
            </div>
            
            <div className="card-body space-y-4">
              {seoData.metadata ? (
                <>
                  <div className="input-group">
                    <label>SEO Title</label>
                    <div className="generated-box">{seoData.metadata.title}</div>
                  </div>
                  
                  <div className="input-group">
                    <label>Description</label>
                    <div className="generated-box" style={{ whiteSpace: 'pre-wrap' }}>
                      {seoData.metadata.description}
                    </div>
                  </div>

                  <div className="input-group">
                    <label>Tags</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {seoData.metadata.tags.map((tag, i) => (
                        <span key={i} className="tag">{tag}</span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="input-group">
                    <label>File Name</label>
                    <code style={{ fontSize: '0.85rem', color: 'var(--accent-primary)' }}>{seoData.metadata.file_name}</code>
                  </div>
                </>
              ) : <SkeletonMetadata />}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

const Badge = ({ val, type }) => {
  let color = 'var(--text-tertiary)';
  if (type === 'vol') {
    if (val === 'High') color = '#10b981'; // Green
    if (val === 'Medium') color = '#f59e0b'; // Yellow
    if (val === 'Low') color = '#ef4444'; // Red
  } else {
    // Competition: Low is good (Green)
    if (val === 'Low') color = '#10b981'; 
    if (val === 'Medium') color = '#f59e0b';
    if (val === 'High') color = '#ef4444';
  }
  
  return (
    <span style={{ 
      color, 
      fontWeight: 600, 
      fontSize: '0.75rem', 
      padding: '2px 6px', 
      borderRadius: 4, 
      background: `${color}15` 
    }}>
      {val}
    </span>
  );
};

const SkeletonLines = ({ count }) => (
  <div className="space-y-2">
    {[...Array(count)].map((_, i) => (
      <div key={i} className="skeleton" style={{ height: 24, width: `${60 + Math.random() * 40}%` }} />
    ))}
  </div>
);

const SkeletonTable = () => (
   <div className="space-y-2 p-4">
    {[...Array(5)].map((_, i) => (
      <div key={i} style={{ display: 'flex', gap: 12 }}>
        <div className="skeleton" style={{ height: 20, flex: 2 }} />
        <div className="skeleton" style={{ height: 20, flex: 1 }} />
        <div className="skeleton" style={{ height: 20, flex: 1 }} />
      </div>
    ))}
  </div>
);

const SkeletonMetadata = () => (
  <div className="space-y-4">
    <div className="skeleton" style={{ height: 40 }} />
    <div className="skeleton" style={{ height: 120 }} />
    <div className="skeleton" style={{ height: 60 }} />
  </div>
);
