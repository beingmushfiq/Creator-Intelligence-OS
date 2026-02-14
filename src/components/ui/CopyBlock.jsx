import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export function CopyBlock({ content, label }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="copy-block">
      {label && <div className="meta-label" style={{ marginBottom: 8 }}>{label}</div>}
      {content}
      <button className="copy-block-btn" onClick={handleCopy}>
        {copied ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
      </button>
    </div>
  );
}
