import { FC } from 'react'
import {
  JourneyActivity,
  ActivityAnswer,
  AI_EVALUATED_TYPES,
} from '../../types'
import { TextResponseActivity } from '../activities/text-response'
import { DebugTheLogicComponent } from '../activities/debug-the-logic'
import styles from './index.module.scss'

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

const TEXT_RESPONSE_PLACEHOLDER: Record<string, string> = {
  'free-response'        : 'Напишите развёрнутый ответ…',
  'explain-like-im-five' : 'Объясни это простыми словами, без специальных терминов…',
  'teach-back'           : 'Как бы ты объяснил это другу? Пиши, как будто объясняешь в разговоре…',
  'give-your-example'    : 'Опиши конкретную ситуацию или пример из реальной жизни…',
}

const TEXT_RESPONSE_CONTEXT: Record<string, string | undefined> = {
  'explain-like-im-five' : 'Представь, что объясняешь это ребёнку или человеку, который ничего не знает о теме. Используй простые слова и аналогии.',
  'teach-back'           : 'Попробуй объяснить концепцию своими словами, как другу. Избегай технических терминов — проверь своё понимание.',
  'give-your-example'    : 'Придумай и опиши конкретный пример из жизни или практики, который иллюстрирует эту идею.',
  'free-response'        : undefined,
}

interface Props {
  activity       : JourneyActivity
  answer         : ActivityAnswer | undefined
  submitted      : boolean
  isEvaluating   : boolean
  onAnswer       : (value: ActivityAnswer['value']) => void
  onSubmitForEval: (value: string) => void
}

export const ActivityRenderer: FC<Props> = ({
  activity,
  answer,
  submitted,
  isEvaluating,
  onAnswer,
  onSubmitForEval,
}) => {
  const isAiType = AI_EVALUATED_TYPES.has(activity.type)

  const renderBody = () => {
    if (activity.type === 'debug-the-logic') {
      return (
        <DebugTheLogicComponent
          activity       = {activity}
          answer         = {answer}
          submitted      = {submitted}
          isEvaluating   = {isEvaluating}
          onTextChange   = {v => onAnswer(v)}
          onSubmitForEval= {onSubmitForEval}
        />
      )
    }

    if (isAiType) {
      return (
        <TextResponseActivity
          activityId     = {activity.id}
          type           = {activity.type}
          placeholder    = {TEXT_RESPONSE_PLACEHOLDER[activity.type] ?? 'Напишите ответ…'}
          contextHint    = {TEXT_RESPONSE_CONTEXT[activity.type]}
          answer         = {answer}
          submitted      = {submitted}
          isEvaluating   = {isEvaluating}
          onTextChange   = {v => onAnswer(v)}
          onSubmitForEval= {onSubmitForEval}
        />
      )
    }

    if (activity.type === 'multiple-choice') {
      const selected = (answer?.value as number[] | undefined) ?? []
      return (
        <div className={styles.options}>
          {activity.options.map((opt, i) => {
            const sel   = selected.includes(i)
            const corr  = submitted && activity.correctAnswers.includes(i)
            const wrong = submitted && sel && !activity.correctAnswers.includes(i)
            return (
              <button
                key      = {i}
                disabled = {submitted}
                className= {`${styles.option} ${sel ? styles.selected : ''} ${corr ? styles.correct : ''} ${wrong ? styles.wrong : ''}`}
                onClick  = {() => {
                  if (activity.allowMultiple) {
                    const next = selected.includes(i)
                      ? selected.filter(x => x !== i)
                      : [...selected, i]
                    onAnswer(next)
                  } else {
                    onAnswer([i])
                  }
                }}
              >
                {opt}
              </button>
            )
          })}
          {submitted && (() => {
            const isCorrect =
              selected.length === activity.correctAnswers.length &&
              activity.correctAnswers.every(c => selected.includes(c))
            return (
              <div className={`${styles.feedback} ${isCorrect ? styles.correct : styles.wrong}`}>
                {isCorrect ? '✓ Верно!' : `✗ Неверно — ${activity.explanation ?? ''}`}
              </div>
            )
          })()}
        </div>
      )
    }

    if (activity.type === 'true-false') {
      return (
        <div className={styles.tfOptions}>
          {([true, false] as boolean[]).map(val => {
            const sel   = answer?.value === val
            const corr  = submitted && activity.correctAnswer === val
            const wrong = submitted && sel && activity.correctAnswer !== val
            return (
              <button
                key      = {String(val)}
                disabled = {submitted}
                className= {`${styles.tfBtn} ${sel ? styles.selected : ''} ${corr ? styles.correct : ''} ${wrong ? styles.wrong : ''}`}
                onClick  = {() => onAnswer(val)}
              >
                {val ? 'Верно' : 'Неверно'}
              </button>
            )
          })}
          {submitted && (
            <div className={`${styles.feedback} ${answer?.value === activity.correctAnswer ? styles.correct : styles.wrong}`}>
              {answer?.value === activity.correctAnswer ? '✓ Верно!' : `✗ Неверно — ${activity.explanation}`}
            </div>
          )}
        </div>
      )
    }

    if (activity.type === 'fill-blank') {
      const vals = (answer?.value as Record<string, string> | undefined) ?? {}
      return (
        <>
          <p className={styles.blankText}>{activity.textWithBlanks}</p>
          <div className={styles.blankInputs}>
            {activity.blanks.map(blank => {
              const v = vals[blank.id] ?? ''
              const corr = submitted && (() => {
                const norm = activity.caseSensitive
                  ? (s: string) => s
                  : (s: string) => s.toLowerCase()
                return norm(v) === norm(blank.correctAnswer) ||
                  (blank.alternatives ?? []).some(a => norm(v) === norm(a))
              })()
              return (
                <input
                  key      = {blank.id}
                  disabled = {submitted}
                  className= {`${styles.blankInput} ${submitted ? (corr ? styles.correct : styles.wrong) : ''}`}
                  value    = {v}
                  placeholder="..."
                  onChange = {e => onAnswer({ ...vals, [blank.id]: e.target.value })}
                />
              )
            })}
          </div>
          {submitted && (() => {
            const norm = activity.caseSensitive
              ? (s: string) => s
              : (s: string) => s.toLowerCase()
            const isCorrect = activity.blanks.every(b => {
              const v = vals[b.id] ?? ''
              return norm(v) === norm(b.correctAnswer) ||
                (b.alternatives ?? []).some(a => norm(v) === norm(a))
            })
            return (
              <div className={`${styles.feedback} ${isCorrect ? styles.correct : styles.wrong}`}>
                {isCorrect ? '✓ Верно!' : '✗ Есть ошибки в пропусках'}
              </div>
            )
          })()}
        </>
      )
    }

    return null
  }

  return <div className={styles.activityBody}>{renderBody()}</div>
}
