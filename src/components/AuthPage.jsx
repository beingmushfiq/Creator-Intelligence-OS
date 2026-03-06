import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { Zap, Loader2, ArrowRight, Mail, Lock, Sparkles } from 'lucide-react';

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signIn, signUp } = useAuth();
  const { addToast } = useToast();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useSpring(x, { stiffness: 50, damping: 10 });
  const mouseY = useSpring(y, { stiffness: 50, damping: 10 });

  function handleMouseMove(event) {
    const { clientX, clientY } = event;
    const { innerWidth, innerHeight } = window;
    x.set((clientX / innerWidth) - 0.5);
    y.set((clientY / innerHeight) - 0.5);
  }

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [8, -8]); 
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-8, 8]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isLogin) {
        await signIn(email, password);
        addToast('success', 'Neural link established. Welcome back.');
      } else {
        await signUp(email, password);
        addToast('success', 'Operative registered! Check communications to confirm origin.');
        setIsLogin(true);
      }
    } catch (error) {
      const msg = error.message || 'Authentication failed.';
      if (isLogin && msg.includes('Invalid login credentials')) {
        addToast('error', 'Invalid credentials. If you just registered, check your email for a confirmation link first.');
      } else {
        addToast('error', msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-primary)',
        overflow: 'hidden',
        perspective: 1200,
        zIndex: 9999,
      }}
    >
      {/* Dynamic Background Ambience */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <motion.div 
          style={{ 
            x: useTransform(mouseX, [-0.5, 0.5], [-40, 40]), 
            y: useTransform(mouseY, [-0.5, 0.5], [-40, 40]),
            position: 'absolute', top: '15%', left: '15%',
            width: 700, height: 700,
            background: 'rgba(124, 92, 252, 0.08)',
            borderRadius: '50%', filter: 'blur(120px)',
          }}
        />
        <motion.div 
          style={{ 
            x: useTransform(mouseX, [-0.5, 0.5], [40, -40]), 
            y: useTransform(mouseY, [-0.5, 0.5], [40, -40]),
            position: 'absolute', bottom: '15%', right: '15%',
            width: 700, height: 700,
            background: 'rgba(0, 212, 255, 0.08)',
            borderRadius: '50%', filter: 'blur(120px)',
          }}
        />
        <div style={{ 
          position: 'absolute', inset: 0, opacity: 0.04, 
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)', 
          backgroundSize: '40px 40px' 
        }} />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="glass glass-strong"
        style={{ 
          rotateX, rotateY, transformStyle: "preserve-3d",
          width: '100%', maxWidth: 440, margin: '0 16px',
          position: 'relative', zIndex: 10, borderRadius: 24,
          overflow: 'hidden', boxShadow: '0 0 80px rgba(124, 92, 252, 0.25)',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.06), transparent)', pointerEvents: 'none' }} />
        <div style={{ height: 4, width: '100%', background: 'var(--gradient-aurora)', opacity: 0.9 }} />

        <div style={{ padding: '40px 32px 32px' }}>
          {/* Header */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 40, position: 'relative' }}>
            <motion.div 
              whileHover={{ rotate: 180, scale: 1.1 }}
              transition={{ duration: 0.5, type: 'spring' }}
              className="glow-border"
              style={{
                width: 72, height: 72, borderRadius: 20,
                background: 'var(--bg-tertiary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: 'var(--shadow-glow)', marginBottom: 24, cursor: 'pointer',
              }}
            >
              <Zap style={{ color: 'var(--accent-primary)', width: 36, height: 36 }} />
            </motion.div>
            
            <motion.div
              key={isLogin ? 'login-title' : 'signup-title'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              style={{ textAlign: 'center' }}
            >
              <h2 className="text-gradient-aurora" style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', fontWeight: 900, marginBottom: 8, letterSpacing: '-0.03em' }}>
                {isLogin ? 'Neural Link' : 'Initialize Node'}
              </h2>
              <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem', fontWeight: 500, maxWidth: 280, margin: '0 auto', lineHeight: 1.5 }}>
                {isLogin ? 'Authenticate to access the intelligence hub.' : 'Deploy a new operative instance.'}
              </p>
            </motion.div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 900, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8, marginLeft: 4 }}>Operative Identifier (Email)</label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, paddingLeft: 16, display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
                    <Mail style={{ width: 18, height: 18, color: 'var(--text-tertiary)' }} />
                  </div>
                  <input
                    type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: '100%', background: 'var(--bg-tertiary)', border: '1px solid var(--border-medium)',
                      borderRadius: 16, padding: '16px 16px 16px 48px', color: 'var(--text-primary)', fontSize: '1rem',
                      outline: 'none', transition: 'all 0.3s'
                    }}
                    placeholder="operative@domain.com"
                    onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--border-medium)'}
                  />
                </div>
              </motion.div>
              
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <label style={{ fontSize: '0.65rem', fontWeight: 900, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginLeft: 4 }}>Security Key</label>
                  {isLogin && <a href="#" style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-primary)' }}>Lost Key?</a>}
                </div>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, paddingLeft: 16, display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
                    <Lock style={{ width: 18, height: 18, color: 'var(--text-tertiary)' }} />
                  </div>
                  <input
                    type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                    style={{
                      width: '100%', background: 'var(--bg-tertiary)', border: '1px solid var(--border-medium)',
                      borderRadius: 16, padding: '16px 16px 16px 48px', color: 'var(--text-primary)', fontSize: '1rem',
                      outline: 'none', transition: 'all 0.3s'
                    }}
                    placeholder="••••••••••••"
                    onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--border-medium)'}
                  />
                </div>
              </motion.div>
            </div>

            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              type="submit" disabled={loading}
              className="btn-primary"
              style={{
                width: '100%', padding: '18px', borderRadius: 16, fontSize: '1.05rem', fontWeight: 900,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 8,
                boxShadow: '0 8px 30px rgba(124, 92, 252, 0.4)', cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1, border: 'none'
              }}
            >
              {loading ? (
                <Loader2 style={{ width: 22, height: 22, animation: 'spin 1s linear infinite' }} />
              ) : (
                <>
                  {isLogin ? 'Establish Link' : 'Deploy Node'}
                  <Sparkles size={20} />
                </>
              )}
            </motion.button>
          </form>

          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--border-subtle)', textAlign: 'center' }}
          >
            <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', marginBottom: 12, fontWeight: 500 }}>
              {isLogin ? "No active node registered?" : "Already deployed an operative core?"}
            </p>
            <button
              onClick={() => setIsLogin(!isLogin)}
              style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-secondary)', cursor: 'pointer', background: 'none', border: 'none', transition: 'color 0.2s', display: 'flex', alignItems: 'center', gap: 6, margin: '0 auto' }}
              onMouseOver={(e) => e.target.style.color = 'var(--accent-primary)'}
              onMouseOut={(e) => e.target.style.color = 'var(--text-secondary)'}
            >
              {isLogin ? "Initialize New Node" : "Link Existing Node"} <ArrowRight size={16} />
            </button>
          </motion.div>
        </div>
        
        {/* Footer Security Badge */}
        <div style={{ background: 'rgba(10, 10, 15, 0.6)', padding: 16, borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
           <Lock size={12} color="var(--accent-success)" />
           <span style={{ fontSize: '0.65rem', color: 'var(--accent-success)', textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 900, opacity: 0.8 }}>E2E Encrypted Protocol via Supabase</span>
        </div>
      </motion.div>
    </div>
  );
}
