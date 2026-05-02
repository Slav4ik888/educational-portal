import { FC, useState, useCallback, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { StateSchema } from 'app/providers/store'
import {
  journeyActions,
  JourneyActivity,
  ActivityAnswer,
  AiEvaluatedActivity,
  ActivityRenderer,
  AI_EVALUATED_TYPES,
  checkActivityCorrect,
} from 'entities/journey'
import { gamificationActions } from 'entities/gamification'
import { evaluateAnswer } from 'shared/lib/ai'
import { useCheckpointTimer } from 'shared/lib/hooks/use-checkpoint-timer'
import styles from './journey-page.module.scss'

function isAiEvaluated(a: JourneyActivity): a is AiEvaluatedActivity {
  return AI_EVALUATED_TYPES.has(a.type)
}

const ACTIVITY_LABELS: Record<string, string> = {
  'multiple-choice'      : 'Выбор ответа',
  'true-false'           : 'Верно / Неверно',
  'fill-blank'           : 'Заполни пропуски',
  'free-response'        : 'Развёрнутый ответ',
  'explain-like-im-five' : 'Объясни просто',
  'teach-back'           : 'Объясни другу',
  'give-your-example'    : 'Твой пример',
  'debug-the-logic'      : 'Найди ошибку',
}

const TYPE_ICON: Record<string, string> = {
  'multiple-choice'      : '🔘',
  'true-false'           : '✓✗',
  'fill-blank'           : '✏️',
  'free-response'        : '📝',
  'explain-like-im-five' : '🧒',
  'teach-back'           : '🎓',
  'give-your-example'    : '💡',
  'debug-the-logic'      : '🔍',
}

const TYPE_COLOR: Record<string, string> = {
  'multiple-choice'      : 'blue',
  'true-false'           : 'green',
  'fill-blank'           : 'orange',
  'free-response'        : 'purple',
  'explain-like-im-five' : 'indigo',
  'teach-back'           : 'teal',
  'give-your-example'    : 'amber',
  'debug-the-logic'      : 'rose',
}

/** Seconds for a checkpoint based on text length and activity XP.
 *  - 1 minute per 300 characters of explanation + activity texts
 *  - 12 seconds per XP point (10 XP → 1 min, 20 XP → 2 min)
 */
function cpTimerSeconds(
  explanation: string,
  activities: JourneyActivity[],
): number {
  const allText    = explanation + activities.map(a => a.text).join('')
  const textSecs   = Math.ceil(allText.length / 300) * 60
  const testSecs   = activities.reduce((sum, a) => sum + (a.points / 10) * 60, 0)
  return Math.round(textSecs + testSecs)
}

interface ActivityCardProps {
  activity        : JourneyActivity
  answer          : ActivityAnswer | undefined
  globalSubmitted : boolean
  evalSubmitted   : Set<string>
  evaluatingSet   : Set<string>
  onAnswer        : (ans: ActivityAnswer) => void
  onSubmitForEval : (activityId: string, value: string) => void
}

const ActivityCard: FC<ActivityCardProps> = ({
  activity,
  answer,
  globalSubmitted,
  evalSubmitted,
  evaluatingSet,
  onAnswer,
  onSubmitForEval,
}) => {
  const [showHint, setShowHint] = useState(false)
  const isAiType   = AI_EVALUATED_TYPES.has(activity.type)
  const submitted  = globalSubmitted || evalSubmitted.has(activity.id)
  const evaluating = evaluatingSet.has(activity.id)
  const colorClass = styles[`type${TYPE_COLOR[activity.type] ?? 'blue'}`] ?? ''

  return (
    <div className={`${styles.activityCard} ${colorClass}`}>
      <div className={styles.activityHeader}>
        <span className={styles.activityIcon}>{TYPE_ICON[activity.type]}</span>
        <span className={styles.activityLabel}>{ACTIVITY_LABELS[activity.type]}</span>
        <span className={styles.pointsBadge}>{activity.points} XP</span>
      </div>

      {activity.type !== 'fill-blank' && activity.type !== 'debug-the-logic' && (
        <div className={styles.activityQuestion}>{activity.text}</div>
      )}

      <ActivityRenderer
        activity       = {activity}
        answer         = {answer}
        submitted      = {submitted}
        isEvaluating   = {evaluating}
        onAnswer       = {value => onAnswer({ activityId: activity.id, type: activity.type, value })}
        onSubmitForEval= {value => {
          onAnswer({ activityId: activity.id, type: activity.type, value })
          onSubmitForEval(activity.id, value)
        }}
      />

      {activity.hint && !isAiType && !submitted && (
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
  )
}


interface ToastProps {
  icon        : string
  title       : string
  description : string
  onDismiss   : () => void
}

const AchievementToast: FC<ToastProps> = ({ icon, title, description, onDismiss }) => {
  useEffect(() => {
    const id = setTimeout(onDismiss, 3500)
    return () => clearTimeout(id)
  }, [onDismiss])

  return (
    <div className={styles.achievementToast} role="status">
      <span className={styles.toastIcon}>{icon}</span>
      <div className={styles.toastBody}>
        <div className={styles.toastTitle}>Достижение разблокировано!</div>
        <div className={styles.toastName}>{title}</div>
        <div className={styles.toastDesc}>{description}</div>
      </div>
      <button className={styles.toastClose} onClick={onDismiss}>×</button>
    </div>
  )
}


interface TimerRingProps {
  remaining : number
  total     : number
  phase     : 'normal' | 'warning' | 'danger'
}

const TimerRing: FC<TimerRingProps> = ({ remaining, total, phase }) => {
  const min  = Math.floor(remaining / 60)
  const sec  = remaining % 60
  const pct  = remaining / total
  const r    = 18
  const circ = 2 * Math.PI * r
  const dash = circ * pct

  return (
    <div className={`${styles.timerRing} ${styles[`timer_${phase}`]}`}>
      <svg width="48" height="48" viewBox="0 0 48 48">
        <circle cx="24" cy="24" r={r} fill="none" strokeWidth="3" className={styles.timerTrack} />
        <circle
          cx="24" cy="24" r={r}
          fill="none" strokeWidth="3"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          transform="rotate(-90 24 24)"
          className={styles.timerArc}
        />
      </svg>
      <span className={styles.timerText}>
        {min}:{sec.toString().padStart(2, '0')}
      </span>
    </div>
  )
}


interface HudProps {
  xp              : number
  streak          : number
  cpIndex         : number
  cpTotal         : number
  timerRemaining  : number
  timerTotal      : number
  timerPhase      : 'normal' | 'warning' | 'danger'
}

const JourneyHud: FC<HudProps> = ({ xp, streak, cpIndex, cpTotal, timerRemaining, timerTotal, timerPhase }) => {
  const multiplier = streak >= 5 ? 2 : streak >= 3 ? 1.5 : streak >= 2 ? 1.25 : 1

  return (
    <div className={styles.hud}>
      <div className={styles.hudItem}>
        <span className={styles.hudIcon}>⚡</span>
        <span className={styles.hudValue}>{xp}</span>
        <span className={styles.hudLabel}>XP</span>
      </div>
      <div className={`${styles.hudItem} ${streak > 0 ? styles.hudStreakActive : ''}`}>
        <span className={styles.hudIcon}>🔥</span>
        <span className={styles.hudValue}>×{multiplier.toFixed(2).replace(/\.?0+$/, '')}</span>
        <span className={styles.hudLabel}>Серия {streak}</span>
      </div>
      <div className={styles.hudItem}>
        <span className={styles.hudIcon}>📍</span>
        <span className={styles.hudValue}>{cpIndex} / {cpTotal}</span>
        <span className={styles.hudLabel}>Чекпоинт</span>
      </div>
      <TimerRing remaining={timerRemaining} total={timerTotal} phase={timerPhase} />
    </div>
  )
}


interface ProgressBarProps {
  checkpoints        : { id: string }[]
  completedIds       : string[]
  currentIdx         : number
}

const CheckpointProgress: FC<ProgressBarProps> = ({ checkpoints, completedIds, currentIdx }) => (
  <div className={styles.progressBar}>
    {checkpoints.map((cp, i) => (
      <div
        key       = {cp.id}
        className = {[
          styles.progressSegment,
          completedIds.includes(cp.id) ? styles.psDone    : '',
          i === currentIdx && !completedIds.includes(cp.id) ? styles.psCurrent : '',
        ].join(' ')}
      >
        {completedIds.includes(cp.id) && <span className={styles.psTick}>✓</span>}
        {i === currentIdx && !completedIds.includes(cp.id) && (
          <span className={styles.psDot} />
        )}
      </div>
    ))}
  </div>
)


export const JourneyPage: FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { current: journey, answers, progress, submittedCheckpointIds } = useSelector((s: StateSchema) => s.journey)
  const gamification = useSelector((s: StateSchema) => s.gamification)

  const checkpoint   = journey?.checkpoints[progress.currentCheckpointIdx]

  const [submitted,     setSubmitted]     = useState(() => submittedCheckpointIds.includes(checkpoint?.id ?? ''))
  const [evalSubmitted, setEvalSubmitted] = useState<Set<string>>(new Set())
  const [evaluatingSet, setEvaluatingSet] = useState<Set<string>>(new Set())
  const [transitioning, setTransitioning] = useState(false)
  const [toastKey,      setToastKey]      = useState(0)
  const [timedOut,      setTimedOut]      = useState(false)

  const { currentCheckpointIdx, completedCheckpoints } = progress
  const cpActivities  = checkpoint?.activities ?? []
  const timerTotal    = cpTimerSeconds(checkpoint?.explanation ?? '', cpActivities)

  // Refs to access current values inside the timer callback without re-creating it
  const timerExpiredRef  = useRef(false)
  const submittedRef     = useRef(false)   // mirrors `submitted` state for use in callbacks
  const xpAwardedRef     = useRef(false)   // ensures XP is awarded only once per attempt

  const checkpointRef    = useRef(checkpoint)
  const answersRef       = useRef(answers)
  checkpointRef.current  = checkpoint
  answersRef.current     = answers

  /**
   * Award XP for the current checkpoint exactly once.
   * `speedMultiplier` is 1 for a normal finish, 0.5 for a timeout.
   * The speed *bonus* (1 / 1.5 / 2×) is applied on top only for normal finishes.
   * `elapsed` seconds is used to check the lightning achievement (<60s).
   */
  const awardCheckpointXP = useCallback((speedMultiplier: number, timerPct: number, elapsed: number) => {
    const cp  = checkpointRef.current
    const ans = answersRef.current
    if (!cp) return
    if (xpAwardedRef.current) return
    xpAwardedRef.current = true

    const speedBonus = speedMultiplier < 1
      ? speedMultiplier                                         // timeout: flat 0.5
      : timerPct > 75 ? 2 : timerPct > 50 ? 1.5 : 1           // normal: time-based

    let anyAnswered       = false
    let allAnsweredCorrect = true   // flipped to false on first wrong answer

    cp.activities.forEach(activity => {
      const a = ans[activity.id]
      // Skip activities the user never touched
      if (!a || a.value === undefined || a.value === '') return

      anyAnswered = true

      const correct = AI_EVALUATED_TYPES.has(activity.type)
        ? (a.aiScore ?? 0) >= 50
        : checkActivityCorrect(activity, a)

      if (correct) {
        dispatch(gamificationActions.addXP({ base: activity.points, speedBonus }))
      } else {
        // Any wrong answer means streak must reset
        allAnsweredCorrect = false
      }
    })

    // Streak: increment only if every answered activity was correct;
    // reset the moment any answer is wrong (per spec).
    if (anyAnswered) {
      if (allAnsweredCorrect) {
        dispatch(gamificationActions.incrementStreak())
      } else {
        dispatch(gamificationActions.resetStreak())
      }
    }

    // Lightning achievement: completed checkpoint in under 60 seconds
    if (elapsed < 60 && speedMultiplier >= 1) {
      dispatch(gamificationActions.unlockAchievement('lightning'))
    }
  }, [dispatch])

  const handleTimeOut = useCallback(() => {
    if (timerExpiredRef.current) return
    timerExpiredRef.current = true

    // If the user already finished manually, nothing to do.
    if (submittedRef.current) return

    // Show the penalty banner but let the user keep working.
    // XP penalty (×0.5) is applied when they actually submit/advance.
    setTimedOut(true)
  }, [])

  const timer = useCheckpointTimer(timerTotal, handleTimeOut)

  // Pause the timer (and sync ref) the moment the user finishes the checkpoint
  useEffect(() => {
    submittedRef.current = submitted
    if (submitted) timer.pause()
  }, [submitted, timer])

  // Reset per-checkpoint local state when checkpoint changes,
  // restoring submitted status from persisted Redux state.
  useEffect(() => {
    timerExpiredRef.current = false
    xpAwardedRef.current    = false
    const alreadySubmitted  = submittedCheckpointIds.includes(checkpoint?.id ?? '')
    submittedRef.current    = alreadySubmitted
    if (!alreadySubmitted) timer.reset(timerTotal)
    setSubmitted(alreadySubmitted)
    setTimedOut(false)
    setEvalSubmitted(new Set())
    setEvaluatingSet(new Set())
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCheckpointIdx])

  // Show achievement toast when pending
  useEffect(() => {
    if (gamification.pendingAchievement) {
      setToastKey(k => k + 1)
    }
  }, [gamification.pendingAchievement])

  const handleSubmitForEval = useCallback(async (activityId: string, value: string) => {
    if (!journey) return
    const rawActivity = checkpoint?.activities.find(a => a.id === activityId)
    if (!rawActivity || !isAiEvaluated(rawActivity)) return
    const activity = rawActivity

    setEvalSubmitted(prev => new Set(prev).add(activityId))
    setEvaluatingSet(prev => new Set(prev).add(activityId))

    try {
      const reasoning  = activity.type === 'debug-the-logic' ? activity.reasoning    : undefined
      const exampleAns = activity.type === 'free-response'   ? activity.exampleAnswer : undefined
      const forbidden  = activity.type === 'teach-back'      ? activity.forbiddenTerms : undefined

      const result = await evaluateAnswer({
        concept            : checkpoint!.concept,
        activityType       : activity.type,
        question           : activity.text,
        reasoning,
        exampleAnswer      : exampleAns,
        evaluationCriteria : activity.evaluationCriteria,
        userAnswer         : value,
        forbiddenTerms     : forbidden,
      })

      dispatch(journeyActions.setAiEvaluation({
        activityId,
        score       : result.score,
        feedback    : result.feedback,
        strengths   : result.strengths   ?? null,
        improvements: result.improvements ?? null,
      }))

    } catch {
      dispatch(journeyActions.setAiEvaluation({
        activityId,
        score       : 0,
        feedback    : 'Не удалось оценить ответ. Ознакомьтесь с критериями оценки вручную.',
        strengths   : null,
        improvements: null,
      }))
    }

    setEvaluatingSet(prev => {
      const next = new Set(prev)
      next.delete(activityId)
      return next
    })
  }, [journey, checkpoint, timer, dispatch])


  if (!journey) {
    return (
      <div className={styles.page}>
        <p style={{ color: '#64748b' }}>Путешествие не найдено.</p>
        <button className={styles.back} onClick={() => navigate('/journey/new')}>
          Создать новое
        </button>
      </div>
    )
  }

  const isLast  = currentCheckpointIdx === journey.checkpoints.length - 1
  const allDone = completedCheckpoints.length === journey.checkpoints.length

  const nonAiActivities = checkpoint ? checkpoint.activities.filter(a => !AI_EVALUATED_TYPES.has(a.type)) : []
  const aiActivities    = checkpoint ? checkpoint.activities.filter(a =>  AI_EVALUATED_TYPES.has(a.type)) : []

  const nonAiAnswered  = nonAiActivities.filter(a =>
    answers[a.id]?.value !== undefined && answers[a.id]?.value !== ''
  ).length
  const aiAllEvaluated = aiActivities.every(a => answers[a.id]?.isEvaluated === true)

  const canCheck = nonAiActivities.length > 0
    ? nonAiAnswered === nonAiActivities.length && aiAllEvaluated
    : aiAllEvaluated

  const handleCheck = () => {
    const elapsed    = timerTotal - timer.remaining
    const speedMult  = timedOut ? 0.5 : 1
    awardCheckpointXP(speedMult, timedOut ? 0 : timer.pct, elapsed)
    setSubmitted(true)
    submittedRef.current = true
    if (checkpoint) dispatch(journeyActions.markCheckpointSubmitted(checkpoint.id))
  }

  const finalizeAndAdvance = (finish: boolean) => {
    // Award XP if the user reached here without going through handleCheck
    // (i.e., pure-AI checkpoint where submitted was never set)
    if (!submittedRef.current) {
      const elapsed   = timerTotal - timer.remaining
      const speedMult = timedOut ? 0.5 : 1
      awardCheckpointXP(speedMult, timedOut ? 0 : timer.pct, elapsed)
      submittedRef.current = true
    }
    const completeAction = timedOut
      ? journeyActions.completeCheckpointTimedOut
      : journeyActions.completeCheckpoint
    if (finish) {
      dispatch(completeAction(checkpoint!.id))
      navigate(`/journey/${journey.id}/report`)
    } else {
      setTransitioning(true)
      setTimeout(() => {
        dispatch(completeAction(checkpoint!.id))
        dispatch(journeyActions.nextCheckpoint())
        setTransitioning(false)
      }, 350)
    }
  }

  const handleRetry = () => {
    if (!checkpoint) return
    const activityIds = checkpoint.activities.map(a => a.id)
    dispatch(journeyActions.clearCheckpointAnswers(activityIds))
    dispatch(journeyActions.unmarkCheckpointSubmitted(checkpoint.id))
    setSubmitted(false)
    submittedRef.current = false
    xpAwardedRef.current = false
    setEvalSubmitted(new Set())
    setEvaluatingSet(new Set())
    timer.resume()
  }

  const handleNext   = () => finalizeAndAdvance(false)
  const handleFinish = () => finalizeAndAdvance(true)

  return (
    <div className={styles.page}>
      {/* Achievement Toast */}
      {gamification.pendingAchievement && (
        <AchievementToast
          key         = {toastKey}
          icon        = {gamification.pendingAchievement.icon}
          title       = {gamification.pendingAchievement.title}
          description = {gamification.pendingAchievement.description}
          onDismiss   = {() => dispatch(gamificationActions.clearPendingAchievement())}
        />
      )}

      <div className={styles.header}>
        <div className={styles.nav}>
          <button className={styles.back} onClick={() => navigate('/journey/new')}>← Создать новое</button>
          <span className={styles.badge}>Knowledge Journey</span>
        </div>
        <h1 className={styles.title}>{journey.title}</h1>
        {journey.description && <p className={styles.description}>{journey.description}</p>}
      </div>

      {/* Progress bar */}
      <div style={{ width: '100%', maxWidth: 720, marginBottom: 16 }}>
        <CheckpointProgress
          checkpoints  = {journey.checkpoints}
          completedIds = {completedCheckpoints}
          currentIdx   = {currentCheckpointIdx}
        />
      </div>

      {/* HUD */}
      {!allDone && (
        <JourneyHud
          xp             = {gamification.sessionXP}
          streak         = {gamification.streak}
          cpIndex        = {currentCheckpointIdx + 1}
          cpTotal        = {journey.checkpoints.length}
          timerRemaining = {timer.remaining}
          timerTotal     = {timerTotal}
          timerPhase     = {timer.phase}
        />
      )}

      {allDone ? (
        <div className={styles.checkpoint}>
          <div className={styles.completedMsg}>Путешествие завершено! 🎉</div>
          <button className={styles.finishBtn} onClick={() => navigate(`/journey/${journey.id}/report`)}>
            Посмотреть финальный отчёт →
          </button>
        </div>
      ) : checkpoint && (
        <div className={`${styles.checkpoint} ${transitioning ? styles.cpTransitionOut : styles.cpTransitionIn}`}>
          {/* Timed-out warning — user can still answer but earns half XP */}
          {timedOut && (
            <div className={styles.timerExpiredBanner}>
              ⏰ Время вышло — максимальный XP за этот чекпоинт уменьшен вдвое. Завершите задания, чтобы продолжить.
            </div>
          )}

          <div className={styles.cpHeader}>
            <div className={styles.cpNum}>
              Чекпоинт {currentCheckpointIdx + 1} из {journey.checkpoints.length}
            </div>
            <h2 className={styles.cpTitle}>{checkpoint.concept}</h2>
            <div className={styles.cpExplanation}>
              {checkpoint.explanation.split(/\n\n+/).map((para, i) => (
                <p key={i} className={styles.cpParagraph}>{para.trim()}</p>
              ))}
            </div>
          </div>

          <div className={styles.activities}>
            {checkpoint.activities.map(activity => (
              <ActivityCard
                key             = {activity.id}
                activity        = {activity}
                answer          = {answers[activity.id]}
                globalSubmitted = {submitted}
                evalSubmitted   = {evalSubmitted}
                evaluatingSet   = {evaluatingSet}
                onAnswer        = {ans => dispatch(journeyActions.setActivityAnswer(ans))}
                onSubmitForEval = {handleSubmitForEval}
              />
            ))}
          </div>

          <div className={styles.actions}>
            {!submitted ? (
              nonAiActivities.length > 0 ? (
                <button
                  className = {styles.checkBtn}
                  disabled  = {!canCheck}
                  onClick   = {handleCheck}
                >
                  Проверить ответы
                </button>
              ) : aiAllEvaluated ? (
                isLast ? (
                  <button className={styles.nextBtn} onClick={handleFinish}>
                    Завершить путешествие →
                  </button>
                ) : (
                  <button className={styles.nextBtn} onClick={handleNext}>
                    Следующий чекпоинт →
                  </button>
                )
              ) : (
                <p className={styles.aiHint}>
                  Ответьте на все задания выше, чтобы продолжить
                </p>
              )
            ) : (
              <>
                <button className={styles.retryBtn} onClick={handleRetry}>
                  ↺ Перепройти
                </button>
                {isLast ? (
                  <button className={styles.nextBtn} onClick={handleFinish}>
                    Завершить путешествие →
                  </button>
                ) : (
                  <button className={styles.nextBtn} onClick={handleNext}>
                    Следующий чекпоинт →
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
