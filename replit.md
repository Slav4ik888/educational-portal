# Educational Portal

## Overview
Образовательный веб-портал на React + TypeScript для изучения принципов работы LLM. Статьи разбиты на теоретические блоки с интерактивными тестами после каждого; финальный тест доступен только после прохождения всех промежуточных.

## User preferences
- Язык общения и интерфейса: русский.
- Все задачи (project tasks): заголовок и описание — на русском.
- Все коммиты, ответы в чате, тексты UI и сообщения об ошибках для пользователя — на русском.
- Технические идентификаторы (имена файлов, переменных, функций, API-эндпоинтов, npm-пакетов) — оставлять как есть, на английском.
- Комментарии в коде — на русском.
- Черновики задач (файлы в .local/tasks/ и .local/session_plan.md) — писать на русском.
- Сообщения о ходе выполнения (summary_in_progress / summary_complete в инструментах) — на русском.

## Architecture
- **Framework:** React 19 + TypeScript
- **Build tool:** Vite 6 (`vite.config.ts`)
- **Styling:** SCSS Modules (старые компоненты) + Tailwind CSS (новые компоненты)
- **State management:** Redux Toolkit + react-redux
- **Routing:** react-router-dom v7
- **API calls:** axios
- **Architecture pattern:** Feature-Sliced Design (FSD)

## Important notes
- TypeScript interfaces/types при реэкспорте должны использовать `export type { ... }`, а при импорте — `import type { ... }`. Это обязательно для Vite/esbuild (isolatedModules).
- Tailwind CSS — подключён через `src/tailwind.css`, импортируется в `src/index.tsx`. В новых компонентах использовать Tailwind, в старых оставить SCSS Modules.

## Project Structure
```
src/
  app/         - Инициализация приложения, провайдеры (router, store, error boundary)
  pages/       - Страницы маршрутов
  widgets/     - Переиспользуемые секции страниц
  features/    - Фичи (например, glossary)
  entities/    - Доменные сущности (article, glossary, test-block, user-progress)
  shared/      - Общие UI компоненты, хелперы, хуки, validators
  tailwind.css - Tailwind CSS точка входа
config/
  jest/        - Конфигурации Jest
index.html     - Корневой HTML для Vite
vite.config.ts - Конфигурация Vite
tailwind.config.js - Конфигурация Tailwind CSS
postcss.config.js  - Конфигурация PostCSS
public/        - Статические файлы (favicon.png)
```

## Development
- **Dev server:** `npx vite --host 0.0.0.0 --port 5000`
- **Production build:** `npx vite build` (output → `dist/`)

## Path aliases (vite.config.ts)
- `app/*` → `src/app/*`
- `pages/*` → `src/pages/*`
- `widgets/*` → `src/widgets/*`
- `features/*` → `src/features/*`
- `entities/*` → `src/entities/*`
- `shared/*` → `src/shared/*`

## Deployment
- **Type:** Static site
- **Build command:** `npx vite build`
- **Output directory:** `dist/`

## Workflow
- **Start application** — `npx vite --host 0.0.0.0 --port 5000`, порт 5000
