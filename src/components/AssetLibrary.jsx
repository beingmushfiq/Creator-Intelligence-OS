import React, { useState, useEffect } from 'react';
import { Image, Music, Trash2, Filter, Loader2, ExternalLink, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { dbService } from '../services/dbService';

export default function AssetLibrary() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all | image | audio
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
      console.error('Failed to load assets:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await dbService.deleteAsset(id);
      setAssets(prev => prev.filter(a => a.id !== id));
      addToast('success', 'Asset deleted.');
    } catch (err) {
      addToast('error', 'Failed to delete asset.');
    }
  };

  const filtered = filter === 'all' ? assets : assets.filter(a => a.type === filter);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (!user) {
    return (
      <div className="tab-content">
        <div className="empty-state">
          <div className="empty-state-icon"><Image size={32} /></div>
          <h3>Sign In Required</h3>
          <p>Log in to access your saved assets.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="tab-content">
      {/* Header */}
      <div className="tab-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 className="tab-title text-gradient">Asset Library</h2>
          <p className="tab-subtitle">{assets.length} generated assets saved to your account</p>
        </div>

        {/* Filter Buttons */}
        <div style={{ display: 'flex', gap: 6 }}>
          {[
            { key: 'all', label: 'All', icon: null },
            { key: 'image', label: 'Images', icon: Image },
            { key: 'audio', label: 'Audio', icon: Music },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className="btn-ghost"
              style={{
                background: filter === f.key ? 'rgba(124, 92, 252, 0.15)' : undefined,
                borderColor: filter === f.key ? 'var(--border-accent)' : undefined,
                color: filter === f.key ? 'var(--accent-primary)' : undefined,
              }}
            >
              {f.icon && <f.icon size={14} />}
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 64 }}>
          <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', color: 'var(--accent-primary)' }} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state" style={{ marginTop: 48 }}>
          <div className="empty-state-icon"><Image size={32} /></div>
          <h3>No Assets Yet</h3>
          <p>Generate thumbnails or audio from other tabs to see them here.</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 'var(--space-lg)',
        }}>
          <AnimatePresence>
            {filtered.map(asset => (
              <motion.div
                key={asset.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="card"
                style={{ padding: 0, overflow: 'hidden' }}
              >
                {/* Preview Area */}
                {asset.type === 'image' ? (
                  <div 
                    style={{ 
                      width: '100%', 
                      height: 200, 
                      backgroundImage: `url(${asset.url})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      cursor: 'pointer',
                    }}
                    onClick={() => setPreviewUrl(asset.url)}
                  />
                ) : (
                  <div style={{ 
                    width: '100%', 
                    height: 120, 
                    background: 'var(--gradient-card)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    flexDirection: 'column',
                    gap: 8,
                  }}>
                    <Music size={32} style={{ color: 'var(--accent-primary)' }} />
                    <audio controls src={asset.url} style={{ width: '80%', height: 28 }} />
                  </div>
                )}

                {/* Info */}
                <div style={{ padding: 'var(--space-md)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <span className="badge" style={asset.type === 'audio' ? { background: 'rgba(0, 212, 255, 0.12)', color: 'var(--accent-secondary)', borderColor: 'rgba(0, 212, 255, 0.2)' } : {}}>
                      {asset.type === 'image' ? <Image size={10} /> : <Music size={10} />}
                      {asset.type}
                    </span>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {asset.type === 'image' && (
                        <a 
                          href={asset.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="btn-icon"
                          style={{ width: 28, height: 28 }}
                          title="Open full size"
                        >
                          <ExternalLink size={12} />
                        </a>
                      )}
                      <button 
                        onClick={() => handleDelete(asset.id)} 
                        className="btn-icon"
                        style={{ width: 28, height: 28, color: 'var(--accent-danger)' }}
                        title="Delete asset"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>

                  {asset.prompt && (
                    <p style={{ 
                      fontSize: '0.75rem', 
                      color: 'var(--text-secondary)', 
                      lineHeight: 1.4,
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      marginBottom: 8,
                    }}>
                      {asset.prompt}
                    </p>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.65rem', color: 'var(--text-tertiary)' }}>
                    <Calendar size={10} />
                    {formatDate(asset.created_at)}
                    {asset.projects?.topic && (
                      <span style={{ marginLeft: 8, opacity: 0.7 }}>• {asset.projects.topic}</span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Full-size Image Preview Modal */}
      <AnimatePresence>
        {previewUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreviewUrl(null)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.85)',
              zIndex: 10000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'zoom-out',
              padding: 32,
            }}
          >
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={previewUrl}
              alt="Full size preview"
              style={{ maxWidth: '90%', maxHeight: '90%', borderRadius: 12, boxShadow: '0 0 60px rgba(0,0,0,0.5)' }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
