# Glass Ultra - AI Desktop Assistant 🧠

> **Open-source fork of [CheatingDaddy](https://github.com/sohzm/cheating-daddy)** - Enhanced with RAG, improved security, and extensive documentation.

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![GitHub](https://img.shields.io/github/stars/AndreySukhanov/Glass_ultra)](https://github.com/AndreySukhanov/Glass_ultra)

**Glass Ultra** is a fast, light & open-source AI assistant that lives on your desktop. It sees what you see, listens in real time, understands your context through RAG (Retrieval-Augmented Generation), and turns every moment into structured knowledge.

---

## ✨ Key Features

### 🎙️ **Listen Mode**
- Real-time audio transcription (Speech-to-Text)
- Automatic meeting notes and summaries
- Support for Deepgram Cloud STT and local Whisper
- Action items extraction

### 💬 **Ask Mode**
- AI answers based on:
  - Current screenshot
  - Audio transcription history
  - Uploaded documents (via RAG)
- Streaming responses
- Multiple AI providers (OpenAI, Gemini, Claude, Ollama)

### 🧠 **RAG System** (NEW!)
- Semantic search with 90% token reduction
- Vector database (Vectra + HNSW)
- Support for PDF, DOCX, TXT, JSON, XML, HTML
- Smart chunking with overlap
- OpenAI embeddings + TF-IDF fallback (offline mode)

### 🫥 **Truly Invisible**
- Never shows up in screen recordings
- Never appears in screenshots
- Hidden from your dock/taskbar
- No always-on capture or hidden sharing

### 🔒 **Privacy & Security**
- **Local-first architecture** - all data stored locally
- No hardcoded API keys
- Environment variables for credentials
- Content Security Policy enabled
- Optional cloud sync (can be disabled)

---

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) 20.x.x
- [Python](https://www.python.org/downloads/)
- Windows: [Build Tools for Visual Studio](https://visualstudio.microsoft.com/downloads/)

### Installation

```bash
# Clone the repository
git clone https://github.com/AndreySukhanov/Glass_ultra.git
cd Glass_ultra

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Add your API keys to .env
# OPENAI_API_KEY=sk-proj-...
# GEMINI_API_KEY=AIzaSy...
# DEEPGRAM_API_KEY=...

# Start the application
npm start
```

---

## 📚 Documentation

Comprehensive documentation is available in the repository:

- **[COMPLETE_FEATURES_GUIDE.md](COMPLETE_FEATURES_GUIDE.md)** - Full feature documentation (English)
- **[ФУНКЦИИ_ПРИЛОЖЕНИЯ.md](ФУНКЦИИ_ПРИЛОЖЕНИЯ.md)** - Full feature documentation (Russian)
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System architecture and data flows
- **[RAG_SYSTEM.md](RAG_SYSTEM.md)** - RAG implementation details
- **[SECURITY.md](SECURITY.md)** - Security best practices
- **[README_RU.md](README_RU.md)** - Documentation hub (Russian)

### Quick Guides

- **[HOW_TO_TEST_RAG.md](HOW_TO_TEST_RAG.md)** - Testing RAG with your documents
- **[FILE_ATTACHMENTS_GUIDE.md](FILE_ATTACHMENTS_GUIDE.md)** - Using file attachments
- **[FILE_UPLOAD_FIX.md](FILE_UPLOAD_FIX.md)** - File upload troubleshooting
- **[CSP_WARNING_FIX.md](CSP_WARNING_FIX.md)** - Fix CSP warnings

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + \` | Show/Hide Glass |
| `Ctrl/Cmd + Enter` | Ask AI |
| `Ctrl/Cmd + L` | Start/Stop Listen mode |
| `Ctrl/Cmd + Arrows` | Move window position |

---

## 🎯 Supported AI Providers

### LLM (Large Language Models)
- **OpenAI** - GPT-4, GPT-4o, GPT-4o-mini
- **Google Gemini** - Gemini 1.5 Pro, Flash
- **Anthropic Claude** - Claude 3.5 Sonnet
- **Ollama** - Local models (llama3, mistral, phi3, gemma2, qwen2.5)

### STT (Speech-to-Text)
- **Deepgram** - Cloud STT (fast, accurate)
- **Whisper** - Local STT via Ollama (privacy-focused)

### Embeddings (RAG)
- **OpenAI** - text-embedding-3-small (1536 dimensions)
- **TF-IDF** - Fallback (free, offline)

---

## 🆕 What's New in Glass Ultra

### RAG System
- 📊 **90% token reduction** - from 6500 to 650 tokens per query
- 💰 **90% cost reduction** - from $0.033 to $0.0033 per query
- 🚀 **Scalability** - support for 1000+ documents
- ⚡ **Fast search** - <5ms vector search with HNSW
- 🔍 **Semantic search** - finds relevant content, not just keywords

### Enhanced Security
- ✅ Removed all hardcoded API keys
- ✅ Added `.env.example` template
- ✅ Enhanced `.gitignore` for credentials
- ✅ Content Security Policy headers
- ✅ Security documentation

### DevTools Integration
- 🔧 Debug button in Settings
- 📊 RAG logs monitoring
- 🐛 Error tracking
- ⚡ Performance metrics

### Improved File Upload
- 📂 Native Electron dialog (more reliable)
- 📄 Support for PDF, DOCX, TXT, JSON, XML, HTML
- 🔄 Automatic RAG indexing
- 📝 File management in Settings

---

## 📦 Project Structure

```
Glass_ultra/
├── src/
│   ├── features/
│   │   ├── ask/              # AI query handling
│   │   ├── listen/           # Audio capture & STT
│   │   ├── settings/         # Settings management
│   │   └── common/
│   │       ├── services/
│   │       │   ├── ragService.js      # RAG implementation
│   │       │   └── authService.js     # Local auth
│   │       └── utils/
│   │           └── documentParser.js  # PDF/DOCX extraction
│   ├── ui/                   # UI components (LitElement)
│   ├── bridge/               # IPC communication
│   └── window/               # Window management
├── public/                   # Static assets
├── docs/                     # Documentation (MD files)
└── .env.example              # Environment variables template
```

---

## 🛠️ Development

### Build Commands

```bash
# Start development
npm start

# Build renderer only
npm run build:renderer

# Watch mode (auto-rebuild)
npm run watch:renderer

# Package application
npm run package

# Build for Windows
npm run build:win
```

### Testing

```bash
# Run linter
npm run lint
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License

This project is licensed under the GPL-3.0 License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Credits

### Original Project
- **CheatingDaddy** by [Soham](https://github.com/sohzm) ([@soham_btw](https://x.com/soham_btw))
- Repository: https://github.com/sohzm/cheating-daddy

### Glass Ultra Enhancements
- RAG System implementation
- Security improvements
- Comprehensive documentation
- File upload fixes
- DevTools integration

---

## 💡 Use Cases

### For Students
- 📚 Lecture recording with automatic notes
- 📄 Analyzing textbooks via RAG
- ✍️ Homework assistance

### For Developers
- 💻 Code review via screenshots
- 📖 Documentation search via RAG
- 🐛 Debugging assistance

### For Business
- 📊 Automatic meeting protocols
- 📈 CRM integration
- 🗂️ Knowledge base via RAG

### For Researchers
- 📑 Scientific paper analysis (PDF)
- 🎙️ Interview transcription
- 🔍 Literature review

---

## 📊 Performance

| Metric | Before RAG | With RAG | Improvement |
|--------|------------|----------|-------------|
| Tokens/query | 6500 | 650 | 90% ↓ |
| Cost/query | $0.033 | $0.0033 | 90% ↓ |
| Relevance | Mixed | High | Better |
| Max documents | <10 | 1000+ | 100x |
| Search speed | - | <5ms | Fast |

---

## 🔗 Links

- **GitHub**: https://github.com/AndreySukhanov/Glass_ultra
- **Original Project**: https://github.com/sohzm/cheating-daddy
- **Issues**: https://github.com/AndreySukhanov/Glass_ultra/issues

---

## ⚠️ Disclaimer

This is a fork of CheatingDaddy with significant enhancements. All credit for the original concept and implementation goes to Soham and the CheatingDaddy contributors.

Glass Ultra is developed independently and is not affiliated with the original project or any commercial entities.

---

**Built with ❤️ for the open-source community**
