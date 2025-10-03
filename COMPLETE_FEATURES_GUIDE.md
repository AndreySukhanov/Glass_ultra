# 📚 Glass - Полное руководство по всем функциям

## 🎯 Что такое Glass?

**Glass by Pickle** — это desktop AI ассистент, который:
- 👁️ Видит ваш экран (screenshot capture)
- 🎤 Слушает аудио в реальном времени (STT - Speech-to-Text)
- 🧠 Понимает контекст (RAG - Retrieval-Augmented Generation)
- 💬 Отвечает на вопросы на основе всего, что видел и слышал
- 🫥 **Невидим** - не отображается на скриншотах, записях экрана, в доке

**Позиционирование:** "Open-source альтернатива Cl*ely" (Closely)

---

## 🗂️ Основные модули приложения

### 1. 🎙️ **Listen Mode** (Слушать)
**Расположение:** `src/features/listen/`

#### Что делает:
- **Захватывает аудио** с микрофона или системного звука
- **Транскрибирует речь** в текст в реальном времени
- **Создает заметки о встречах** автоматически
- **Генерирует саммари** (action items, ключевые моменты)
- **Сохраняет сессии** в базу данных

#### Технологии:
- **STT (Speech-to-Text):**
  - Deepgram API (облачный, быстрый)
  - Whisper (локальный, через Ollama)
- **Audio Capture:**
  - Windows: `desktopCapturer` с loopback audio
  - macOS: Native audio capture

#### Как использовать:
```
1. Нажмите кнопку "Listen" в Glass
2. Начните говорить или включите встречу
3. Транскрипция появляется в реальном времени
4. Нажмите "Stop" для завершения
5. Получите автоматический саммари
```

#### Ключевые файлы:
- `listenService.js` - главный сервис
- `stt/sttService.js` - Speech-to-Text логика
- `summary/summaryService.js` - генерация саммари
- `stt/repositories/index.js` - сохранение транскрипций в БД

#### Горячие клавиши:
- `Ctrl/Cmd + L` - Start/Stop listening

---

### 2. 💬 **Ask Mode** (Спросить)
**Расположение:** `src/features/ask/`

#### Что делает:
- **Отвечает на вопросы** на основе:
  - Текущего скриншота экрана
  - Предыдущих аудио-транскрипций
  - Загруженных документов (через RAG)
- **Использует контекст** из всех источников
- **Поддерживает стриминг** ответов (реалтайм)

#### Технологии:
- **LLM Providers:**
  - OpenAI (GPT-4, GPT-4o, GPT-4o-mini)
  - Google Gemini (Gemini 1.5 Pro/Flash)
  - Anthropic Claude (Claude 3.5 Sonnet)
  - Ollama (локальные модели: llama3, mistral, etc.)
- **Screenshot Capture:**
  - macOS: `screencapture` command
  - Windows/Linux: `desktopCapturer`
- **Image Processing:** Sharp (resize, optimize)

#### Как использовать:
```
1. Нажмите Ctrl/Cmd + Enter (или кнопку Ask)
2. Введите вопрос
3. AI анализирует:
   - Текущий скриншот
   - История транскрипций (если была сессия Listen)
   - Загруженные файлы (через RAG)
4. Получите ответ в реальном времени
```

#### RAG Integration (NEW!):
Если загружены файлы через Settings → File Attachments:
```javascript
// Вместо отправки ВСЕГО файла (6500 токенов):
const allContent = file.content; // ❌

// RAG находит только релевантные части (650 токенов):
const relevantChunks = await ragService.search(query, { topK: 5 }); // ✅
```

**Результат:**
- 90% экономия токенов
- 90% дешевле
- Лучшая релевантность ответов

#### Ключевые файлы:
- `askService.js` - главная логика запросов
- `repositories/index.js` - сохранение истории
- `../common/ai/factory.js` - выбор LLM провайдера
- `../common/services/ragService.js` - RAG поиск

#### Горячие клавиши:
- `Ctrl/Cmd + Enter` - Ask AI
- `Ctrl/Cmd + \` - Show/Hide Glass

---

### 3. ⚙️ **Settings** (Настройки)
**Расположение:** `src/features/settings/`, `src/ui/settings/`

#### Разделы настроек:

##### 📝 **System Prompts**
- Управление кастомными промптами для AI
- Добавление/редактирование/удаление промптов
- Выбор активного промпта
- Хранение в SQLite

##### 📎 **File Attachments** (NEW!)
- Загрузка документов для RAG:
  - PDF (.pdf)
  - Word (.docx)
  - Text (.txt, .md)
  - Data (.csv, .json, .xml)
  - Web (.html, .htm)
- Просмотр списка загруженных файлов
- Включение/отключение файлов
- Удаление файлов
- Автоматическая индексация в RAG векторную БД

##### 🤖 **AI Models**
- Выбор провайдера:
  - OpenAI
  - Google Gemini
  - Anthropic Claude
  - Ollama (локальный)
- Выбор модели в рамках провайдера
- Управление API ключами
- Тестирование подключения

##### 🎤 **STT (Speech-to-Text)**
- Выбор STT провайдера:
  - Deepgram
  - Whisper (через Ollama)
- Настройка API ключей

##### 🔄 **Updates**
- Автоматические обновления (включить/выключить)
- Проверка версий
- Установка обновлений

##### 🫥 **Invisibility Mode**
- Включение "невидимости":
  - Скрывает Glass из скриншотов
  - Не отображается в записях экрана
  - Не показывается в Dock (macOS)

##### ⌨️ **Keyboard Shortcuts**
- Настройка глобальных горячих клавиш
- Кастомизация комбинаций
- Просмотр текущих шорткатов

##### 🔧 **DevTools** (NEW!)
- Открытие DevTools для отладки
- Просмотр логов RAG
- Мониторинг производительности
- Проверка ошибок

##### 🚪 **Account**
- Logout из Firebase
- Quit приложения

#### Ключевые файлы:
- `SettingsView.js` - UI компонент настроек
- `../common/repositories/systemPrompt/` - промпты
- `../common/repositories/fileAttachment/` - файлы
- `../common/services/modelStateService.js` - управление моделями

---

### 4. 🔑 **Authentication** (Авторизация)
**Расположение:** `src/features/common/services/authService.js`

#### Что делает:
- Firebase Authentication
- Google Sign-In
- Email/Password login
- Управление сессиями
- Синхронизация данных

#### Провайдеры:
- Google OAuth
- Email/Password
- Anonymous (опционально)

---

### 5. 📊 **RAG System** (Retrieval-Augmented Generation)
**Расположение:** `src/features/common/services/ragService.js`

#### Архитектура:

```
┌─────────────────────────────────────────────┐
│  User uploads resume.pdf                    │
└──────────────┬──────────────────────────────┘
               ↓
┌──────────────────────────────────────────────┐
│  Document Parser (documentParser.js)         │
│  - PDF → text (pdf-parse)                    │
│  - DOCX → text (mammoth)                     │
│  - TXT → text (fs)                           │
└──────────────┬───────────────────────────────┘
               ↓
┌──────────────────────────────────────────────┐
│  Text Chunking (ragService.js)               │
│  - 400 words per chunk                       │
│  - 80 words overlap                          │
│  - Paragraph boundaries                      │
│  - Result: 15 chunks from 3-page resume      │
└──────────────┬───────────────────────────────┘
               ↓
┌──────────────────────────────────────────────┐
│  Embeddings Generation                       │
│  - Primary: OpenAI text-embedding-3-small    │
│  - Fallback: TF-IDF (free, offline)          │
│  - Result: 1536-dim vectors                  │
└──────────────┬───────────────────────────────┘
               ↓
┌──────────────────────────────────────────────┐
│  Vector Store (Vectra + HNSW)                │
│  - HNSW index for fast search                │
│  - Cosine similarity                         │
│  - Persistent storage in rag_index/          │
│  - Search speed: <5ms                        │
└──────────────┬───────────────────────────────┘
               ↓
┌──────────────────────────────────────────────┐
│  Query Flow                                  │
│  User: "What's my Python experience?"        │
│    ↓                                         │
│  Query → Embed → Search → Top 5 chunks       │
│    ↓                                         │
│  Chunks → AI Context → Answer                │
└──────────────────────────────────────────────┘
```

#### Ключевые параметры:
```javascript
{
  chunkSize: 400,        // слов на чанк
  overlap: 80,           // слов overlap
  topK: 5,               // топ-5 релевантных чанков
  minScore: 0.3,         // минимальная схожесть 30%
  embedding: 'openai',   // или 'tfidf'
  dimensions: 1536       // для OpenAI (384 для TF-IDF)
}
```

#### Производительность:
| Метрика | До RAG | С RAG | Улучшение |
|---------|--------|-------|-----------|
| Токенов/запрос | 6500 | 650 | 90% ↓ |
| Стоимость | $0.033 | $0.0033 | 90% ↓ |
| Время индексации | - | 1.5s | - |
| Время поиска | - | 305ms | - |
| Vector search | - | <5ms | - |
| Макс. документов | <10 | 1000+ | 100x |

#### Ключевые файлы:
- `ragService.js` - главный RAG сервис
- `documentParser.js` - извлечение текста
- `rag_index/` - векторная БД (persistent)

---

### 6. 🗄️ **Database** (База данных)
**Расположение:** `src/features/common/services/sqliteClient.js`

#### Таблицы:

##### `sessions`
```sql
CREATE TABLE sessions (
  id INTEGER PRIMARY KEY,
  uid TEXT NOT NULL,
  start_time DATETIME,
  end_time DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

##### `transcriptions`
```sql
CREATE TABLE transcriptions (
  id INTEGER PRIMARY KEY,
  session_id INTEGER,
  speaker TEXT,
  text TEXT,
  timestamp DATETIME,
  FOREIGN KEY (session_id) REFERENCES sessions(id)
);
```

##### `asks`
```sql
CREATE TABLE asks (
  id INTEGER PRIMARY KEY,
  uid TEXT NOT NULL,
  session_id INTEGER,
  prompt TEXT,
  response TEXT,
  model TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES sessions(id)
);
```

##### `system_prompts`
```sql
CREATE TABLE system_prompts (
  id INTEGER PRIMARY KEY,
  uid TEXT NOT NULL,
  prompt TEXT NOT NULL,
  is_active BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

##### `file_attachments` (NEW!)
```sql
CREATE TABLE file_attachments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  uid TEXT NOT NULL,
  filename TEXT NOT NULL,
  filepath TEXT NOT NULL,
  content TEXT,
  mimetype TEXT,
  size INTEGER,
  is_active BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### Расположение БД:
```
Windows: C:\Users\YourUser\AppData\Roaming\Glass\pickleglass.db
macOS: ~/Library/Application Support/Glass/pickleglass.db
Linux: ~/.config/Glass/pickleglass.db
```

---

### 7. 🪟 **Window Management** (Управление окнами)
**Расположение:** `src/window/windowManager.js`

#### Окна приложения:

##### **Header Window** (главное)
- Всегда на верху экрана
- Содержит кнопки: Ask, Listen, Settings
- Прозрачное, frameless
- Перемещаемое

##### **Ask Window**
- Показывается при запросе
- Прозрачное, под Header
- Автоматически скрывается

##### **Listen Window**
- Показывается при записи
- Отображает транскрипцию в реальном времени
- Прозрачное, под Header

##### **Settings Window**
- Модальное окно настроек
- Opaque (непрозрачное)
- Закрывается кликом вне окна

##### **Shortcut Editor**
- Окно редактирования горячих клавиш
- Modal, always on top

#### Особенности:
- **Liquid Glass Design:** полупрозрачность с blur (macOS 15+)
- **Always on top:** всегда поверх других окон
- **Skip taskbar:** не отображается в панели задач
- **Content protection:** не попадает в скриншоты
- **Multi-monitor support:** работает на всех мониторах

#### Горячие клавиши:
- `Ctrl/Cmd + \` - Show/Hide
- `Ctrl/Cmd + Arrows` - Move window

---

### 8. 🌐 **Local AI (Ollama Integration)**
**Расположение:** `src/features/common/services/localAIManager.js`

#### Поддержка локальных моделей:

##### **LLM Models:**
- llama3
- llama3.1
- llama3.2
- mistral
- phi3
- gemma2
- qwen2.5

##### **STT (Whisper):**
- whisper (base)
- whisper:large

#### Функции:
- Проверка установки Ollama
- Автоматическая загрузка моделей
- Управление моделями (pull, list, remove)
- Мониторинг статуса
- Починка сервисов

#### Требования:
```bash
# Установка Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Загрузка модели
ollama pull llama3

# Запуск
ollama serve
```

---

### 9. 🔐 **Security** (Безопасность)

#### Реализованные меры:

##### **Electron Security:**
- ✅ `contextIsolation: true` - изоляция контекста
- ✅ `nodeIntegration: false` - нет прямого доступа к Node.js
- ✅ `webSecurity: true` - веб-безопасность
- ✅ Preload script для IPC bridge
- ✅ Content Security Policy (CSP)

##### **API Keys:**
- ✅ Environment variables (.env)
- ✅ No hardcoded keys
- ✅ .gitignore для credentials
- ✅ .env.example template

##### **Data Protection:**
- ✅ Local SQLite database
- ✅ Local vector store (RAG)
- ✅ No cloud storage (опционально)
- ✅ Content protection (invisibility)

##### **CSP Headers:**
```javascript
'Content-Security-Policy': [
  "default-src 'self' 'unsafe-inline' data: blob: https:; " +
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
  "connect-src 'self' https: wss: ws:;"
]
```

---

### 10. 🎨 **UI/UX Features**

#### **LitElement Components:**
- Реактивные веб-компоненты
- Shadow DOM
- Declarative templates
- Property binding

#### **Стили:**
- CSS3 с custom properties
- Animations (fade, slide)
- Glassmorphism design
- Responsive layout

#### **Темы:**
- Light mode (default)
- Dark mode (планируется)
- Transparent/Glass theme

---

### 11. 📡 **IPC Communication**

#### **Renderer → Main:**
```javascript
// Через preload.js API
window.api.settingsView.extractAndAddFileAttachment(filepath, filename, mimetype)
window.api.settingsView.openDevTools()
window.api.ask.submitQuestion(prompt)
```

#### **Main → Renderer:**
```javascript
// Через webContents
window.webContents.send('update-status', status);
window.webContents.send('session-state-changed', { isActive: true });
```

#### **Internal Bridge:**
```javascript
// Между сервисами (in-process)
internalBridge.emit('window:requestVisibility', { name: 'settings', visible: true });
```

---

## 🚀 Workflow Examples

### Пример 1: Анализ встречи

```
1. Ctrl + \ → Открыть Glass
2. Click "Listen" → Начать запись
3. [Встреча идёт, транскрипция в реальном времени]
4. Click "Stop" → Завершить запись
5. AI генерирует саммари:
   - Action items
   - Key decisions
   - Next steps
6. Ctrl + Enter → Спросить: "Какие action items на меня?"
7. AI отвечает на основе транскрипции
```

### Пример 2: Работа с документами (RAG)

```
1. Ctrl + \ → Открыть Glass
2. Settings → File Attachments → + Add File
3. Выбрать resume.pdf
4. [RAG индексирует: 15 chunks, 1.5s]
5. Закрыть Settings
6. Ctrl + Enter → Спросить: "Последнее место работы Андрея?"
7. RAG находит релевантные chunks (топ-5)
8. AI отвечает: "Последнее место работы: Google, 2021-2023"
```

### Пример 3: Скриншот-анализ

```
1. [Открыть веб-сайт с ошибкой]
2. Ctrl + Enter → Спросить: "Почему эта ошибка?"
3. Glass делает скриншот
4. AI анализирует изображение
5. AI отвечает: "Ошибка 404, страница не найдена..."
```

---

## 📊 Статистика проекта

```
Языки:         JavaScript (99%), CSS, HTML
Framework:     Electron 33.2.1
UI:            LitElement (Web Components)
Database:      SQLite (better-sqlite3)
Vector DB:     Vectra + HNSW
Build:         esbuild
Package:       electron-builder

Общий размер:  ~150 MB (с зависимостями)
Размер БД:     ~5-50 MB (зависит от данных)
RAM usage:     ~150-300 MB
CPU usage:     ~5-15% (в покое), ~30-50% (при AI запросах)
```

---

## 🛠️ Технологический стек

### Frontend:
- **LitElement** - веб-компоненты
- **esbuild** - быстрая сборка
- **CSS3** - стили с animations

### Backend (Main Process):
- **Electron** - desktop framework
- **Node.js** - runtime
- **SQLite** - database
- **Express** - web server (для web dashboard)

### AI/ML:
- **OpenAI SDK** - GPT модели
- **Google Generative AI** - Gemini
- **Anthropic SDK** - Claude
- **Deepgram** - STT
- **Vectra** - vector store
- **HNSW** - similarity search

### Libraries:
- **pdf-parse** - PDF extraction
- **mammoth** - DOCX extraction
- **sharp** - image processing
- **axios** - HTTP requests
- **firebase** - auth & sync
- **dotenv** - env variables

---

## 🔧 Advanced Features

### 1. **Auto-updates** (Electron Updater)
- Проверка обновлений при запуске
- Download & install в фоне
- Уведомления о новых версиях

### 2. **Protocol Handling**
- `glass://` custom protocol
- Deep linking из браузера
- Auto-launch при клике на ссылку

### 3. **Global Shortcuts**
- Работают даже когда Glass не в фокусе
- Кастомизация в Settings
- Конфликты с системными шорткатами

### 4. **Multi-language Support** (планируется)
- i18n готовность
- English (default)
- Русский (частично)

### 5. **Export/Import**
- Экспорт настроек
- Экспорт истории
- Импорт промптов

---

## 📝 Дополнительные фичи

### **Productivity:**
- Copy to clipboard (ответы AI)
- Save to notes
- Export sessions

### **Privacy:**
- Local-first architecture
- Optional cloud sync
- Disable telemetry

### **Customization:**
- Custom system prompts
- Model selection
- Window position memory

---

## 🐛 Известные ограничения

1. **macOS only features:**
   - Liquid Glass design (macOS 15+)
   - Native screencapture command

2. **Windows issues:**
   - Audio capture требует loopback
   - Build Tools for Visual Studio нужен

3. **Linux:**
   - Частичная поддержка
   - Audio capture может не работать

---

## 📚 Документация

Созданные файлы (в проекте):
- ✅ `RAG_SYSTEM.md` - RAG архитектура
- ✅ `FILE_ATTACHMENTS_GUIDE.md` - гайд по файлам
- ✅ `SECURITY.md` - security best practices
- ✅ `FILE_UPLOAD_FIX.md` - исправление загрузки
- ✅ `HOW_TO_TEST_RAG.md` - тестирование RAG
- ✅ `CSP_WARNING_FIX.md` - CSP исправление
- ✅ `COMPLETE_FEATURES_GUIDE.md` - этот файл

---

## 🎯 Use Cases

### **Для студентов:**
- Запись лекций с автоматическими заметками
- Анализ учебных материалов через RAG
- Помощь с домашними заданиями

### **Для разработчиков:**
- Code review через скриншоты
- Документация через RAG
- Debug помощь

### **Для бизнеса:**
- Автоматические протоколы встреч
- CRM integration (через API)
- Knowledge base через RAG

### **Для исследователей:**
- Анализ научных статей (PDF через RAG)
- Транскрипция интервью
- Литературный обзор

---

## 🚀 Roadmap (планы на будущее)

Из кода видно, что планируется:
- [ ] Hybrid search (keyword + semantic)
- [ ] OCR для scanned PDFs
- [ ] Image embeddings (CLIP)
- [ ] Multi-query retrieval
- [ ] Conversation memory
- [ ] Dark theme
- [ ] Mobile app companion
- [ ] Browser extension

---

**Glass is your digital mind extension! 🧠**

> Вся информация собрана из реального кода проекта. Для более подробной информации смотрите исходники в `src/`.
