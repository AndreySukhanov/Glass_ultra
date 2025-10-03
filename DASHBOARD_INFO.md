# 📊 Веб-дашборд Glass Ultra

## Что это?

Локальный веб-дашборд для управления настройками, персонализацией и заметками встреч Glass Ultra.

## Быстрый запуск

### Из приложения
1. Откройте настройки Glass Ultra (⚙️)
2. Нажмите **"Personalize / Meeting Notes"**
3. Дашборд откроется в браузере автоматически

### Вручную
```bash
cd dashboard
npm install
npm run dev
```

Откройте: http://localhost:3001

## Функции

- 🏠 **Главная** - Статистика использования и активность
- 👤 **Персонализация** - Настройка AI под ваш стиль
- 📝 **Заметки встреч** - Просмотр и экспорт записей
- ⚙️ **Настройки** - API ключи, модели, параметры

## Скриншоты

### Главная панель
```
┌────────────────────────────────────────┐
│  Glass Ultra                           │
│  Панель управления                     │
├────────────────────────────────────────┤
│                                        │
│  Всего сессий  │  Транскрибировано    │
│       0        │       0 мин          │
│                                        │
│  AI запросов   │  Заметки встреч      │
│       0        │       0              │
│                                        │
│  Последняя активность                 │
│  ├─ Пока нет активности               │
│                                        │
└────────────────────────────────────────┘
```

## Технологии

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Backend Integration**: Electron IPC → SQLite/Firebase
- **Icons**: Lucide React
- **UI Components**: Custom с Tailwind

## Документация

- 📖 [Полное руководство](./DASHBOARD_GUIDE_RU.md)
- 🚀 [Быстрый старт](./dashboard/QUICK_START_RU.md)
- 🔧 [README дашборда](./dashboard/README.md)

## Разработка

```bash
# Установка зависимостей
cd dashboard
npm install

# Режим разработки
npm run dev

# Сборка для production
npm run build

# Запуск production сборки
npm start
```

## Структура проекта

```
dashboard/
├── app/              # Next.js pages (App Router)
│   ├── page.tsx     # Главная страница
│   ├── layout.tsx   # Root layout
│   └── globals.css  # Глобальные стили
├── components/      # React компоненты
│   ├── DashboardHome.tsx
│   ├── PersonalizePage.tsx
│   ├── MeetingNotesPage.tsx
│   └── SettingsPage.tsx
├── utils/          # Утилиты и хелперы
├── public/         # Статические файлы
└── package.json
```

## Интеграция с Electron

Дашборд интегрирован через:

1. **dashboardService.js** - Управление процессом Next.js
2. **windowBridge.js** - IPC обработчики
3. **Общая база данных** - SQLite/Firebase

## API (Планируется)

- `GET /api/settings` - Получить настройки
- `POST /api/settings` - Сохранить настройки
- `GET /api/meetings` - Получить заметки
- `POST /api/personalization` - Сохранить персонализацию

## Требования

- Node.js 18+
- npm 9+
- Glass Ultra 1.0.0+

## Поддержка

- 🐛 [Баг-репорты](https://github.com/yourusername/glass-ultra/issues)
- 💬 [Обсуждения](https://github.com/yourusername/glass-ultra/discussions)
- 📧 Email: support@glassultra.com

---

**Создано для Glass Ultra** - AI-ассистент следующего поколения 🚀
