import React from 'react';
import { RefreshCw } from 'lucide-react';

export function RegenerateButton({ onClick, loading, label = 'Regenerate' }) {
  return (
    <button className="btn-ghost" onClick={onClick} disabled={loading}>
      <RefreshCw size={14} className={loading ? 'spinning' : ''} style={loading ? { animation: 'spin 0.6s linear infinite' } : {}} />
      {label}
    </button>
  );
}
