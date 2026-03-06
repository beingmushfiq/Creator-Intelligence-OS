import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, 
  ResponsiveContainer, Radar as RadarComponent
} from 'recharts';
import { 
  Fingerprint, Sparkles, RefreshCw, Quote, Trash2, Zap, Activity, Info,
  Brain, Heart, Compass, Target, Layers, ChevronRight, Zap as ZapIcon
} from 'lucide-react';
import { useCreator } from '../context/CreatorContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { extractStyleDNA } from '../engine/aiService.js';

export default function GenomeTab() {
  const { data, setData, loading } = useCreator();
  const { addToast } = useToast();
  const [extracting, setExtracting] = useState(false);

  const genome = data?.genome || { samples: [], dna: null };

  const handleExtractDNA = async () => {
    if (genome.samples.length < 3) {
      addToast('error', 'Minimum 3 narrative samples required for extraction.');
      return;
    }
    setExtracting(true);
    try {
      const dna = await extractStyleDNA(genome.samples);
      setData(prev => ({
        ...prev,
        genome: { ...prev.genome, dna }
      }));
      addToast('success', 'Neural DNA crystallized.');
    } catch (e) {
      addToast('error', 'Crystallization failure.');
    } finally {
      setExtracting(false);
    }
  };

  const radarData = useMemo(() => {
    if (!genome.dna?.metrics) return [];
    return Object.entries(genome.dna.metrics).map(([key, val]) => ({
       subject: key.toUpperCase(),
       A: val,
       fullMark: 100
    }));
  }, [genome.dna]);

  return (
    <div className="tab-content animate-slide-up">
      <div className="tab-header" style={{ marginBottom: 40 }}>
        <div className="stagger-children">
          <h2 className="tab-title text-gradient-aurora" style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.04em' }}>Style Genome</h2>
          <p className="tab-subtitle" style={{ fontSize: '1.1rem' }}>Extracting unique narrative DNA & cross-modal style synchronization</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
           <button onClick={handleExtractDNA} disabled={extracting || loading} className="btn-primary" style={{ padding: '12px 24px' }}>
              {extracting ? <RefreshCw className="animate-spin" size={18} /> : <Fingerprint size={18} />}
              <span>{extracting ? 'Extracting...' : 'Extract DNA'}</span>
           </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 28, alignItems: 'start' }}>
         
         {/* Main Visualizer */}
         <div className="glass" style={{ padding: 40, borderRadius: 32, position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div className="glow-border" style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--bg-tertiary)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     <Brain size={22} />
                  </div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 900 }}>Neural Style Blueprint</h3>
               </div>
               {genome.dna && <div className="glass" style={{ padding: '6px 14px', borderRadius: 100, fontSize: '0.65rem', fontWeight: 950, color: 'var(--accent-success)' }}>CRYSTALLIZED</div>}
            </div>

            <div style={{ width: '100%', height: 350 }}>
               {genome.dna ? (
                  <ResponsiveContainer width="100%" height="100%">
                     <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                        <PolarGrid stroke="var(--border-subtle)" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-tertiary)', fontSize: 10, fontWeight: 800 }} />
                        <RadarComponent name="DNA" dataKey="A" stroke="var(--accent-primary)" fill="var(--accent-primary)" fillOpacity={0.3} />
                     </RadarChart>
                  </ResponsiveContainer>
               ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.2 }}>
                     <Layers size={80} />
                     <p style={{ marginTop: 20, fontWeight: 800 }}>DNA Telemetry Silent</p>
                  </div>
               )}
            </div>

            {genome.dna?.description && (
               <div className="glass" style={{ padding: 32, borderRadius: 24, marginTop: 40, background: 'rgba(124, 92, 252, 0.02)', borderLeft: '4px solid var(--accent-primary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                     <Sparkles size={16} color="var(--accent-primary)" />
                     <span style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--accent-primary)', textTransform: 'uppercase' }}>Archetype Profile</span>
                  </div>
                  <p style={{ fontSize: '1.1rem', color: 'var(--text-primary)', fontWeight: 700, lineHeight: 1.5, margin: 0 }}>
                     "{genome.dna.description}"
                  </p>
               </div>
            )}
         </div>

         {/* Samples Sidebar */}
         <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            <div className="glass" style={{ padding: 32, borderRadius: 28 }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                     <Quote size={20} color="var(--accent-secondary)" />
                     <h3 style={{ fontSize: '1.1rem', fontWeight: 900 }}>Style Samples</h3>
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-tertiary)' }}>{genome.samples.length}/5</span>
               </div>
               <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {genome.samples.map((s, i) => (
                     <div key={i} className="glass glass-hover" style={{ padding: '12px 16px', borderRadius: 12, fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{s}</span>
                        <ChevronRight size={14} style={{ opacity: 0.3 }} />
                     </div>
                  ))}
                  {genome.samples.length === 0 && <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-tertiary)', padding: '20px 0' }}>Add samples to extract DNA.</p>}
               </div>
            </div>

            <div className="glass glass-hover" style={{ padding: 32, borderRadius: 28, background: 'var(--gradient-primary)05', border: '1px solid var(--accent-primary)20' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <ZapIcon size={18} color="var(--accent-primary)" />
                  <span style={{ fontSize: '0.7rem', fontWeight: 950, color: 'var(--accent-primary)', textTransform: 'uppercase' }}>Extraction Tip</span>
               </div>
               <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                  Unique style DNA extraction improves AI generation alignment by 42%. Use your best performing scripts as samples.
               </p>
            </div>
         </div>

      </div>
    </div>
  );
}
