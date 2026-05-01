import React, { useState } from 'react'
import {
  TestQuestion,
  TestUserAnswer,
  TEST_AI_EVALUATED_TYPES,
  AiEvaluatedTestQuestion,
  AiTestUserAnswer,
  DebugTheLogicQuestion,
  TeachBackQuestion,
  FreeResponseQuestion,
} from '../../types'
import { MultipleChoice } from '../multiple-choice'
import { TrueFalse } from '../true-false'
import { MatchPairs } from '../match-pairs'
import { FillBlank } from '../fill-blank'
import { OrderSteps } from '../order-steps'
import styles from './index.module.scss'
import aiStyles from './ai-response.module.scss'
import { cn } from 'shared/lib/styles/class-names'
import { evaluateAnswer } from 'shared/lib/ai'

const MIN_AI_CHARS = 20

interface TestQuestionRendererProps {
  isSubmitted      : boolean
  isAnswerCorrect  : boolean
  question         : TestQuestion
  userAnswer?      : TestUserAnswer
  showResult?      : boolean
  /** Topic/concept context for AI evaluation (optional, improves quality) */
  topic?           : string
  onAnswer         : (answer: TestUserAnswer) => void
}

const TypeIcon: Record<string, string> = {
  'multiple-choice'      : '🔘',
  'true-false'           : '✓✗',
  'fill-blank'           : '___',
  'match-pairs'          : '🔗',
  'order-steps'          : '📊',
  'free-response'        : '📝',
  'explain-like-im-five' : '🧒',
  'teach-back'           : '🎓',
  'give-your-example'    : '💡',
  'debug-the-logic'      : '🔍',
}

const TypeColor: Record<string, string> = {
  'multiple-choice'      : 'blue',
  'true-false'           : 'green',
  'fill-blank'           : 'orange',
  'match-pairs'          : 'purple',
  'order-steps'          : 'teal',
  'free-response'        : 'purple',
  'explain-like-im-five' : 'blue',
  'teach-back'           : 'teal',
  'give-your-example'    : 'orange',
  'debug-the-logic'      : 'purple',
}

const AI_PLACEHOLDERS: Record<string, string> = {
  'free-response'        : 'Напишите развёрнутый ответ…',
  'explain-like-im-five' : 'Объясни просто, без специальных терминов…',
  'teach-back'           : 'Объясни своими словами, как объяснял бы другу…',
  'give-your-example'    : 'Опиши конкретный пример из жизни или практики…',
  'debug-the-logic'      : 'Укажи, где ошибка в рассуждении, и объясни почему…',
}

const AI_CONTEXT: Record<string, string> = {
  'explain-like-im-five' : 'Используй простые слова и аналогии — так, чтобы понял человек без знания темы.',
  'teach-back'           : 'Объясни как другу. Избегай технических терминов без пояснений.',
  'give-your-example'    : 'Приведи конкретный, реальный пример — не абстрактное описание.',
  'debug-the-logic'      : 'Найди, что именно неверно в рассуждении и почему.',
}

/** Компонент для AI-оцениваемых вопросов */
const AiResponseQuestion: React.FC<{
  question     : AiEvaluatedTestQuestion
  userAnswer?  : AiTestUserAnswer
  isSubmitted  : boolean
  topic?       : string
  onAnswer     : (answer: AiTestUserAnswer) => void
}> = ({ question, userAnswer, isSubmitted, topic, onAnswer }) => {
  const [evaluating, setEvaluating] = useState(false)

  const aiAns = userAnswer
  const text   = aiAns?.value ?? ''
  const score  = aiAns?.aiScore
  const evaluated = aiAns?.isEvaluated ?? false

  const scoreClass =
    score == null ? ''          :
    score >= 80   ? aiStyles.high   :
    score >= 50   ? aiStyles.medium :
                    aiStyles.low

  const handleEval = async (value: string) => {
    if (!value.trim() || evaluating) return
    setEvaluating(true)

    // Optimistically record the text answer
    onAnswer({ questionId: question.id, type: question.type, value })

    try {
      const reasoning      = question.type === 'debug-the-logic'
        ? (question as DebugTheLogicQuestion).reasoning
        : undefined
      const forbiddenTerms = question.type === 'teach-back'
        ? (question as TeachBackQuestion).forbiddenTerms
        : undefined
      const exampleAnswer  = question.type === 'free-response'
        ? (question as FreeResponseQuestion).exampleAnswer
        : undefined

      const result = await evaluateAnswer({
        concept            : topic ?? question.text,
        activityType       : question.type as import('entities/journey').ActivityType,
        question           : question.text,
        reasoning,
        exampleAnswer,
        evaluationCriteria : (question as FreeResponseQuestion).evaluationCriteria,
        userAnswer         : value,
        forbiddenTerms,
      })

      onAnswer({
        questionId    : question.id,
        type          : question.type,
        value,
        aiScore       : result.score,
        aiFeedback    : result.feedback,
        aiStrengths   : result.strengths,
        aiImprovements: result.improvements,
        isEvaluated   : true,
      })
    } catch {
      onAnswer({
        questionId   : question.id,
        type         : question.type,
        value,
        aiScore      : 0,
        aiFeedback   : 'Не удалось оценить ответ. Проверьте подключение.',
        isEvaluated  : true,
      })
    }

    setEvaluating(false)
  }

  const contextHint = AI_CONTEXT[question.type]
  const placeholder = AI_PLACEHOLDERS[question.type] ?? 'Напишите ответ…'

  return (
    <div className={aiStyles.container}>
      {question.type === 'debug-the-logic' && (
        <div className={aiStyles.reasoningCard}>
          <div className={aiStyles.reasoningLabel}>🔍 Найди ошибку:</div>
          <blockquote className={aiStyles.reasoningText}>
            {(question as DebugTheLogicQuestion).reasoning}
          </blockquote>
        </div>
      )}

      {contextHint && question.type !== 'debug-the-logic' && (
        <div className={aiStyles.contextHint}>💬 {contextHint}</div>
      )}

      <div className={`${aiStyles.textareaWrap} ${isSubmitted ? aiStyles.locked : ''}`}>
        <textarea
          className   = {aiStyles.textarea}
          disabled    = {isSubmitted}
          placeholder = {placeholder}
          value       = {text}
          maxLength   = {1000}
          rows        = {4}
          onChange    = {e => onAnswer({
            questionId : question.id,
            type       : question.type,
            value      : e.target.value,
          })}
        />
        <span className={`${aiStyles.charCount} ${text.length < MIN_AI_CHARS ? aiStyles.tooShort : ''}`}>
          {text.length}/1000
        </span>
      </div>

      {!isSubmitted && (
        <button
          className = {aiStyles.submitBtn}
          disabled  = {text.length < MIN_AI_CHARS || evaluating}
          onClick   = {() => handleEval(text)}
        >
          {evaluating ? 'Оценивается…' : 'Отправить на AI-проверку →'}
        </button>
      )}

      {isSubmitted && !evaluated && !evaluating && (
        <button className={aiStyles.evalBtn} onClick={() => handleEval(text)}>
          ✨ Проверить с AI
        </button>
      )}

      {evaluating && (
        <div className={aiStyles.skeleton}>
          <div className={aiStyles.skeletonLine} />
          <div className={aiStyles.skeletonLine} style={{ width: '70%' }} />
          <p className={aiStyles.evalText}>AI анализирует ответ…</p>
        </div>
      )}

      {evaluated && score != null && (
        <div className={`${aiStyles.feedbackBox} ${scoreClass}`}>
          <div className={aiStyles.scoreRow}>
            <span className={aiStyles.scoreLabel}>AI оценка</span>
            <span className={`${aiStyles.scoreBadge} ${scoreClass}`}>{score}/100</span>
          </div>
          {aiAns?.aiFeedback     && <p className={aiStyles.feedbackText}>{aiAns.aiFeedback}</p>}
          {aiAns?.aiStrengths    && <div className={aiStyles.section}><span>✅</span><span>{aiAns.aiStrengths}</span></div>}
          {aiAns?.aiImprovements && <div className={aiStyles.section}><span>💡</span><span>{aiAns.aiImprovements}</span></div>}
        </div>
      )}
    </div>
  )
}


/** Визуальный диспетчер вопросов */
export const TestQuestionRenderer: React.FC<TestQuestionRendererProps> = ({
  question,
  userAnswer,
  showResult,
  isSubmitted,
  isAnswerCorrect,
  topic,
  onAnswer
}) => {
  const isAiType = TEST_AI_EVALUATED_TYPES.has(question.type)
  const colorKey = TypeColor[question.type] ?? 'blue'

  const renderQuestion = () => {
    if (isAiType) {
      return (
        <AiResponseQuestion
          question    = {question as AiEvaluatedTestQuestion}
          userAnswer  = {userAnswer as AiTestUserAnswer | undefined}
          isSubmitted = {isSubmitted}
          topic       = {topic}
          onAnswer    = {answer => onAnswer(answer as TestUserAnswer)}
        />
      )
    }

    switch (question.type) {
      case 'multiple-choice':
        return (
          <MultipleChoice
            question        = {question}
            userAnswer      = {userAnswer?.type === 'multiple-choice' ? userAnswer.value : undefined}
            isSubmitted     = {isSubmitted}
            isAnswerCorrect = {isAnswerCorrect}
            showResult      = {showResult}
            onAnswer        = {onAnswer}
          />
        )

      case 'true-false':
        return (
          <TrueFalse
            question        = {question}
            userAnswer      = {userAnswer?.type === 'true-false' ? userAnswer.value : undefined}
            isSubmitted     = {isSubmitted}
            isAnswerCorrect = {isAnswerCorrect}
            showResult      = {showResult}
            onAnswer        = {onAnswer}
          />
        )

      case 'fill-blank':
        return (
          <FillBlank
            question        = {question}
            userAnswer      = {userAnswer?.type === 'fill-blank' ? userAnswer.value : undefined}
            isSubmitted     = {isSubmitted}
            isAnswerCorrect = {isAnswerCorrect}
            showResult      = {showResult}
            onAnswer        = {onAnswer}
          />
        )

      case 'match-pairs':
        return (
          <MatchPairs
            question        = {question}
            userAnswer      = {userAnswer?.type === 'match-pairs' ? userAnswer.value : {}}
            isSubmitted     = {isSubmitted}
            isAnswerCorrect = {isAnswerCorrect}
            showResult      = {isSubmitted}
            onAnswer        = {onAnswer}
          />
        )

      case 'order-steps':
        return (
          <OrderSteps
            question        = {question}
            userAnswer      = {userAnswer?.type === 'order-steps' ? userAnswer.value : undefined}
            isSubmitted     = {isSubmitted}
            isAnswerCorrect = {isAnswerCorrect}
            showResult      = {isSubmitted}
            onAnswer        = {onAnswer}
          />
        )

      default:
        return <div>Этот тип вопроса не поддерживается</div>
    }
  }

  return (
    <div
      className={cn(styles.questionCard, {}, [
        styles[`type${colorKey}`],
        isSubmitted && !isAnswerCorrect && !isAiType ? styles.wrongAnswer : ''
      ])}
    >
      <div className={styles.questionHeader}>
        <span className={styles.typeIcon}>{TypeIcon[question.type]}</span>
        <span className={styles.typeBadge}>{question.type}</span>
        <span className={styles.pointsBadge}>{question.points} баллов</span>
      </div>

      {renderQuestion()}

      {showResult && question.explanation && !isAiType && (
        <div className={styles.explanation}>{question.explanation}</div>
      )}
    </div>
  )
}
