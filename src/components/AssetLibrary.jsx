import React, { useState, useEffect } from 'react';
import { 
  Image as ImageIcon, Music, Trash2, Filter, Loader2, ExternalLink, 
  Calendar, Copy, Download, Play, Pause, Search, Folders,
  Layers, HardDrive, Smartphone, Monitor, ChevronRight, Info,
  Sparkles, FileText, Activity, RefreshCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { dbService } from '../services/dbService';

export default function AssetLibrary() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); 
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (user) loadAssets();
  }, [user]);

  const loadAssets = async () => {
    try {
      setLoading(true);
      const data = await dbService.getAssets(user.id);
      setAssets(data || []);
    } catch (err) {
      console.error('Asset load failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await dbService.deleteAsset(id);
      setAssets(prev => prev.filter(a => a.id !== id));
      addToast('success', 'Asset decommissioned.');
    } catch (err) {
      addToast('error', 'Decommission failed.');
    }
  };

  const filtered = filter === 'all' ? assets : assets.filter(a => a.type === filter);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (!user) {
    return (
      <div className="tab-content center-content">
        <div style={{ textAlign: 'center' }}>
          <HardDrive size={48} className="opacity-20" style={{ marginBottom: 20 }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Vault Authorization Required</h3>
          <p style={{ color: 'var(--text-tertiary)' }}>Sign in to access your secure creative asset library.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="tab-content">
      <div className="tab-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20 }}>
        <div>
          <h2 className="tab-title text-gradient">The Creative Vault</h2>
          <p className="tab-subtitle">{assets.length} high-fidelity assets synchronized across your workspace</p>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <div className="view-switcher" style={{ background: 'var(--bg-tertiary)', padding: 4, borderRadius: 12, border: '1px solid var(--border-subtle)', display: 'flex' }}>
             {[
               { key: 'all', label: 'All', Icon: Folders },
               { key: 'image', label: 'Images', Icon: ImageIcon },
               { key: 'audio', label: 'Audio', Icon: Music },
             ].map(f => (
                <button 
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  style={{ 
                    fontSize: '0.7rem', fontWeight: 800, padding: '8px 16px', borderRadius: 8, border: 'none',
                    background: filter === f.key ? 'var(--bg-secondary)' : 'transparent',
                    color: filter === f.key ? 'var(--accent-primary)' : 'var(--text-tertiary)',
                    cursor: 'pointer', transition: 'all 0.2s', textTransform: 'uppercase', letterSpacing: '0.05em',
                    display: 'flex', alignItems: 'center', gap: 6
                  }}
                >
                  <f.Icon size={14} />
                  <span>{f.label}</span>
                </button>
             ))}
          </div>
          <button onClick={loadAssets} className="btn-secondary" style={{ padding: '8px 16px' }}><RefreshCcw size={18} className={loading ? 'spin' : ''} /></button>
        </div>
      </div>

      {loading ? (
        <div className="center-content" style={{ minHeight: '400px' }}>
          <Loader2 size={48} className="spin opacity-20" color="var(--accent-primary)" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="center-content" style={{ minHeight: '400px' }}>
          <div style={{ textAlign: 'center' }}>
            <ImageIcon size={48} className="opacity-10" style={{ marginBottom: 20 }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-tertiary)' }}>Vault is Empty</h3>
            <p style={{ color: 'var(--text-tertiary)' }}>Generate visuals or audio to populate your library.</p>
          </div>
        </div>
      ) : (
        <motion.div 
           layout
           className="stagger-children" 
           style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}
        >
          <AnimatePresence>
            {filtered.map(asset => (
              <motion.div
                key={asset.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="card"
                style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)' }}
              >
                {/* Visual Preview */}
                <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden', background: 'var(--bg-tertiary)' }}>
                  {asset.type === 'image' ? (
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      style={{ 
                        width: '100%', height: '100%', backgroundImage: `url(${asset.url})`, 
                        backgroundSize: 'cover', backgroundPosition: 'center', cursor: 'zoom-in'
                      }}
                      onClick={() => setPreviewUrl(asset.url)}
                    >
                       <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', opacity: 0, transition: 'opacity 0.3s' }} className="hover-show">
                          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#fff' }}>
                             <ExternalLink size={24} />
                          </div>
                       </div>
                    </motion.div>
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
                       <Music size={40} color="var(--accent-primary)" style={{ filter: 'drop-shadow(0 0 10px var(--accent-primary)40)' }} />
                       <div style={{ display: 'flex', gap: 4, height: 20, alignItems: 'flex-end' }}>
                          {[...Array(8)].map((_, i) => (
                             <motion.div 
                               key={i} 
                               animate={{ height: [`40%`, `${Math.random() * 60 + 40}%`, `40%`] }}
                               transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                               style={{ width: 4, background: 'var(--accent-primary)', borderRadius: 2 }} 
                             />
                          ))}
                       </div>
                    </div>
                  )}
                  <div style={{ position: 'absolute', top: 12, right: 12 }}>
                     <div className={`badge badge-${asset.type === 'image' ? 'primary' : 'purple'}`} style={{ fontSize: '0.65rem', fontWeight: 900 }}>
                        {asset.type.toUpperCase()}
                     </div>
                  </div>
                </div>

                {/* Content Details */}
                <div style={{ padding: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                     <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                        Added {formatDate(asset.created_at)}
                     </span>
                  </div>

                  {asset.prompt && (
                    <p style={{ 
                      fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, height: 36, 
                      overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                      marginBottom: 20, fontStyle: 'italic'
                    }}>
                      "{asset.prompt}"
                    </p>
                  )}

                  <div style={{ display: 'flex', gap: 8 }}>
                    <a 
                      href={asset.url}
                      download={`asset-${asset.id}`}
                      className="shiny-button"
                      style={{ flex: 1, padding: '8px', fontSize: '0.75rem', gap: 6 }}
                    >
                      <Download size={14} /> <span>Fetch</span>
                    </a>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(asset.prompt);
                        addToast('success', 'Prompt synchronized.');
                      }}
                      className="btn-secondary"
                      style={{ padding: '8px' }}
                    >
                      <Copy size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(asset.id)}
                      className="btn-secondary"
                      style={{ padding: '8px', color: 'var(--accent-danger)', borderColor: 'var(--accent-danger)20', background: 'var(--accent-danger)05' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* High-Fidelity Preview Modal */}
      <AnimatePresence>
        {previewUrl && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setPreviewUrl(null)}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', zIndex: 10000,
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'zoom-out', padding: 40,
              backdropFilter: 'blur(20px)'
            }}
          >
            <motion.img
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              src={previewUrl}
              style={{ maxWidth: '90%', maxHeight: '90%', borderRadius: 24, boxShadow: '0 40px 100px rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)' }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
