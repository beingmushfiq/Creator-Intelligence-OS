import React, { useState } from 'react';
import { Download, FileText, FileType, FileCode, FileJson } from 'lucide-react';
import { exportAsText, exportAsPDF, exportAsMarkdown, exportAsJSON } from '../../utils/exportUtils';
import { useCreator } from '../../context/CreatorContext';
import { useToast } from '../../context/ToastContext';

export function ExportButton({ section, data }) {
  const { topic } = useCreator();
  const { addToast } = useToast();
  const [showMenu, setShowMenu] = useState(false);

  const handleExport = (format) => {
    if (!data) {
      addToast('No data to export. Generate content first.', 'error');
      return;
    }

    try {
      if (format === 'text') {
        exportAsText(data, section, topic || 'untitled');
      } else if (format === 'pdf') {
        exportAsPDF(data, section, topic || 'untitled');
      } else if (format === 'markdown') {
        exportAsMarkdown(data, section, topic || 'untitled');
      } else if (format === 'json') {
        exportAsJSON(data, section, topic || 'untitled');
      }
      setShowMenu(false);
      addToast(`Exported as ${format.toUpperCase()}`, 'success');
    } catch (error) {
      console.error('Export failed:', error);
      addToast('Export failed. Please try again.', 'error');
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="btn-secondary"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '8px 14px',
          fontSize: '0.85rem',
        }}
        title="Export"
      >
        <Download size={16} />
        Export
      </button>

      {showMenu && (
        <>
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 999,
            }}
            onClick={() => setShowMenu(false)}
          />
          <div
            style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: 6,
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 8,
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              zIndex: 1000,
              minWidth: 180,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              padding: '4px'
            }}
          >
            {[
              { id: 'text', label: 'Export as Text', icon: FileText },
              { id: 'pdf', label: 'Export as PDF', icon: FileType },
              { id: 'markdown', label: 'Export as Markdown', icon: FileCode },
              { id: 'json', label: 'Export as JSON', icon: FileJson },
            ].map((option) => (
              <button
                key={option.id}
                onClick={() => handleExport(option.id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '8px 12px',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  borderRadius: 4,
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--bg-tertiary)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }}
              >
                <option.icon size={16} />
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
