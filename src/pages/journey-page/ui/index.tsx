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

function checkActivityCorrect(activity: JourneyActivity, ans: ActivityAnswer | undefined): boolean {
  if (!ans) return false
  if (activity.type === 'multiple-choice') {
    const val = ans.value as number[]
    return val?.length === activity.correctAnswers.length &&
      activity.correctAnswers.every(c => val.includes(c))
  }
  if (activity.type === 'true-false') {
    return ans.value === activity.correctAnswer
  }
  if (activity.type === 'fill-blank') {
    const vals = ans.value as Record<string, string>
    const norm = activity.caseSensitive
      ? (s: string) => s
      : (s: string) => s.toLowerCase()
    return activity.blanks.every(b => {
      const v = (vals?.[b.id] ?? '').trim()
      return norm(v) === norm(b.correctAnswer) ||
        (b.alternatives ?? []).some(a => norm(v) === norm(a))
    })
  }
  if (AI_EVALUATED_TYPES.has(activity.type)) {
    return (ans.aiScore ?? 0) >= 50
  }
  return false
}

/** Seconds for a checkpoint based on activity count */
function cpTimerSeconds(activityCount: number): number {
  return Math.min(300, Math.max(180, 120 + activityCount * 40))
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

      <div className={styles.activityQuestion}>{activity.text}</div>

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
  const { current: journey, answers, progress } = useSelector((s: StateSchema) => s.journey)
  const gamification = useSelector((s: StateSchema) => s.gamification)

  const [submitted,     setSubmitted]     = useState(false)
  const [evalSubmitted, setEvalSubmitted] = useState<Set<string>>(new Set())
  const [evaluatingSet, setEvaluatingSet] = useState<Set<string>>(new Set())
  const [transitioning, setTransitioning] = useState(false)
  const [toastKey,      setToastKey]      = useState(0)
  const [timedOut,      setTimedOut]      = useState(false)

  const { currentCheckpointIdx, completedCheckpoints } = progress
  const checkpoint   = journey?.checkpoints[currentCheckpointIdx]
  const cpActivities = checkpoint?.activities ?? []
  const timerTotal   = cpTimerSeconds(cpActivities.length)

  // Refs to access current values inside the timer callback without re-creating it
  const timerExpiredRef = useRef(false)
  const submittedRef    = useRef(false)   // mirrors `submitted` state for use in callbacks
  const checkpointRef   = useRef(checkpoint)
  const answersRef      = useRef(answers)
  checkpointRef.current = checkpoint
  answersRef.current    = answers

  /**
   * Award XP for the current checkpoint exactly once.
   * `speedMultiplier` is 1 for a normal finish, 0.5 for a timeout.
   * The speed *bonus* (1 / 1.5 / 2×) is applied on top only for normal finishes.
   */
  const awardCheckpointXP = useCallback((speedMultiplier: number, timerPct: number) => {
    const cp  = checkpointRef.current
    const ans = answersRef.current
    if (!cp) return

    const speedBonus = speedMultiplier < 1
      ? speedMultiplier                          // timeout: flat 0.5
      : timerPct > 75 ? 2 : timerPct > 50 ? 1.5 : 1  // normal: time-based

    let anyCorrect  = false
    let anyAnswered = false

    cp.activities.forEach(activity => {
      const a = ans[activity.id]
      if (!a) return

      let correct = false
      if (AI_EVALUATED_TYPES.has(activity.type)) {
        correct = (a.aiScore ?? 0) >= 50
      } else {
        correct = checkActivityCorrect(activity, a)
      }

      if (correct) {
        anyCorrect  = true
        anyAnswered = true
        dispatch(gamificationActions.addXP({ base: activity.points, speedBonus }))
      } else if (a.value !== undefined && a.value !== '') {
        anyAnswered = true
      }
    })

    // Streak tracks whether the checkpoint ended successfully
    if (anyAnswered) {
      if (anyCorrect) {
        dispatch(gamificationActions.incrementStreak())
      } else {
        dispatch(gamificationActions.resetStreak())
      }
    }
  }, [dispatch])

  const handleTimeOut = useCallback(() => {
    if (timerExpiredRef.current) return
    timerExpiredRef.current = true

    // If the user already finished manually, the timer was paused — this path
    // should never fire.  Guard anyway to be safe.
    if (submittedRef.current) return

    setTimedOut(true)
    setSubmitted(true)
    submittedRef.current = true

    const cp = checkpointRef.current
    if (!cp) return

    // Award 50% XP (penalised) for whatever the user managed to answer
    awardCheckpointXP(0.5, 0)

    // Check lightning achievement based on elapsed time (even on timeout the
    // user could have answered quickly before time ran out — not applicable here,
    // so skip lightning on timeout)

    // Persist timed-out state to Redux and auto-advance after 2.5s
    dispatch(journeyActions.completeCheckpointTimedOut(cp.id))
    setTimeout(() => {
      dispatch(journeyActions.nextCheckpoint())
    }, 2500)
  }, [dispatch, awardCheckpointXP])

  const timer = useCheckpointTimer(timerTotal, handleTimeOut)

  // Pause the timer (and sync ref) the moment the user finishes the checkpoint
  useEffect(() => {
    submittedRef.current = submitted
    if (submitted) timer.pause()
  }, [submitted, timer])

  // Reset per-checkpoint local state when checkpoint changes
  useEffect(() => {
    timerExpiredRef.current = false
    submittedRef.current    = false
    timer.reset(timerTotal)
    setSubmitted(false)
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
    awardCheckpointXP(1, timer.pct)
    // Lightning: answered everything in under 60s
    const elapsed = timerTotal - timer.remaining
    if (elapsed < 60) {
      dispatch(gamificationActions.unlockAchievement('lightning'))
    }
    setSubmitted(true)
    submittedRef.current = true
  }

  const finalizeAndAdvance = (finish: boolean) => {
    // Award XP if the user reached here without going through handleCheck
    // (i.e., pure-AI checkpoint where submitted was never set)
    if (!submittedRef.current) {
      awardCheckpointXP(1, timer.pct)
      submittedRef.current = true
    }
    if (finish) {
      dispatch(journeyActions.completeCheckpoint(checkpoint!.id))
      navigate(`/journey/${journey.id}/report`)
    } else {
      setTransitioning(true)
      setTimeout(() => {
        dispatch(journeyActions.completeCheckpoint(checkpoint!.id))
        dispatch(journeyActions.nextCheckpoint())
        setTransitioning(false)
      }, 350)
    }
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
          {/* Timed-out warning — auto-advance fires after 2.5s */}
          {timedOut && (
            <div className={styles.timerExpiredBanner}>
              ⏰ Время вышло — начислено 50% XP за выполненные задания. Переход к следующему чекпоинту…
            </div>
          )}

          <div className={styles.cpHeader}>
            <div className={styles.cpNum}>
              Чекпоинт {currentCheckpointIdx + 1} из {journey.checkpoints.length}
            </div>
            <h2 className={styles.cpTitle}>{checkpoint.concept}</h2>
            <div className={styles.cpExplanation}>{checkpoint.explanation}</div>
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
            {timedOut ? (
              /* Auto-advance is pending — block all manual navigation */
              null
            ) : !submitted ? (
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
  )
}
