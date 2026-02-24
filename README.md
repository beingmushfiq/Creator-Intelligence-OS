<div align="center">

# 🧠 Creator Intelligence OS

**The World-Class AI Operating System for Content Creators**

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite)](https://vitejs.dev)
[![Supabase](https://img.shields.io/badge/Supabase-Database%20%2B%20Auth-3ECF8E?logo=supabase)](https://supabase.com)
[![Framer Motion](https://img.shields.io/badge/Framer%20Motion-11-BB4BE0?logo=framer)](https://www.framer.com/motion)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

*From one topic to a full content empire — powered by AI, built for creators.*

</div>

---

## 📖 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Variables](#environment-variables)
  - [Database Setup](#database-setup)
  - [Running Locally](#running-locally)
- [Feature Documentation](#feature-documentation)
  - [Core Generation Engine](#core-generation-engine)
  - [Strategy Tab](#strategy-tab)
  - [Script & Content Tabs](#script--content-tabs)
  - [SEO & Titles](#seo--titles)
  - [Visual Content Suite](#visual-content-suite)
  - [Repurposing Engine](#repurposing-engine)
  - [Analytics & Performance](#analytics--performance)
  - [Growth & Engagement](#growth--engagement)
  - [Monetization Suite](#monetization-suite)
  - [Community & Social](#community--social)
  - [Media & Thumbnails](#media--thumbnails)
  - [Automation & Workflows](#automation--workflows)
  - [Content Calendar](#content-calendar)
  - [Task Management](#task-management)
  - [Asset Library](#asset-library)
  - [AI Neural Coach](#ai-neural-coach)
  - [DNA Genome System](#dna-genome-system)
  - [Trend Intelligence](#trend-intelligence)
  - [Batch Mode](#batch-mode)
  - [Team Collaboration](#team-collaboration)
  - [Settings & Integrations](#settings--integrations)
  - [Theme Engine](#theme-engine)
- [Database Architecture](#database-architecture)
- [Real-Time Sync](#real-time-sync)
- [AI Provider Setup](#ai-provider-setup)
- [Server / Backend](#server--backend)
- [Deployment](#deployment)
- [Contributing](#contributing)

---

## Overview

Creator Intelligence OS is a **full-stack, AI-powered content creation command center** built for solo creators and teams alike. Enter a single topic → get a complete, multi-platform content strategy including scripts, titles, thumbnails, SEO, repurposing plans, a posting calendar, revenue analysis, and much more.

**Core Philosophy:** One input. Infinite output. Everything in one place.

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend Framework** | React 18 + Vite 6 | Fast, component-based UI |
| **Animations** | Framer Motion 11 | Cinematic micro-animations |
| **Icons** | Lucide React | Consistent iconography |
| **Charts** | Recharts 3 | Analytics visualizations |
| **Database & Auth** | Supabase | PostgreSQL + Real-time + Auth |
| **AI Engine** | OpenAI / OpenRouter | Content generation |
| **Backend** | Node.js + Express | AI proxy server |
| **PDF Export** | jsPDF + AutoTable | Document exports |
| **Styling** | Vanilla CSS + Custom Tokens | Fully themeable design system |
| **Deployment** | Vercel (frontend) | Production hosting |

---

## Project Structure

```
creator-intelligence-os/
├── index.html                    # App entry point
├── vite.config.js                # Vite build config
├── vercel.json                   # Vercel deployment config
├── supabase_schema.sql           # Complete DB schema (run once in Supabase)
├── package.json
│
├── public/                       # Static assets
│
├── server/                       # Node.js AI proxy backend
│   ├── server.js                 # Express server (AI API proxy)
│   ├── .env                      # Server environment variables
│   └── .env.example              # Template for server env vars
│
└── src/
    ├── main.jsx                  # React root + ErrorBoundary
    ├── App.jsx                   # Main layout, routing, sidebar, theme
    ├── index.css                 # Global design system (CSS tokens, glassmorphism)
    │
    ├── lib/
    │   └── supabaseClient.js     # Supabase client initialization
    │
    ├── context/
    │   ├── CreatorContext.jsx    # Context definition + useCreator hook
    │   ├── CreatorProvider.jsx   # State, actions, real-time subscriptions
    │   ├── AuthContext.jsx       # Auth context + useAuth hook
    │   ├── AuthProvider.jsx      # Supabase auth state management
    │   ├── ToastContext.jsx      # Toast notification context
    │   └── ToastProvider.jsx     # Toast state & display logic
    │
    ├── services/
    │   └── dbService.js          # All Supabase CRUD + real-time subscription methods
    │
    ├── engine/
    │   ├── aiService.js          # AI API calls (OpenAI / OpenRouter / mock)
    │   ├── mockGenerator.js      # Fallback mock data generator (offline mode)
    │   ├── prompts.js            # Core system prompts
    │   └── *Prompts.js           # Feature-specific prompt modules (30 files)
    │
    ├── utils/
    │   ├── exportUtils.js        # PDF, Markdown, TXT export helpers
    │   ├── repurposingUtils.js   # Content transformation utilities
    │   ├── analyticsData.js      # Sample analytics data structures
    │   └── RevenueCalculators.js # Revenue projection math
    │
    └── components/
        ├── App-level
        │   ├── AuthPage.jsx      # Login / signup UI
        │   ├── TopicInput.jsx    # Main topic entry + tone selector
        │   ├── SaveProjectModal.jsx
        │   ├── AudioPlayer.jsx   # Floating audio player
        │   ├── CoachSidebar.jsx  # AI Neural Coach slide-out panel
        │   ├── CoachSidebar.css
        │   ├── CommentsSidebar.jsx
        │   ├── TeamSettingsModal.jsx
        │   ├── TeamSwitcher.jsx
        │   ├── ActivityFeed.jsx
        │   ├── SettingsPage.jsx  # Tabbed settings (Account, API, Integration)
        │   └── SettingsPage.css
        │
        ├── Content Tabs (lazy-loaded)
        │   ├── DashboardTab.jsx       # Home & project stats
        │   ├── StrategyTab.jsx        # Full content strategy
        │   ├── ScriptTab.jsx          # Full video script
        │   ├── TitlesTab.jsx          # Title + hook generation
        │   ├── SeoTab.jsx             # SEO optimization
        │   ├── ThumbnailsTab.jsx      # Thumbnail concept generation
        │   ├── VisualsTab.jsx         # Visual content planning
        │   ├── RepurposingTab.jsx     # Multi-platform repurposing
        │   ├── AnalyticsTab.jsx       # Charts & performance
        │   ├── PerformanceTab.jsx     # Detailed performance metrics
        │   ├── GrowthTab.jsx          # Growth strategy & tips
        │   ├── EngagementTab.jsx      # Engagement optimization
        │   ├── CommunityTab.jsx       # Community building
        │   ├── AudienceTab.jsx        # Audience research & personas
        │   ├── TrendTab.jsx           # Trend intelligence & forecasting
        │   ├── ViralTab.jsx           # Viral content mechanics
        │   ├── CalendarTab.jsx        # posting calendar
        │   ├── TasksTab.jsx           # Project task management
        │   ├── AssetLibrary.jsx       # Generated assets gallery
        │   ├── MediaKit.jsx           # Media kit / press kit generator
        │   ├── MediaTab.jsx           # Media production planning
        │   ├── MotionPromptsTab.jsx   # B-Roll & motion prompt generator
        │   ├── DealsTab.jsx           # Brand deals / sponsorships
        │   ├── AffiliateTab.jsx       # Affiliate marketing manager
        │   ├── ProductTab.jsx         # Product/merch strategy
        │   ├── AutomationTab.jsx      # Workflow automation
        │   ├── BurnoutTab.jsx         # Creator wellness & burnout prevention
        │   ├── GenomeTab.jsx          # Creator DNA & content fingerprint
        │   ├── OmnichannelTab.jsx     # Cross-platform publishing planner
        │   ├── PulseTab.jsx           # Community pulse & sentiment
        │   ├── ResearchTab.jsx        # Deep topic research
        │   ├── LearningTab.jsx        # Creator education hub
        │   ├── DeckTab.jsx            # Pitch deck / brand presentation
        │   ├── MarketTab.jsx          # Market & competition analysis
        │   ├── OptimizationTab.jsx    # Content optimization scorer
        │   ├── SeriesTab.jsx          # Series & long-form planning
        │   └── HistoryTab.jsx         # Project history
        │
        └── ui/                        # Reusable UI atoms
            ├── CommandPalette.jsx     # ⌘K command palette
            ├── ExportButton.jsx       # Multi-format export
            └── ...
```

---

## Getting Started

### Prerequisites

- **Node.js** 18+
- **Supabase** account (free tier works perfectly)
- **OpenAI API key** or **OpenRouter API key** (optional — mock mode works offline)

### Environment Variables

**Frontend** — create `.env` in the project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Backend server** — create `server/.env`:

```env
OPENAI_API_KEY=sk-...          # OpenAI key (or use OpenRouter below)
OPENROUTER_API_KEY=sk-or-...   # Alternative: OpenRouter
PORT=3001
```

> Both keys are optional. The app ships with a **mock generator** that creates realistic data without any API key.

### Database Setup

1. Go to your [Supabase Dashboard](https://supabase.com) → **SQL Editor**
2. Create a new query, paste the entire contents of `supabase_schema.sql`, and run it
3. This creates all 8 tables, enables RLS, sets policies, enables real-time on all tables, and creates indexes

> **One-time operation.** The schema uses `create table if not exists` and `drop policy if exists` so it is safe to re-run.

### Running Locally

```bash
# 1. Install frontend dependencies
npm install

# 2. Install backend dependencies
cd server && npm install && cd ..

# 3. Start the AI proxy server (terminal 1)
node server/server.js

# 4. Start the Vite dev server (terminal 2)
npm run dev
```

The app runs at `http://localhost:5173`. The AI backend runs at `http://localhost:3001`.

---

## Feature Documentation

### Core Generation Engine

**File:** `src/engine/aiService.js`, `src/engine/mockGenerator.js`

The generation engine is a dual-mode system:

- **AI Mode**: Sends structured prompts to OpenAI (GPT-4o) or OpenRouter. Each feature has its own dedicated prompt module in `src/engine/*Prompts.js`.
- **Mock Mode**: When no API key is configured, `mockGenerator.js` generates high-quality realistic data locally, making the app fully usable offline.

**Tone System**: Every generation accepts a tone modifier:
`Analytical | Educational | Entertainment | Motivational | Storytelling | Controversial | Documentary`

---

### Strategy Tab

**File:** `src/components/StrategyTab.jsx`

The command center. Generates a comprehensive content strategy including:
- Executive summary with content angles
- Platform-specific distribution plan
- Hook bank (10+ opening hooks)
- Audience personas
- Competitive positioning
- Content pillars
- 30/60/90 day roadmap

---

### Script & Content Tabs

**Files:** `ScriptTab.jsx`, `DeckTab.jsx`, `ResearchTab.jsx`

| Tab | Output |
|-----|--------|
| **Script** | Full narrated script with timestamps, chapters, CTAs, and pacing notes |
| **Deck** | Slide-by-slide pitch deck / brand presentation outline |
| **Research** | Deep background research, statistics, expert quotes, source suggestions |

All tabs support one-click **copy**, **PDF export**, and **Markdown export** via `exportUtils.js`.

---

### SEO & Titles

**Files:** `SeoTab.jsx`, `TitlesTab.jsx`

- **SEO Tab**: Generates primary keywords, LSI keywords, meta description, tags, chapter timestamps, and a YouTube/Google optimization score
- **Titles Tab**: Produces 10+ title variants with curiosity gaps, number hooks, and emotional triggers — each rated for viral potential

---

### Visual Content Suite

**Files:** `ThumbnailsTab.jsx`, `VisualsTab.jsx`, `MotionPromptsTab.jsx`

| Tab | What It Does |
|-----|-------------|
| **Thumbnails** | AI thumbnail concepts (face composition, background, text overlay, color palette) + Midjourney/DALL-E prompts |
| **Visuals** | Full visual content plan: B-roll lists, graphics needed, color schemes, mood board |
| **Motion Prompts** | Cinematic B-roll prompt generator for stock footage and AI video tools |

---

### Repurposing Engine

**File:** `src/components/RepurposingTab.jsx`, `src/utils/repurposingUtils.js`

One of the most powerful modules. Takes the master content and repurposes it for:

| Platform | Output Format |
|----------|--------------|
| YouTube Long-Form | Full script + timestamps + SEO |
| YouTube Shorts | 3 viral hook clips |
| TikTok | 60s script + sound suggestions + hashtags |
| Instagram Reels | Caption + hook line + hashtags |
| Instagram Carousel | 7-slide content outline |
| LinkedIn Post | Thought leadership format |
| Twitter/X Thread | 10-15 tweet thread |
| Blog Post | SEO-optimized article outline |
| Email Newsletter | Story-format email |
| Podcast Script | Audio-first rewrite |
| Pinterest Pin | Description + keyword-rich text |

---

### Analytics & Performance

**Files:** `AnalyticsTab.jsx`, `PerformanceTab.jsx`, `OptimizationTab.jsx`

- **Analytics**: Revenue growth area chart, platform split pie chart, engagement rate trends, top content performance table — all rendered with `recharts`
- **Performance**: Video retention curve, click-through rate analysis, impressions-to-views funnel, watch time breakdown
- **Optimization**: Content scoring system that rates your project on hook strength, retention, SEO, and virality

---

### Growth & Engagement

**Files:** `GrowthTab.jsx`, `EngagementTab.jsx`, `ViralTab.jsx`

| Tab | Focus |
|-----|-------|
| **Growth** | Subscriber growth strategies, collaboration opportunities, posting frequency optimizer |
| **Engagement** | Comment reply templates, community question banks, pinned comment strategies, CTA variations |
| **Viral** | Viral mechanics analysis, pattern interrupts, curiosity loops, shareability score |

---

### Monetization Suite

**Files:** `AffiliateTab.jsx`, `DealsTab.jsx`, `ProductTab.jsx`, `MediaKit.jsx`
**Util:** `src/utils/RevenueCalculators.js`

| Module | Features |
|--------|---------|
| **Affiliate Manager** | Suggested affiliate programs, link placement strategy, earnings projection |
| **Brand Deals** | Sponsorship pitch templates, rate cards, brand match analysis |
| **Products** | Digital product ideas, merch concepts, course outline, pricing strategy |
| **Media Kit** | Auto-generated press kit with stats, audience demographics, and brand-ready talking points |

Revenue records are persisted to Supabase via `dbService.saveRevenue()`.

---

### Community & Social

**Files:** `CommunityTab.jsx`, `AudienceTab.jsx`, `PulseTab.jsx`, `OmnichannelTab.jsx`

| Tab | Purpose |
|-----|---------|
| **Community** | Discord/Reddit strategy, community event ideas, member engagement loops |
| **Audience** | 3 detailed audience personas with psychographics, pain points, and content preferences |
| **Pulse** | Real-time community sentiment analysis, trending conversation topics, emotional resonance score |
| **Omnichannel** | Cross-platform posting schedule, content adaptation checklist, channel synergy map |

---

### Media & Thumbnails

**Files:** `MediaTab.jsx`, `AssetLibrary.jsx`, `AudioPlayer.jsx`

- **Media Tab**: Full production plan — gear recommendations, filming checklist, editing workflow, color grade style
- **Asset Library**: Gallery of all AI-generated images and audio files from the session, with delete and download controls
- **Audio Player**: Floating persistent audio player for any generated audio content

Assets are stored in Supabase via `dbService.saveAsset()` and synced in real-time.

---

### Automation & Workflows

**File:** `src/components/AutomationTab.jsx`

Generates AI-powered automation blueprints:
- Content pipeline workflows (Idea → Script → Shoot → Edit → Publish)
- Platform auto-posting sequences
- Email funnel sequences
- Social media repurposing automation scripts
- Integration suggestions (Zapier, Make.com, Buffer)

---

### Content Calendar

**File:** `src/components/CalendarTab.jsx`

Generates a 30-day publishing calendar with:
- Date-specific post scheduling per platform
- Content type rotation (educational, entertaining, promotional)
- Optimal posting time recommendations
- One-click "add to calendar" export

Calendar data persisted via `dbService.saveGeneration(userId, projectId, 'calendar', ...)`.

---

### Task Management

**File:** `src/components/TasksTab.jsx`

A Kanban-style task board with three columns: **Todo → Doing → Done**

- AI auto-generates a production task list for each project
- Manual task creation, editing, priority setting (Low/Medium/High)
- Due date assignment
- Bulk task import via `dbService.bulkAddTasks()`
- Team member assignment (in team workspaces)
- Real-time sync: tasks update live across all team members

---

### Asset Library

**File:** `src/components/AssetLibrary.jsx`

Central gallery for all AI-generated media in your session:
- Generated thumbnails and visual concepts
- Audio narration files
- Filterable by type (image/audio)
- Delete with real-time sync back to Supabase
- Download support

---

### AI Neural Coach

**Files:** `src/components/CoachSidebar.jsx`, `src/engine/coachPrompts.js`

A premium slide-out AI coaching panel accessible from the sidebar. In **IDLE state**, features animated orbit rings and a system-ready display. After initiating an audit:

- **Content Quality Score** (0–100) with an animated ring visualization
- **Tactical Upgrades**: Specific actionable improvements
- **Exposure Hazards**: Risks and weak points in your content strategy
- **Pattern Disruptions**: Unique angles to differentiate from competitors
- **Executive Strategy Analysis**: AI-written overall strategic recommendation

Triggered via `CreatorContext.analyzeCoachFeedback()`, which calls `aiService.analyzeContentQuality()`.

---

### DNA Genome System

**File:** `src/components/GenomeTab.jsx`, `src/engine/genomePrompts.js`

Identifies your unique **Creator DNA** — the content fingerprint that makes your work distinctive:
- Content pillars (what you uniquely own)
- Signature voice traits
- Audience chemistry score
- Content archetypes (Teacher, Entertainer, Challenger, etc.)
- DNA snippet that feeds back into all future AI generations to maintain consistency

The `dna_snippet` is passed as context to every subsequent AI call in `CreatorProvider`, ensuring all generated content stays true to the creator's unique voice.

---

### Trend Intelligence

**Files:** `TrendTab.jsx`, `engine/trendPrompts.js`

- Trend forecast for 2–4 weeks out
- Rising vs. declining topic analysis
- Competitor trend activity
- "Ride the wave" content timing recommendations
- Evergreen content opportunities within trending topics

---

### Batch Mode

**State in:** `CreatorProvider.jsx` (`batchMode`, `batchQueue`)

Process multiple topics simultaneously:
1. Toggle **Batch Mode** from the command palette or UI
2. Queue up to N topics with individual tone settings
3. Hit **Process** — all topics generate in parallel via `Promise.allSettled()`
4. Each result is auto-saved as a new project in Supabase

---

### Team Collaboration

**Files:** `TeamSettingsModal.jsx`, `TeamSwitcher.jsx`, `CommentsSidebar.jsx`
**Service:** `dbService` team methods

Full multi-user workspace system:

- **Create teams** with role-based access (Owner / Admin / Editor / Viewer)
- **Invite members** by email — invitations are stored in Supabase with pending status
- **Switch workspaces** — personal or any team you belong to
- **Comments**: Inline commenting on any content section, persisted and real-time synced
- **Activity Feed**: Live feed of all team actions (generations, edits, comments)

All team data is protected by **Row Level Security** — members only see data they have access to.

---

### Settings & Integrations

**Files:** `SettingsPage.jsx`, `SettingsPage.css`, `IntegrationHub.jsx`

Three-tab settings panel:

| Tab | Contents |
|-----|---------|
| **Account** | Profile info, display name, avatar |
| **API Configuration** | AI provider selection (OpenAI / OpenRouter), API key input, model selection, backend health status |
| **Integrations** | Connect/disconnect: YouTube, Notion, Slack, Airtable, Zapier, Webflow |

Settings are persisted to `localStorage` under `creator_settings`.

---

### Theme Engine

**State in:** `App.jsx` (`theme` state, `localStorage`)

- **Dark Mode** (default): Deep navy/black with purple neon accents, glassmorphism, neural mesh background
- **Light Mode**: Clean whites and soft greys, deep indigo typography, soft ambient shadows
- Toggle persisted in `localStorage` under `creator_theme`
- All colors defined as CSS custom properties (`--bg-primary`, `--text-primary`, etc.) in `index.css`
- `.light-theme` class applied to `document.documentElement` to activate light mode overrides

---

## Database Architecture

All data lives in **Supabase** (PostgreSQL). Run `supabase_schema.sql` once to set up.

### Tables

| Table | Purpose |
|-------|---------|
| `teams` | Team workspace definitions |
| `team_members` | User-team memberships with roles |
| `projects` | Creator projects (one per topic generation) |
| `generations` | AI-generated content per project, keyed by `(project_id, type)` |
| `assets` | Generated images and audio files |
| `comments` | Section-level threaded comments |
| `activity_log` | Full audit trail of all actions |
| `tasks` | Kanban tasks linked to projects |

### Row Level Security

All tables use Supabase RLS. Users can only access:
- Their own personal data (`user_id = auth.uid()`)
- Data belonging to teams they are a member of (via `team_members` join)

### Key Design Decisions

- `generations` has a **UNIQUE constraint on `(project_id, type)`** — this allows true `UPSERT` for updates without creating duplicates
- `activity_log` uses `type` + `description` + `metadata jsonb` for flexible event logging
- Cascade deletes: deleting a project removes all its generations, assets, tasks, and comments automatically

---

## Real-Time Sync

Powered by **Supabase Realtime** (WebSocket-based Postgres change listeners).

### What's Synced Live

| Event | Tables Watched | Effect |
|-------|---------------|--------|
| User opens project | `generations`, `assets`, `tasks`, `comments` | All content syncs live with teammates |
| Teammate saves content | `generations` | Your view updates instantly — no refresh needed |
| New asset generated | `assets` | Appears in both users' Asset Libraries immediately |
| Comment posted | `comments` | Appears live without polling |
| Tasks updated | `tasks` | Kanban board updates across all team members |
| Project created/deleted | `projects` | Dashboard refreshes for all workspace members |

### Subscription Methods (from `dbService.js`)

```js
// Subscribe to all changes on an active project
const unsub = dbService.subscribeToProject(projectId, {
  onGenerationChange: (payload) => { ... },
  onTaskChange: (payload) => { ... },
  onAssetChange: (payload) => { ... },
  onCommentChange: (payload) => { ... },
});

// Clean up when component unmounts
unsub();
```

All subscriptions are managed in `CreatorProvider.jsx` using `useRef` refs to ensure proper cleanup.

---

## AI Provider Setup

The app supports three AI modes:

### 1. Mock Mode (default — no setup needed)
When no `provider` is set in Settings, `mockGenerator.js` generates realistic data locally. Perfect for development and demos.

### 2. OpenRouter (recommended)
1. Sign up at [openrouter.ai](https://openrouter.ai)
2. Get an API key → paste into Settings → API tab
3. Supports 100+ models including GPT-4o, Claude 3.5, Gemini, Llama 3

### 3. Direct OpenAI
1. Get your key from [platform.openai.com](https://platform.openai.com)
2. Add to `server/.env` as `OPENAI_API_KEY`
3. The Express server proxies requests to protect your key

---

## Server / Backend

**File:** `server/server.js`

A lightweight Node.js + Express proxy server that:
- Forwards AI requests from the frontend to OpenAI/OpenRouter
- Keeps your API key secure (never exposed to the browser)
- Handles CORS
- Has a `/health` endpoint for backend status checks in Settings

```bash
cd server
node server.js    # starts on port 3001
```

The frontend automatically detects if the backend is running via `checkBackendHealth()` in `aiService.js` and falls back to mock mode gracefully.

---

## Deployment

### Frontend (Vercel)

```bash
npm run build       # outputs to dist/
```

Configure in Vercel:
- **Root directory**: `/` (project root)
- **Build command**: `npm run build`
- **Output directory**: `dist`
- Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as Vercel environment variables

The `vercel.json` file already handles SPA routing redirects.

### Backend Server

Deploy `server/` to any Node.js host (Railway, Render, Fly.io). Set `OPENAI_API_KEY` / `OPENROUTER_API_KEY` as environment variables on the host.

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

<div align="center">

**Built with ❤️ for creators who refuse to create less.**

*Creator Intelligence OS — Where AI meets creative ambition.*

</div>
