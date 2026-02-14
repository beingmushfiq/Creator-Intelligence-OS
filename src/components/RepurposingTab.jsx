import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Video,
  Linkedin,
  Twitter,
  FileText,
  Mail,
  Instagram,
  Mic,
  Copy,
  Check,
  Download
} from 'lucide-react';
import { useCreator } from '../context/CreatorContext';
import { useToast } from '../context/ToastContext';
import { repurposeContent } from '../utils/repurposingUtils';
import EditableText from './ui/EditableText';

export default function RepurposingTab() {
  const { data, setData } = useCreator();
  const { addToast } = useToast();
  const [copiedId, setCopiedId] = React.useState(null);

  // Initialize repurposed data if it doesn't exist
  React.useEffect(() => {
    if (data && !data.repurposed) {
      const generated = repurposeContent(data);
      setData(prev => ({ ...prev, repurposed: generated }));
    }
  }, [data, setData]);

  const content = data?.repurposed || repurposeContent(data);

  const updateContent = (section, updateFn) => {
    if (!data?.repurposed) return;
    const newSectionData = updateFn(data.repurposed[section]);
    setData(prev => ({
      ...prev,
      repurposed: {
        ...prev.repurposed,
        [section]: newSectionData
      }
    }));
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    addToast('Copied to clipboard', 'success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!data) {
    return (
      <div className="empty-state">
        <Video size={48} style={{ opacity: 0.3 }} />
        <h3>No Content Yet</h3>
        <p>Generate content first to see multi-platform repurposing options</p>
      </div>
    );
  }

  const platforms = [
    {
      id: 'short-form',
      title: 'Short-Form Video',
      icon: Video,
      color: '#FF0050',
      data: content?.shortFormClips,
      render: (clips) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {clips?.map((clip, i) => (
            <div key={i} className="card" style={{ padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                <div>
                  <strong style={{ color: 'var(--accent-primary)' }}>Clip {i + 1}</strong>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                   <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>Duration:</span>
                   <EditableText 
                      value={clip.duration}
                      onChange={(val) => updateContent('shortFormClips', (prev) => {
                        const newClips = [...prev];
                        newClips[i] = { ...newClips[i], duration: val };
                        return newClips;
                      })}
                      style={{ fontSize: '0.85rem', width: 'auto', minWidth: '60px' }}
                    />
                  </div>
                </div>
                <button
                  onClick={() => handleCopy(`${clip.hook}\n\n${clip.content}\n\n${clip.caption}`, `clip-${i}`)}
                  className="icon-btn"
                >
                  {copiedId === `clip-${i}` ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
              <div style={{ marginBottom: '8px' }}>
                <strong style={{ fontSize: '0.9rem' }}>Hook:</strong>
                <EditableText 
                  value={clip.hook}
                  onChange={(val) => updateContent('shortFormClips', (prev) => {
                    const newClips = [...prev];
                    newClips[i] = { ...newClips[i], hook: val };
                    return newClips;
                  })}
                  style={{ marginTop: '4px' }}
                />
              </div>
              <div style={{ marginBottom: '8px' }}>
                <strong style={{ fontSize: '0.9rem' }}>Content:</strong>
                <EditableText 
                  value={clip.content}
                  multiline
                  onChange={(val) => updateContent('shortFormClips', (prev) => {
                    const newClips = [...prev];
                    newClips[i] = { ...newClips[i], content: val };
                    return newClips;
                  })}
                  style={{ marginTop: '4px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}
                />
              </div>
              <div>
                <strong style={{ fontSize: '0.9rem' }}>Caption:</strong>
                <EditableText 
                  value={clip.caption}
                  multiline
                  onChange={(val) => updateContent('shortFormClips', (prev) => {
                    const newClips = [...prev];
                    newClips[i] = { ...newClips[i], caption: val };
                    return newClips;
                  })}
                  style={{ marginTop: '4px', fontSize: '0.85rem', color: 'var(--text-tertiary)' }}
                />
              </div>
            </div>
          ))}
        </div>
      )
    },
    {
      id: 'linkedin',
      title: 'LinkedIn Post',
      icon: Linkedin,
      color: '#0077B5',
      data: repurposedContent?.linkedInPost,
      render: (post) => (
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <strong style={{ color: 'var(--accent-primary)' }}>Professional Post</strong>
            <button
              onClick={() => handleCopy(post.body, 'linkedin')}
              className="icon-btn"
            >
              {copiedId === 'linkedin' ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>
          <EditableText 
            value={post.body}
            multiline
            onChange={(val) => updateContent('linkedInPost', (prev) => ({ ...prev, body: val }))}
            style={{ 
              whiteSpace: 'pre-wrap',
              fontFamily: 'inherit',
              fontSize: '0.9rem',
              lineHeight: '1.6',
              color: 'var(--text-secondary)'
            }}
          />
        </div>
      )
    },
    {
      id: 'twitter',
      title: 'Twitter Thread',
      icon: Twitter,
      color: '#1DA1F2',
      data: repurposedContent?.twitterThread,
      render: (thread) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {thread?.map((tweet, i) => (
            <div key={i} className="card" style={{ padding: '16px', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{
                    background: 'var(--accent-primary)',
                    color: 'white',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 'bold'
                  }}>{tweet.number}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{tweet.type}</span>
                </div>
                <button
                  onClick={() => handleCopy(tweet.content, `tweet-${i}`)}
                  className="icon-btn"
                >
                  {copiedId === `tweet-${i}` ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
              <EditableText 
                value={tweet.content}
                multiline
                onChange={(val) => updateContent('twitterThread', (prev) => {
                  const newThread = [...prev];
                  newThread[i] = { ...newThread[i], content: val, characterCount: val.length };
                  return newThread;
                })}
                style={{ fontSize: '0.9rem', lineHeight: '1.5' }}
              />
              <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '8px' }}>
                {tweet.characterCount} characters
              </p>
            </div>
          ))}
        </div>
      )
    },
    {
      id: 'blog',
      title: 'Blog Post',
      icon: FileText,
      color: '#FF6B6B',
      data: repurposedContent?.blogPost,
      render: (blog) => (
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <strong style={{ color: 'var(--accent-primary)' }}>SEO-Optimized Article</strong>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', marginTop: '4px' }}>{blog.wordCount}</p>
            </div>
            <button
              onClick={() => handleCopy(`# ${blog.title}\n\n${blog.structure.introduction}\n\n${blog.structure.h2Sections.map(s => `## ${s.heading}\n\n${s.content}`).join('\n\n')}`, 'blog')}
              className="icon-btn"
            >
              {copiedId === 'blog' ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>
          <div style={{ marginBottom: '12px' }}>
            <EditableText 
              value={blog.structure.h1}
              onChange={(val) => updateContent('blogPost', (prev) => ({
                ...prev,
                structure: { ...prev.structure, h1: val }
              }))}
              style={{ fontSize: '1.5em', fontWeight: 'bold' }}
            />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <EditableText 
              value={blog.structure.introduction}
              multiline
              onChange={(val) => updateContent('blogPost', (prev) => ({
                ...prev,
                structure: { ...prev.structure, introduction: val }
              }))}
              style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}
            />
          </div>
          {blog.structure.h2Sections.map((section, i) => (
            <div key={i} style={{ marginBottom: '16px' }}>
              <div style={{ marginBottom: '8px' }}>
                <EditableText 
                  value={section.heading}
                  onChange={(val) => updateContent('blogPost', (prev) => {
                    const newSections = [...prev.structure.h2Sections];
                    newSections[i] = { ...newSections[i], heading: val };
                    return {
                      ...prev,
                      structure: { ...prev.structure, h2Sections: newSections }
                    };
                  })}
                  style={{ fontSize: '1rem', fontWeight: 'bold' }}
                />
              </div>
              <EditableText 
                value={section.content}
                multiline
                onChange={(val) => updateContent('blogPost', (prev) => {
                  const newSections = [...prev.structure.h2Sections];
                  newSections[i] = { ...newSections[i], content: val };
                  return {
                    ...prev,
                    structure: { ...prev.structure, h2Sections: newSections }
                  };
                })}
                style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}
              />
            </div>
          ))}
          <div style={{ marginTop: '16px', padding: '12px', background: 'var(--bg-secondary)', borderRadius: '6px' }}>
            <strong style={{ fontSize: '0.85rem' }}>SEO Keywords:</strong>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', marginTop: '4px' }}>
              {blog.seoKeywords.join(', ')}
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'email',
      title: 'Email Newsletter',
      icon: Mail,
      color: '#EA4335',
      data: repurposedContent?.emailNewsletter,
      render: (email) => (
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <strong style={{ color: 'var(--accent-primary)' }}>Newsletter Format</strong>
            <button
              onClick={() => handleCopy(`Subject: ${email.subject}\n\n${email.body}`, 'email')}
              className="icon-btn"
            >
              {copiedId === 'email' ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>
          <div style={{ marginBottom: '12px' }}>
            <strong style={{ fontSize: '0.85rem' }}>Subject:</strong>
            <p style={{ marginTop: '4px', fontSize: '0.95rem' }}>{email.subject}</p>
          </div>
          <div style={{ marginBottom: '12px' }}>
            <strong style={{ fontSize: '0.85rem' }}>Preheader:</strong>
            <p style={{ marginTop: '4px', fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>{email.preheader}</p>
          </div>
          <div>
            <strong style={{ fontSize: '0.85rem' }}>Body:</strong>
          <EditableText 
            value={email.body}
            multiline
            onChange={(val) => updateContent('emailNewsletter', (prev) => ({ ...prev, body: val }))}
            style={{ 
              whiteSpace: 'pre-wrap',
              fontFamily: 'inherit',
              fontSize: '0.9rem',
              lineHeight: '1.6',
              marginTop: '8px',
              color: 'var(--text-secondary)'
            }}
          />
          </div>
        </div>
      )
    },
    {
      id: 'instagram',
      title: 'Instagram Caption',
      icon: Instagram,
      color: '#E4405F',
      data: repurposedContent?.instagramCaption,
      render: (ig) => (
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <strong style={{ color: 'var(--accent-primary)' }}>Post Caption</strong>
            <button
              onClick={() => handleCopy(ig.caption, 'instagram')}
              className="icon-btn"
            >
              {copiedId === 'instagram' ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>
          <EditableText 
            value={ig.caption}
            multiline
            onChange={(val) => updateContent('instagramCaption', (prev) => ({ ...prev, caption: val }))}
            style={{ 
              whiteSpace: 'pre-wrap',
              fontFamily: 'inherit',
              fontSize: '0.9rem',
              lineHeight: '1.6',
              color: 'var(--text-secondary)'
            }}
          />
          <div style={{ marginTop: '16px', padding: '12px', background: 'var(--bg-secondary)', borderRadius: '6px' }}>
            <strong style={{ fontSize: '0.85rem' }}>Story Prompt:</strong>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', marginTop: '4px' }}>{ig.storyPrompt}</p>
          </div>
        </div>
      )
    },
    {
      id: 'podcast',
      title: 'Podcast Script',
      icon: Mic,
      color: '#9B59B6',
      data: repurposedContent?.podcastScript,
      render: (podcast) => (
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <strong style={{ color: 'var(--accent-primary)' }}>Conversational Format</strong>
            <button
              onClick={() => handleCopy(`${podcast.intro}\n\n${podcast.mainContent.map(s => s.script).join('\n\n')}\n\n${podcast.outro}`, 'podcast')}
              className="icon-btn"
            >
              {copiedId === 'podcast' ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <strong style={{ fontSize: '0.9rem' }}>Intro:</strong>
            <EditableText 
              value={podcast.intro}
              multiline
              onChange={(val) => updateContent('podcastScript', (prev) => ({ ...prev, intro: val }))}
              style={{ 
                marginTop: '8px',
                fontSize: '0.85rem',
                lineHeight: '1.5',
                color: 'var(--text-tertiary)'
              }}
            />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <strong style={{ fontSize: '0.9rem' }}>Main Content:</strong>
            {podcast.mainContent.map((segment, i) => (
              <div key={i} style={{ marginTop: '12px', paddingLeft: '12px', borderLeft: '2px solid var(--border-subtle)' }}>
                <EditableText 
                  value={segment.script}
                  multiline
                  onChange={(val) => updateContent('podcastScript', (prev) => {
                    const newContent = [...prev.mainContent];
                    newContent[i] = { ...newContent[i], script: val };
                    return { ...prev, mainContent: newContent };
                  })}
                  style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}
                />
              </div>
            ))}
          </div>
          <div>
            <strong style={{ fontSize: '0.9rem' }}>Outro:</strong>
            <EditableText 
              value={podcast.outro}
              multiline
              onChange={(val) => updateContent('podcastScript', (prev) => ({ ...prev, outro: val }))}
              style={{ 
                marginTop: '8px',
                fontSize: '0.85rem',
                lineHeight: '1.5',
                color: 'var(--text-tertiary)'
              }}
            />
          </div>
        </div>
      )
    },
  ];

  return (
    <div className="tab-content">
      <div className="tab-header">
        <div>
          <h2>Multi-Platform Repurposing</h2>
          <p>Transform your content into 7+ platform-optimized formats</p>
        </div>
      </div>

      <div style={{ display: 'grid', gap: '24px' }}>
        {platforms.map((platform, index) => {
          const Icon = platform.icon;
          return (
            <motion.div
              key={platform.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '12px'
              }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: `${platform.color}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Icon size={20} style={{ color: platform.color }} />
                </div>
                <h3 style={{ margin: 0 }}>{platform.title}</h3>
              </div>
              {platform.data && platform.render(platform.data)}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
