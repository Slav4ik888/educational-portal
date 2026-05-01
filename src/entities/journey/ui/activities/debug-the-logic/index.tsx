import { FC, useState } from 'react'
import { ActivityAnswer, DebugTheLogicActivity } from '../../../types'
import styles from './index.module.scss'

const MIN_CHARS = 15
const MAX_CHARS = 600

interface Props {
  activity       : DebugTheLogicActivity
  answer         : ActivityAnswer | undefined
  submitted      : boolean
  isEvaluating   : boolean
  onTextChange   : (value: string) => void
  onSubmitForEval: (value: string) => void
}

export const DebugTheLogicComponent: FC<Props> = ({
  activity,
  answer,
  submitted,
  isEvaluating,
  onTextChange,
  onSubmitForEval,
}) => {
  const [focused, setFocused] = useState(false)
  const text      = typeof answer?.value === 'string' ? answer.value : ''
  const charCount = text.length
  const canSubmit = charCount >= MIN_CHARS && !submitted

  const score        = answer?.aiScore ?? null
  const feedback     = answer?.aiFeedback ?? null
  const strengths    = answer?.aiStrengths ?? null
  const improvements = answer?.aiImprovements ?? null
  const evaluated    = answer?.isEvaluated ?? false

  const scoreClass =
    score === null   ? ''            :
    score >= 80      ? styles.high   :
    score >= 50      ? styles.medium :
                       styles.low

  return (
    <div className={styles.container}>
      <div className={styles.reasoningCard}>
        <div className={styles.reasoningLabel}>
          <span>🔍</span>
          Найди логическую ошибку в рассуждении:
        </div>
        <blockquote className={styles.reasoningText}>
          {activity.reasoning}
        </blockquote>
      </div>

      <div className={styles.inputLabel}>
        Опиши ошибку: что именно неверно и почему?
      </div>

      <div className={`${styles.textareaWrap} ${focused ? styles.focused : ''} ${submitted ? styles.locked : ''}`}>
        <textarea
          className   = {styles.textarea}
          disabled    = {submitted}
          placeholder = "Укажи, где в рассуждении ошибка, и объясни почему это неверно..."
          value       = {text}
          maxLength   = {MAX_CHARS}
          rows        = {4}
          onFocus     = {() => setFocused(true)}
          onBlur      = {() => setFocused(false)}
          onChange    = {e => onTextChange(e.target.value)}
        />
        <div className={`${styles.charCounter} ${charCount < MIN_CHARS ? styles.tooShort : ''}`}>
          {charCount} / {MAX_CHARS}
          {charCount < MIN_CHARS && !submitted && (
            <span className={styles.minNote}> (мин. {MIN_CHARS})</span>
          )}
        </div>
      </div>

      {!submitted && (
        <button
          className = {styles.submitBtn}
          disabled  = {!canSubmit}
          onClick   = {() => onSubmitForEval(text)}
        >
          Проверить с AI →
        </button>
      )}

      {submitted && !evaluated && !isEvaluating && (
        <button
          className = {styles.evalBtn}
          onClick   = {() => onSubmitForEval(text)}
        >
          ✨ Проверить с AI
        </button>
      )}

      {isEvaluating && (
        <div className={styles.skeleton}>
          <div className={styles.skeletonLine} />
          <div className={styles.skeletonLine} style={{ width: '65%' }} />
          <div className={styles.skeletonLine} style={{ width: '80%' }} />
          <p className={styles.evaluatingText}>AI проверяет анализ…</p>
        </div>
      )}

      {evaluated && score !== null && (
        <div className={`${styles.feedbackBox} ${scoreClass}`}>
          <div className={styles.scoreRow}>
            <span className={styles.scoreLabel}>Точность анализа</span>
            <span className={`${styles.scoreBadge} ${scoreClass}`}>{score} / 100</span>
          </div>

          {feedback && (
            <p className={styles.feedbackText}>{feedback}</p>
          )}

          {strengths && (
            <div className={styles.feedbackSection}>
              <span>✅</span>
              <span>{strengths}</span>
            </div>
          )}

          {improvements && (
            <div className={styles.feedbackSection}>
              <span>💡</span>
              <span>{improvements}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
