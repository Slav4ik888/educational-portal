import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { StateSchema } from 'app/providers/store';
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

  const totalActivities = journey.checkpoints.reduce((s, cp) => s + cp.activities.length, 0);
  const totalPoints     = journey.checkpoints.reduce(
    (s, cp) => s + cp.activities.reduce((ss, a) => ss + a.points, 0), 0
  );

  const earnedPoints = Object.values(answers).reduce((sum, ans) => {
    if (ans.type === 'free-response') {
      return sum + Math.round(((ans.aiScore ?? 0) / 100) * (20));
    }
    const activity = journey.checkpoints
      .flatMap(cp => cp.activities)
      .find(a => a.id === ans.activityId);
    if (!activity) return sum;

    if (activity.type === 'multiple-choice') {
      const val = ans.value as number[];
      const correct = activity.correctAnswers;
      const isOk = val?.length === correct?.length && correct.every(c => val.includes(c));
      return sum + (isOk ? activity.points : 0);
    }
    if (activity.type === 'true-false') {
      return sum + (ans.value === activity.correctAnswer ? activity.points : 0);
    }
    if (activity.type === 'fill-blank') {
      const val = ans.value as Record<string, string>;
      const isOk = activity.blanks.every(b => {
        const uv = (val?.[b.id] || '').trim().toLowerCase();
        return uv === b.correctAnswer.toLowerCase()
          || (b.alternatives || []).some(a => uv === a.toLowerCase());
      });
      return sum + (isOk ? activity.points : 0);
    }
    return sum;
  }, 0);

  const pct = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;

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
            <div className={styles.statValue}>{earnedPoints}</div>
            <div className={styles.statLabel}>XP заработано</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statValue}>{progress.completedCheckpoints.length}</div>
            <div className={styles.statLabel}>Чекпоинтов пройдено</div>
          </div>
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
