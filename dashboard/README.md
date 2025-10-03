# Glass Ultra Dashboard

Веб-дашборд для управления настройками и персонализацией Glass Ultra.

## Возможности

- 🏠 **Главная панель** - Статистика и обзор активности
- 👤 **Персонализация** - Настройка AI под ваши предпочтения
- 📝 **Заметки встреч** - Просмотр и управление записями встреч
- ⚙️ **Настройки** - Управление API ключами, моделями и параметрами

## Технологии

- **Next.js 14** - React фреймворк
- **TypeScript** - Типобезопасность
- **Tailwind CSS** - Стилизация
- **Lucide React** - Иконки
- **React Hot Toast** - Уведомления

## Разработка

### Запуск локально

```bash
cd dashboard
npm install
npm run dev
```

Дашборд будет доступен по адресу: http://localhost:3001

### Запуск из Electron

Нажмите кнопку **"Personalize / Meeting Notes"** в настройках Glass Ultra.

## Структура

```
dashboard/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Корневой layout
│   ├── page.tsx           # Главная страница
│   └── globals.css        # Глобальные стили
├── components/            # React компоненты
│   ├── DashboardHome.tsx
│   ├── PersonalizePage.tsx
│   ├── MeetingNotesPage.tsx
│   └── SettingsPage.tsx
├── utils/                 # Утилиты
├── public/               # Статические файлы
└── package.json
```

## Интеграция с Glass Ultra

Дашборд интегрирован с главным Electron приложением через:

1. **dashboardService.js** - Управление процессом Next.js
2. **windowBridge.js** - IPC обработчики для запуска дашборда
3. **SQLite/Firebase** - Общее хранилище данных

## Сборка для production

```bash
npm run build
npm start
```

## TODO

- [ ] Подключение к SQLite базе данных Glass Ultra
- [ ] Реализация API endpoints для настроек
- [ ] Добавление экспорта заметок встреч
- [ ] Интеграция Firebase синхронизации
- [ ] Добавление графиков и аналитики
