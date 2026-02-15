// ============================================
// CREATOR INTELLIGENCE OS — Backend Proxy
// ============================================
// Handles all LLM API calls server-side, keeping API keys secure.
// Supports OpenAI, Gemini, and Claude.

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ENV_PATH = path.join(__dirname, '.env');

// Reset dotenv config
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));

const PORT = process.env.PORT || 3001;

// ── Save Config ──
app.post('/api/config/keys', (req, res) => {
  try {
    const { OPENAI_API_KEY, GEMINI_API_KEY, CLAUDE_API_KEY, ELEVENLABS_API_KEY } = req.body;
    let envContent = '';

    if (fs.existsSync(ENV_PATH)) {
      envContent = fs.readFileSync(ENV_PATH, 'utf8');
    }

    // Upgrade env vars
    const updateKey = (key, val) => {
      if (val === undefined) return;
      const regex = new RegExp(`^${key}=.*`, 'm');
      if (regex.test(envContent)) {
        envContent = envContent.replace(regex, `${key}=${val}`);
      } else {
        envContent += `\n${key}=${val}`;
      }
      process.env[key] = val; // Runtime update
    };

    updateKey('OPENAI_API_KEY', OPENAI_API_KEY);
    updateKey('GEMINI_API_KEY', GEMINI_API_KEY);
    updateKey('CLAUDE_API_KEY', CLAUDE_API_KEY);
    updateKey('ELEVENLABS_API_KEY', ELEVENLABS_API_KEY);

    fs.writeFileSync(ENV_PATH, envContent);
    console.log('API Keys updated successfully');
    res.json({ status: 'ok', message: 'API Keys updated' });
  } catch (error) {
    console.error('Failed to save keys:', error);
    res.status(500).json({ error: 'Failed to save configuration' });
  }
});

// ── Health Check ──
app.get('/api/health', (req, res) => {
  const providers = [];
  if (process.env.OPENAI_API_KEY) providers.push('openai');
  if (process.env.GEMINI_API_KEY) providers.push('gemini');
  if (process.env.CLAUDE_API_KEY) providers.push('claude');
  res.json({ status: 'ok', providers, timestamp: new Date().toISOString() });
});

// ── Get available providers ──
app.get('/api/providers', (req, res) => {
  const providers = [];
  if (process.env.OPENAI_API_KEY) {
    providers.push({ id: 'openai', name: 'OpenAI', model: process.env.OPENAI_MODEL || 'gpt-4o-mini' });
  }
  if (process.env.GEMINI_API_KEY) {
    providers.push({ id: 'gemini', name: 'Google Gemini', model: process.env.GEMINI_MODEL || 'gemini-2.0-flash' });
  }
  if (process.env.CLAUDE_API_KEY) {
    providers.push({ id: 'claude', name: 'Anthropic Claude', model: process.env.CLAUDE_MODEL || 'claude-3-5-sonnet-20241022' });
  }
  res.json({ providers, default: providers[0]?.id || null });
});

// ── Main generate endpoint ──
app.post('/api/generate', async (req, res) => {
  try {
    const { systemPrompt, userPrompt, provider } = req.body;
    if (!systemPrompt || !userPrompt) {
      return res.status(400).json({ error: 'systemPrompt and userPrompt are required' });
    }

    const selectedProvider = provider || getDefaultProvider();
    if (!selectedProvider) {
      return res.status(400).json({ error: 'No LLM providers configured. Add API keys to server/.env' });
    }

    console.log(`[${new Date().toISOString()}] Generating with ${selectedProvider}...`);
    const startTime = Date.now();

    const result = await callProvider(selectedProvider, systemPrompt, userPrompt);

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`[${new Date().toISOString()}] Done in ${elapsed}s (${selectedProvider})`);

    res.json({ result, provider: selectedProvider, elapsed: parseFloat(elapsed) });
  } catch (err) {
    console.error('Generation error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── Provider Router ──
function getDefaultProvider() {
  if (process.env.OPENAI_API_KEY) return 'openai';
  if (process.env.GEMINI_API_KEY) return 'gemini';
  if (process.env.CLAUDE_API_KEY) return 'claude';
  return null;
}

async function callProvider(provider, systemPrompt, userPrompt) {
  switch (provider) {
    case 'openai': return callOpenAI(systemPrompt, userPrompt);
    case 'gemini': return callGemini(systemPrompt, userPrompt);
    case 'claude': return callClaude(systemPrompt, userPrompt);
    default: throw new Error(`Unknown provider: ${provider}`);
  }
}

// ── OpenAI ──
async function callOpenAI(systemPrompt, userPrompt) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY not configured');

  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.8,
      max_tokens: 8000,
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(`OpenAI error (${response.status}): ${err.error?.message || response.statusText}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  return extractJSON(content);
}

// ── Gemini ──
async function callGemini(systemPrompt, userPrompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY not configured');

  const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: systemPrompt }] },
      contents: [{ parts: [{ text: userPrompt }] }],
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 8192,
        responseMimeType: 'application/json',
      },
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(`Gemini error (${response.status}): ${err.error?.message || response.statusText}`);
  }

  const data = await response.json();
  const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
  return extractJSON(content);
}

// ── Claude ──
async function callClaude(systemPrompt, userPrompt) {
  const apiKey = process.env.CLAUDE_API_KEY;
  if (!apiKey) throw new Error('CLAUDE_API_KEY not configured');

  const model = process.env.CLAUDE_MODEL || 'claude-3-5-sonnet-20241022';
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: 8000,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(`Claude error (${response.status}): ${err.error?.message || response.statusText}`);
  }

  const data = await response.json();
  const content = data.content?.[0]?.text;
  return extractJSON(content);
}

// ── JSON Extraction (robust) ──
function extractJSON(text) {
  if (!text) throw new Error('Empty response from LLM');

  // Try direct parse first
  try {
    return JSON.parse(text);
  } catch (e) {
    // Noop — try extraction
  }

  // Try extracting from ```json blocks
  const jsonBlockMatch = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
  if (jsonBlockMatch) {
    try {
      return JSON.parse(jsonBlockMatch[1].trim());
    } catch (e) {
      // Noop
    }
  }

  // Try finding first { to last }
  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    try {
      return JSON.parse(text.slice(firstBrace, lastBrace + 1));
    } catch (e) {
      // Noop
    }
  }

  throw new Error('Failed to parse JSON from LLM response');
}

// ── Image Generation (DALL-E 3) ──
app.post('/api/generate-image', async (req, res) => {
  try {
    const { prompt } = req.body;
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) return res.status(500).json({ error: 'OpenAI API Key missing' });

    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(`OpenAI Image Error: ${err.error?.message || response.statusText}`);
    }

    const data = await response.json();
    res.json({ url: data.data[0].url });
  } catch (err) {
    console.error('Image Generation Error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ── Voice Generation (ElevenLabs) ──
app.post('/api/generate-speech', async (req, res) => {
  try {
    const { text, voiceId } = req.body;
    const apiKey = process.env.ELEVENLABS_API_KEY;
    const voice = voiceId || '21m00Tcm4TlvDq8ikWAM'; // Default "Rachel"

    if (!apiKey) return res.status(500).json({ error: 'ElevenLabs API Key missing' });

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': apiKey,
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_monolingual_v1",
        voice_settings: { stability: 0.5, similarity_boost: 0.75 }
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(`ElevenLabs Error: ${err.detail?.message || response.statusText}`);
    }

    // Pipe the audio stream directly to the client
    res.setHeader('Content-Type', 'audio/mpeg');
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    res.send(buffer);

  } catch (err) {
    console.error('Voice Generation Error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ── Start Server ──
app.listen(PORT, () => {
  const providers = [];
  if (process.env.OPENAI_API_KEY) providers.push('OpenAI');
  if (process.env.GEMINI_API_KEY) providers.push('Gemini');
  if (process.env.CLAUDE_API_KEY) providers.push('Claude');

  console.log(`
╔═══════════════════════════════════════════════════╗
║       CREATOR INTELLIGENCE OS — Backend           ║
║       Port: ${PORT}                                  ║
║       Providers: ${providers.length > 0 ? providers.join(', ') : 'NONE (add keys to .env)'}
╚═══════════════════════════════════════════════════╝
  `);
});
