# 📚 Glass - Документация на русском

## 🎯 Быстрый старт

### Что такое Glass?
**Glass by Pickle** — это AI ассистент для рабочего стола, который:
- 👁️ Видит ваш экран
- 🎤 Слушает аудио в реальном времени
- 🧠 Понимает контекст через RAG
- 💬 Отвечает на вопросы
- 🫥 Невидим (не попадает в скриншоты)

---

## 📖 Содержание документации

### 🚀 Начало работы

#### **FINAL_SUMMARY.md** - Итоговое резюме проекта
Полный обзор всех улучшений, включая:
- ✅ Security fixes (удалены hardcoded API keys)
- ✅ RAG система (90% экономия токенов)
- ✅ DevTools integration
- ✅ File upload fix
- ✅ CSP fix

**Читать:** Чтобы понять все изменения в проекте.

---

### 🎯 Функциональность

#### **ФУНКЦИИ_ПРИЛОЖЕНИЯ.md** - Краткий обзор (RUS)
Все функции Glass на русском языке:
- Listen Mode (запись встреч)
- Ask Mode (вопросы к AI)
- File Attachments (RAG)
- Settings (настройки)
- Database (БД)
- Local AI (Ollama)

**Читать:** Для быстрого понимания возможностей.

#### **COMPLETE_FEATURES_GUIDE.md** - Подробный гайд (ENG)
Полное руководство на английском:
- Все модули детально
- Use cases и примеры
- Технологический стек
- Performance metrics
- Troubleshooting

**Читать:** Для глубокого погружения в функциональность.

---

### 🏗️ Архитектура

#### **ARCHITECTURE.md** - Диаграммы и потоки
Визуальные схемы:
- High-level architecture
- Listen module flow
- Ask module flow
- RAG system architecture
- Window management
- Database schema
- Data flow

**Читать:** Для понимания внутреннего устройства.

---

### 🧠 RAG система

#### **RAG_SYSTEM.md** - Техническая документация
Подробно о RAG:
- Архитектура
- Векторная БД (Vectra + HNSW)
- Embeddings (OpenAI / TF-IDF)
- Chunking strategy
- Performance optimization

**Читать:** Для работы с RAG или его модификации.

#### **RAG_IMPLEMENTATION_SUMMARY.md** - Детали реализации
Как RAG встроен в проект:
- Интеграция в askService
- File upload handler
- Vector store initialization
- Query flow

**Читать:** Для понимания кода RAG.

#### **FILE_ATTACHMENTS_GUIDE.md** - Руководство пользователя
Как использовать File Attachments:
- Загрузка файлов
- Поддерживаемые форматы
- Работа с RAG
- Примеры запросов

**Читать:** Для работы с документами в Glass.

---

### 🔧 Решение проблем

#### **FILE_UPLOAD_FIX.md** - Исправление загрузки файлов
Проблема: кнопка "+ Add File" не работала

Решение:
- Native Electron dialog вместо HTML5 File API
- Измененные файлы: featureBridge.js, preload.js, SettingsView.js
- Rebuild инструкции

**Читать:** Если файлы не загружаются.

#### **CSP_WARNING_FIX.md** - Устранение CSP warning
Проблема: "Electron Security Warning (Insecure Content-Security-Policy)"

Решение:
- Добавлен CSP header в index.js
- Environment variable `ELECTRON_DISABLE_SECURITY_WARNINGS=true`
- Restart инструкции

**Читать:** Если видите CSP warning в консоли.

#### **HOW_TO_TEST_RAG.md** - Тестирование RAG
Пошаговая инструкция:
- Как загрузить файл
- Как задать вопрос
- Что должно произойти
- Логи в DevTools
- Troubleshooting

**Читать:** Для проверки работы RAG.

#### **RESTART_INSTRUCTIONS.md** - Инструкции по перезапуску
Как правильно перезапустить после изменений:
- Полный quit
- Rebuild команды
- Проверка результата

**Читать:** Если изменения не применяются.

---

### 🔒 Безопасность

#### **SECURITY.md** - Security best practices
Меры безопасности:
- API keys в .env
- Context isolation
- Content Security Policy
- No hardcoded credentials
- .gitignore для секретов

**Читать:** Для обеспечения безопасности.

---

### 🎨 UI/UX

#### **DEVTOOLS_FEATURE.md** - DevTools интеграция
Как использовать DevTools:
- Кнопка в Settings
- Просмотр RAG логов
- Мониторинг ошибок
- Performance metrics

**Читать:** Для отладки приложения.

---

### 📊 История изменений

#### **IMPROVEMENTS.md** - Changelog
Все изменения проекта:
- Security fixes
- RAG implementation
- DevTools button
- File upload fix
- CSP fix

**Читать:** Для истории разработки.

---

## 🚀 Быстрый старт

### 1. Установка

```bash
# Клонировать репозиторий
git clone <repo_url>
cd glass

# Установить зависимости
npm install

# Создать .env файл
cp .env.example .env

# Добавить API ключи в .env
# OPENAI_API_KEY=sk-proj-...
# GEMINI_API_KEY=AIzaSy...
```

### 2. Запуск

```bash
npm start
```

### 3. Первые шаги

1. **Откройте Glass:** `Ctrl/Cmd + \`
2. **Задайте вопрос:** `Ctrl/Cmd + Enter`
3. **Начните запись:** Нажмите "Listen"
4. **Загрузите файл:** Settings → File Attachments

---

## 📋 Горячие клавиши

| Клавиша | Действие |
|---------|----------|
| `Ctrl/Cmd + \` | Показать/Скрыть Glass |
| `Ctrl/Cmd + Enter` | Спросить AI |
| `Ctrl/Cmd + L` | Start/Stop Listen |
| `Ctrl/Cmd + Arrows` | Переместить окно |

---

## 🛠️ Troubleshooting

### Файлы не загружаются
→ **FILE_UPLOAD_FIX.md**

### CSP warning в консоли
→ **CSP_WARNING_FIX.md**

### RAG не работает
→ **HOW_TO_TEST_RAG.md**

### Изменения не применяются
→ **RESTART_INSTRUCTIONS.md**

### DevTools кнопка не видна
→ **RESTART_INSTRUCTIONS.md**

---

## 📚 Рекомендуемый порядок чтения

### Для новичков:
1. **ФУНКЦИИ_ПРИЛОЖЕНИЯ.md** - понять возможности
2. **HOW_TO_TEST_RAG.md** - попробовать RAG
3. **FILE_ATTACHMENTS_GUIDE.md** - научиться загружать файлы

### Для разработчиков:
1. **ARCHITECTURE.md** - понять структуру
2. **COMPLETE_FEATURES_GUIDE.md** - изучить детали
3. **RAG_SYSTEM.md** - разобраться в RAG
4. **SECURITY.md** - соблюдать безопасность

### Для отладки:
1. **DEVTOOLS_FEATURE.md** - открыть консоль
2. **HOW_TO_TEST_RAG.md** - проверить логи
3. **FILE_UPLOAD_FIX.md** / **CSP_WARNING_FIX.md** - решить проблемы

---

## 🎉 Основные улучшения проекта

### ✅ Security (Безопасность)
- Удалены hardcoded API keys из 3 файлов
- Создан .env.example template
- Улучшен .gitignore
- Добавлены CSP headers

### ✅ RAG System (90% экономия)
- Векторная БД (Vectra + HNSW)
- OpenAI embeddings + TF-IDF fallback
- Smart chunking с overlap
- Semantic search (топ-5 релевантных)
- Поддержка PDF, DOCX, TXT, etc.

### ✅ DevTools Integration
- Кнопка в Settings для отладки
- Просмотр RAG логов
- Мониторинг производительности

### ✅ File Upload Fix
- Native Electron dialog вместо HTML5 API
- Поддержка всех путей к файлам
- Автоматическая индексация в RAG

### ✅ CSP Fix
- Content Security Policy headers
- Environment variable для dev mode
- Убран security warning

---

## 📞 Поддержка

- **Discord:** https://discord.gg/UCZH5B5Hpd
- **Website:** https://pickle.com
- **Twitter:** https://x.com/leinadpark

---

## 📄 Лицензия

GPL-3.0 License

---

**Glass is your digital mind extension!** 🧠

_Вся документация создана на основе реального кода проекта._
