import React, { useState, useEffect } from 'react';
import { 
  Image as ImageIcon, Music, Trash2, Filter, Loader2, ExternalLink, 
  Calendar, Copy, Download, Play, Pause, Search, Folders,
  Layers, HardDrive, Smartphone, Monitor, ChevronRight, Info,
  RefreshCw, Zap, MoreHorizontal, Grid, List as ListIcon,
  X, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { dbService } from '../services/dbService.js';

export default function AssetLibrary() {
  const { user } = useAuth();
  const { addToast } = useToast();
  
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');

  const loadAssets = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await dbService.getAssets(user.id);
      setAssets(data);
    } catch (err) {
      addToast('error', 'Vault failed to synchronize.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAssets(); }, [user]);

  const handleDelete = async (id) => {
    if (!confirm('Permanent deletion of this asset?')) return;
    try {
      await dbService.deleteAsset(id);
      setAssets(prev => prev.filter(a => a.id !== id));
      addToast('success', 'Asset removed from vault.');
    } catch (err) {
      addToast('error', 'Deletion failed.');
    }
  };

  const filteredAssets = assets.filter(a => {
    if (filter === 'all') return true;
    return a.type === filter;
  });

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString(undefined, { 
       month: 'short', day: 'numeric', year: 'numeric' 
    }).toUpperCase();
  };

  if (loading) return (
     <div className="tab-content center-content" style={{ minHeight: '60vh' }}>
        <RefreshCw size={48} className="animate-spin" color="var(--accent-primary)" />
     </div>
  );

  return (
    <div className="tab-content animate-slide-up">
      <div className="tab-header" style={{ marginBottom: 40 }}>
        <div className="stagger-children">
          <h2 className="tab-title text-gradient-aurora" style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.04em' }}>Visual Vault</h2>
          <p className="tab-subtitle" style={{ fontSize: '1.1rem' }}>Centralized high-fidelity asset synchronization & archival</p>
        </div>
        
        <div style={{ display: 'flex', gap: 12 }}>
           <div className="glass" style={{ display: 'flex', padding: 4, borderRadius: 12 }}>
              <button 
                onClick={() => setViewMode('grid')}
                className={viewMode === 'grid' ? 'btn-secondary' : 'glass-hover'}
                style={{ padding: 8, borderRadius: 8, border: 'none', background: viewMode === 'grid' ? 'var(--bg-tertiary)' : 'transparent', color: viewMode === 'grid' ? 'var(--accent-primary)' : 'var(--text-tertiary)' }}
              >
                <Grid size={18} />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={viewMode === 'list' ? 'btn-secondary' : 'glass-hover'}
                style={{ padding: 8, borderRadius: 8, border: 'none', background: viewMode === 'list' ? 'var(--bg-tertiary)' : 'transparent', color: viewMode === 'list' ? 'var(--accent-primary)' : 'var(--text-tertiary)' }}
              >
                <ListIcon size={18} />
              </button>
           </div>
           <button onClick={loadAssets} className="btn-secondary" style={{ padding: '12px' }}>
              <RefreshCw size={18} />
           </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 32, overflowX: 'auto', paddingBottom: 8, scrollbarWidth: 'none' }}>
         <FilterPill label="All Assets" active={filter === 'all'} onClick={() => setFilter('all')} icon={Folders} />
         <FilterPill label="Images" active={filter === 'image'} onClick={() => setFilter('image')} icon={ImageIcon} />
         <FilterPill label="Audio" active={filter === 'audio'} onClick={() => setFilter('audio')} icon={Music} />
      </div>

      <AnimatePresence mode="wait">
        {filteredAssets.length === 0 ? (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="center-content" style={{ minHeight: '40vh' }}>
             <div className="glass" style={{ padding: 48, borderRadius: 32, textAlign: 'center' }}>
                <HardDrive size={48} style={{ opacity: 0.1, margin: '0 auto 24px' }} />
                <p style={{ color: 'var(--text-tertiary)', fontWeight: 800 }}>No synchronized assets in this sector.</p>
             </div>
          </motion.div>
        ) : (
          <motion.div 
             key={viewMode}
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             style={{ 
               display: viewMode === 'grid' ? 'grid' : 'flex',
               flexDirection: 'column',
               gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
               gap: 24
             }}
          >
            {filteredAssets.map(asset => (
              <AssetCard 
                 key={asset.id} 
                 asset={asset} 
                 viewMode={viewMode} 
                 onDelete={() => handleDelete(asset.id)} 
                 formatDate={formatDate}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FilterPill({ label, active, onClick, icon: Icon }) {
   return (
      <button 
         onClick={onClick}
         className={`glass glass-hover ${active ? 'glass-strong' : ''}`}
         style={{ 
            padding: '10px 20px', borderRadius: 100, border: active ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
            display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap', cursor: 'pointer',
            color: active ? 'var(--accent-primary)' : 'var(--text-secondary)',
            fontWeight: 800, fontSize: '0.85rem'
         }}
      >
         <Icon size={16} />
         <span>{label}</span>
      </button>
   );
}

function AssetCard({ asset, viewMode, onDelete, formatDate }) {
   const isImage = asset.type === 'image';
   
   if (viewMode === 'list') {
      return (
         <div className="glass glass-hover" style={{ padding: '16px 24px', borderRadius: 16, display: 'flex', alignItems: 'center', gap: 20 }}>
            <div className="glow-border" style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--bg-tertiary)', overflow: 'hidden', flexShrink: 0 }}>
               {isImage ? <img src={asset.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Music size={20} style={{ margin: 12, color: 'var(--accent-secondary)' }} />}
            </div>
            <div style={{ flex: 1 }}>
               <h4 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0 }}>{asset.name || 'Unnamed Asset'}</h4>
               <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', fontWeight: 900 }}>{formatDate(asset.created_at)}</span>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
               <a href={asset.url} target="_blank" rel="noreferrer" className="btn-secondary" style={{ padding: 8 }}><ExternalLink size={16} /></a>
               <button onClick={onDelete} className="btn-secondary" style={{ padding: 8, color: 'var(--accent-danger)' }}><Trash2 size={16} /></button>
            </div>
         </div>
      );
   }

   return (
      <motion.div 
         whileHover={{ y: -8 }}
         className="glass glass-hover"
         style={{ borderRadius: 24, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
      >
         <div style={{ width: '100%', aspectRatio: '1/1', background: 'var(--bg-tertiary)', position: 'relative', overflow: 'hidden' }}>
            {isImage ? (
               <img src={asset.url} alt={asset.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
               <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-secondary)' }}>
                  <Music size={48} />
               </div>
            )}
            <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: 8 }}>
               <button onClick={onDelete} className="glass" style={{ padding: 8, borderRadius: 10, border: 'none', background: 'rgba(0,0,0,0.4)', color: '#fff', cursor: 'pointer' }}>
                  <Trash2 size={14} />
               </button>
            </div>
         </div>
         <div style={{ padding: 20 }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 900, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{asset.name || 'Unnamed Asset'}</h4>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', fontWeight: 900 }}>{formatDate(asset.created_at)}</span>
               <a href={asset.url} target="_blank" rel="noreferrer" className="glass glass-hover" style={{ padding: '4px 12px', borderRadius: 8, fontSize: '0.7rem', fontWeight: 900, color: 'var(--accent-primary)', textDecoration: 'none' }}>
                  VIEW <ExternalLink size={10} style={{ marginLeft: 4 }} />
               </a>
            </div>
         </div>
      </motion.div>
   );
}
