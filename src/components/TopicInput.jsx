import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Send, ChevronDown, Shuffle } from 'lucide-react';
import { useCreator } from '../context/CreatorContext';

const RANDOM_TOPICS = [
  'Why the diamond industry is a manufactured illusion',
  'The hidden economics of free-to-play mobile games',
  'How social media algorithms exploit cognitive biases',
  'The psychology behind luxury brand pricing',
  'Why most productivity advice is designed to fail',
  'The real reason streaming services are raising prices',
  'How dark patterns manipulate user behavior online',
  'The truth about "organic" food labeling',
  'Why college textbooks cost so much',
  'The hidden costs of fast fashion',
  'How insurance companies calculate risk',
  'The psychology of FOMO in cryptocurrency',
  'Why airport food is so expensive',
  'The business model behind free VPNs',
  'How influencer marketing actually works',
];

export default function TopicInput() {
  const { topic, setTopic, tone, setTone, generate, loading } = useCreator();
  const [input, setInput] = React.useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) generate(input.trim());
  };

  const handleRandomTopic = () => {
    const randomTopic = RANDOM_TOPICS[Math.floor(Math.random() * RANDOM_TOPICS.length)];
    setInput(randomTopic);
  };

  return (
    <div className="header-bar">
      <form onSubmit={handleSubmit} className="topic-input-wrapper">
        <div style={{ position: 'relative', flex: 1 }}>
          <input
            type="text"
            className="topic-input"
            placeholder="Enter a topic sentence... e.g. 'Why the diamond industry is a manufactured illusion'"
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={loading}
            style={{ width: '100%', paddingRight: 80 }}
          />
          <button
            type="button"
            onClick={handleRandomTopic}
            disabled={loading}
            style={{
              position: 'absolute',
              right: 10,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: 6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 6,
              transition: 'all 0.2s ease',
              color: 'var(--text-tertiary)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--bg-tertiary)';
              e.currentTarget.style.color = 'var(--accent-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'var(--text-tertiary)';
            }}
            title="Random Topic"
          >
            <Shuffle size={16} />
          </button>
        </div>
        <select
          className="tone-select"
          value={tone}
          onChange={e => setTone(e.target.value)}
        >
          <option value="Neutral">🎯 Neutral</option>
          <option value="Analytical">📊 Analytical</option>
          <option value="Aggressive">🔥 Aggressive</option>
          <option value="Philosophical">🧠 Philosophical</option>
          <option value="Satirical">😏 Satirical</option>
        </select>
        <motion.button
          type="submit"
          className="btn-primary generate-btn"
          disabled={loading || !input.trim()}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
        >
          {loading ? (
            <>
              <div className="spinner" />
              Generating...
            </>
          ) : (
            <>
              <Send size={16} />
              Generate
            </>
          )}
        </motion.button>
      </form>
    </div>
  );
}
