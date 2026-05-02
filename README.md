# Knowledge Journey — AI-Powered Learning System

Интерактивная образовательная система с AI-генерацией персонализированных учебных маршрутов, RAG-поиском по базе знаний, AI-анализом прогресса, рекомендациями и объяснятором.

---

## О проекте

**Knowledge Journey** превращает любую тему или текст в структурированный учебный маршрут («путешествие»). ИИ разбивает материал на чекпоинты, подбирает задания разных типов и оценивает развёрнутые ответы студента в реальном времени. Система помнит прогресс пользователя, адаптирует рекомендации и отвечает на вопросы, опираясь на материалы платформы.

**Ключевые возможности:**
- Генерация учебного маршрута по свободной теме или вставленному тексту
- 8 типов заданий (выбор ответа, заполни пропуски, развёрнутый ответ, «объясни другу», и др.)
- Таймер на каждый чекпоинт с автозавершением и штрафом за превышение
- Геймификация: XP, серии правильных ответов, ×2 бонус за скорость, 3 вида достижений
- AI-оценка свободных ответов с подробным фидбеком (сильные стороны / точки роста)
- Финальный отчёт с точностью по каждому чекпоинту и рекомендациями для повторения
- Печать / сохранение отчёта как PDF через браузер
- **RAG-поиск** — «Спроси платформу» отвечает на вопросы по базе знаний с точными источниками
- **AI-анализ прогресса** — выявляет слабые места по истории прохождений
- **AI-рекомендации** — предлагает 3 темы для следующего изучения
- **AI-объяснятор** — упрощает сложные концепции прямо в читалке и на чекпоинте
- **Персональный контекст** — история, статистика и слабые темы сохраняются локально

---

## Технологии и мотивация выбора

| Технология | Роль | Мотивация |
|---|---|---|
| **React 19 + TypeScript** | UI + типизация | Актуальный стек, строгая типизация устраняет целый класс ошибок |
| **Vite** | Сборщик | Мгновенный HMR, быстрая dev-сборка даже на больших проектах |
| **Redux Toolkit** | Глобальное состояние | Предсказуемое единое хранилище; RTK устраняет boilerplate |
| **FSD (Feature-Sliced Design)** | Архитектура | Чёткие правила импортов между слоями, масштабируется без хаоса |
| **SCSS Modules** | Стили | Изолированные классы, поддержка print-CSS, нет конфликтов |
| **DeepSeek API (`deepseek-chat`)** | AI-движок | Экономичная и мощная модель; API совместим с OpenAI SDK |
| **Node.js HTTP-сервер** | Backend proxy | Скрывает API-ключ от клиента, реализует SSE-стриминг ответа |
| **RAG (Retrieval-Augmented Generation)** | Умный поиск | Ответы строго на основе контента платформы, источники верифицированы |
| **localStorage** | Персональный контекст | Без регистрации, данные остаются у пользователя, GDPR-friendly |

---

## Архитектура системы (FSD)

```
src/
├── app/           # Инициализация: провайдеры, роутер, глобальные стили
├── pages/         # Страницы:
│   ├── articles-list-page/   # Главная — список статей + навигация
│   ├── article-page/         # Читалка статьи с AI-объяснятором
│   ├── journey-new-page/     # Создание Journey (тема / ?topic= от рекомендаций)
│   ├── journey-page/         # Прохождение: чекпоинты + CheckpointExplainer
│   ├── journey-report-page/  # Финальный отчёт + навигация к AI-поиску
│   ├── progress-page/        # Прогресс + AI-анализ + AI-рекомендации
│   └── search-page/          # RAG-поиск «Спроси платформу»
├── widgets/       # Виджеты: ArticleReader (с explainer-кнопкой), TestBlock
├── features/      # Фичи: test, glossary
├── entities/      # Сущности:
│   ├── journey/       # Journey + Checkpoint + Activity + ActivityAnswer
│   ├── gamification/  # XP, streak, achievements (Redux slice + types)
│   ├── article/       # Статьи и блоки контента
│   ├── user-progress/ # Прогресс по статьям
│   └── test-block/    # Рендер вопросов, AI-evaluation UI
└── shared/        # Переиспользуемый код:
    ├── lib/ai/        # Все AI-функции клиента:
    │                  #   evaluateAnswer, ragSearch, ragIndexJourney,
    │                  #   ragRehydrateJourneys, analyzeProgress,
    │                  #   recommendNext, explainSimpler
    ├── lib/hooks/     # useCheckpointTimer — таймер с фазами
    └── api/           # axios instance
```

### Backend (server.js)

```
server.js
├── POST /api/ai/generate-journey  # Генерация Journey (SSE-стриминг)
├── POST /api/ai/evaluate-answer   # AI-оценка ответов (SSE-стриминг)
├── POST /api/rag/search           # RAG-поиск по базе знаний
├── POST /api/rag/index-journey    # Индексирование Journey в RAG
├── POST /api/ai/analyze-progress  # Анализ прогресса пользователя
├── POST /api/ai/recommend-next    # Рекомендации следующих тем
└── POST /api/ai/explain           # Объяснение концепции «попроще»

rag-content.cjs   # 15 статичных чанков из 3 статей (база знаний)
ai-prompts.cjs    # Все AI-промпты (экстернализованы)
```

---

## Архитектура AI-компонентов

### RAG (Retrieval-Augmented Generation)

```
Пользователь вводит вопрос
  → POST /api/rag/search
  → Поиск по ragIndex (rag-content.cjs + проиндексированные Journey)
  → Top-3 релевантных чанка → КОНТЕКСТ для промпта
  → DeepSeek: RAG_SEARCH_PROMPT + контекст + вопрос
  → JSON { answer, sources[] }
  → SearchPage: ответ + кликабельные источники
```

**Индексирование Journey:**
- При завершении Journey → `ragIndexJourney()` → `POST /api/rag/index-journey`
- Сервер хранит индекс в памяти (Map); восстанавливается при перезапуске из `ragIndexedJourneys` в localStorage

### AI-анализ прогресса

```
ProgressPage
  → buildUserContextSummary(history)   # Сжатая сводка для AI
  → POST /api/ai/analyze-progress
  → ANALYZE_PROGRESS_PROMPT + contextSummary + weakTopics
  → JSON { summary, weakAreas[], strengths, nextFocus }
```

### AI-рекомендации

```
ProgressPage
  → POST /api/ai/recommend-next
  → RECOMMEND_NEXT_PROMPT + completedTopics + weakTopics
  → JSON { recommendations[], advice }
  → CTA-кнопка → /journey/new?topic=<рекомендованная тема>
```

### AI-объяснятор

```
CheckpointExplainer (journey-page)
  → POST /api/ai/explain  { text: checkpoint.explanation }
  → JSON { explanation, keyPoints[], analogy }

TheoryBlock (article-reader)
  → POST /api/ai/explain  { text: block.content }
  → JSON { explanation, keyPoints[], analogy }
```

### Персональный контекст

```
JourneyReportPage → dispatch(personalContextActions.addJourneyRecord(record))
  → localStorage: personalContext.journeyHistory[]

record = {
  completionId, title, topic, accuracy, xpEarned,
  durationSec, weakCheckpoints[], checkpointResults[], date
}

buildUserContextSummary(history) → текстовая сводка для AI-промптов
```

---

## Полный поток данных

```
JourneyNewPage (или ?topic= от рекомендаций)
  → POST /api/ai/generate-journey  (SSE → DeepSeek)
  → Redux: journey.setJourney()

JourneyPage
  → Per-checkpoint: timer + activities + AI eval (SSE)
  → Redux: journey.setActivityAnswer / setAiEvaluation / completeCheckpoint
  → Redux: gamification.addXP / incrementStreak / unlockAchievement
  → При завершении: ragIndexJourney() + personalContextActions.addJourneyRecord()

JourneyReportPage
  ← Redux: journey.answers + progress, gamification.sessionXP / maxStreak / achievements
  → window.print()  →  PDF

ProgressPage
  ← Redux: personalContext.journeyHistory
  → analyzeProgress() / recommendNext()  →  AI-insights

SearchPage
  → ragSearch(query)  →  ответ + источники
```

---

## Быстрый старт

### Требования
- Node.js 18+
- npm 9+

### Установка

```bash
# 1. Клонируйте репозиторий
git clone https://github.com/your-username/educational-portal.git
cd educational-portal

# 2. Установите зависимости
npm install

# 3. Добавьте API-ключ DeepSeek
echo "DEEPSEEK_API_KEY=sk-..." > .env
```

### Запуск

```bash
# Терминал 1 — backend (порт 7575)
node server.js

# Терминал 2 — Vite dev-сервер (порт 5000)
npx vite --host 0.0.0.0 --port 5000
```

Откройте [http://localhost:5000](http://localhost:5000).

### Production-сборка

```bash
npm run build:prod     # Webpack → dist/
node server.js         # backend на порту 7575
# Раздайте dist/ через nginx или любой статик-сервер
```

---

## Как попробовать AI-возможности

### 1. RAG-поиск
1. Перейдите на главную → нажмите **🔍 Спроси платформу**
2. Задайте вопрос: *«Что такое токенизация?»* или *«Как работает механизм внимания?»*
3. Получите ответ с источниками и перейдите к статье

### 2. AI-объяснятор (в статье)
1. Откройте любую статью (например, «Как работают LLM»)
2. В теоретическом блоке нажмите **🤖 Объясни проще**
3. Получите упрощённое объяснение, ключевые моменты и аналогию

### 3. AI-объяснятор (в Journey)
1. Главная → **✨ Создать Knowledge Journey**
2. Введите тему: *«Градиентный спуск в машинном обучении»*
3. На чекпоинте нажмите **🤖 Объясни проще** если текст сложный

### 4. AI-анализ прогресса
1. Завершите хотя бы одно Journey
2. Перейдите в **📊 Мой прогресс**
3. Нажмите **🔍 Проанализировать мой прогресс** — AI выявит слабые места
4. Нажмите **💡 Что изучить дальше?** — AI предложит 3 темы

### 5. Рекомендация → Journey одним кликом
1. На странице прогресса получите рекомендации (шаг 4)
2. Нажмите **✨ Создать Journey** рядом с рекомендованной темой
3. Тема автоматически подставляется в форму создания

---

## Демо-режим (быстрое тестирование)

Для проверки полного флоу без ожидания AI-генерации:

1. Перейдите на `/journey/new`
2. Прокрутите вниз до панели **Dev-настройки**
3. Включите тумблер **«Демо-режим»** → нажмите **⚡ Запустить демо**

Демо загружает готовый маршрут «Основы HTTP протокола» с предзаполненными ответами.
AI-задания уже содержат оценки и фидбек — AI-запросы не отправляются.

---

## Ограничения и безопасность

- **Rate limiter**: 10 запросов / 60 секунд на IP (все `/api/ai/*` и `/api/rag/*`)
- **Персональные данные**: хранятся только в localStorage, сервер их не получает
- **RAG без векторов**: поиск на TF-IDF; для > 500 чанков рекомендуются векторные эмбеддинги
- **API-ключ**: хранится только на сервере (`process.env.DEEPSEEK_API_KEY`)

---

## Лицензия

MIT
