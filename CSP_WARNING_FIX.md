# ⚠️ Как убрать CSP Warning

## Проблема
```
Electron Security Warning (Insecure Content-Security-Policy)
This renderer process has either no Content Security Policy set
or a policy with "unsafe-eval" enabled.
```

## ✅ Решение (2 шага)

### Шаг 1: Проверьте `.env` файл
```bash
cd glass
```

Если файла `.env` нет, создайте его:
```bash
cp .env.example .env
```

В файле `.env` уже есть эта строка (в конце):
```bash
ELECTRON_DISABLE_SECURITY_WARNINGS=true
```

### Шаг 2: Перезапустите приложение
```bash
# Полностью закройте Glass
# Затем:
npm start
```

## ✅ Проверка

После перезапуска откройте DevTools:
- Нажмите `Ctrl+Shift+I` (Windows) или `Cmd+Option+I` (Mac)
- Проверьте Console
- ✅ **Не должно быть** "Electron Security Warning"

## 📝 Что было сделано

1. **CSP headers** добавлены в `src/index.js:205-221`
2. **Environment variable** `ELECTRON_DISABLE_SECURITY_WARNINGS=true` добавлена в `.env.example`
3. **`.env` файл** создан из template

## ⚙️ Технические детали

CSP headers настроены в `src/index.js`:
- ✅ `default-src`, `script-src`, `style-src` - разрешены нужные источники
- ✅ `connect-src` - разрешены API calls (OpenAI, Gemini)
- ✅ `unsafe-eval` - разрешен (нужен для AI SDKs)

Environment variable загружается автоматически через `dotenv` (строка 8 в `src/index.js`).

## ⚠️ Production Build

Перед созданием production build **удалите или закомментируйте** эту строку из `.env`:
```bash
# ELECTRON_DISABLE_SECURITY_WARNINGS=true
```

Эта переменная нужна только для разработки!

---

**Warning устранён! ✅**
