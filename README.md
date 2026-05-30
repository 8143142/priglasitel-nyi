# Kenes 50 Invitation Site

Готовый React/Vite проект для Vercel.

## Локальный запуск

```bash
npm install
npm run dev
```

## Сборка

```bash
npm run build
```

## Деплой на Vercel

1. Загрузите папку проекта в GitHub.
2. В Vercel нажмите Add New → Project.
3. Выберите репозиторий.
4. Framework Preset: Vite.
5. Build Command: npm run build.
6. Output Directory: dist.
7. Нажмите Deploy.

## Важные места для редактирования

Файл: `src/App.jsx`

- Дата и время: `EVENT_DATE_ISO`
- 2GIS ссылка: `TWO_GIS_URL`
- WhatsApp номер: `PHONE_WHATSAPP`
- Тексты на казахском/русском: объект `content`
