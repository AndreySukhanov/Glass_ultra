# 🔧 Исправление загрузки файлов

## Проблема

Файлы не прикрепляются через UI (кнопка "+ Add File" не работала).

## Причина

**HTML5 File API не дает доступ к полному пути файла** из renderer process из соображений безопасности.

Старый код пытался использовать `file.path`, который:
- ❌ Undefined в браузерном контексте
- ❌ Недоступен из-за contextIsolation
- ❌ Блокируется Electron security

## ✅ Решение

Используем **native Electron dialog** (`dialog.showOpenDialog`) из main process, который имеет доступ к полному пути файла.

## Что изменилось

### 1. Добавлен handler в `featureBridge.js` (строки 305-324)

```javascript
ipcMain.handle('fileAttachment:showOpenDialog', async () => {
  const { dialog } = require('electron');
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      { name: 'Documents', extensions: ['pdf', 'docx', 'txt', 'md', 'csv', 'json', 'xml', 'html', 'htm'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  });

  if (result.canceled) {
    return { canceled: true };
  }

  return {
    canceled: false,
    filePath: result.filePaths[0]
  };
});
```

### 2. Добавлен API в `preload.js` (строка 265)

```javascript
showOpenFileDialog: () => ipcRenderer.invoke('fileAttachment:showOpenDialog'),
```

### 3. Переписан `handleAddFileAttachment()` в `SettingsView.js` (строки 1274-1325)

**До (не работало):**
```javascript
const input = document.createElement('input');
input.type = 'file';
input.onchange = async (e) => {
    const file = e.target.files[0];
    // ❌ file.path = undefined (нет доступа)
    await api.extractAndAddFileAttachment(file.path, ...);
};
input.click();
```

**После (работает):**
```javascript
// ✅ Используем native dialog из main process
const dialogResult = await api.showOpenFileDialog();

if (!dialogResult.canceled) {
    const filepath = dialogResult.filePath;  // ✅ Полный путь доступен
    const filename = filepath.split(/[\\/]/).pop();

    // Определяем mimetype по расширению
    const ext = filename.split('.').pop().toLowerCase();
    const mimetype = mimetypes[ext] || 'text/plain';

    // Загружаем файл
    await api.extractAndAddFileAttachment(filepath, filename, mimetype);
}
```

## Поддерживаемые форматы

Native dialog фильтрует только нужные файлы:
- ✅ PDF (.pdf)
- ✅ Word (.docx)
- ✅ Text (.txt, .md)
- ✅ Data (.csv, .json, .xml)
- ✅ Web (.html, .htm)

## Как тестировать

### 1. Перезапустите приложение
```bash
cd glass
npm start
```

### 2. Откройте Settings → File Attachments

### 3. Нажмите "+ Add File"

Должно появиться **native окно выбора файла** (Windows Explorer / macOS Finder).

### 4. Выберите файл (например, resume.pdf)

### 5. Проверьте в DevTools (Ctrl+Shift+I):
```
[SettingsView] Adding file attachment: resume.pdf Path: C:\Users\...\resume.pdf
[FeatureBridge] Extracting text from: C:\Users\...\resume.pdf
[RAGService] Adding document: resume.pdf
[RAGService] Created 15 chunks from document
[FeatureBridge] Document added to RAG vector store
[SettingsView] File added successfully
```

### 6. Файл должен появиться в списке:
```
✅ resume.pdf (активно)
```

## Проверка RAG

После загрузки файла задайте вопрос:
```
"Последнее место работы Андрея"
```

Должны увидеть в DevTools:
```
[AskService] Using RAG to retrieve relevant chunks...
[AskService] Added 5 relevant chunks from 1 documents
```

И AI ответит **данными из резюме**, а не "информации на экране нет".

## Безопасность

✅ **Решение безопасное:**
- Native dialog работает в main process (имеет доступ к FS)
- Renderer process получает только путь через IPC
- contextIsolation остаётся включённым
- Нет прямого доступа к Node.js из renderer

## Файлы изменены

1. ✅ `src/bridge/featureBridge.js` - добавлен dialog handler
2. ✅ `src/preload.js` - добавлен API метод
3. ✅ `src/ui/settings/SettingsView.js` - переписан handleAddFileAttachment
4. ✅ `public/build/content.js` - пересобран (npm run build:renderer)

## Troubleshooting

### Dialog не открывается
**Проверьте:** API метод добавлен в preload.js и доступен через `window.api.settingsView.showOpenFileDialog`

### Файл не добавляется
**Проверьте DevTools Console:** должны быть логи `[SettingsView] Adding file attachment`

Если есть ошибка `extractTextFromDocument`, проверьте:
- Установлены ли `pdf-parse` и `mammoth`: `npm list pdf-parse mammoth`
- Файл читаемый (не повреждён)

### RAG не находит chunks
**Проверьте:** файл был добавлен ПОСЛЕ установки RAG системы

Если файл был добавлен раньше, удалите и загрузите заново.

---

**Загрузка файлов исправлена! ✅**

Теперь можно полноценно тестировать RAG с резюме. 🚀
