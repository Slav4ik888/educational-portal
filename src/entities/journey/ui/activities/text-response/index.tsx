import { FC, useState } from 'react'
import { ActivityAnswer, ActivityType } from '../../../types'
import styles from './index.module.scss'

const MIN_CHARS = 20
const MAX_CHARS = 1000

interface Props {
  activityId         : string
  type               : ActivityType
  placeholder        : string
  contextHint?       : string
  answer             : ActivityAnswer | undefined
  submitted          : boolean
  isEvaluating       : boolean
  onTextChange       : (value: string) => void
  onSubmitForEval    : (value: string) => void
}

export const TextResponseActivity: FC<Props> = ({
  activityId,
  type,
  placeholder,
  contextHint,
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
      {contextHint && (
        <div className={styles.contextHint}>
          <span className={styles.contextIcon}>💬</span>
          {contextHint}
        </div>
      )}

      <div className={`${styles.textareaWrap} ${focused ? styles.focused : ''} ${submitted ? styles.locked : ''}`}>
        <textarea
          className  = {styles.textarea}
          disabled   = {submitted}
          placeholder= {placeholder}
          value      = {text}
          maxLength  = {MAX_CHARS}
          rows       = {5}
          onFocus    = {() => setFocused(true)}
          onBlur     = {() => setFocused(false)}
          onChange   = {e => onTextChange(e.target.value)}
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
          className  = {styles.submitBtn}
          disabled   = {!canSubmit}
          onClick    = {() => onSubmitForEval(text)}
        >
          Отправить на проверку →
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
          <div className={styles.skeletonLine} style={{ width: '70%' }} />
          <div className={styles.skeletonLine} style={{ width: '85%' }} />
          <p className={styles.evaluatingText}>AI анализирует ответ…</p>
        </div>
      )}

      {evaluated && score !== null && (
        <div className={`${styles.feedbackBox} ${scoreClass}`}>
          <div className={styles.scoreRow}>
            <span className={styles.scoreLabel}>AI оценка</span>
            <span className={`${styles.scoreBadge} ${scoreClass}`}>{score} / 100</span>
          </div>

          {feedback && (
            <p className={styles.feedbackText}>{feedback}</p>
          )}

          {strengths && (
            <div className={styles.feedbackSection}>
              <span className={styles.sectionIcon}>✅</span>
              <span>{strengths}</span>
            </div>
          )}

          {improvements && (
            <div className={styles.feedbackSection}>
              <span className={styles.sectionIcon}>💡</span>
              <span>{improvements}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
