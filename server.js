// server.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const https = require('https');
const { jsonrepair } = require('jsonrepair');

const app = express();
const PORT = 7575;

// Allow requests only from the same machine (Vite proxy + local dev)
const ALLOWED_ORIGINS = [
  'http://localhost:5050',
  'http://localhost:5000',
  'http://localhost:3000',
  `https://${process.env.REPLIT_DEV_DOMAIN}`,
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || ALLOWED_ORIGINS.some(o => origin.startsWith(o))) {
      cb(null, true);
    } else {
      cb(new Error('CORS: origin not allowed'));
    }
  },
  methods: ['GET', 'POST'],
}));

app.use(express.json({ limit: '100kb' }));

// --- Simple in-memory rate limiter ---
const rateLimitMap = new Map();
const RATE_WINDOW_MS = 60_000;
const RATE_MAX_REQ = 10;

function rateLimit(req, res, next) {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const rec = rateLimitMap.get(ip) || { count: 0, start: now };

  if (now - rec.start > RATE_WINDOW_MS) {
    rec.count = 0;
    rec.start = now;
  }

  rec.count += 1;
  rateLimitMap.set(ip, rec);

  if (rec.count > RATE_MAX_REQ) {
    return res.status(429).json({ error: 'Слишком много запросов — подождите минуту' });
  }
  return next();
}

setInterval(() => {
  const now = Date.now();
  for (const [ip, rec] of rateLimitMap) {
    if (now - rec.start > RATE_WINDOW_MS * 2) rateLimitMap.delete(ip);
  }
}, RATE_WINDOW_MS);

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const MODEL = 'deepseek-chat';
const MIN_CHECKPOINTS = 3;
const MAX_CHECKPOINTS = 7;

const VALID_ACTIVITY_TYPES = new Set([
  'multiple-choice',
  'true-false',
  'fill-blank',
  'free-response',
  'explain-like-im-five',
  'teach-back',
  'give-your-example',
  'debug-the-logic',
]);

const AI_EVALUATED_TYPES = new Set([
  'free-response',
  'explain-like-im-five',
  'teach-back',
  'give-your-example',
  'debug-the-logic',
]);

/** Default points per activity type */
function defaultPoints(type) {
  if (AI_EVALUATED_TYPES.has(type)) return 20;
  return 10;
}

/** Normalize and validate a checkpoint's activities, stripping malformed ones */
function normalizeActivities(rawActs, checkpointIdx) {
  if (!Array.isArray(rawActs)) return [];
  return rawActs
    .filter(a => a && typeof a === 'object' && VALID_ACTIVITY_TYPES.has(a.type))
    .filter(a => typeof a.text === 'string' && a.text.trim())
    .map((act, aIdx) => {
      const base = {
        id: `cp${checkpointIdx + 1}_act${aIdx + 1}`,
        type: act.type,
        text: String(act.text).trim(),
        points: Number.isFinite(act.points) && act.points > 0 ? act.points : defaultPoints(act.type),
        hint: typeof act.hint === 'string' ? act.hint : null,
      };

      if (act.type === 'multiple-choice') {
        const options = Array.isArray(act.options) ? act.options.map(String) : [];
        const correctAnswers = Array.isArray(act.correctAnswers)
          ? act.correctAnswers.filter(i => typeof i === 'number' && i < options.length)
          : [0];
        if (options.length < 2 || correctAnswers.length === 0) return null;
        return {
          ...base,
          options,
          correctAnswers,
          allowMultiple: Boolean(act.allowMultiple),
          explanation: String(act.explanation || ''),
        };
      }

      if (act.type === 'true-false') {
        if (typeof act.correctAnswer !== 'boolean') return null;
        return { ...base, correctAnswer: act.correctAnswer, explanation: String(act.explanation || '') };
      }

      if (act.type === 'fill-blank') {
        const blanks = Array.isArray(act.blanks)
          ? act.blanks.filter(b => b && typeof b.id === 'string' && typeof b.correctAnswer === 'string')
          : [];
        if (blanks.length === 0) return null;
        return {
          ...base,
          textWithBlanks: String(act.textWithBlanks || act.text),
          blanks,
          caseSensitive: Boolean(act.caseSensitive),
        };
      }

      if (act.type === 'free-response') {
        return {
          ...base,
          evaluationCriteria: String(act.evaluationCriteria || 'понимание концепции'),
          exampleAnswer: String(act.exampleAnswer || ''),
        };
      }

      if (act.type === 'explain-like-im-five') {
        return {
          ...base,
          evaluationCriteria: String(act.evaluationCriteria || 'объяснение без терминов, понятно новичку'),
          targetAudience: String(act.targetAudience || 'ребёнку 10 лет'),
        };
      }

      if (act.type === 'teach-back') {
        return {
          ...base,
          evaluationCriteria: String(act.evaluationCriteria || 'полнота, правильность, понятность объяснения'),
          forbiddenTerms: Array.isArray(act.forbiddenTerms) ? act.forbiddenTerms.map(String) : [],
        };
      }

      if (act.type === 'give-your-example') {
        return {
          ...base,
          evaluationCriteria: String(act.evaluationCriteria || 'пример релевантен, конкретный, правильно иллюстрирует концепцию'),
          domain: String(act.domain || 'из повседневной жизни или практики'),
        };
      }

      if (act.type === 'debug-the-logic') {
        if (!act.reasoning || typeof act.reasoning !== 'string') return null;
        return {
          ...base,
          reasoning: String(act.reasoning).trim(),
          errorLocation: String(act.errorLocation || ''),
          evaluationCriteria: String(act.evaluationCriteria || 'точное определение ошибки и объяснение почему это неверно'),
        };
      }

      return null;
    })
    .filter(Boolean);
}

/** Validate/normalize parsed decomposition result */
function normalizeCheckpoints(raw) {
  if (!Array.isArray(raw)) throw new Error('AI returned invalid checkpoints structure');
  const valid = raw.filter(cp =>
    cp && typeof cp.id === 'string' && typeof cp.concept === 'string' && cp.concept.trim()
  );
  if (valid.length < MIN_CHECKPOINTS) {
    throw new Error(`AI returned only ${valid.length} checkpoints (minimum ${MIN_CHECKPOINTS})`);
  }
  return valid.slice(0, MAX_CHECKPOINTS).map((cp, i) => ({
    id: cp.id || `cp${i + 1}`,
    concept: String(cp.concept).trim(),
    explanation: String(cp.explanation || '').trim(),
    order: i + 1,
  }));
}

function callOpenRouter(messages, temperature = 0.7, maxTokens = 4096) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model: MODEL,
      messages,
      temperature,
      max_tokens: maxTokens,
      response_format: { type: 'json_object' }
    });

    const options = {
      hostname: 'api.deepseek.com',
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.error) return reject(new Error(parsed.error.message));
          const content = parsed.choices?.[0]?.message?.content;
          if (!content) return reject(new Error('Empty response from AI'));
          try {
            resolve(JSON.parse(content));
          } catch {
            // AI occasionally returns malformed JSON (unescaped newlines / quotes
            // inside long string values). Try to repair before giving up.
            try {
              resolve(JSON.parse(jsonrepair(content)));
            } catch (repairErr) {
              reject(new Error('Failed to parse AI response: ' + repairErr.message));
            }
          }
        } catch (e) {
          reject(new Error('Failed to parse API envelope: ' + e.message));
        }
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}


app.post('/api/ai/generate-journey', rateLimit, async (req, res) => {
  try {
    if (!DEEPSEEK_API_KEY) {
      return res.status(500).json({ error: 'DEEPSEEK_API_KEY not configured' });
    }

    const { topic, text } = req.body;
    if (!topic && !text) {
      return res.status(400).json({ error: 'topic or text required' });
    }

    const inputContent = text
      ? `Текст для изучения:\n${String(text).slice(0, 8000)}`
      : `Тема для изучения: ${String(topic).slice(0, 200)}`;

    const decompositionResult = await callOpenRouter([
      {
        role: 'system',
        content: `Ты — автор образовательных статей. Напиши подробную обучающую статью по заданной теме, структурированную на 3–7 разделов (чекпоинтов) — от базового к сложному.

Верни JSON в точно таком формате:
{
  "title": "Название статьи (краткое, ёмкое)",
  "description": "1-2 предложения о чём эта статья",
  "checkpoints": [
    {
      "id": "cp1",
      "concept": "Название раздела",
      "explanation": "Полноценный раздел статьи: 3–5 абзацев, разделённых \\n\\n. Каждый абзац — 3–5 предложений. Включи: введение в концепцию, подробное объяснение своими словами, реальные примеры и аналогии, практическое применение. Пиши так, чтобы понял человек без опыта в теме.",
      "order": 1
    }
  ]
}

Правила:
- 3-7 разделов (не меньше 3, не больше 7)
- explanation каждого раздела: минимум 3 абзаца, разделённых \\n\\n
- Каждый абзац — полноценный, 3-5 предложений
- Порядок от базового к сложному
- Используй примеры, аналогии, сравнения из реальной жизни
- Пиши понятно и увлекательно, без лишнего академизма`
      },
      { role: 'user', content: inputContent }
    ], 0.6, 8192);

    const checkpoints = normalizeCheckpoints(decompositionResult.checkpoints);

    const activitiesPromises = checkpoints.map(async (cp, idx) => {
      const activities = await callOpenRouter([
        {
          role: 'system',
          content: `Ты — создатель интерактивных учебных заданий. Создай 4-5 разнообразных заданий для проверки понимания концепции.

Верни JSON в точно таком формате:
{
  "activities": [...]
}

Доступные типы заданий:

1. multiple-choice — выбор ответа:
{"type":"multiple-choice","text":"Вопрос","options":["A","B","C","D"],"correctAnswers":[0],"allowMultiple":false,"explanation":"Почему правильно","hint":"Подсказка"}

2. true-false — верно/неверно:
{"type":"true-false","text":"Утверждение","correctAnswer":true,"explanation":"Объяснение","hint":"Подсказка"}

3. fill-blank — заполни пропуски:
{"type":"fill-blank","text":"Вопрос","textWithBlanks":"Текст с ___ пропуском","blanks":[{"id":"b1","correctAnswer":"реестр","alternatives":["реестре","реестрах","реестром","registry","registries"]}],"caseSensitive":false}
ВАЖНО для fill-blank: поле alternatives ОБЯЗАТЕЛЬНО должно содержать все разумные варианты ответа — разные падежные формы слова (именительный, родительный, дательный, предложный и т.д.), единственное и множественное число, синонимы, английский эквивалент если применимо. Не ограничивайся одной формой.

4. free-response — развёрнутый ответ:
{"type":"free-response","text":"Развёрнутый вопрос","evaluationCriteria":"Что должен понять студент","exampleAnswer":"Пример хорошего ответа","points":20}

5. explain-like-im-five — объясни просто (ELI5):
{"type":"explain-like-im-five","text":"Объясни [концепцию] так, чтобы понял ребёнок","evaluationCriteria":"Объяснение без терминов, понятными словами, с аналогией","targetAudience":"ребёнку 10 лет","points":20}

6. teach-back — объясни другу:
{"type":"teach-back","text":"Представь, что объясняешь [концепцию] другу, который никогда не слышал об этом","evaluationCriteria":"Полнота, правильность, понятность; без излишних терминов","forbiddenTerms":["термин1","термин2"],"points":20}

7. give-your-example — придумай пример:
{"type":"give-your-example","text":"Приведи конкретный пример [концепции] из реальной жизни","evaluationCriteria":"Пример релевантен, конкретный, правильно иллюстрирует идею","domain":"из повседневной жизни","points":20}

8. debug-the-logic — найди ошибку в рассуждении:
{"type":"debug-the-logic","text":"Найди логическую ошибку в следующем рассуждении","reasoning":"Текст рассуждения с намеренной логической ошибкой (2-4 предложения)","errorLocation":"Краткое описание ошибки для AI-проверки","evaluationCriteria":"Точное определение ошибки и объяснение почему это неверно","points":20}

Правила:
- 4-5 заданий на чекпоинт
- Не более 2 одного типа
- Используй минимум 1 AI-оцениваемый тип (free-response, explain-like-im-five, teach-back, give-your-example, debug-the-logic)
- Для debug-the-logic: ошибка должна быть логической (не фактической опечаткой), связанной с концепцией
- points: 10 для простых (multiple-choice, true-false, fill-blank), 20 для AI-оцениваемых`
        },
        {
          role: 'user',
          content: `Концепция: ${cp.concept}\nОбъяснение: ${String(cp.explanation).slice(0, 2000)}\n\nСоздай 4-5 разнообразных заданий.`
        }
      ], 0.8);

      const acts = normalizeActivities(activities.activities, idx);
      if (acts.length === 0) {
        console.warn(`[generate-journey] no valid activities for checkpoint ${idx + 1}, using fallback`);
      }

      return {
        ...cp,
        activities: acts,
        timeLimit: 240 + acts.length * 30
      };
    });

    const resolvedCheckpoints = await Promise.all(activitiesPromises);

    const journey = {
      id: `journey_${Date.now()}`,
      title: decompositionResult.title || topic || 'Knowledge Journey',
      description: decompositionResult.description || '',
      topic: topic || 'Custom text',
      checkpoints: resolvedCheckpoints,
      createdAt: new Date().toISOString()
    };

    return res.json({ journey });
  } catch (err) {
    console.error('[generate-journey] error:', err.message);
    return res.status(500).json({ error: err.message || 'AI generation failed' });
  }
});


// Evaluation system prompts per activity type
const EVAL_SYSTEM_PROMPTS = {
  'free-response': `Ты — опытный преподаватель. Оцени развёрнутый ответ студента на вопрос.

Верни JSON:
{
  "score": 75,
  "isCorrect": true,
  "feedback": "Конкретный вывод (2-3 предложения)",
  "strengths": "Что студент понял правильно",
  "improvements": "Что стоит уточнить или дополнить"
}

Правила:
- score: 0-100
- isCorrect: true если score >= 60
- Засчитывай правильную мысль даже если сформулирована иначе
- Пиши на русском языке`,

  'explain-like-im-five': `Ты — педагог. Оцени, насколько объяснение студента простое и понятное.

Верни JSON:
{
  "score": 75,
  "isCorrect": true,
  "feedback": "Оценка простоты и понятности объяснения (2-3 предложения)",
  "strengths": "Что получилось объяснить просто и ясно",
  "improvements": "Где остались термины или неясности"
}

Правила:
- Высокий балл если объяснение понятно без знания темы
- Штрафуй за жаргон и технические термины без объяснения
- Поощряй аналогии, примеры, простые формулировки
- Засчитывай нестандартные, но понятные объяснения
- Пиши на русском языке`,

  'teach-back': `Ты — преподаватель. Оцени объяснение студента как если бы он объяснял другу.

Верни JSON:
{
  "score": 75,
  "isCorrect": true,
  "feedback": "Насколько объяснение полное и правильное (2-3 предложения)",
  "strengths": "Что объяснено верно и понятно",
  "improvements": "Что упущено или сформулировано неточно"
}

Правила:
- Проверяй фактическую правильность И понятность
- Если даны запрещённые термины — снижай балл за их использование
- Поощряй своими словами, аналогиями, структурированность
- Засчитывай нестандартные правильные формулировки
- Пиши на русском языке`,

  'give-your-example': `Ты — преподаватель. Оцени, насколько хорошо пример студента иллюстрирует концепцию.

Верни JSON:
{
  "score": 75,
  "isCorrect": true,
  "feedback": "Оценка релевантности и точности примера (2-3 предложения)",
  "strengths": "Чем пример хорош — конкретность, связь с концепцией",
  "improvements": "Что можно улучшить — детали, точность, связь"
}

Правила:
- Высокий балл: пример конкретный, реальный, правильно отражает идею
- Низкий балл: пример слишком абстрактный, неверный или не по теме
- Поощряй оригинальные примеры из реальной жизни
- Засчитывай нестандартные примеры если они правильны по сути
- Пиши на русском языке`,

  'debug-the-logic': `Ты — логик и преподаватель. Оцени, насколько точно студент определил ошибку в рассуждении.

Верни JSON:
{
  "score": 75,
  "isCorrect": true,
  "feedback": "Правильно ли найдена ошибка (2-3 предложения)",
  "strengths": "Что студент заметил верно",
  "improvements": "Что упущено или названо неточно"
}

Правила:
- Высокий балл: найдена правильная ошибка с объяснением
- Засчитывай если суть ошибки понята даже при другой формулировке
- Снижай если указано несущественное или не та ошибка
- Учитывай errorLocation при оценке точности
- Пиши на русском языке`
};


app.post('/api/ai/evaluate-answer', rateLimit, async (req, res) => {
  try {
    if (!DEEPSEEK_API_KEY) {
      return res.status(500).json({ error: 'DEEPSEEK_API_KEY not configured' });
    }

    const {
      concept,
      activityType = 'free-response',
      question,
      reasoning,
      exampleAnswer,
      userAnswer,
      evaluationCriteria,
      forbiddenTerms,
    } = req.body;

    if (!question || !userAnswer) {
      return res.status(400).json({ error: 'question and userAnswer required' });
    }

    const systemPrompt = EVAL_SYSTEM_PROMPTS[activityType] || EVAL_SYSTEM_PROMPTS['free-response'];

    let userContent = `Концепция: ${String(concept || '').slice(0, 200)}
Вопрос/задание: ${String(question).slice(0, 500)}
Критерии оценки: ${String(evaluationCriteria || 'понимание концепции').slice(0, 500)}`;

    if (activityType === 'debug-the-logic' && reasoning) {
      userContent += `\nРассуждение с ошибкой: ${String(reasoning).slice(0, 800)}`;
    }

    if (activityType === 'free-response' && exampleAnswer) {
      userContent += `\nПример хорошего ответа: ${String(exampleAnswer).slice(0, 500)}`;
    }

    if (activityType === 'teach-back' && Array.isArray(forbiddenTerms) && forbiddenTerms.length > 0) {
      userContent += `\nЗапрещённые термины: ${forbiddenTerms.slice(0, 10).map(String).join(', ')}`;
    }

    userContent += `\nОтвет студента: ${String(userAnswer).slice(0, 2000)}`;

    const result = await callOpenRouter([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userContent }
    ], 0.3);

    // Normalize result
    const score = Math.max(0, Math.min(100, Number(result.score) || 0));
    const isCorrect = typeof result.isCorrect === 'boolean' ? result.isCorrect : score >= 60;
    const feedback = String(result.feedback || '').trim();
    const strengths = String(result.strengths || '').trim();
    const improvements = String(result.improvements || '').trim();

    return res.json({ score, isCorrect, feedback, strengths, improvements });
  } catch (err) {
    console.error('[evaluate-answer] error:', err.message);
    return res.status(500).json({ error: err.message || 'Evaluation failed' });
  }
});


// ─── RAG Search ────────────────────────────────────────────────────────────
const { chunks: ARTICLE_CHUNKS } = require('./rag-content.cjs');

/** Normalize text for keyword matching */
function normalizeText(text) {
  return text
    .toLowerCase()
    .replace(/[^а-яёa-z0-9\s]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const STOP_WORDS = new Set([
  'и','в','на','с','по','для','из','это','что','как','не','а','но','от','до',
  'при','за','к','о','об','или','то','же','он','она','они','мы','вы','я','его',
  'её','их','нет','да','есть','так','уже','всё','все','был','была','было','были',
  'быть','can','the','and','for','are','is','in','on','of','to','a','an','be',
  'not','have','it','this','that','with','as','at','by',
]);

function tokenize(text) {
  return [...new Set(
    normalizeText(text).split(' ').filter(t => t.length > 2 && !STOP_WORDS.has(t))
  )];
}

/** TF-IDF-style score for any chunk with { heading, text, articleTitle } */
function scoreChunk(queryTokens, chunk) {
  const chunkText  = normalizeText((chunk.heading || '') + ' ' + (chunk.text || '') + ' ' + (chunk.articleTitle || ''));
  const chunkWords = chunkText.split(' ');
  let score = 0;
  for (const qt of queryTokens) {
    for (const ct of chunkWords) {
      if (ct === qt) { score += 2; break; }
      if (ct.length > 3 && qt.length > 3 && (ct.includes(qt) || qt.includes(ct))) { score += 1; break; }
    }
    if (normalizeText(chunk.heading || '').includes(qt)) score += 3;
    if (normalizeText(chunk.articleTitle || '').includes(qt)) score += 1;
  }
  return score;
}

// ── In-memory journey index (server-side) ───────────────────────────────────
// Chunks: { id, journeyId, journeyTitle, topic, heading, text, url, type:'journey' }
const journeyIndex = new Map(); // journeyId → chunk[]

/** Build chunks from a journey object (id, title, topic, checkpoints[]) */
function indexJourney(journey) {
  if (!journey || !journey.id) return;
  const chunks = journey.checkpoints.map((cp, i) => ({
    id           : `${journey.id}_cp${i}`,
    journeyId    : journey.id,
    journeyTitle : journey.title,
    topic        : journey.topic,
    heading      : cp.concept || `Checkpoint ${i + 1}`,
    text         : (cp.explanation || '').slice(0, 800),
    articleTitle : journey.title,   // used by scorer
    url          : `/journey/${journey.id}`,
    type         : 'journey',
  }));
  journeyIndex.set(journey.id, chunks);
}

/** Flatten all journey chunks into array */
function allJourneyChunks() {
  const result = [];
  for (const chunks of journeyIndex.values()) result.push(...chunks);
  return result;
}

/** POST /api/rag/index-journey — called from client after generating a journey */
app.post('/api/rag/index-journey', rateLimit, (req, res) => {
  const { journey } = req.body;
  if (!journey || !journey.id || !Array.isArray(journey.checkpoints)) {
    return res.status(400).json({ error: 'journey with checkpoints required' });
  }
  // Validate: journey must have at least 1 checkpoint with concept string
  if (journey.checkpoints.length === 0) {
    return res.status(400).json({ error: 'journey must have at least one checkpoint' });
  }
  // Guard against oversized payloads abusing memory
  if (journey.checkpoints.length > 50) {
    return res.status(400).json({ error: 'too many checkpoints (max 50)' });
  }
  for (const cp of journey.checkpoints) {
    if (typeof cp.concept !== 'string') {
      return res.status(400).json({ error: 'each checkpoint must have a concept string' });
    }
  }
  indexJourney(journey);
  return res.json({ ok: true, chunks: (journeyIndex.get(journey.id) || []).length });
});

app.post('/api/rag/search', rateLimit, async (req, res) => {
  try {
    if (!DEEPSEEK_API_KEY) {
      return res.status(500).json({ error: 'DEEPSEEK_API_KEY not configured' });
    }

    const { query } = req.body;
    if (!query || typeof query !== 'string' || !query.trim()) {
      return res.status(400).json({ error: 'query is required' });
    }

    const cleanQuery  = String(query).slice(0, 500).trim();
    const queryTokens = tokenize(cleanQuery);

    // ── Score article chunks ─────────────────────────────────────────────────
    const scoredArticles = ARTICLE_CHUNKS
      .map(chunk => ({ chunk, score: scoreChunk(queryTokens, chunk), type: 'article' }))
      .filter(x => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 4);

    // ── Score journey chunks (server-side in-memory index) ───────────────────
    const scoredJourneys = allJourneyChunks()
      .map(chunk => ({ chunk, score: scoreChunk(queryTokens, chunk), type: 'journey' }))
      .filter(x => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    // ── Merge: top-5 across both corpora by score ────────────────────────────
    const allScored = [...scoredArticles, ...scoredJourneys]
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    if (allScored.length === 0) {
      return res.json({
        answer : 'К сожалению, по вашему запросу не найдено релевантных материалов в базе платформы. Попробуйте переформулировать вопрос.',
        sources: [],
      });
    }

    // ── Build context for AI prompt ──────────────────────────────────────────
    const contextText = allScored.map(({ chunk, type }) => {
      if (type === 'article') {
        return `[Статья: "${chunk.articleTitle}" / Раздел: "${chunk.heading}"]\n${chunk.text}`;
      }
      return `[Journey: "${chunk.journeyTitle}" (тема: ${chunk.topic}) / Концепция: "${chunk.heading}"]\n${chunk.text}`;
    }).join('\n\n');

    const aiAnswer = await callOpenRouter([
      {
        role: 'system',
        content: `Ты — умный помощник образовательной платформы. Тебе дан вопрос пользователя и релевантные фрагменты из базы знаний платформы.

Задача: дать точный, полезный ответ на вопрос, опираясь ТОЛЬКО на предоставленные фрагменты. Если в материалах нет достаточной информации — честно скажи об этом.

Стиль ответа:
- Ясный и конкретный, 3-7 предложений
- Ссылайся на концепции из материалов
- Если полезно — используй структуру (короткий список)
- Отвечай на русском языке

Верни JSON:
{
  "answer": "Развёрнутый ответ на вопрос (3-7 предложений)"
}`
      },
      {
        role: 'user',
        content: `Вопрос: ${cleanQuery}\n\nМатериалы из базы знаний:\n${contextText.slice(0, 6000)}`
      }
    ], 0.4, 1024);

    const answer = String(aiAnswer.answer || '').trim() || 'Ответ не сформирован.';

    // ── Sources: include both article and journey hits ────────────────────────
    const sources = allScored.map(({ chunk, type }) => {
      if (type === 'article') {
        return {
          articleId    : chunk.articleId,
          articleTitle : chunk.articleTitle,
          heading      : chunk.heading,
          url          : chunk.url,
          type         : 'article',
        };
      }
      return {
        articleId    : chunk.journeyId,
        articleTitle : chunk.journeyTitle,
        heading      : chunk.heading,
        url          : chunk.url,
        type         : 'journey',
      };
    });

    // Deduplicate sources by url
    const seen = new Set();
    const dedupedSources = sources.filter(s => {
      if (seen.has(s.url)) return false;
      seen.add(s.url);
      return true;
    });

    return res.json({ answer, sources: dedupedSources });
  } catch (err) {
    console.error('[rag/search] error:', err.message);
    return res.status(500).json({ error: err.message || 'RAG search failed' });
  }
});


// ─── AI Feature: Analyze Progress ──────────────────────────────────────────
app.post('/api/ai/analyze-progress', rateLimit, async (req, res) => {
  try {
    if (!DEEPSEEK_API_KEY) return res.status(500).json({ error: 'DEEPSEEK_API_KEY not configured' });

    const { contextSummary, weakTopics = [], checkpointResults = [] } = req.body;
    if (!contextSummary) return res.status(400).json({ error: 'contextSummary required' });

    const result = await callOpenRouter([
      {
        role: 'system',
        content: `Ты — персональный наставник образовательной платформы. Проанализируй прогресс студента и выяви конкретные слабые места.

Верни JSON:
{
  "summary": "Общий вывод об уровне студента (2-3 предложения)",
  "weakAreas": [
    {
      "topic": "Название темы",
      "issue": "Конкретная проблема или пробел в знаниях (1-2 предложения)",
      "advice": "Практический совет что сделать (1-2 предложения)"
    }
  ],
  "strengths": "Что студент делает хорошо (1-2 предложения)",
  "nextFocus": "Что стоит изучить следующим (1 предложение)"
}

Правила:
- weakAreas: 2-4 конкретных пункта, основанных на данных
- Если слабых тем нет — всё равно найди что можно улучшить
- Будь конкретным, опирайся на цифры из контекста
- Пиши на русском языке`
      },
      {
        role: 'user',
        content: `Прогресс студента:\n${String(contextSummary).slice(0, 1200)}\n\nСлабые темы: ${weakTopics.slice(0, 5).join(', ') || 'нет данных'}\n\nПоследние результаты по концепциям: ${JSON.stringify(checkpointResults.slice(0, 10))}`
      }
    ], 0.5, 1024);

    return res.json({
      summary   : String(result.summary   || '').trim(),
      weakAreas : Array.isArray(result.weakAreas) ? result.weakAreas.slice(0, 4) : [],
      strengths : String(result.strengths  || '').trim(),
      nextFocus : String(result.nextFocus  || '').trim(),
    });
  } catch (err) {
    console.error('[analyze-progress] error:', err.message);
    return res.status(500).json({ error: err.message || 'Analysis failed' });
  }
});

// ─── AI Feature: Recommend Next ─────────────────────────────────────────────
app.post('/api/ai/recommend-next', rateLimit, async (req, res) => {
  try {
    if (!DEEPSEEK_API_KEY) return res.status(500).json({ error: 'DEEPSEEK_API_KEY not configured' });

    const { contextSummary, completedTopics = [], weakTopics = [] } = req.body;
    if (!contextSummary) return res.status(400).json({ error: 'contextSummary required' });

    const result = await callOpenRouter([
      {
        role: 'system',
        content: `Ты — советник по обучению. На основе прогресса студента предложи 3 конкретные темы для следующего изучения.

Верни JSON:
{
  "recommendations": [
    {
      "title": "Название темы для изучения",
      "reason": "Почему именно эта тема сейчас (1-2 предложения)",
      "difficulty": "beginner | intermediate | advanced",
      "estimatedMinutes": 25
    }
  ],
  "advice": "Общий совет как двигаться дальше (2-3 предложения)"
}

Правила:
- Ровно 3 рекомендации
- Темы должны логично продолжать изученное или закрывать пробелы
- estimatedMinutes: реалистичная оценка 15-60 минут
- Избегай повторять уже пройденные темы (если только не нужно повторение)
- Пиши на русском языке`
      },
      {
        role: 'user',
        content: `Прогресс студента:\n${String(contextSummary).slice(0, 1200)}\n\nПройденные темы: ${completedTopics.slice(0, 10).join(', ') || 'нет'}\n\nСлабые темы: ${weakTopics.slice(0, 5).join(', ') || 'нет'}`
      }
    ], 0.6, 1024);

    const recs = Array.isArray(result.recommendations)
      ? result.recommendations.slice(0, 3).map(r => ({
          title            : String(r.title || '').trim(),
          reason           : String(r.reason || '').trim(),
          difficulty       : ['beginner','intermediate','advanced'].includes(r.difficulty) ? r.difficulty : 'intermediate',
          estimatedMinutes : Math.max(10, Math.min(90, Number(r.estimatedMinutes) || 25)),
        }))
      : [];

    return res.json({
      recommendations: recs,
      advice: String(result.advice || '').trim(),
    });
  } catch (err) {
    console.error('[recommend-next] error:', err.message);
    return res.status(500).json({ error: err.message || 'Recommendation failed' });
  }
});

// ─── AI Feature: Explain Simpler ────────────────────────────────────────────
app.post('/api/ai/explain', rateLimit, async (req, res) => {
  try {
    if (!DEEPSEEK_API_KEY) return res.status(500).json({ error: 'DEEPSEEK_API_KEY not configured' });

    const { content, concept } = req.body;
    if (!content) return res.status(400).json({ error: 'content required' });

    const result = await callOpenRouter([
      {
        role: 'system',
        content: `Ты — учитель, который умеет объяснять сложные вещи простыми словами. Перепиши предоставленный текст понятнее и доступнее.

Верни JSON:
{
  "explanation": "Упрощённое объяснение (4-8 предложений)",
  "keyPoints": ["ключевой момент 1", "ключевой момент 2", "ключевой момент 3"],
  "analogy": "Простая аналогия или пример из жизни"
}

Правила:
- Объяснение без технического жаргона (или с минимальным объяснением терминов)
- Используй аналогии, сравнения, примеры из реальной жизни
- 3 ключевых момента — самое важное
- Пиши на русском языке`
      },
      {
        role: 'user',
        content: `${concept ? `Концепция: ${String(concept).slice(0, 200)}\n\n` : ''}Текст для упрощения:\n${String(content).slice(0, 3000)}`
      }
    ], 0.5, 1024);

    return res.json({
      explanation : String(result.explanation || '').trim(),
      keyPoints   : Array.isArray(result.keyPoints) ? result.keyPoints.slice(0, 3).map(String) : [],
      analogy     : String(result.analogy || '').trim(),
    });
  } catch (err) {
    console.error('[explain] error:', err.message);
    return res.status(500).json({ error: err.message || 'Explain failed' });
  }
});

app.get('/api/health', (_, res) => res.json({ status: 'ok' }));

app.listen(PORT, '127.0.0.1', () => {
  console.log(`[server] API backend running on port ${PORT} (localhost-only)`);
  console.log(`[server] DeepSeek key: ${DEEPSEEK_API_KEY ? 'configured' : 'MISSING'}`);
});
