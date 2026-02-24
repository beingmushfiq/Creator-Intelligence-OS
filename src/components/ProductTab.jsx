import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, Target, Rocket, Lightbulb, ArrowUpRight, 
  Layers, ListChecks, Calendar, DollarSign, Wand2, 
  ChevronRight, BookOpen, Clock, Zap, Star, RefreshCw,
  TrendingUp, ShieldCheck, ChevronDown, Plus, Info
} from 'lucide-react';
import { useCreator } from '../context/CreatorContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { generateProductStrategy } from '../engine/aiService.js';

export default function ProductTab() {
  const { data, loading, topic, setData } = useCreator();
  const { addToast } = useToast();
  const product = data?.product;
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeView, setActiveView] = useState('ladder');

  const fetchProductStrategy = async () => {
    if (!topic || isGenerating) return;
    setIsGenerating(true);
    try {
      const result = await generateProductStrategy(topic, data?.niche || 'Digital Content', data?.genome?.dna_snippet);
      setData(prev => ({
        ...prev,
        product: result
      }));
      addToast('success', 'Digital Product Blueprint mapped!');
    } catch (err) {
      addToast('error', 'Failed to architect digital product.');
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (topic && !product && !loading) {
      fetchProductStrategy();
    }
  }, [topic, product, loading]);

  if (isGenerating) return (
    <div className="tab-content center-content">
       <div style={{ textAlign: 'center' }}>
          <RefreshCw size={48} className="spin" color="var(--accent-primary)" style={{ marginBottom: 24 }} />
          <h3 className="text-gradient" style={{ fontSize: '1.5rem', fontWeight: 800 }}>Architecting Digital Ecosystem</h3>
          <p style={{ color: 'var(--text-tertiary)' }}>Calculating value ladders, curriculum modules, and launch runways...</p>
       </div>
    </div>
  );

  if (!product) return (
    <div className="tab-content center-content">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="empty-state" 
        style={{ maxWidth: 600 }}
      >
        <div className="empty-state-icon" style={{ background: 'var(--accent-warning)15', color: 'var(--accent-warning)' }}>
          <ShoppingBag size={32} />
        </div>
        <h3>Product Architect</h3>
        <p>Transition from content consumer to asset owner. Design a high-conversion digital product suite tailored to your audience DNA.</p>
        <button onClick={fetchProductStrategy} className="shiny-button" style={{ marginTop: 24, padding: '16px 32px' }}>
          <Wand2 size={18} /> Initialize Monetization Engine
        </button>
      </motion.div>
    </div>
  );

  return (
    <div className="tab-content">
      <div className="tab-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20 }}>
        <div>
          <h2 className="tab-title text-gradient">Product Architect</h2>
          <p className="tab-subtitle">Monetizing {topic} beyond the algorithmic feed</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <div className="view-switcher" style={{ background: 'var(--bg-tertiary)', padding: 4, borderRadius: 12, border: '1px solid var(--border-subtle)', display: 'flex' }}>
             {['ladder', 'blueprint', 'launch'].map(v => (
                <button 
                  key={v}
                  onClick={() => setActiveView(v)}
                  style={{ 
                    fontSize: '0.75rem', fontWeight: 700, padding: '8px 16px', borderRadius: 8, border: 'none',
                    background: activeView === v ? 'var(--bg-secondary)' : 'transparent',
                    color: activeView === v ? 'var(--accent-primary)' : 'var(--text-tertiary)',
                    cursor: 'pointer', transition: 'all 0.2s', textTransform: 'uppercase', letterSpacing: '0.05em'
                  }}
                >
                  {v}
                </button>
             ))}
          </div>
          <button onClick={fetchProductStrategy} className="btn-secondary" style={{ padding: '8px 16px' }}>
             <RefreshCw size={18} />
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeView === 'ladder' && (
          <motion.div 
            key="ladder"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20 }}
          >
             {product.valueLadder.map((step, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -6, borderColor: 'var(--accent-primary)40' }}
                  className="card" 
                  style={{ padding: 24, position: 'relative', display: 'flex', flexDirection: 'column', gap: 16, background: i % 2 === 0 ? 'var(--bg-secondary)' : 'var(--bg-tertiary)' }}
                >
                   <div style={{ position: 'absolute', top: 12, right: 12, fontSize: '0.65rem', fontWeight: 900, color: 'var(--text-tertiary)', opacity: 0.5 }}>STEP 0{i+1}</div>
                   <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ padding: 8, background: 'var(--bg-primary)', borderRadius: 10, border: '1px solid var(--border-subtle)' }}>
                         {i === 0 && <Lightbulb size={20} color="var(--accent-success)" />}
                         {i === 1 && <DollarSign size={20} color="var(--accent-warning)" />}
                         {i === 2 && <Star size={20} color="var(--accent-primary)" />}
                         {i === 3 && <Zap size={20} color="var(--accent-secondary)" />}
                      </div>
                      <span className="badge badge-purple" style={{ fontSize: '0.65rem' }}>{step.level}</span>
                   </div>
                   <div>
                      <h4 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: 4 }}>{step.name}</h4>
                      <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--accent-primary)' }}>{step.price}</div>
                   </div>
                   <div style={{ padding: 16, background: 'var(--bg-primary)80', borderRadius: 16, border: '1px solid var(--border-subtle)', fontSize: '0.85rem' }}>
                      <div style={{ fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: 4 }}>Primary Deliverable</div>
                      <p style={{ margin: 0, color: 'var(--text-secondary)', fontWeight: 600 }}>{step.deliverable}</p>
                   </div>
                </motion.div>
             ))}
             
             <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.5 }}
               className="card card-full" 
               style={{ 
                 background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%)', 
                 border: '1px solid var(--accent-success)30', padding: 32, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap'
               }}
             >
                <div style={{ flex: 1, minWidth: 300 }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                      <div style={{ padding: 8, background: 'var(--accent-success)15', color: 'var(--accent-success)', borderRadius: 10 }}><TrendingUp size={20} /></div>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Profit Projections</h3>
                   </div>
                   <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', margin: 0 }}>{product.revenueModel.logic}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                   <div style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: 4 }}>Est. First 90 Days</div>
                   <div style={{ fontSize: '2.5rem', fontWeight: 950, color: 'var(--accent-success)', letterSpacing: '-0.02em' }}>{product.revenueModel.projection}</div>
                </div>
             </motion.div>
          </motion.div>
        )}

        {activeView === 'blueprint' && (
          <motion.div 
            key="blueprint"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="card"
            style={{ padding: 0, overflow: 'hidden' }}
          >
             <div style={{ padding: '32px 40px', background: 'var(--bg-secondary)50', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 20 }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: 'var(--accent-primary)15', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                   <BookOpen size={28} color="var(--accent-primary)" />
                </div>
                <div>
                   <h3 style={{ fontSize: '1.5rem', fontWeight: 900 }}>{product.blueprint.title}</h3>
                   <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>
                      <span>Core Curriculum Architect</span>
                      <div className="dot" />
                      <span>{product.blueprint.modules.length} Strategic Modules</span>
                   </div>
                </div>
             </div>
             
             <div style={{ padding: 40 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 32 }}>
                   {product.blueprint.modules.map((mod, i) => (
                      <motion.div 
                        key={i} 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="module-block"
                      >
                         <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--accent-primary)', color: '#fff', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 950, boxShadow: '0 4px 10px var(--accent-primary)40' }}>{i + 1}</div>
                            <h4 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{mod.title}</h4>
                         </div>
                         <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingLeft: 40 }}>
                            {mod.lessons.map((lesson, li) => (
                               <div key={li} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '0.9rem', color: 'var(--text-secondary)', padding: '12px 16px', background: 'var(--bg-secondary)', borderRadius: 12, border: '1px solid var(--border-subtle)', transition: 'all 0.2s' }}>
                                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-primary)40' }} />
                                  {lesson}
                               </div>
                            ))}
                         </div>
                      </motion.div>
                   ))}
                </div>
             </div>
          </motion.div>
        )}

        {activeView === 'launch' && (
          <motion.div 
            key="launch"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 24 }}
          >
             {product.launchRunway.map((phase, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="card" 
                  style={{ padding: 32, display: 'flex', gap: 40, alignItems: 'flex-start', borderLeft: '4px solid var(--accent-primary)' }}
                >
                   <div style={{ textAlign: 'center', minWidth: 100 }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Phase</div>
                      <div style={{ fontSize: '3.5rem', fontWeight: 950, color: 'var(--accent-primary)', lineHeight: 1 }}>0{phase.week}</div>
                   </div>
                   <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                         <Rocket size={20} color="var(--accent-secondary)" />
                         <h4 style={{ fontSize: '1.4rem', fontWeight: 900 }}>{phase.theme}</h4>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
                         {phase.actions.map((action, ai) => (
                            <div key={ai} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '0.95rem', color: 'var(--text-secondary)', padding: '16px 20px', background: 'var(--bg-tertiary)', borderRadius: 16, border: '1px solid var(--border-subtle)' }}>
                               <CheckCircle2 size={16} color="var(--accent-success)" style={{ flexShrink: 0 }} />
                               {action}
                            </div>
                         ))}
                      </div>
                   </div>
                </motion.div>
             ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const CheckCircle2 = ({ size, className, color, style }) => (
  <Star size={size} className={className} color={color} style={style} />
);
