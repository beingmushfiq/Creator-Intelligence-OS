import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Layers, Sparkles, Copy, Check, Download, RefreshCw, 
  Loader2, Play, Layout, Maximize2, Palette, Zap, 
  Video, Share2, ArrowRight, BookOpen, Smartphone,
  Linkedin, Twitter, Info, MoreHorizontal, Globe,
  MessageSquare, Camera
} from 'lucide-react';
import { useCreator } from '../context/CreatorContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { getVisualRepurposingPlan, generateImage } from '../engine/aiService.js';

export default function OmnichannelTab() {
  const { data, setData, topic } = useCreator();
  const { addToast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [genId, setGenId] = useState(null);
  const [copyType, setCopyType] = useState(null);

  const plan = data?.omnichannel?.plan || [];

  const handleGeneratePlan = async () => {
    if (!topic) {
      addToast('error', 'Start a project first!');
      return;
    }
    setLoading(true);
    try {
      const scriptText = data?.script?.scenes ? JSON.stringify(data.script.scenes) : '';
      const result = await getVisualRepurposingPlan(topic, scriptText);
      setData(prev => ({
        ...prev,
        omnichannel: { ...prev.omnichannel, plan: result.variations }
      }));
      addToast('success', 'Omnichannel blueprint materialised');
    } catch (err) {
      addToast('error', 'Blueprint failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGenSlideImage = async (index) => {
    setGenId(index);
    try {
      const v = plan[index];
      const imageUrl = await generateImage(v.imagePrompt, '1:1');
      setData(prev => {
        const newPlan = [...prev.omnichannel.plan];
        newPlan[index] = { ...newPlan[index], mockupUrl: imageUrl };
        return {
          ...prev,
          omnichannel: { ...prev.omnichannel, plan: newPlan }
        };
      });
      addToast('success', `${v.platform} visual generated`);
    } catch (err) {
      addToast('error', 'Visual failed');
    } finally {
      setGenId(null);
    }
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopyType(type);
    addToast('success', 'Content captured');
    setTimeout(() => setCopyType(null), 2000);
  };

  if (plan.length === 0) return (
    <div className="tab-content center-content" style={{ minHeight: '60vh' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass glass-hover" style={{ maxWidth: 540, padding: 48, textAlign: 'center', borderRadius: 32 }}>
        <div className="glow-border" style={{ width: 80, height: 80, borderRadius: 24, background: 'var(--bg-tertiary)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <Share2 size={40} />
        </div>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: 16 }}>Omnichannel Architect</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6, marginBottom: 32 }}>Repurpose your core narrative into platform-native variants. Generate LinkedIn carousels, Twitter threads, and short-form scripts in one click.</p>
        <button onClick={handleGeneratePlan} className="btn-primary" style={{ padding: '16px 32px' }}>
          <Sparkles size={18} /> Initialize Omnichannel Map
        </button>
      </motion.div>
    </div>
  );

  return (
    <div className="tab-content animate-slide-up">
      <div className="tab-header" style={{ marginBottom: 40 }}>
        <div className="stagger-children">
          <h2 className="tab-title text-gradient-aurora" style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.04em' }}>Content Distribution</h2>
          <p className="tab-subtitle" style={{ fontSize: '1.1rem' }}>Platform-native repurposing & visual asset orchestration</p>
        </div>
        <button onClick={handleGeneratePlan} className="btn-secondary" style={{ padding: '12px 20px' }}>
          {loading ? <RefreshCw className="animate-spin" size={18} /> : <RefreshCw size={18} />}
        </button>
      </div>

      <div className="stagger-children" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 28 }}>
         {plan.map((v, i) => (
            <motion.div 
               key={i} 
               whileHover={{ y: -6 }}
               className="glass glass-hover" 
               style={{ padding: 40, borderRadius: 32, display: 'flex', flexDirection: 'column', gap: 32 }}
            >
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                     <div className="glow-border" style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--bg-tertiary)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {v.platform === 'LinkedIn' ? <Linkedin size={20} /> : v.platform === 'Twitter' ? <Twitter size={20} /> : <Smartphone size={20} />}
                     </div>
                     <h3 style={{ fontSize: '1.3rem', fontWeight: 900 }}>{v.platform}</h3>
                  </div>
                  <div className="glass" style={{ padding: '6px 14px', borderRadius: 100, fontSize: '0.65rem', fontWeight: 900, color: 'var(--accent-secondary)', background: 'rgba(0, 212, 255, 0.05)' }}>
                     {v.type.toUpperCase()}
                  </div>
               </div>

               <div style={{ display: 'grid', gridTemplateColumns: v.mockupUrl ? '1fr 120px' : '1fr', gap: 24, alignItems: 'center' }}>
                  <div>
                     <p style={{ fontSize: '1.05rem', color: 'var(--text-primary)', fontWeight: 700, margin: 0, lineHeight: 1.5 }}>{v.hook}</p>
                  </div>
                  {v.mockupUrl && (
                     <div className="glass" style={{ width: 120, height: 120, borderRadius: 16, overflow: 'hidden' }}>
                        <img src={v.mockupUrl} alt="mockup" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                     </div>
                  )}
               </div>

               <div className="glass" style={{ padding: 24, borderRadius: 20, background: 'rgba(255,255,255,0.02)' }}>
                  <div style={{ fontSize: '0.65rem', fontWeight: 900, color: 'var(--accent-primary)', textTransform: 'uppercase', marginBottom: 12, letterSpacing: '0.1em' }}>Core Body Content</div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>{v.body}</p>
               </div>

               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: 12 }}>
                  <div style={{ display: 'flex', gap: 12 }}>
                     <button 
                        onClick={() => copyToClipboard(v.body, i)}
                        className="btn-secondary" 
                        style={{ padding: '10px 20px' }}
                     >
                        {copyType === i ? <Check size={16} color="var(--accent-success)" /> : <Copy size={16} />}
                        <span>Capture</span>
                     </button>
                     <button 
                        onClick={() => handleGenSlideImage(i)}
                        className="btn-secondary" 
                        disabled={genId === i}
                        style={{ padding: '10px 20px' }}
                     >
                        {genId === i ? <RefreshCw className="animate-spin" size={16} /> : <Camera size={16} />}
                        <span>{v.mockupUrl ? 'Regen' : 'Forge'}</span>
                     </button>
                  </div>
                  <MoreHorizontal size={20} className="cursor-pointer" style={{ opacity: 0.3 }} />
               </div>
            </motion.div>
         ))}
      </div>
    </div>
  );
}
