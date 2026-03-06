import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { 
  Download, FileText, X, Sparkles, BarChart2, 
  Users, Briefcase, Zap, Star, Layout, 
  Globe, TrendingUp, Info, CheckCircle,
  Share2, Camera, ShieldCheck, HeartPulse
} from 'lucide-react';
import { useCreator } from '../context/CreatorContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function MediaKit({ isOpen, onClose, creatorData, dealsData }) {
  const { addToast } = useToast();
  const [generating, setGenerating] = useState(false);

  const generatePDF = async () => {
    setGenerating(true);
    addToast('info', 'Synthesizing professional dossier...');
    try {
      const doc = new jsPDF();
      doc.setFontSize(22);
      doc.text('CREATOR INTELLIGENCE DOSSIER', 20, 20);
      doc.setFontSize(14);
      doc.text(`Identity: ${creatorData?.handle || 'Unknown Operative'}`, 20, 40);
      doc.text(`Niche: ${creatorData?.niche || 'Generalist'}`, 20, 50);
      doc.save('Creator_Intelligence_Kit.pdf');
      addToast('success', 'Dossier synthesized and downloaded.');
    } catch (e) {
      addToast('error', 'Synthesis failure.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', padding: 20 }}
          onClick={onClose}
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="glass"
            style={{ width: '100%', maxWidth: 1000, maxHeight: '90vh', borderRadius: 40, border: '1px solid var(--accent-primary)30', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ padding: '32px 48px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-tertiary)30' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div className="glow-border" style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--bg-tertiary)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     <Sparkles size={22} />
                  </div>
                  <div>
                     <h2 style={{ fontSize: '1.5rem', fontWeight: 950, margin: 0 }}>Professional Media Kit</h2>
                     <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', margin: 0 }}>AI-Augmented ecosystem portfolio & engagement metrics</p>
                  </div>
               </div>
               <button onClick={onClose} className="btn-ghost" style={{ padding: 12, borderRadius: '50%' }}><X size={24} /></button>
            </div>

            {/* Content */}
            <div style={{ padding: 48, overflowY: 'auto', flex: 1 }}>
               
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, marginBottom: 48 }}>
                  
                  {/* Persona Summary */}
                  <div className="glass" style={{ padding: 40, borderRadius: 32, position: 'relative', overflow: 'hidden' }}>
                     <div style={{ position: 'absolute', right: -20, top: -20, opacity: 0.05 }}><Users size={160} /></div>
                     <h3 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: 28 }}>Creator Identity</h3>
                     <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <KitField label="HANDLE" value={`@${creatorData?.handle || 'operative'}`} />
                        <KitField label="NICHE" value={creatorData?.niche || 'Multi-Modal Specialist'} />
                        <KitField label="AUTHORITY RANK" value="Alpha Cluster" />
                     </div>
                  </div>

                  {/* Performance Metrics */}
                  <div className="glass" style={{ padding: 40, borderRadius: 32 }}>
                     <h3 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: 28 }}>Ecosystem Telemetry</h3>
                     <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                        <StatBox label="Impressions" value="1.2M+" color="var(--accent-primary)" />
                        <StatBox label="Engagement" value="8.4%" color="var(--accent-success)" />
                        <StatBox label="Retention" value="72s" color="var(--accent-secondary)" />
                        <StatBox label="Growth" value="+12%" color="var(--accent-warning)" />
                     </div>
                  </div>

               </div>

               {/* Active Deals / Partnerships */}
               <div style={{ marginBottom: 48 }}>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 900, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
                     <Briefcase size={22} color="var(--accent-secondary)" /> Strategic Partnerships
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
                     {dealsData?.slice(0, 3).map((deal, i) => (
                        <div key={i} className="glass glass-hover" style={{ padding: 28, borderRadius: 24 }}>
                           <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 8 }}>{deal.brand}</h4>
                           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-tertiary)' }}>{deal.status}</span>
                              <ShieldCheck size={16} color="var(--accent-success)" />
                           </div>
                        </div>
                     )) || <div className="glass" style={{ padding: 32, textAlign: 'center', opacity: 0.5 }}>No active partnerships mapped.</div>}
                  </div>
               </div>

               {/* Vision Statement */}
               <div className="glass" style={{ padding: 40, borderRadius: 32, background: 'var(--gradient-primary)05', border: '1px solid var(--accent-primary)20' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
                     <Globe size={22} color="var(--accent-primary)" /> Operational Philosophy
                  </h3>
                  <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0, fontStyle: 'italic' }}>
                     "Leveraging high-fidelity neural insights to saturate engagement loops across multi-modal platforms, ensuring maximum retention and recursive audience acquisition."
                  </p>
               </div>

            </div>

            {/* Footer / Actions */}
            <div style={{ padding: '32px 48px', borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-tertiary)30', display: 'flex', justifyContent: 'flex-end', gap: 16 }}>
               <button className="btn-secondary" style={{ padding: '12px 24px' }}>
                  <Share2 size={18} />
                  <span>Share Kit</span>
               </button>
               <button onClick={generatePDF} disabled={generating} className="btn-primary" style={{ padding: '12px 32px' }}>
                  {generating ? <RefreshCw className="animate-spin" size={18} /> : <Download size={18} />}
                  <span>{generating ? 'Synthesizing...' : 'Download Dossier (PDF)'}</span>
               </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function KitField({ label, value }) {
   return (
      <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: 16 }}>
         <div style={{ fontSize: '0.65rem', fontWeight: 950, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: 6 }}>{label}</div>
         <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>{value}</div>
      </div>
   );
}

function StatBox({ label, value, color }) {
   return (
      <div className="glass" style={{ padding: 20, borderRadius: 16, textAlign: 'center' }}>
         <div style={{ fontSize: '0.6rem', fontWeight: 950, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: 8 }}>{label}</div>
         <div style={{ fontSize: '1.4rem', fontWeight: 950, color: color }}>{value}</div>
      </div>
   );
}
