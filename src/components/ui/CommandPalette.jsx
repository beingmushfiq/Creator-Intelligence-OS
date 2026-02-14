import React, { useState, useEffect } from 'react';
import { Command } from 'cmdk';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  FileText,
  Download,
  Settings,
  Compass,
  Video,
  Type,
  Image,
  Search,
  GitBranch,
  Plus,
  Copy,
  X
} from 'lucide-react';
import { useCreator } from '../../context/CreatorContext';
import './CommandPalette.css';

export default function CommandPalette({ activeTab, setActiveTab, onClose }) {
  const { topic, resetSession } = useCreator();
  const [search, setSearch] = useState('');

  // Close on Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const commands = [
    {
      group: 'Navigation',
      items: [
        { id: 'strategy', label: 'Go to Strategy', icon: Compass, action: () => setActiveTab('strategy'), shortcut: '⌘1' },
        { id: 'script', label: 'Go to Script', icon: FileText, action: () => setActiveTab('script'), shortcut: '⌘2' },
        { id: 'motion', label: 'Go to Motion Prompts', icon: Video, action: () => setActiveTab('motion'), shortcut: '⌘3' },
        { id: 'titles', label: 'Go to Titles', icon: Type, action: () => setActiveTab('titles'), shortcut: '⌘4' },
        { id: 'thumbnails', label: 'Go to Thumbnails', icon: Image, action: () => setActiveTab('thumbnails'), shortcut: '⌘5' },
        { id: 'research', label: 'Go to Research', icon: Search, action: () => setActiveTab('research'), shortcut: '⌘6' },
        { id: 'series', label: 'Go to Series Builder', icon: GitBranch, action: () => setActiveTab('series'), shortcut: '⌘7' },
        { id: 'optimization', label: 'Go to Optimization', icon: Settings, action: () => setActiveTab('optimization'), shortcut: '⌘8' },
      ]
    },
    {
      group: 'Actions',
      items: [
        { id: 'new-project', label: 'New Project', icon: Plus, action: () => {
          if (confirm('Start a new project? This will clear your current session.')) {
            resetSession();
            onClose();
          }
        }, shortcut: '⌘N' },
        { id: 'settings', label: 'Open Settings', icon: Settings, action: () => setActiveTab('settings'), shortcut: '⌘,' },
        { id: 'export', label: 'Export Current Tab', icon: Download, action: () => {
          // This would trigger export - we'll implement this later
          alert('Export functionality - coming soon!');
        }, shortcut: '⌘E' },
      ]
    }
  ];

  const handleSelect = (action) => {
    action();
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="command-palette-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="command-palette"
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
        >
          <Command label="Command Menu">
            <div className="command-header">
              <Zap size={18} style={{ color: 'var(--accent-primary)' }} />
              <Command.Input
                placeholder="Type a command or search..."
                value={search}
                onValueChange={setSearch}
                autoFocus
              />
              <button className="command-close" onClick={onClose}>
                <X size={16} />
              </button>
            </div>

            <Command.List>
              <Command.Empty>No results found.</Command.Empty>

              {commands.map((group) => (
                <Command.Group key={group.group} heading={group.group}>
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Command.Item
                        key={item.id}
                        value={item.label}
                        onSelect={() => handleSelect(item.action)}
                      >
                        <Icon size={16} />
                        <span>{item.label}</span>
                        {item.shortcut && (
                          <kbd className="command-shortcut">{item.shortcut}</kbd>
                        )}
                      </Command.Item>
                    );
                  })}
                </Command.Group>
              ))}
            </Command.List>
          </Command>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
