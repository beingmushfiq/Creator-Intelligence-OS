import React, { useState, useEffect, useRef } from 'react';
import { Edit2, Check, X } from 'lucide-react';

export default function EditableText({ 
  value, 
  onChange, 
  multiline = false, 
  className = '', 
  style = {},
  placeholder = 'Click to edit...'
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const inputRef = useRef(null);

  useEffect(() => {
    setTempValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (tempValue !== value) {
      onChange(tempValue);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !multiline && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div className={`editable-text-container ${className}`} style={{ position: 'relative', width: '100%' }}>
        {multiline ? (
          <textarea
            ref={inputRef}
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="editable-input"
            rows={5}
            style={{ 
              width: '100%', 
              padding: '8px',
              border: '1px solid var(--accent-primary)',
              borderRadius: '4px',
              background: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              fontFamily: 'inherit',
              fontSize: 'inherit',
              lineHeight: 'inherit',
              resize: 'vertical',
              ...style
            }}
          />
        ) : (
          <input
            ref={inputRef}
            type="text"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="editable-input"
            style={{ 
              width: '100%', 
              padding: '4px 8px',
              border: '1px solid var(--accent-primary)',
              borderRadius: '4px',
              background: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              fontFamily: 'inherit',
              fontSize: 'inherit',
              ...style
            }}
          />
        )}
        <div style={{ position: 'absolute', right: 0, top: -24, display: 'flex', gap: 4, zIndex: 10 }}>
          <button 
            onMouseDown={(e) => { e.preventDefault(); handleSave(); }}
            style={{ background: 'var(--accent-primary)', color: 'white', border: 'none', borderRadius: 4, padding: '2px 6px', cursor: 'pointer', fontSize: '10px' }}
          >
            Save
          </button>
          <button 
            onMouseDown={(e) => { e.preventDefault(); handleCancel(); }}
            style={{ background: 'var(--bg-tertiary)', color: 'var(--text-tertiary)', border: 'none', borderRadius: 4, padding: '2px 6px', cursor: 'pointer', fontSize: '10px' }}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={() => setIsEditing(true)}
      className={`editable-text-display ${className}`}
      title="Click to edit"
      style={{ 
        cursor: 'text', 
        position: 'relative',
        padding: '2px',
        border: '1px solid transparent',
        borderRadius: '4px',
        transition: 'all 0.2s',
        minHeight: multiline ? '1.5em' : 'auto',
        ...style 
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'var(--bg-secondary)';
        e.currentTarget.style.borderColor = 'var(--border-subtle)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.borderColor = 'transparent';
      }}
    >
      {value || <span style={{ color: 'var(--text-tertiary)', fontStyle: 'italic' }}>{placeholder}</span>}
    </div>
  );
}
