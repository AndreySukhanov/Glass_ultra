# 🏗️ Glass Architecture Overview

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     GLASS APPLICATION                        │
│                   (Electron Desktop App)                     │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ Main Process │    │   Renderer   │    │   Preload    │
│  (Node.js)   │◄──►│   Process    │◄──►│    Script    │
│              │ IPC│  (Browser)   │ API│   (Bridge)   │
└──────────────┘    └──────────────┘    └──────────────┘
        │
        ├─► Services
        ├─► Database
        ├─► AI/ML
        └─► Window Management
```

---

## Core Modules

```
┌─────────────────────────────────────────────────────────────┐
│                         FEATURES                             │
├─────────────┬─────────────┬─────────────┬──────────────────┤
│   Listen    │     Ask     │  Settings   │     Common       │
│   (STT)     │    (AI)     │   (Config)  │   (Shared)       │
└─────────────┴─────────────┴─────────────┴──────────────────┘
      │             │              │              │
      ▼             ▼              ▼              ▼
┌──────────────────────────────────────────────────────────────┐
│                       SERVICES LAYER                          │
├────────────┬──────────────┬──────────────┬──────────────────┤
│ STT Service│ Ask Service  │ Auth Service │  RAG Service     │
│ (Deepgram/ │ (AI Models)  │ (Firebase)   │  (Vectors)       │
│  Whisper)  │              │              │                  │
└────────────┴──────────────┴──────────────┴──────────────────┘
      │             │              │              │
      ▼             ▼              ▼              ▼
┌──────────────────────────────────────────────────────────────┐
│                    DATA/STORAGE LAYER                         │
├────────────┬──────────────┬──────────────┬──────────────────┤
│  SQLite DB │ Vector Store │   Firebase   │  File System     │
│ (sessions, │  (Vectra +   │   (Auth +    │  (uploads/,      │
│  prompts,  │   HNSW)      │    Sync)     │   rag_index/)    │
│  files)    │              │              │                  │
└────────────┴──────────────┴──────────────┴──────────────────┘
```

---

## Listen Module Flow

```
User clicks "Listen"
        ↓
┌─────────────────────┐
│  listenService.js   │
│  - initializeSession│
│  - Start recording  │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│   sttService.js     │
│  - Capture audio    │
│  - Stream to STT    │
└──────────┬──────────┘
           ↓
┌─────────────────────┬─────────────────────┐
│   Deepgram API      │   Whisper (Ollama)  │
│   (Cloud STT)       │   (Local STT)       │
└──────────┬──────────┴──────────┬──────────┘
           │                     │
           └──────────┬──────────┘
                      ↓
              Transcription Text
                      ↓
┌─────────────────────────────────────────┐
│   sttRepository.js                      │
│   - Save to SQLite                      │
│   - Link to session                     │
└─────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────┐
│   summaryService.js                     │
│   - Generate summary with AI            │
│   - Extract action items                │
│   - Identify key decisions              │
└─────────────────────────────────────────┘
                      ↓
          Display to User (UI)
```

---

## Ask Module Flow

```
User presses Ctrl+Enter
        ↓
┌─────────────────────┐
│   askService.js     │
│   - submitQuestion  │
└──────────┬──────────┘
           ↓
┌──────────────────────────────────────────┐
│  Gather Context                          │
│  ┌────────────┬────────────┬───────────┐│
│  │ Screenshot │ Audio      │ Documents ││
│  │ (current)  │ (session)  │ (RAG)     ││
│  └────────────┴────────────┴───────────┘│
└──────────┬───────────────────────────────┘
           ↓
┌─────────────────────────────────────────┐
│  Screenshot Capture                     │
│  - macOS: screencapture                 │
│  - Windows/Linux: desktopCapturer       │
│  - Sharp: resize/optimize               │
└──────────┬──────────────────────────────┘
           ↓
┌─────────────────────────────────────────┐
│  Audio Context (if Listen active)       │
│  - Get current session transcriptions   │
│  - Add to context                       │
└──────────┬──────────────────────────────┘
           ↓
┌─────────────────────────────────────────┐
│  RAG Search (if files attached)         │
│  ┌───────────────────────────────────┐  │
│  │ ragService.search(query)          │  │
│  │  - Embed query (OpenAI/TF-IDF)    │  │
│  │  - Vector search (HNSW)           │  │
│  │  - Get top 5 relevant chunks      │  │
│  │  - Add to context                 │  │
│  └───────────────────────────────────┘  │
└──────────┬──────────────────────────────┘
           ↓
┌─────────────────────────────────────────┐
│  Build AI Prompt                        │
│  - System prompt                        │
│  - User question                        │
│  - Screenshot (base64)                  │
│  - Audio transcriptions                 │
│  - RAG chunks                           │
└──────────┬──────────────────────────────┘
           ↓
┌─────────────────────────────────────────┐
│  AI Model Selection (factory.js)        │
│  ┌────────┬────────┬────────┬─────────┐│
│  │ OpenAI │ Gemini │ Claude │ Ollama  ││
│  └────────┴────────┴────────┴─────────┘│
└──────────┬──────────────────────────────┘
           ↓
┌─────────────────────────────────────────┐
│  Stream Response                        │
│  - Token by token                       │
│  - Display to UI                        │
└──────────┬──────────────────────────────┘
           ↓
┌─────────────────────────────────────────┐
│  Save to Database                       │
│  - askRepository.saveAsk()              │
│  - Store prompt + response              │
└─────────────────────────────────────────┘
           ↓
        Complete
```

---

## RAG System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    DOCUMENT UPLOAD                           │
└──────────────────────────┬──────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  documentParser.js                                           │
│  ┌────────────┬────────────┬────────────┬─────────────┐     │
│  │ PDF        │ DOCX       │ TXT/MD     │ JSON/XML    │     │
│  │ pdf-parse  │ mammoth    │ fs.read    │ JSON.parse  │     │
│  └────────────┴────────────┴────────────┴─────────────┘     │
│                           ↓                                  │
│                   Extracted Text                             │
└──────────────────────────┬──────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  ragService.chunkText()                                      │
│  - Chunk size: 400 words                                     │
│  - Overlap: 80 words                                         │
│  - Paragraph boundaries                                      │
│                           ↓                                  │
│         [chunk1] [chunk2] ... [chunk15]                      │
└──────────────────────────┬──────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  ragService.generateEmbedding()                              │
│  ┌──────────────────────┬──────────────────────────────┐    │
│  │  OpenAI              │  TF-IDF (fallback)           │    │
│  │  text-embedding-3-   │  - Free                      │    │
│  │  small               │  - Offline                   │    │
│  │  - 1536 dimensions   │  - 384 dimensions            │    │
│  └──────────────────────┴──────────────────────────────┘    │
│                           ↓                                  │
│         [vec1] [vec2] ... [vec15]                            │
└──────────────────────────┬──────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  Vector Store (Vectra + HNSW)                                │
│  - HNSW index (Hierarchical Navigable Small World)          │
│  - Cosine similarity                                         │
│  - Persistent: rag_index/index.json                          │
│  - Fast search: <5ms                                         │
└──────────────────────────┬──────────────────────────────────┘
                           ↓
                    Indexed & Ready

┌─────────────────────────────────────────────────────────────┐
│                      QUERY FLOW                              │
└──────────────────────────┬──────────────────────────────────┘
                           ↓
User Query: "Python experience?"
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  ragService.search()                                         │
│  1. Embed query → [query_vec]                               │
│  2. Search HNSW index                                        │
│  3. Calculate cosine similarity                              │
│  4. Filter by minScore (0.3)                                 │
│  5. Return topK (5) chunks                                   │
└──────────────────────────┬──────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  Results                                                     │
│  [                                                           │
│    {                                                         │
│      text: "...Python development...",                       │
│      score: 0.87,                                            │
│      filename: "resume.pdf",                                 │
│      chunkIndex: 5                                           │
│    },                                                        │
│    ...4 more chunks                                          │
│  ]                                                           │
└──────────────────────────┬──────────────────────────────────┘
                           ↓
               Add to AI context
                           ↓
                    AI generates answer
```

---

## Window Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         SCREEN                               │
│                                                              │
│  ┌────────────────────────────────────────────────────┐     │
│  │  Header Window (always on top)                     │     │
│  │  [Ask] [Listen] [Settings]                         │     │
│  └────────────────────────────────────────────────────┘     │
│           │                                                  │
│           ├─► Ask Window (when active)                       │
│           │   ┌──────────────────────────────────┐          │
│           │   │ Ask AI a question...             │          │
│           │   │ [User input]                     │          │
│           │   │                                  │          │
│           │   │ AI Response streaming...         │          │
│           │   └──────────────────────────────────┘          │
│           │                                                  │
│           ├─► Listen Window (when recording)                 │
│           │   ┌──────────────────────────────────┐          │
│           │   │ 🎙️ Recording...                  │          │
│           │   │                                  │          │
│           │   │ Speaker 1: "Hello world..."      │          │
│           │   │ Speaker 2: "How are you?"        │          │
│           │   └──────────────────────────────────┘          │
│           │                                                  │
│           └─► Settings Window (modal)                        │
│               ┌──────────────────────────────────┐          │
│               │ ⚙️ Settings                      │          │
│               │ ├─ System Prompts                │          │
│               │ ├─ File Attachments              │          │
│               │ ├─ AI Models                     │          │
│               │ ├─ Auto Updates                  │          │
│               │ ├─ Invisibility Mode             │          │
│               │ └─ Logout                        │          │
│               └──────────────────────────────────┘          │
│                                                              │
└─────────────────────────────────────────────────────────────┘

Window Properties:
- Frameless: true
- Transparent: true (except Settings)
- Always on top: true
- Skip taskbar: true
- Content protection: true (invisible to screen capture)
- Vibrancy: true (macOS Liquid Glass)
```

---

## Database Schema

```
┌─────────────────────────────────────────────────────────────┐
│                      pickleglass.db                          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────┐      ┌──────────────────┐
│   sessions      │      │  transcriptions  │
├─────────────────┤      ├──────────────────┤
│ id (PK)         │◄─────│ session_id (FK)  │
│ uid             │      │ speaker          │
│ start_time      │      │ text             │
│ end_time        │      │ timestamp        │
│ created_at      │      └──────────────────┘
└─────────────────┘
        │
        │
        ▼
┌─────────────────┐
│      asks       │
├─────────────────┤
│ id (PK)         │
│ uid             │
│ session_id (FK) │
│ prompt          │
│ response        │
│ model           │
│ created_at      │
└─────────────────┘

┌──────────────────┐      ┌──────────────────┐
│ system_prompts   │      │ file_attachments │
├──────────────────┤      ├──────────────────┤
│ id (PK)          │      │ id (PK)          │
│ uid              │      │ uid              │
│ prompt           │      │ filename         │
│ is_active        │      │ filepath         │
│ created_at       │      │ content          │
└──────────────────┘      │ mimetype         │
                          │ size             │
                          │ is_active        │
                          │ created_at       │
                          └──────────────────┘
```

---

## Technology Stack

```
┌─────────────────────────────────────────────────────────────┐
│                     GLASS TECH STACK                         │
└─────────────────────────────────────────────────────────────┘

Frontend (Renderer Process):
├─ LitElement (Web Components)
├─ esbuild (Bundler)
└─ CSS3 (Styles)

Backend (Main Process):
├─ Electron 33.2.1
├─ Node.js 20.x
├─ SQLite (better-sqlite3)
└─ Express (Web Server)

AI/ML:
├─ OpenAI SDK (GPT models)
├─ Google Generative AI (Gemini)
├─ Anthropic SDK (Claude)
├─ Deepgram (STT)
├─ Vectra (Vector Store)
└─ HNSW (Similarity Search)

Document Processing:
├─ pdf-parse (PDF extraction)
├─ mammoth (DOCX extraction)
└─ sharp (Image processing)

Other:
├─ Firebase (Auth + Sync)
├─ dotenv (Environment)
└─ axios (HTTP)
```

---

## Data Flow Summary

```
User Input
    ↓
┌───────────────┐
│   UI Layer    │ ← LitElement Components
└───────┬───────┘
        ↓ IPC (via preload.js)
┌───────────────┐
│ Service Layer │ ← askService, listenService, ragService
└───────┬───────┘
        ↓
┌───────────────┐
│  Data Layer   │ ← SQLite, Vectra, File System
└───────┬───────┘
        ↓
┌───────────────┐
│  External AI  │ ← OpenAI, Gemini, Claude, Ollama
└───────────────┘
        ↓
    Response
        ↓
   Display to User
```

---

**Architecture designed for:**
- ✅ Modularity (clear separation of concerns)
- ✅ Scalability (RAG supports 1000+ docs)
- ✅ Security (context isolation, no hardcoded keys)
- ✅ Performance (HNSW fast search, streaming responses)
- ✅ Privacy (local-first, optional cloud sync)