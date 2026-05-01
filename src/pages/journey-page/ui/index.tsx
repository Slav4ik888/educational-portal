import { FC, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { StateSchema } from 'app/providers/store';
import { journeyActions, JourneyActivity, ActivityAnswer } from 'entities/journey';
import { evaluateAnswer } from 'shared/lib/ai';
import styles from './journey-page.module.scss';

const ACTIVITY_LABELS: Record<string, string> = {
  'multiple-choice' : 'Выбор ответа',
  'true-false'      : 'Верно / Неверно',
  'fill-blank'      : 'Заполни пропуски',
  'free-response'   : 'Развёрнутый ответ',
};

interface ActivityProps {
  activity    : JourneyActivity
  answer      : ActivityAnswer | undefined
  submitted   : boolean
  onAnswer    : (ans: ActivityAnswer) => void
}

const ActivityView: FC<ActivityProps> = ({ activity, answer, submitted, onAnswer }) => {
  const [showHint, setShowHint] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const dispatch = useDispatch();
  const journey  = useSelector((s: StateSchema) => s.journey.current);

  const currentCheckpointIdx = useSelector((s: StateSchema) => s.journey.progress.currentCheckpointIdx);
  const checkpoint = journey?.checkpoints[currentCheckpointIdx];

  const handleFreeResponseEvaluate = useCallback(async (value: string) => {
    if (!checkpoint || !value.trim() || activity.type !== 'free-response') return;
    setIsEvaluating(true);
    try {
      const result = await evaluateAnswer({
        concept            : checkpoint.concept,
        question           : activity.text,
        exampleAnswer      : activity.exampleAnswer,
        evaluationCriteria : activity.evaluationCriteria,
        userAnswer         : value,
      });
      dispatch(journeyActions.setAiEvaluation({
        activityId : activity.id,
        score      : result.score,
        feedback   : result.feedback,
      }));
    } catch {
      dispatch(journeyActions.setAiEvaluation({
        activityId : activity.id,
        score      : 0,
        feedback   : 'Не удалось оценить ответ. Сравните с критериями вручную.',
      }));
    }
    setIsEvaluating(false);
  }, [activity, checkpoint, dispatch]);

  const isCorrect = (() => {
    if (!submitted || !answer) return null;
    if (activity.type === 'multiple-choice') {
      const val = answer.value as number[];
      const correct = activity.correctAnswers;
      return val?.length === correct?.length && correct.every(c => val.includes(c));
    }
    if (activity.type === 'true-false') {
      return answer.value === activity.correctAnswer;
    }
    if (activity.type === 'fill-blank') {
      const val = answer.value as Record<string, string>;
      return activity.blanks.every(b => {
        const userVal = (val?.[b.id] || '').trim();
        const check = activity.caseSensitive ? (s: string) => s : (s: string) => s.toLowerCase();
        return check(userVal) === check(b.correctAnswer)
          || (b.alternatives || []).some(a => check(userVal) === check(a));
      });
    }
    if (activity.type === 'free-response') {
      return (answer.aiScore ?? 0) >= 60;
    }
    return null;
  })();

  return (
    <div className={styles.activityCard}>
      <div className={styles.activityLabel}>{ACTIVITY_LABELS[activity.type]}</div>
      <div className={styles.pointsBadge}>{activity.points} XP</div>
      <div className={styles.activityQuestion}>{activity.text}</div>

      {activity.type === 'multiple-choice' && (
        <div className={styles.options}>
          {activity.options.map((opt, i) => {
            const sel  = ((answer?.value as number[]) || []).includes(i);
            const corr = submitted && activity.correctAnswers.includes(i);
            const wrong = submitted && sel && !activity.correctAnswers.includes(i);
            return (
              <button
                key={i}
                disabled={submitted}
                className={`${styles.option} ${sel ? styles.selected : ''} ${corr ? styles.correct : ''} ${wrong ? styles.wrong : ''}`}
                onClick={() => {
                  if (activity.allowMultiple) {
                    const cur = ((answer?.value as number[]) || []);
                    const next = cur.includes(i) ? cur.filter(x => x !== i) : [...cur, i];
                    onAnswer({ activityId: activity.id, type: 'multiple-choice', value: next });
                  } else {
                    onAnswer({ activityId: activity.id, type: 'multiple-choice', value: [i] });
                  }
                }}
              >
                {opt}
              </button>
            );
          })}
        </div>
      )}

      {activity.type === 'true-false' && (
        <div className={styles.tfOptions}>
          {[true, false].map(val => {
            const label = val ? 'Верно' : 'Неверно';
            const sel   = answer?.value === val;
            const corr  = submitted && activity.correctAnswer === val;
            const wrong = submitted && sel && activity.correctAnswer !== val;
            return (
              <button
                key={String(val)}
                disabled={submitted}
                className={`${styles.tfBtn} ${sel ? styles.selected : ''} ${corr ? styles.correct : ''} ${wrong ? styles.wrong : ''}`}
                onClick={() => onAnswer({ activityId: activity.id, type: 'true-false', value: val })}
              >
                {label}
              </button>
            );
          })}
        </div>
      )}

      {activity.type === 'fill-blank' && (
        <>
          <p className={styles.blankText}>{activity.textWithBlanks}</p>
          <div className={styles.blankInputs}>
            {activity.blanks.map(blank => {
              const val  = ((answer?.value as Record<string, string>) || {})[blank.id] || '';
              const corr = submitted && (() => {
                const check = activity.caseSensitive ? (s: string) => s : (s: string) => s.toLowerCase();
                return check(val) === check(blank.correctAnswer)
                  || (blank.alternatives || []).some(a => check(val) === check(a));
              })();
              return (
                <input
                  key={blank.id}
                  disabled={submitted}
                  className={`${styles.blankInput} ${submitted ? (corr ? styles.correct : styles.wrong) : ''}`}
                  value={val}
                  placeholder="..."
                  onChange={e => onAnswer({
                    activityId : activity.id,
                    type       : 'fill-blank',
                    value      : { ...((answer?.value as Record<string, string>) || {}), [blank.id]: e.target.value }
                  })}
                />
              );
            })}
          </div>
        </>
      )}

      {activity.type === 'free-response' && (
        <>
          <textarea
            className={styles.freeTextarea}
            disabled={submitted}
            placeholder="Напишите развёрнутый ответ..."
            value={answer?.value || ''}
            onChange={e => onAnswer({ activityId: activity.id, type: 'free-response', value: e.target.value })}
          />
          {submitted && !answer?.isEvaluated && !isEvaluating && (
            <button
              className={styles.checkBtn}
              style={{ marginTop: 10, flex: 'none', padding: '10px 20px', width: 'auto' }}
              onClick={() => handleFreeResponseEvaluate(answer?.value || '')}
            >
              Проверить с AI →
            </button>
          )}
          {isEvaluating && <p className={styles.aiEvaluating}>AI оценивает ответ...</p>}
          {answer?.isEvaluated && answer.aiFeedback && (
            <div className={styles.aiFeedback}>
              <strong>AI: {answer.aiScore}% — </strong>{answer.aiFeedback}
            </div>
          )}
        </>
      )}

      {submitted && activity.type !== 'free-response' && isCorrect !== null && (
        <div className={`${styles.feedback} ${isCorrect ? styles.correct : styles.wrong}`}>
          {isCorrect ? '✓ Верно!' : '✗ Неверно'}
          {!isCorrect && activity.type === 'true-false' && (
            <span> — {activity.explanation}</span>
          )}
          {!isCorrect && activity.type === 'multiple-choice' && activity.explanation && (
            <div style={{ marginTop: 6 }}>{activity.explanation}</div>
          )}
        </div>
      )}

      {activity.hint && !submitted && (
        <>
          {!showHint && (
            <button className={styles.hintBtn} onClick={() => setShowHint(true)}>
              💡 Показать подсказку
            </button>
          )}
          {showHint && <div className={styles.hint}>💡 {activity.hint}</div>}
        </>
      )}
    </div>
  );
};


export const JourneyPage: FC = () => {
  const navigate  = useNavigate();
  const dispatch  = useDispatch();
  const { current: journey, answers, progress } = useSelector((s: StateSchema) => s.journey);

  const [submitted, setSubmitted] = useState(false);

  if (!journey) {
    return (
      <div className={styles.page}>
        <p style={{ color: '#64748b' }}>Путешествие не найдено.</p>
        <button className={styles.back} onClick={() => navigate('/journey/new')}>
          Создать новое
        </button>
      </div>
    );
  }

  const { currentCheckpointIdx, completedCheckpoints } = progress;
  const checkpoint = journey.checkpoints[currentCheckpointIdx];
  const isLast     = currentCheckpointIdx === journey.checkpoints.length - 1;
  const allDone    = completedCheckpoints.length === journey.checkpoints.length;

  const answeredCount = checkpoint
    ? checkpoint.activities.filter(a => answers[a.id]?.value !== undefined && answers[a.id]?.value !== '').length
    : 0;
  const canCheck = answeredCount > 0;

  const handleCheck = () => setSubmitted(true);

  const handleNext = () => {
    dispatch(journeyActions.completeCheckpoint(checkpoint.id));
    dispatch(journeyActions.nextCheckpoint());
    setSubmitted(false);
  };

  const handleFinish = () => {
    dispatch(journeyActions.completeCheckpoint(checkpoint.id));
    navigate(`/journey/${journey.id}/report`);
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.nav}>
          <button className={styles.back} onClick={() => navigate('/journey/new')}>← Создать новое</button>
          <span className={styles.badge}>Knowledge Journey</span>
        </div>
        <h1 className={styles.title}>{journey.title}</h1>
        {journey.description && <p className={styles.description}>{journey.description}</p>}
      </div>

      <div className={styles.progress} style={{ width: '100%', maxWidth: 720 }}>
        {journey.checkpoints.map((cp, i) => (
          <div
            key={cp.id}
            className={`${styles.progressDot} ${completedCheckpoints.includes(cp.id) ? styles.done : ''} ${i === currentCheckpointIdx && !completedCheckpoints.includes(cp.id) ? styles.current : ''}`}
          />
        ))}
      </div>

      {allDone ? (
        <div className={styles.checkpoint}>
          <div className={styles.completedMsg}>
            Путешествие завершено! 🎉
          </div>
          <button className={styles.finishBtn} onClick={() => navigate(`/journey/${journey.id}/report`)}>
            Посмотреть финальный отчёт →
          </button>
        </div>
      ) : checkpoint && (
        <div className={styles.checkpoint}>
          <div className={styles.cpHeader}>
            <div className={styles.cpNum}>
              Чекпоинт {currentCheckpointIdx + 1} из {journey.checkpoints.length}
            </div>
            <h2 className={styles.cpTitle}>{checkpoint.concept}</h2>
            <div className={styles.cpExplanation}>{checkpoint.explanation}</div>
          </div>

          <div className={styles.activities}>
            {checkpoint.activities.map(activity => (
              <ActivityView
                key={activity.id}
                activity={activity}
                answer={answers[activity.id]}
                submitted={submitted}
                onAnswer={ans => dispatch(journeyActions.setActivityAnswer(ans))}
              />
            ))}
          </div>

          <div className={styles.actions}>
            {!submitted ? (
              <button
                className={styles.checkBtn}
                disabled={!canCheck}
                onClick={handleCheck}
              >
                Проверить ответы
              </button>
            ) : isLast ? (
              <button className={styles.nextBtn} onClick={handleFinish}>
                Завершить путешествие →
              </button>
            ) : (
              <button className={styles.nextBtn} onClick={handleNext}>
                Следующий чекпоинт →
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
