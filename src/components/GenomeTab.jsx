import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, 
  ResponsiveContainer, Radar as RadarComponent
} from 'recharts';
import { 
  Dna, Sparkles, Wand2, Shield, Plus, X, 
  RefreshCw, Quote, Trash2, Zap, Activity, Info
} from 'lucide-react';
import { useCreator } from '../context/CreatorContext';
import { useToast } from '../context/ToastContext';
import { extractStyleDNA } from '../engine/aiService';

export default function GenomeTab() {
  const { data, setData } = useCreator();
  const { addToast } = useToast();
  
  const [samples, setSamples] = useState(['', '', '']);
  const [isLoading, setIsLoading] = useState(false);

  const dna = data?.genome || null;

  const handleAddSample = () => setSamples([...samples, '']);
  const handleRemoveSample = (index) => setSamples(samples.filter((_, i) => i !== index));
  const handleUpdateSample = (index, val) => {
    const next = [...samples];
    next[index] = val;
    setSamples(next);
  };

  const handleExtractDNA = async () => {
    const validSamples = samples.filter(s => s.trim().length > 50);
    if (validSamples.length < 1) {
      addToast('error', 'Provide at least one meaningful sample (50+ words)');
      return;
    }

    setIsLoading(true);
    try {
      const result = await extractStyleDNA(validSamples);
      setData(prev => ({ ...prev, genome: result }));
      addToast('success', 'Style DNA extracted successfully!');
    } catch (err) {
      addToast('error', 'Analysis failed. Check your API connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const radarData = useMemo(() => {
    if (!dna?.metrics) return [];
    return [
      { subject: 'Professional', A: dna.metrics.professional_v_casual, fullMark: 100 },
      { subject: 'Data-Driven', A: dna.metrics.data_v_story, fullMark: 100 },
      { subject: 'Direct', A: dna.metrics.direct_v_suggestive, fullMark: 100 },
      { subject: 'Hype', A: dna.metrics.hype_v_skeptical, fullMark: 100 },
      { subject: 'Casual', A: 100 - dna.metrics.professional_v_casual, fullMark: 100 },
      { subject: 'Story-First', A: 100 - dna.metrics.data_v_story, fullMark: 100 },
    ];
  }, [dna]);

  if (!dna && !isLoading) {
    return (
      <div className="tab-content center-content">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="empty-state" 
          style={{ maxWidth: 700, background: 'var(--bg-secondary)', padding: 48, borderRadius: 32, border: '1px solid var(--border-subtle)', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}
        >
          <div className="empty-state-icon" style={{ background: 'var(--accent-primary)15', color: 'var(--accent-primary)', width: 80, height: 80, borderRadius: 24, marginBottom: 32 }}>
            <Dna size={40} />
          </div>
          <h3 style={{ fontSize: '2rem', marginBottom: 16 }}>The Brand Genome</h3>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: 40, lineHeight: 1.6 }}>
            The AI sounds generic by default. Use the Genome to clone your unique voice. 
            Paste a few samples of your best content and we'll extract your "Style DNA".
          </p>
          
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {samples.map((s, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                style={{ position: 'relative' }}
              >
                <textarea
                  className="genome-sample-input"
                  placeholder={`Sample ${i+1}: Paste a high-performing script, post, or article here...`}
                  value={s}
                  onChange={e => handleUpdateSample(i, e.target.value)}
                  style={{ 
                    width: '100%', minHeight: 120, background: 'var(--bg-primary)', 
                    border: '1px solid var(--border-subtle)', borderRadius: 16, padding: '20px 48px 20px 20px',
                    fontSize: '0.9rem', color: 'var(--text-primary)', resize: 'vertical',
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)', transition: 'all 0.3s ease'
                  }}
                />
                {samples.length > 1 && (
                  <button 
                    onClick={() => handleRemoveSample(i)}
                    style={{ position: 'absolute', top: 12, right: 12, background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', color: 'var(--text-tertiary)', cursor: 'pointer', padding: 6, borderRadius: 8 }}
                  >
                    <X size={14} />
                  </button>
                )}
              </motion.div>
            ))}
            
            <button onClick={handleAddSample} className="btn-ghost" style={{ alignSelf: 'center', fontSize: '0.85rem', gap: 8, padding: '10px 20px' }}>
              <Plus size={16} /> Add Writing Sample
            </button>
            
            <button 
              onClick={handleExtractDNA}
              disabled={isLoading || samples.every(s => s.length < 10)}
              className="shiny-button"
              style={{ marginTop: 24, padding: '18px 36px', fontSize: '1rem', borderRadius: 16 }}
            >
              {isLoading ? <RefreshCw size={20} className="spin" /> : <Wand2 size={20} />}
              <span>Extract My Style DNA</span>
            </button>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 12, color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>
              <Info size={12} /> Pro Tip: Longer samples (200+ words) yield more accurate DNA extraction.
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="tab-content">
      <div className="tab-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20 }}>
        <div>
          <h2 className="tab-title text-gradient">Brand Genome: {dna?.personaName}</h2>
          <p className="tab-subtitle">Linguistic fingerprints and psychological grounding active</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
           <button onClick={() => setData(prev => ({ ...prev, genome: null }))} className="btn-ghost" style={{ color: 'var(--accent-danger)', fontSize: '0.8rem' }}>
             <Trash2 size={14} /> Reset DNA
           </button>
           <button onClick={() => handleExtractDNA()} disabled={isLoading} className="btn-secondary" style={{ fontSize: '0.8rem' }}>
             <RefreshCw size={14} className={isLoading ? 'spin' : ''} /> 
             <span>Re-Analyze</span>
           </button>
        </div>
      </div>

      <div className="genome-layout" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 24 }}>
        
        {/* Left Col: Radar & Vision */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
           <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             className="card" 
             style={{ padding: 24, position: 'relative', overflow: 'hidden' }}
           >
              <div style={{ padding: 10, background: 'var(--accent-primary)10', color: 'var(--accent-primary)', borderRadius: 12, display: 'inline-flex', marginBottom: 20 }}>
                <Activity size={20} />
              </div>
              <h3 style={{ marginBottom: 24, fontSize: '1.2rem', fontWeight: 800 }}>Linguistic Personality Map</h3>
              <div style={{ width: '100%', height: 320, background: 'var(--bg-tertiary)', borderRadius: 24, padding: 20, border: '1px solid var(--border-subtle)' }}>
                 <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                       <PolarGrid stroke="rgba(255,255,255,0.1)" />
                       <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-tertiary)', fontSize: 11, fontWeight: 600 }} />
                       <RadarComponent
                          name="Style DNA"
                          dataKey="A"
                          stroke="var(--accent-primary)"
                          fill="var(--accent-primary)"
                          fillOpacity={0.4}
                       />
                    </RadarChart>
                 </ResponsiveContainer>
              </div>
           </motion.div>

           <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ delay: 0.1 }}
             className="card" 
             style={{ padding: 24 }}
           >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                 <Quote size={20} color="var(--accent-secondary)" />
                 <h3 style={{ fontWeight: 800, fontSize: '1.2rem' }}>Voice Description</h3>
              </div>
              <div style={{ background: 'linear-gradient(135deg, var(--bg-tertiary) 0%, var(--bg-secondary) 100%)', padding: 24, borderRadius: 20, border: '1px solid var(--accent-secondary)20', position: 'relative' }}>
                 <p style={{ fontSize: '1rem', color: 'var(--text-primary)', lineHeight: 1.8, fontStyle: 'italic', fontWeight: 500 }}>
                   "{dna?.voiceDescription}"
                 </p>
                 <div style={{ position: 'absolute', bottom: -12, right: 16 }}>
                    <div className="badge badge-purple" style={{ fontSize: '0.7rem', padding: '6px 14px', boxShadow: '0 4px 12px rgba(124, 92, 252, 0.4)' }}>GROUNDING ACTIVE</div>
                 </div>
              </div>
           </motion.div>
        </div>

        {/* Right Col: Vocabulary & Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
           <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24 }}>
              {/* Power Words */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="card" 
                style={{ padding: 24 }}
              >
                 <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                    <Zap size={20} color="var(--accent-warning)" />
                    <h3 style={{ fontWeight: 800, fontSize: '1.1rem' }}>Vocabulary Fingerprints</h3>
                 </div>
                 <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                    {dna?.vocabulary.map((word, i) => (
                      <span key={i} className="badge" style={{ background: 'var(--accent-warning)15', color: 'var(--accent-warning)', border: '1px solid var(--accent-warning)30', padding: '8px 16px', fontSize: '0.85rem', fontWeight: 700 }}>
                        {word}
                      </span>
                    ))}
                 </div>
                 <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', marginTop: 24, lineHeight: 1.6 }}>
                    High-frequency tokens detected in your writing. The AI will prioritize these to match your tone.
                 </p>
              </motion.div>

              {/* Forbidden Styles */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="card" 
                style={{ padding: 24 }}
              >
                 <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                    <Shield size={20} color="var(--accent-danger)" />
                    <h3 style={{ fontWeight: 800, fontSize: '1.1rem' }}>Forbidden Markers</h3>
                 </div>
                 <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                    {dna?.forbidden.map((word, i) => (
                      <span key={i} className="badge" style={{ background: 'var(--accent-danger)15', color: 'var(--accent-danger)', border: '1px solid var(--accent-danger)30', padding: '8px 16px', fontSize: '0.85rem', fontWeight: 700 }}>
                        {word}
                      </span>
                    ))}
                 </div>
                 <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', marginTop: 24, lineHeight: 1.6 }}>
                    Generic tokens and off-brand markers the AI is strictly instructed to avoid.
                 </p>
              </motion.div>
           </div>

           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.4 }}
             className="card" 
             style={{ padding: 24 }}
           >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                 <div style={{ padding: 8, background: 'var(--accent-primary)10', color: 'var(--accent-primary)', borderRadius: 10 }}>
                    <Sparkles size={18} />
                 </div>
                 <h3 style={{ fontWeight: 800, fontSize: '1.1rem' }}>Structural Rhythm</h3>
              </div>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 32 }}>
                 {dna?.rhythm}
              </p>
              
              <div style={{ padding: 24, background: 'linear-gradient(to right, var(--accent-primary)10, transparent)', borderRadius: 20, border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div className="icon-badge" style={{ background: 'var(--accent-primary)', color: 'white', width: 44, height: 44, borderRadius: 12 }}>
                       <Dna size={20} />
                    </div>
                    <div>
                       <div style={{ fontWeight: 800, fontSize: '1rem' }}>Identity Synthesis Active</div>
                       <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>All future generations will utilize the "{dna?.personaName}" identity core.</div>
                    </div>
                 </div>
                 <div className="toggle-switch active" style={{ cursor: 'not-allowed' }}><div className="toggle-knob" /></div>
              </div>
           </motion.div>
        </div>

      </div>
    </div>
  );
}
