import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Zap, Loader2, ArrowRight, Mail, Lock, User, MousePointer2 } from 'lucide-react';

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signIn, signUp } = useAuth();
  const { addToast } = useToast();

  // Mouse interactivity for 3D Tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useSpring(x, { stiffness: 50, damping: 10 });
  const mouseY = useSpring(y, { stiffness: 50, damping: 10 });

  function handleMouseMove(event) {
    const { clientX, clientY } = event;
    const { innerWidth, innerHeight } = window;
    // Calculate percentage from center (-0.5 to 0.5)
    x.set((clientX / innerWidth) - 0.5);
    y.set((clientY / innerHeight) - 0.5);
  }

  // Tilt values
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [7, -7]); // Slightly increased tilt
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-7, 7]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isLogin) {
        await signIn(email, password);
        addToast('success', 'Welcome back, Creator.');
      } else {
        await signUp(email, password);
        addToast('success', 'Account created! Check your email to confirm before logging in.');
        setIsLogin(true); // Switch to login after signup
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
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
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
        {/* Moving Blobs */}
        <motion.div 
          style={{ 
            x: useTransform(mouseX, [-0.5, 0.5], [-30, 30]), 
            y: useTransform(mouseY, [-0.5, 0.5], [-30, 30]),
            position: 'absolute',
            top: '20%',
            left: '20%',
            width: 600,
            height: 600,
            background: 'rgba(124, 92, 252, 0.06)',
            borderRadius: '50%',
            filter: 'blur(100px)',
          }}
        />
        <motion.div 
          style={{ 
            x: useTransform(mouseX, [-0.5, 0.5], [30, -30]), 
            y: useTransform(mouseY, [-0.5, 0.5], [30, -30]),
            position: 'absolute',
            bottom: '20%',
            right: '20%',
            width: 600,
            height: 600,
            background: 'rgba(0, 212, 255, 0.06)',
            borderRadius: '50%',
            filter: 'blur(100px)',
          }}
        />
        
        {/* Grid Pattern */}
        <div style={{ 
          position: 'absolute', 
          inset: 0, 
          opacity: 0.03, 
          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', 
          backgroundSize: '40px 40px' 
        }} />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{ 
          rotateX, 
          rotateY,
          transformStyle: "preserve-3d",
          width: '100%',
          maxWidth: 420,
          margin: '0 16px',
          position: 'relative',
          zIndex: 10,
          borderRadius: 16,
          overflow: 'hidden',
          background: 'rgba(22, 22, 31, 0.85)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 0 60px rgba(124, 92, 252, 0.25)',
        }}
      >
        {/* Shine Effect */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.05), transparent)', pointerEvents: 'none' }} />
        
        {/* Top Accent Line */}
        <div style={{ height: 3, width: '100%', background: 'var(--gradient-primary)', opacity: 0.7 }} />

        <div style={{ padding: '32px 32px 24px' }}>
          {/* Header */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32, position: 'relative' }}>
            <motion.div 
              whileHover={{ rotate: 180, scale: 1.1 }}
              transition={{ duration: 0.5, type: 'spring' }}
              style={{
                width: 64,
                height: 64,
                borderRadius: 16,
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-medium)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-glow)',
                marginBottom: 24,
                cursor: 'pointer',
              }}
            >
              <Zap style={{ color: 'var(--accent-primary)', width: 32, height: 32 }} />
            </motion.div>
            
            <motion.div
              key={isLogin ? 'login-title' : 'signup-title'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              style={{ textAlign: 'center' }}
            >
              <h2 style={{ fontSize: '1.75rem', fontFamily: 'var(--font-display)', fontWeight: 700, color: '#fff', marginBottom: 8, letterSpacing: '-0.02em' }}>
                {isLogin ? 'Welcome Back' : 'Join the Revolution'}
              </h2>
              <p style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem', maxWidth: 280, margin: '0 auto', lineHeight: 1.5 }}>
                {isLogin ? 'Enter the flow state and create.' : 'Unleash your creative potential with AI.'}
              </p>
            </motion.div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <motion.div 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ delay: 0.2 }}
              >
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8, marginLeft: 2 }}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, paddingLeft: 12, display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
                    <Mail style={{ width: 18, height: 18, color: 'var(--text-tertiary)' }} />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(17, 17, 24, 0.5)',
                      border: '1px solid var(--border-medium)',
                      borderRadius: 12,
                      paddingLeft: 40,
                      paddingRight: 16,
                      paddingTop: 14,
                      paddingBottom: 14,
                      color: 'var(--text-primary)',
                      fontSize: '0.95rem',
                    }}
                    placeholder="name@example.com"
                  />
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ delay: 0.3 }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <label style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginLeft: 2 }}>Password</label>
                  {isLogin && <a href="#" style={{ fontSize: '0.75rem', color: 'var(--accent-secondary)' }}>Forgot?</a>}
                </div>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, paddingLeft: 12, display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
                    <Lock style={{ width: 18, height: 18, color: 'var(--text-tertiary)' }} />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(17, 17, 24, 0.5)',
                      border: '1px solid var(--border-medium)',
                      borderRadius: 12,
                      paddingLeft: 40,
                      paddingRight: 16,
                      paddingTop: 14,
                      paddingBottom: 14,
                      color: 'var(--text-primary)',
                      fontSize: '0.95rem',
                    }}
                    placeholder="••••••••"
                  />
                </div>
              </motion.div>
            </div>

            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                background: 'var(--gradient-primary)',
                color: '#fff',
                fontWeight: 700,
                padding: '16px',
                borderRadius: 12,
                fontSize: '0.95rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                marginTop: 8,
                boxShadow: '0 4px 20px rgba(124, 92, 252, 0.3)',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? (
                <Loader2 style={{ width: 20, height: 20, animation: 'spin 1s linear infinite' }} />
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight style={{ width: 20, height: 20 }} />
                </>
              )}
            </motion.button>
          </form>

          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.5 }}
            style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--border-subtle)', textAlign: 'center' }}
          >
            <p style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)', marginBottom: 8 }}>
              {isLogin ? "New to Creator OS?" : "Already a member?"}
            </p>
            <button
              onClick={() => setIsLogin(!isLogin)}
              style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--accent-secondary)', cursor: 'pointer', background: 'none', border: 'none' }}
            >
              {isLogin ? "Create an account →" : "Sign in to your account →"}
            </button>
          </motion.div>
        </div>
        
        {/* Footer Security Badge */}
        <div style={{
          background: 'rgba(17, 17, 24, 0.4)',
          padding: 12,
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 8,
        }}>
           <Lock style={{ width: 12, height: 12, color: 'var(--text-tertiary)' }} />
           <span style={{ fontSize: '0.6rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.6, fontWeight: 600 }}>Secured via Supabase</span>
        </div>
      </motion.div>
    </div>
  );
}

