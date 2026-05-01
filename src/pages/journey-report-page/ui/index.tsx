import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { StateSchema } from 'app/providers/store';
import { AI_EVALUATED_TYPES } from 'entities/journey';
import styles from './journey-report-page.module.scss';

export const JourneyReportPage: FC = () => {
  const navigate = useNavigate();
  const { current: journey, answers, progress } = useSelector((s: StateSchema) => s.journey);

  if (!journey) {
    return (
      <div className={styles.page}>
        <div className={styles.card}>
          <div className={styles.emoji}>🗺️</div>
          <h1 className={styles.title}>Путешествие не найдено</h1>
          <div className={styles.actions}>
            <button className={styles.primaryBtn} onClick={() => navigate('/journey/new')}>
              Создать новое путешествие
            </button>
          </div>
        </div>
      </div>
    );
  }

  const allActivities = journey.checkpoints.flatMap(cp => cp.activities);
  const totalPoints   = allActivities.reduce((s, a) => s + a.points, 0);

  const earnedPoints = allActivities.reduce((sum, activity) => {
    const ans = answers[activity.id];
    if (!ans) return sum;

    // AI-evaluated types: score proportional to aiScore (0-100) × activity.points
    if (AI_EVALUATED_TYPES.has(activity.type)) {
      const score = ans.aiScore ?? 0;
      return sum + Math.round((score / 100) * activity.points);
    }

    // Deterministic types: check exact correctness
    if (activity.type === 'multiple-choice') {
      const val = ans.value as number[];
      const isOk = val?.length === activity.correctAnswers.length &&
        activity.correctAnswers.every(c => val.includes(c));
      return sum + (isOk ? activity.points : 0);
    }

    if (activity.type === 'true-false') {
      return sum + (ans.value === activity.correctAnswer ? activity.points : 0);
    }

    if (activity.type === 'fill-blank') {
      const val = ans.value as Record<string, string>;
      const norm = activity.caseSensitive
        ? (s: string) => s
        : (s: string) => s.toLowerCase();
      const isOk = activity.blanks.every(b => {
        const uv = (val?.[b.id] ?? '').trim();
        return norm(uv) === norm(b.correctAnswer) ||
          (b.alternatives ?? []).some(a => norm(uv) === norm(a));
      });
      return sum + (isOk ? activity.points : 0);
    }

    return sum;
  }, 0);

  const pct = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;

  const aiAnsweredCount = allActivities.filter(a =>
    AI_EVALUATED_TYPES.has(a.type) && answers[a.id]?.isEvaluated
  ).length;

  const aiTotalCount = allActivities.filter(a => AI_EVALUATED_TYPES.has(a.type)).length;

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.emoji}>
          {pct >= 80 ? '🏆' : pct >= 60 ? '🎓' : '📚'}
        </div>
        <h1 className={styles.title}>Путешествие завершено!</h1>
        <p className={styles.subtitle}>{journey.title}</p>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <div className={styles.statValue}>{pct}%</div>
            <div className={styles.statLabel}>Результат</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statValue}>{earnedPoints} / {totalPoints}</div>
            <div className={styles.statLabel}>XP заработано</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statValue}>{progress.completedCheckpoints.length}</div>
            <div className={styles.statLabel}>Чекпоинтов</div>
          </div>
          {aiTotalCount > 0 && (
            <div className={styles.stat}>
              <div className={styles.statValue}>{aiAnsweredCount} / {aiTotalCount}</div>
              <div className={styles.statLabel}>AI-оценено</div>
            </div>
          )}
        </div>

        <div className={styles.checkpoints}>
          <div className={styles.cpTitle}>Концепции, которые вы изучили</div>
          {journey.checkpoints.map(cp => (
            <div key={cp.id} className={styles.cpItem}>
              <div className={styles.cpDot} />
              <span>{cp.concept}</span>
            </div>
          ))}
        </div>

        <div className={styles.actions}>
          <button className={styles.primaryBtn} onClick={() => navigate('/journey/new')}>
            Новое путешествие →
          </button>
          <button className={styles.secondaryBtn} onClick={() => navigate('/')}>
            К статьям
          </button>
        </div>
      </div>
    </div>
  );
};
