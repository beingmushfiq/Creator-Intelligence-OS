# Creator Intelligence OS ⚡️

> The ultimate AI-powered operating system for high-performance content creators.

**Creator Intelligence OS** is a React-based application designed to streamline the entire content creation workflow—from ideation and scripting to repurposing and analytics. It leverages local AI (via a backend proxy) and modern web technologies to provide a production-grade experience for creators.

![Creator Intelligence OS Banner](public/vite.svg) *Note: Add a real screenshot here later*

---

## 🚀 Key Features

- **🧠 Narrative Intelligence Engine**: Deconstructs topics into core tensions, incentives, and emotional leverage points.
- **📄 Master Script Generator**: Auto-generates structured scripts with hooks, motion prompts, and scene directions.
- **🔄 Multi-Platform Repurposing**: Instantly transforms one script into assets for YouTube Shorts, LinkedIn, Twitter, Blog, and Email.
- **🎨 Thumbnail Psychology**: AI-driven visual concepts and prompt generation for high-CTR thumbnails.
- **📊 Analytics Dashboard**: (Mock) Real-time tracking of revenue, views, and audience growth with `recharts`.
- **💾 Auto-Save & Persistence**: All work is saved locally to your device—never lose an idea.
- **🍞 Toast & Notifications**: Polished UI feedback system.
- **📱 Mobile Optimized**: Fully responsive layout for creating on the go.

---

## 🛠 Tech Stack

- **Frontend**: React, Vite, Framer Motion, Lucide React, Recharts
- **Backend Proxy**: Node.js, Express (handles AI API requests)
- **AI Integration**: OpenAI (GPT-4), Anthropic (Claude 3.5), Google (Gemini)
- **Styling**: Pure CSS Variables (Glassmorphism design system)
- **State Management**: React Context (`CreatorContext`)

---

## 🏁 Getting Started

### Prerequisites
- Node.js (v16+)
- API Keys (OpenAI, Anthropic, or Gemini)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/beingmushfiq/creator-intelligence-os.git
   cd creator-intelligence-os
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd server
   npm install
   cd ..
   ```

3. **Configure Environment**
   - Create a `.env` file in the `server/` directory.
   - Add your API keys:
     ```env
     OPENAI_API_KEY=sk-...
     GEMINI_API_KEY=AIza...
     CLAUDE_API_KEY=sk-ant...
     PORT=3001
     ```

### Running the App

You need to run both the frontend and the backend proxy.

1. **Start the Backend Server** (Terminal 1)
   ```bash
   node server/server.js
   ```
   *Runs on http://localhost:3001*

2. **Start the Frontend Client** (Terminal 2)
   ```bash
   npm run dev
   ```
   *Runs on http://localhost:5173*

3. **Open Access**
   - Visit `http://localhost:5173` in your browser.
   - Using the **Sidebar**, navigate to **Settings** to select your active AI provider.

---

## 📖 Feature Guide

### 1. Strategy Tab 🧭
Enter a topic (e.g., "The Future of AI"). The engine breaks it down into "Core Tension," "Hidden Incentives," and "Market Context."

### 2. Script Tab 📝
Generates a full video script. You can edit blocks inline, regenerate specific sections, and export as PDF/Markdown.

### 3. Repurposing Tab ♻️
See your master script transformed into:
- **Viral Tweets**
- **LinkedIn Posts**
- **YouTube Shorts descriptions**
- **Newsletter drafts**
*Click on any text block to inline-edit!*

### 4. Titles & Thumbnails 🖼️
- **Title Psychology**: Generates 10+ title variations optimized for CTR.
- **Visual Concepts**: Describes thumbnail elements (Face, Background, Text) based on psychological triggers.

### 5. Analytics 📈
Visualizes your (simulated) growth. Track revenue, subscribers, and platform split using beautiful interactive charts.

---

## 🤝 Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
