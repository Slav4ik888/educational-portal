const express = require('express');
const cors    = require('cors');
const https   = require('https');

const app  = express();
const PORT = 7575;

app.use(cors());
app.use(express.json({ limit: '2mb' }));

const OPENAI_API_KEY  = process.env.OPENAI_API_KEY;
const OPENROUTER_BASE = 'https://openrouter.ai/api/v1';
const MODEL           = 'openai/gpt-4o-mini';

function callOpenRouter(messages, temperature = 0.7) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model       : MODEL,
      messages,
      temperature,
      max_tokens  : 4096,
      response_format: { type: 'json_object' }
    });

    const options = {
      hostname : 'openrouter.ai',
      path     : '/api/v1/chat/completions',
      method   : 'POST',
      headers  : {
        'Content-Type'  : 'application/json',
        'Authorization' : `Bearer ${OPENAI_API_KEY}`,
        'HTTP-Referer'  : 'https://knowledge-journey.replit.app',
        'X-Title'       : 'Knowledge Journey',
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.error) return reject(new Error(parsed.error.message));
          const content = parsed.choices?.[0]?.message?.content;
          if (!content) return reject(new Error('Empty response from AI'));
          resolve(JSON.parse(content));
        } catch (e) {
          reject(new Error('Failed to parse AI response: ' + e.message));
        }
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}


app.post('/api/ai/generate-journey', async (req, res) => {
  try {
    if (!OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OPENAI_API_KEY not configured' });
    }

    const { topic, text } = req.body;
    if (!topic && !text) {
      return res.status(400).json({ error: 'topic or text required' });
    }

    const inputContent = text
      ? `Текст для изучения:\n${text.slice(0, 8000)}`
      : `Тема для изучения: ${topic}`;

    const decompositionResult = await callOpenRouter([
      {
        role: 'system',
        content: `Ты — эксперт по педагогическому дизайну. Твоя задача — разбить учебный материал на атомарные концепции для изучения.

Верни JSON в точно таком формате:
{
  "title": "Название путешествия (краткое, ёмкое)",
  "description": "1-2 предложения о чём это путешествие",
  "checkpoints": [
    {
      "id": "cp1",
      "concept": "Название концепции",
      "explanation": "Краткое объяснение (2-4 предложения) — суть концепции простым языком",
      "order": 1
    }
  ]
}

Правила:
- 3-6 чекпоинтов
- Порядок от базового к сложному (сначала то, без чего нельзя понять следующее)
- Каждая концепция — атомарная (одна идея, не несколько)
- explanation должен быть понятным даже новичку`
      },
      { role: 'user', content: inputContent }
    ], 0.5);

    const checkpoints = decompositionResult.checkpoints || [];

    const activitiesPromises = checkpoints.map(async (cp, idx) => {
      const activities = await callOpenRouter([
        {
          role: 'system',
          content: `Ты — создатель интерактивных учебных заданий. Создай 3-4 разнообразных задания для проверки понимания концепции.

Верни JSON в точно таком формате:
{
  "activities": [
    {
      "id": "act_unique_id",
      "type": "multiple-choice",
      "points": 10,
      "hint": "Подсказка если студент застрял",
      ...поля специфичные для типа
    }
  ]
}

Типы заданий и их поля:

1. multiple-choice:
{
  "type": "multiple-choice",
  "text": "Вопрос",
  "options": ["Вариант A", "Вариант B", "Вариант C", "Вариант D"],
  "correctAnswers": [0],
  "allowMultiple": false,
  "explanation": "Объяснение почему правильно"
}

2. true-false:
{
  "type": "true-false",
  "text": "Утверждение для оценки",
  "correctAnswer": true,
  "explanation": "Почему верно/неверно"
}

3. fill-blank:
{
  "type": "fill-blank",
  "text": "Вопрос",
  "textWithBlanks": "Текст с ___ пропусками для ___",
  "blanks": [
    {"id": "b1", "correctAnswer": "слово", "alternatives": ["синоним"]},
    {"id": "b2", "correctAnswer": "слово2", "alternatives": []}
  ],
  "caseSensitive": false
}

4. free-response:
{
  "type": "free-response",
  "text": "Развёрнутый вопрос",
  "evaluationCriteria": "Что именно должен понять студент в ответе",
  "exampleAnswer": "Пример хорошего ответа"
}

Правила:
- Не более 2 заданий одного типа подряд
- multiple-choice: дистракторы должны быть правдоподобными, не очевидно неверными
- Вопросы проверяют понимание, а не просто запоминание
- Используй все 4 типа по возможности
- points: 10 для простых, 20 для сложных (free-response всегда 20)`
        },
        {
          role: 'user',
          content: `Концепция: ${cp.concept}\nОбъяснение: ${cp.explanation}\n\nСоздай 3-4 задания для проверки понимания этой концепции.`
        }
      ], 0.8);

      const acts = (activities.activities || []).map((act, aIdx) => ({
        ...act,
        id: `cp${idx + 1}_act${aIdx + 1}`,
        points: act.points || (act.type === 'free-response' ? 20 : 10),
        hint: act.hint || null,
      }));

      return {
        ...cp,
        activities: acts,
        timeLimit: 240 + acts.length * 30
      };
    });

    const resolvedCheckpoints = await Promise.all(activitiesPromises);

    const journey = {
      id          : `journey_${Date.now()}`,
      title       : decompositionResult.title || topic || 'Knowledge Journey',
      description : decompositionResult.description || '',
      topic       : topic || 'Custom text',
      checkpoints : resolvedCheckpoints,
      createdAt   : new Date().toISOString()
    };

    res.json({ journey });
  } catch (err) {
    console.error('[generate-journey] error:', err.message);
    res.status(500).json({ error: err.message || 'AI generation failed' });
  }
});


app.post('/api/ai/evaluate-answer', async (req, res) => {
  try {
    if (!OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OPENAI_API_KEY not configured' });
    }

    const { concept, question, exampleAnswer, userAnswer, evaluationCriteria } = req.body;

    const result = await callOpenRouter([
      {
        role: 'system',
        content: `Ты — опытный преподаватель. Оцени развёрнутый ответ студента.

Верни JSON в точно таком формате:
{
  "score": 75,
  "isCorrect": true,
  "feedback": "Конструктивный фидбек (2-4 предложения)",
  "strengths": "Что понял правильно",
  "improvements": "Что стоит уточнить или дополнить"
}

Правила оценки:
- score: 0-100
- isCorrect: true если score >= 60
- Засчитывай правильную мысль даже если сформулирована иначе
- feedback должен быть конкретным и полезным, не "хороший ответ"
- Пиши на русском языке`
      },
      {
        role: 'user',
        content: `Концепция: ${concept}
Вопрос: ${question}
Критерии оценки: ${evaluationCriteria || 'понимание концепции'}
Пример хорошего ответа: ${exampleAnswer || 'не указан'}
Ответ студента: ${userAnswer}`
      }
    ], 0.3);

    res.json(result);
  } catch (err) {
    console.error('[evaluate-answer] error:', err.message);
    res.status(500).json({ error: err.message || 'Evaluation failed' });
  }
});


app.get('/api/health', (_, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`[server] API backend running on port ${PORT}`);
  console.log(`[server] OpenAI key: ${OPENAI_API_KEY ? 'configured' : 'MISSING'}`);
});
