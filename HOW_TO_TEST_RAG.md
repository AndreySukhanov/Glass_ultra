# 🧪 Как протестировать RAG с резюме

## Проблема

Вы спросили: "Последнее место работы Андрея"

Приложение ответило: "Информации на экране нет" — потому что оно смотрит на **скриншот**, а не на **файл резюме**.

## Причина

**RAG работает**, но **файл резюме не загружен** в Glass!

RAG код проверяет базу данных:
```javascript
const attachments = fileAttachmentRepository.getActiveAttachments(user.uid);
if (attachments && attachments.length > 0) {
    // Ищет в RAG
} else {
    // Использует скриншот
}
```

## ✅ Решение: Загрузите резюме через UI

### Шаг 1: Откройте Glass
```
Нажмите Ctrl + \ (Windows) или Cmd + \ (Mac)
```

### Шаг 2: Откройте Settings
- Нажмите на кнопку **Settings** (шестерёнка)

### Шаг 3: Найдите раздел "File Attachments"
В окне Settings будет раздел:
```
📎 File Attachments
   + Add File
```

### Шаг 4: Добавьте файл резюме
1. Нажмите **+ Add File**
2. Выберите файл резюме (PDF, DOCX, TXT)
3. Подождите ~1-2 секунды (индексация в RAG)

Вы увидите:
```
✅ resume.pdf (активно)
```

### Шаг 5: Задайте вопрос
Теперь закройте Settings и спросите:
```
"Последнее место работы Андрея"
```

## Что происходит под капотом

### До загрузки файла:
```
User: "Последнее место работы Андрея"
↓
[AskService] attachments.length = 0
↓
[AskService] Используется скриншот экрана
↓
AI: "На скриншоте нет информации"
```

### После загрузки файла:
```
User: "Последнее место работы Андрея"
↓
[AskService] attachments.length = 1 (resume.pdf)
↓
[AskService] Using RAG to retrieve relevant chunks...
↓
[RAGService] Ищет по 15 чанкам резюме
↓
[RAGService] Находит топ-5 релевантных чанков
↓
AI: "Последнее место работы: [информация из резюме]"
```

## 🔍 Проверка (DevTools)

Откройте DevTools (Ctrl+Shift+I) и проверьте логи:

### До загрузки:
```
[AskService] No attachments found
```

### После загрузки:
```
[RAGService] Successfully added document: resume.pdf
[RAGService] Created 15 chunks from document
[AskService] Using RAG to retrieve relevant chunks...
[AskService] Added 5 relevant chunks from 1 documents
```

## 📁 Где хранятся файлы

### Оригинальные файлы
Копируются в:
```
Windows: C:\Users\YourUser\AppData\Roaming\Glass\uploads\
Mac: ~/Library/Application Support/Glass/uploads/
```

### База данных
```
Windows: C:\Users\YourUser\AppData\Roaming\Glass\pickleglass.db
Mac: ~/Library/Application Support/Glass/pickleglass.db

Таблица: file_attachments
Поля: id, uid, filename, filepath, content, mimetype, size, is_active, created_at
```

### Vector Store (RAG)
```
Windows: C:\Users\YourUser\AppData\Roaming\Glass\rag_index\
Mac: ~/Library/Application Support/Glass/rag_index/

Файл: index.json (HNSW vector index)
```

## 🎯 Тестовые вопросы

После загрузки резюме Андрея попробуйте:

1. **Конкретные факты:**
   - "Последнее место работы Андрея"
   - "Какие навыки у Андрея в Python?"
   - "Где учился Андрей?"

2. **Сложные запросы:**
   - "Сколько лет опыта работы у Андрея?"
   - "Какие проекты Андрей делал на Python?"
   - "Перечисли все компании где работал Андрей"

3. **Семантический поиск:**
   - "Опыт с машинным обучением" (должен найти ML/AI секции)
   - "Знание баз данных" (должен найти SQL/PostgreSQL)
   - "Образование" (должен найти университет)

## ⚠️ Важно!

1. **Файл должен быть АКТИВНЫМ** в UI (галочка ✅)
2. **RAG индексирует только при загрузке** — если файл был добавлен ДО установки RAG, удалите и загрузите заново
3. **Поддерживаемые форматы**: PDF, DOCX, TXT, MD, CSV, JSON, XML, HTML

## 🐛 Troubleshooting

### "No relevant chunks found"
**Решение:** Понизьте `minScore` в `askService.js:303`:
```javascript
minScore: 0.2,  // было 0.3
```

### "RAG is not initialized"
**Решение:** Добавьте OpenAI API ключ в `.env`:
```bash
OPENAI_API_KEY=sk-proj-your-key-here
```

Или используйте fallback TF-IDF (работает без API):
```javascript
// В ragService.js автоматически используется TF-IDF если нет OpenAI ключа
```

### Файл не индексируется
**Решение:** Проверьте DevTools Console:
```
[RAGService] Adding document: resume.pdf
[RAGService] Created N chunks
```

Если нет логов — файл не был обработан. Удалите и загрузите заново.

---

## 📋 Краткая инструкция

```
1. Откройте Glass (Ctrl + \)
2. Settings → File Attachments → + Add File
3. Выберите resume.pdf
4. Подождите 1-2 сек
5. Задайте вопрос: "Последнее место работы Андрея"
6. ✅ AI найдёт ответ в резюме через RAG!
```

---

**RAG готов к работе! Просто загрузите файл через UI.** 🚀
