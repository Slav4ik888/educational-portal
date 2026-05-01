import { FC, useState, useCallback } from 'react'
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
import { evaluateAnswer } from 'shared/lib/ai'
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

interface ActivityCardProps {
  activity         : JourneyActivity
  answer           : ActivityAnswer | undefined
  globalSubmitted  : boolean
  evalSubmitted    : Set<string>
  evaluatingSet    : Set<string>
  onAnswer         : (ans: ActivityAnswer) => void
  onSubmitForEval  : (activityId: string, value: string) => void
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
  )
}


export const JourneyPage: FC = () => {
  const navigate  = useNavigate()
  const dispatch  = useDispatch()
  const { current: journey, answers, progress } = useSelector((s: StateSchema) => s.journey)

  const [submitted, setSubmitted]         = useState(false)
  const [evalSubmitted, setEvalSubmitted] = useState<Set<string>>(new Set())
  const [evaluatingSet, setEvaluatingSet] = useState<Set<string>>(new Set())

  const handleSubmitForEval = useCallback(async (activityId: string, value: string) => {
    if (!journey) return
    const { currentCheckpointIdx } = progress
    const checkpoint = journey.checkpoints[currentCheckpointIdx]
    if (!checkpoint) return

    const rawActivity = checkpoint.activities.find(a => a.id === activityId)
    if (!rawActivity || !isAiEvaluated(rawActivity)) return
    const activity = rawActivity

    setEvalSubmitted(prev => new Set(prev).add(activityId))
    setEvaluatingSet(prev => new Set(prev).add(activityId))

    try {
      const reasoning  = activity.type === 'debug-the-logic' ? activity.reasoning   : undefined
      const exampleAns = activity.type === 'free-response'   ? activity.exampleAnswer : undefined
      const forbidden  = activity.type === 'teach-back'      ? activity.forbiddenTerms : undefined

      const result = await evaluateAnswer({
        concept            : checkpoint.concept,
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
        score    : result.score,
        feedback : result.feedback,
        strengths    : result.strengths ?? null,
        improvements : result.improvements ?? null,
      }))
    } catch {
      dispatch(journeyActions.setAiEvaluation({
        activityId,
        score    : 0,
        feedback : 'Не удалось оценить ответ. Ознакомьтесь с критериями оценки вручную.',
        strengths    : null,
        improvements : null,
      }))
    }

    setEvaluatingSet(prev => {
      const next = new Set(prev)
      next.delete(activityId)
      return next
    })
  }, [journey, progress, dispatch])

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

  const { currentCheckpointIdx, completedCheckpoints } = progress
  const checkpoint = journey.checkpoints[currentCheckpointIdx]
  const isLast     = currentCheckpointIdx === journey.checkpoints.length - 1
  const allDone    = completedCheckpoints.length === journey.checkpoints.length

  const nonAiActivities = checkpoint ? checkpoint.activities.filter(a => !AI_EVALUATED_TYPES.has(a.type)) : []
  const aiActivities    = checkpoint ? checkpoint.activities.filter(a =>  AI_EVALUATED_TYPES.has(a.type)) : []

  const nonAiAnswered  = nonAiActivities.filter(a =>
    answers[a.id]?.value !== undefined && answers[a.id]?.value !== ''
  ).length
  // AI activities are gated by actual Redux isEvaluated flag — not optimistic local state
  const aiAllEvaluated = aiActivities.every(a => answers[a.id]?.isEvaluated === true)

  const canCheck = nonAiActivities.length > 0
    ? nonAiAnswered === nonAiActivities.length && aiAllEvaluated
    : aiAllEvaluated

  const handleCheck = () => setSubmitted(true)

  const handleNext = () => {
    dispatch(journeyActions.completeCheckpoint(checkpoint.id))
    dispatch(journeyActions.nextCheckpoint())
    setSubmitted(false)
    setEvalSubmitted(new Set())
    setEvaluatingSet(new Set())
  }

  const handleFinish = () => {
    dispatch(journeyActions.completeCheckpoint(checkpoint.id))
    navigate(`/journey/${journey.id}/report`)
  }

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
            key       = {cp.id}
            className = {`${styles.progressDot}
              ${completedCheckpoints.includes(cp.id) ? styles.done : ''}
              ${i === currentCheckpointIdx && !completedCheckpoints.includes(cp.id) ? styles.current : ''}`}
          />
        ))}
      </div>

      {allDone ? (
        <div className={styles.checkpoint}>
          <div className={styles.completedMsg}>Путешествие завершено! 🎉</div>
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
              <ActivityCard
                key            = {activity.id}
                activity       = {activity}
                answer         = {answers[activity.id]}
                globalSubmitted= {submitted}
                evalSubmitted  = {evalSubmitted}
                evaluatingSet  = {evaluatingSet}
                onAnswer       = {ans => dispatch(journeyActions.setActivityAnswer(ans))}
                onSubmitForEval= {handleSubmitForEval}
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
