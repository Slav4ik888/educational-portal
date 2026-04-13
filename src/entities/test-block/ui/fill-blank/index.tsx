import { FC, useState, useRef, useEffect } from 'react'
import { FillBlankQuestion, TestUserAnswer } from '../../types'
import styles from './index.module.scss'
import { Explanation } from '../explanation'



interface FillBlankProps {
  question        : FillBlankQuestion
  isSubmitted     : boolean
  isAnswerCorrect : boolean
  userAnswer?     : Record<string, string>
  showResult?     : boolean
  onAnswer        : (answer: TestUserAnswer) => void
}

export const FillBlank: FC<FillBlankProps> = ({
  question, isSubmitted, isAnswerCorrect, userAnswer,
  onAnswer,
  showResult = false,
}) => {
  const [answers, setAnswers] = useState<Record<string, string>>(userAnswer || {})
  const [focusedBlank, setFocusedBlank] = useState<string | null>(null)
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  // Инициализация ответов из props
  useEffect(() => {
    if (userAnswer) {
      setAnswers(userAnswer)
    }
  }, [userAnswer])

  const handleAnswerChange = (blankId: string, value: string) => {
    if (isSubmitted) return

    const newAnswers = { ...answers, [blankId]: value }
    setAnswers(newAnswers)

    onAnswer({
      questionId: question.id,
      type: 'fill-blank',
      value: newAnswers
    })
  }

  const isBlankCorrect = (blankId: string): boolean | null => {
    if (!showResult) return null

    const blank = question.blanks.find(b => b.id === blankId)
    if (!blank) return false

    const userValue = answers[blankId]
    if (!userValue) return false

    const normalizedUser = normalizeString(userValue)
    const normalizedCorrect = normalizeString(blank.correctAnswer)

    if (normalizedUser === normalizedCorrect) return true

    if (blank.alternatives) {
      return blank.alternatives.some(alt => normalizeString(alt) === normalizedUser)
    }

    return false
  }

  const normalizeString = (str: string): string => {
    let normalized = str.trim()

    if (!question.caseSensitive) {
      normalized = normalized.toLowerCase()
    }

    return normalized
  }

  const renderTextWithBlanks = () => {
    const parts: React.ReactNode[] = [];
    let blankCounter = 0;

    // Разбиваем текст по маркерам пропусков (___)
    const segments = question.textWithBlanks.split(/(___)/g);

    segments.forEach((segment, idx) => {
      if (segment === '___') {
        const blank = question.blanks[blankCounter];
        if (blank) {
          const isCorrect = isBlankCorrect(blank.id);
          const currentAnswer = answers[blank.id] || '';
          const isFocused = focusedBlank === blank.id;

          parts.push(
            <span key={`blank-wrapper-${idx}`} className={styles.blankWrapper}>
              <input
                ref          = {el => { inputRefs.current[blank.id] = el }}
                type         = 'text'
                value        = {currentAnswer}
                onChange     = {(e) => handleAnswerChange(blank.id, e.target.value)}
                onFocus      = {() => setFocusedBlank(blank.id)}
                onBlur       = {() => setFocusedBlank(null)}
                disabled     = {isSubmitted}
                placeholder  = '______'
                autoComplete = 'off'
                className    = {`
                  ${styles.blankInput}
                  ${isCorrect === true ? styles.correct : ''}
                  ${isCorrect === false ? styles.incorrect : ''}
                  ${isFocused ? styles.focused : ''}
                  ${isSubmitted ? styles.disabled : ''}
                `}
              />
              {showResult && isCorrect === true && (
                <span className={styles.checkmark}>✓</span>
              )}
              {showResult && isCorrect === false && currentAnswer && (
                <span className={styles.crossmark}>✗</span>
              )}
            </span>
          )
          blankCounter++;
        }
        else {
          parts.push(<span key={`blank-${idx}`} className={styles.missingBlank}>___</span>)
        }
      }
      else {
        // Обычный текст, разбиваем на слова для лучшей типографики
        const textParts = segment.split(/(\s+)/);
        textParts.forEach((part, partIdx) => {
          if (part.trim()) {
            parts.push(
              <span key={`text-${idx}-${partIdx}`} className={styles.textSegment}>
                {part}
              </span>
            )
          }
          else {
            parts.push(<span key={`space-${idx}-${partIdx}`}> </span>)
          }
        })
      }
    })

    return parts
  }

  const getScoreInfo = () => {
    if (!showResult) return null

    let correctCount = 0;
    question.blanks.forEach(blank => {
      if (isBlankCorrect(blank.id) === true) correctCount++;
    })

    const score = (correctCount / question.blanks.length) * question.points;

    return { correctCount, total: question.blanks.length, score }
  }

  const scoreInfo = getScoreInfo();

  return (
    <div className={styles.fillBlank}>
      <h3>{question.text}</h3>

      {question.points && (
        <p className={styles.points}>Баллов: {question.points}</p>
      )}

      <div className={styles.textContainer}>
        {renderTextWithBlanks()}
      </div>

      {showResult && scoreInfo && (
        <div className={styles.resultInfo}>
          <div className={styles.scoreBadge}>
            <span className={styles.scoreValue}>
              {Math.round(scoreInfo.score)} / {question.points}
            </span>
            <span className={styles.scoreLabel}>баллов</span>
          </div>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${(scoreInfo.correctCount / scoreInfo.total) * 100}%` }}
            />
          </div>
          <p className={styles.scoreText}>
            Правильно заполнено: {scoreInfo.correctCount} из {scoreInfo.total}
          </p>
        </div>
      )}

      {/* {showResult && question.explanation && (
        <div className={styles.explanation}>
          <span className={styles.explanationIcon}>💡</span>
          <span className={styles.explanationText}>{question.explanation}</span>
        </div>
      )} */}

      {! isAnswerCorrect && ! isSubmitted && (
        <div className={styles.hint}>
          <span className={styles.hintIcon}>✏️</span>
          <span className={styles.hintText}>Введите ответы в поля выше</span>
        </div>
      )}
      <Explanation
        isAnswerCorrect = {isAnswerCorrect}
        question        = {question}
        isSubmitted     = {isSubmitted}
      />
    </div>
  )
}
