import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { StateSchema } from 'app/providers/store';
import { journeyActions } from 'entities/journey';
import { generateJourney } from 'shared/lib/ai';
import styles from './journey-new-page.module.scss';

const EXAMPLE_TOPICS = [
  'Нейросети и глубокое обучение',
  'Как работает blockchain',
  'Docker и контейнеризация',
  'REST vs GraphQL',
  'Как работает TCP/IP',
];

const LOADING_STEPS = [
  'Анализ материала',
  'Выделение ключевых концепций',
  'Выстраивание последовательности',
  'Генерация заданий',
  'Финальная сборка',
];

export const JourneyNewPage: FC = () => {
  const navigate  = useNavigate();
  const dispatch  = useDispatch();
  const { isGenerating, error } = useSelector((s: StateSchema) => s.journey);

  const [tab, setTab]   = useState<'topic' | 'text'>('topic');
  const [topic, setTopic] = useState('');
  const [text, setText]   = useState('');
  const [step, setStep]   = useState(-1);

  const canGenerate = tab === 'topic' ? topic.trim().length > 2 : text.trim().length > 50;

  const handleGenerate = async () => {
    if (!canGenerate || isGenerating) return;
    dispatch(journeyActions.setGenerating(true));
    setStep(0);

    const stepInterval = setInterval(() => {
      setStep(prev => {
        if (prev >= LOADING_STEPS.length - 2) {
          clearInterval(stepInterval);
          return prev;
        }
        return prev + 1;
      });
    }, 3500);

    try {
      const journey = await generateJourney(
        tab === 'topic' ? { topic } : { text }
      );
      clearInterval(stepInterval);
      setStep(LOADING_STEPS.length - 1);
      dispatch(journeyActions.setJourney(journey));
      setTimeout(() => navigate(`/journey/${journey.id}`), 400);
    } catch (err: any) {
      clearInterval(stepInterval);
      dispatch(journeyActions.setError(err?.response?.data?.error || err.message || 'Ошибка генерации'));
      setStep(-1);
    }
  };

  return (
    <div className={styles.page}>
      <button className={styles.back} onClick={() => navigate('/')}>
        ← Назад
      </button>

      <div className={styles.hero}>
        <div className={styles.badge}>Knowledge Journey</div>
        <h1 className={styles.title}>Создать путешествие по знаниям</h1>
        <p className={styles.subtitle}>
          Введите тему или вставьте текст — AI разберёт материал на концепции
          и создаст интерактивный маршрут обучения
        </p>
      </div>

      <div className={styles.card}>
        {isGenerating ? (
          <div className={styles.loading}>
            <div className={styles.spinner} />
            <div className={styles.loadingText}>AI строит ваше путешествие...</div>
            <div className={styles.loadingSteps}>
              {LOADING_STEPS.map((s, i) => (
                <div
                  key={s}
                  className={`${styles.loadingStep} ${i < step ? styles.done : ''} ${i === step ? styles.active : ''}`}
                >
                  <span>{i < step ? '✓' : i === step ? '→' : '·'}</span>
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className={styles.tabs}>
              <button
                className={`${styles.tab} ${tab === 'topic' ? styles.active : ''}`}
                onClick={() => setTab('topic')}
              >
                По теме
              </button>
              <button
                className={`${styles.tab} ${tab === 'text' ? styles.active : ''}`}
                onClick={() => setTab('text')}
              >
                По тексту
              </button>
            </div>

            {tab === 'topic' ? (
              <div>
                <label className={styles.label}>Тема</label>
                <input
                  className={styles.input}
                  placeholder="Например: Как работают трансформеры в ML"
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleGenerate()}
                />
                <p className={styles.hint}>
                  Чем точнее тема — тем глубже и качественнее будут задания
                </p>
                <div className={styles.exampleTopics}>
                  {EXAMPLE_TOPICS.map(t => (
                    <button
                      key={t}
                      className={styles.exampleBtn}
                      onClick={() => setTopic(t)}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <label className={styles.label}>Текст для изучения</label>
                <textarea
                  className={styles.textarea}
                  placeholder="Вставьте статью, конспект, документацию или любой учебный текст (минимум 50 символов)..."
                  value={text}
                  onChange={e => setText(e.target.value)}
                />
                <p className={styles.hint}>
                  {text.length} символов{text.length < 50 ? ` (нужно ещё ${50 - text.length})` : ' — готово'}
                </p>
              </div>
            )}

            {error && <div className={styles.error}>Ошибка: {error}</div>}

            <button
              className={styles.generateBtn}
              disabled={!canGenerate}
              onClick={handleGenerate}
            >
              Сгенерировать путешествие →
            </button>
          </>
        )}
      </div>
    </div>
  );
};
