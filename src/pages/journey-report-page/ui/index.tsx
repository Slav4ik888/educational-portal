import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { StateSchema } from 'app/providers/store';
import {
  AI_EVALUATED_TYPES,
  ActivityAnswer,
  Checkpoint,
  JourneyActivity,
  checkActivityCorrect,
} from 'entities/journey';
import { ACHIEVEMENTS } from 'entities/gamification';
import styles from './journey-report-page.module.scss';


/* ─── helpers ─────────────────────────────────────────────────────────────── */

function rank(pct: number): { label: string; icon: string } {
  if (pct >= 90) return { label: 'Эксперт',     icon: '🏆' }
  if (pct >= 75) return { label: 'Мастер',       icon: '🎓' }
  if (pct >= 60) return { label: 'Ученик',       icon: '📚' }
  return           { label: 'Начинающий',        icon: '🌱' }
}

function cpAccuracy(
  cp      : Checkpoint,
  answers : Record<string, ActivityAnswer>,
): number {
  const { earned, total } = cp.activities.reduce(
    (acc, a) => {
      // Every activity contributes to the denominator, answered or not
      const newTotal = acc.total + a.points
      const ans = answers[a.id]
      if (!ans || ans.value === undefined || ans.value === '') {
        return { earned: acc.earned, total: newTotal }
      }
      if (AI_EVALUATED_TYPES.has(a.type)) {
        const score = ans.aiScore ?? 0
        return { earned: acc.earned + (score / 100) * a.points, total: newTotal }
      }
      const ok = checkActivityCorrect(a, ans)
      return { earned: acc.earned + (ok ? a.points : 0), total: newTotal }
    },
    { earned: 0, total: 0 },
  )
  return total > 0 ? Math.round((earned / total) * 100) : 0
}

function formatAnswer(activity: JourneyActivity, ans: ActivityAnswer): string {
  if (!ans || ans.value === undefined) return '—'

  if (activity.type === 'multiple-choice') {
    const indices = ans.value as number[]
    if (!indices?.length) return '—'
    return indices.map(i => activity.options[i]).filter(Boolean).join(', ')
  }

  if (activity.type === 'true-false') {
    return (ans.value as boolean) ? 'Верно' : 'Неверно'
  }

  if (activity.type === 'fill-blank') {
    const vals = ans.value as Record<string, string>
    return activity.blanks.map(b => `[${b.id}]: ${vals?.[b.id] ?? '—'}`).join(' | ')
  }

  return String(ans.value || '—')
}

function formatCorrect(activity: JourneyActivity): string {
  if (AI_EVALUATED_TYPES.has(activity.type)) return ''  // no fixed answer

  if (activity.type === 'multiple-choice') {
    return activity.correctAnswers.map(i => activity.options[i]).join(', ')
  }

  if (activity.type === 'true-false') {
    return activity.correctAnswer ? 'Верно' : 'Неверно'
  }

  if (activity.type === 'fill-blank') {
    return activity.blanks.map(b => b.correctAnswer).join(' | ')
  }

  return ''
}

const ACTIVITY_TYPE_LABEL: Record<string, string> = {
  'multiple-choice'      : 'Выбор ответа',
  'true-false'           : 'Верно/Неверно',
  'fill-blank'           : 'Заполни пропуски',
  'free-response'        : 'Развёрнутый ответ',
  'explain-like-im-five' : 'Объясни просто',
  'teach-back'           : 'Объясни другу',
  'give-your-example'    : 'Свой пример',
  'debug-the-logic'      : 'Найди ошибку',
}

const ACTIVITY_ICON: Record<string, string> = {
  'multiple-choice'      : '🔘',
  'true-false'           : '✓✗',
  'fill-blank'           : '✏️',
  'free-response'        : '📝',
  'explain-like-im-five' : '🧒',
  'teach-back'           : '🎓',
  'give-your-example'    : '💡',
  'debug-the-logic'      : '🔍',
}


/* ─── ScoreRing ────────────────────────────────────────────────────────────── */

const ScoreRing: FC<{ pct: number }> = ({ pct }) => {
  const r    = 56
  const circ = 2 * Math.PI * r
  const dash = (pct / 100) * circ
  const color = pct >= 75 ? '#34d399' : pct >= 50 ? '#fbbf24' : '#f87171'

  return (
    <svg className={styles.ring} width="140" height="140" viewBox="0 0 140 140">
      <circle cx="70" cy="70" r={r} fill="none" stroke="#1e293b" strokeWidth="12" />
      <circle
        cx="70" cy="70" r={r}
        fill="none"
        stroke={color}
        strokeWidth="12"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        transform="rotate(-90 70 70)"
      />
      <text x="70" y="66" textAnchor="middle" fill="#e2e8f0" fontSize="22" fontWeight="800">
        {pct}%
      </text>
      <text x="70" y="84" textAnchor="middle" fill="#64748b" fontSize="11">
        точность
      </text>
    </svg>
  )
}


/* ─── AnswerRow ───────────────────────────────────────────────────────────── */

interface AnswerRowProps {
  activity : JourneyActivity
  answer   : ActivityAnswer | undefined
}

const AnswerRow: FC<AnswerRowProps> = ({ activity, answer }) => {
  const isAi       = AI_EVALUATED_TYPES.has(activity.type)
  const unanswered = !answer || answer.value === undefined || answer.value === ''
  const correct    = unanswered
    ? false
    : isAi
      ? (answer!.aiScore ?? 0) >= 50
      : checkActivityCorrect(activity, answer)
  const userAns    = unanswered ? '—' : formatAnswer(activity, answer!)
  const correctAns = formatCorrect(activity)

  const rowClass = unanswered
    ? styles.answerSkipped
    : correct ? styles.answerCorrect : styles.answerWrong

  return (
    <div className={`${styles.answerRow} ${rowClass}`}>
      <div className={styles.answerHeader}>
        <span className={styles.actIcon}>{ACTIVITY_ICON[activity.type] ?? '❓'}</span>
        <span className={styles.actLabel}>{ACTIVITY_TYPE_LABEL[activity.type] ?? activity.type}</span>
        <span className={styles.actPoints}>{activity.points} XP</span>
        <span className={styles.verdict}>
          {unanswered ? '−' : correct ? '✓' : '✗'}
        </span>
      </div>

      <p className={styles.questionText}>{activity.text}</p>

      <div className={styles.answerBody}>
        <div className={styles.answerField}>
          <span className={styles.fieldLabel}>Ваш ответ</span>
          <span className={styles.fieldValue}>{userAns}</span>
        </div>

        {isAi && !unanswered ? (
          <div className={styles.answerField}>
            <span className={styles.fieldLabel}>Оценка AI</span>
            <span className={styles.fieldValue}>{answer?.aiScore ?? '—'} / 100</span>
          </div>
        ) : !isAi && correctAns ? (
          <div className={styles.answerField}>
            <span className={styles.fieldLabel}>Правильный ответ</span>
            <span className={`${styles.fieldValue} ${styles.correctAnswer}`}>{correctAns}</span>
          </div>
        ) : null}
      </div>

      {isAi && !unanswered && answer?.aiFeedback && (
        <div className={styles.aiFeedback}>
          <span className={styles.feedbackLabel}>💬 AI-фидбек</span>
          <p className={styles.feedbackText}>{answer.aiFeedback}</p>
          {answer.aiStrengths && (
            <p className={styles.feedbackStrengths}>✅ {answer.aiStrengths}</p>
          )}
          {answer.aiImprovements && (
            <p className={styles.feedbackImprove}>💡 {answer.aiImprovements}</p>
          )}
        </div>
      )}
    </div>
  )
}


/* ─── CheckpointSection ───────────────────────────────────────────────────── */

interface CheckpointSectionProps {
  cp      : Checkpoint
  index   : number
  answers : Record<string, ActivityAnswer>
  timed   : boolean
}

const CheckpointSection: FC<CheckpointSectionProps> = ({ cp, index, answers, timed }) => {
  const acc = cpAccuracy(cp, answers)
  const accColor = acc >= 80 ? '#34d399' : acc >= 60 ? '#fbbf24' : '#f87171'

  return (
    <div className={styles.cpSection}>
      <div className={styles.cpSectionHeader}>
        <div className={styles.cpSectionMeta}>
          <span className={styles.cpNum}>Чекпоинт {index + 1}</span>
          {timed && <span className={styles.timedBadge}>⏰ По таймеру</span>}
        </div>
        <h3 className={styles.cpConcept}>{cp.concept}</h3>
        <div className={styles.cpBar}>
          <div className={styles.cpBarFill} style={{ width: `${acc}%`, background: accColor }} />
        </div>
        <span className={styles.cpAcc} style={{ color: accColor }}>{acc}% точность</span>
      </div>

      <div className={styles.answers}>
        {cp.activities.map(a => (
          <AnswerRow key={a.id} activity={a} answer={answers[a.id]} />
        ))}
      </div>
    </div>
  )
}


/* ─── Main page ───────────────────────────────────────────────────────────── */

export const JourneyReportPage: FC = () => {
  const navigate = useNavigate();
  const { current: journey, answers, progress } = useSelector((s: StateSchema) => s.journey);
  const gamification = useSelector((s: StateSchema) => s.gamification);

  if (!journey) {
    return (
      <div className={styles.page}>
        <div className={styles.emptyCard}>
          <div className={styles.emptyIcon}>🗺️</div>
          <h1 className={styles.emptyTitle}>Путешествие не найдено</h1>
          <button className={styles.primaryBtn} onClick={() => navigate('/journey/new')}>
            Создать новое путешествие
          </button>
        </div>
      </div>
    );
  }

  // Overall accuracy
  const allActivities = journey.checkpoints.flatMap(cp => cp.activities)
  const totalPoints   = allActivities.reduce((s, a) => s + a.points, 0)
  const earnedPoints  = allActivities.reduce((sum, a) => {
    const ans = answers[a.id]
    if (!ans || ans.value === undefined || ans.value === '') return sum
    if (AI_EVALUATED_TYPES.has(a.type)) {
      return sum + Math.round(((ans.aiScore ?? 0) / 100) * a.points)
    }
    return sum + (checkActivityCorrect(a, ans) ? a.points : 0)
  }, 0)
  const pct = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0
  const { label: rankLabel, icon: rankIcon } = rank(pct)

  // Gamification
  const sessionXP  = gamification?.sessionXP  ?? 0
  const maxStreak  = gamification?.maxStreak  ?? 0
  const unlockedIds = gamification?.unlockedAchievements ?? []
  const unlocked   = ACHIEVEMENTS.filter(a => unlockedIds.includes(a.id))

  // Timed-out checkpoints
  const timedSet = new Set(progress.timedOutCheckpoints ?? [])

  // Recommendations: checkpoints with accuracy < 70%, worst first, top 3
  const recommendations = journey.checkpoints
    .map(cp => ({ cp, acc: cpAccuracy(cp, answers) }))
    .filter(x => x.acc < 70)
    .sort((a, b) => a.acc - b.acc)
    .slice(0, 3)

  return (
    <div className={styles.page}>

      {/* ── Print-only heading ── */}
      <div className={`${styles.printHeading} ${styles.printOnly}`}>
        Knowledge Journey — Финальный отчёт
      </div>

      {/* ── Hero card ── */}
      <div className={styles.heroCard}>
        <ScoreRing pct={pct} />

        <div className={styles.heroInfo}>
          <div className={styles.rankBadge}>{rankIcon} {rankLabel}</div>
          <h1 className={styles.heroTitle}>Путешествие завершено!</h1>
          <p className={styles.heroSub}>{journey.title}</p>
        </div>
      </div>

      {/* ── Stats grid ── */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statVal}>{sessionXP}</div>
          <div className={styles.statKey}>XP заработано</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statVal}>{pct}%</div>
          <div className={styles.statKey}>Точность</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statVal}>{progress.completedCheckpoints.length}</div>
          <div className={styles.statKey}>Чекпоинтов</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statVal}>{maxStreak}</div>
          <div className={styles.statKey}>Макс. серия</div>
        </div>
      </div>

      {/* ── Achievements ── */}
      {unlocked.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>🏅 Достижения</h2>
          <div className={styles.achievementGrid}>
            {unlocked.map(a => (
              <div key={a.id} className={styles.achievementCard}>
                <div className={styles.achIcon}>{a.icon}</div>
                <div className={styles.achTitle}>{a.title}</div>
                <div className={styles.achDesc}>{a.description}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Recommendations ── */}
      {recommendations.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>🔄 Рекомендуем повторить</h2>
          <p className={styles.sectionSub}>
            Эти концепции вызвали затруднения. Вернитесь к ним позже.
          </p>
          <div className={styles.recList}>
            {recommendations.map(({ cp, acc }) => (
              <div key={cp.id} className={styles.recCard}>
                <div className={styles.recAcc} style={{ color: acc < 50 ? '#f87171' : '#fbbf24' }}>
                  {acc}%
                </div>
                <div className={styles.recInfo}>
                  <div className={styles.recConcept}>{cp.concept}</div>
                  <div className={styles.recExp}>{cp.explanation}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Per-checkpoint breakdown ── */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>📋 Ответы по чекпоинтам</h2>
        {journey.checkpoints.map((cp, i) => (
          <CheckpointSection
            key     = {cp.id}
            cp      = {cp}
            index   = {i}
            answers = {answers}
            timed   = {timedSet.has(cp.id)}
          />
        ))}
      </section>

      {/* ── Actions (hidden in print) ── */}
      <div className={`${styles.actions} ${styles.noPrint}`}>
        <button
          className={styles.printBtn}
          onClick={() => window.print()}
        >
          🖨️ Распечатать / Сохранить PDF
        </button>
        <button
          className={styles.primaryBtn}
          onClick={() => navigate('/journey/new')}
        >
          Начать новое путешествие →
        </button>
        <button
          className={styles.secondaryBtn}
          onClick={() => navigate('/')}
        >
          К статьям
        </button>
      </div>
    </div>
  )
}
