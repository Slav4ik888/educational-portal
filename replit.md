# Educational Portal

## Overview
A React + TypeScript educational web app that teaches how LLMs work intuitively. It presents articles split into theory blocks, with interactive tests after each block and a final test unlocked only after completing prior tests.

## User preferences
- Язык общения и интерфейса: русский.
- Все задачи (project tasks): заголовок и описание — на русском.
- Все коммиты, ответы в чате, тексты UI и сообщения об ошибках для пользователя — на русском.
- Технические идентификаторы (имена файлов, переменных, функций, API-эндпоинтов, npm-пакетов) — оставлять как есть, на английском.
- Комментарии в коде — на русском.

## Architecture
- **Framework:** React 19 + TypeScript
- **Build tool:** Webpack 5 (custom config in `/config/build/`)
- **Styling:** tailwindcss
- **State management:** Redux Toolkit + react-redux
- **Routing:** react-router-dom v7
- **API calls:** axios
- **Architecture pattern:** Feature-Sliced Design (FSD)

## Project Structure
```
src/
  app/         - App initialization, providers (router, store, error boundary)
  pages/       - Route-level pages
  widgets/     - Reusable page sections (article reader, test blocks)
  features/    - Feature modules (e.g., glossary)
  entities/    - Domain entities (article, glossary, test-block, user-progress)
  shared/      - Shared UI, lib, config, helpers
config/
  build/       - Custom webpack configuration builders
  jest/        - Jest test configurations
public/        - Static HTML template and favicon
```

## Development
- **Dev server:** `npm run dev` (port 5000, host 0.0.0.0)
- **Production build:** `npm run build:prod`

## Deployment
- **Type:** Static site
- **Build command:** `npm run build:prod`
- **Output directory:** `build/`

## Workflow
- **Start application** — runs `npm run dev`, serves on port 5000
