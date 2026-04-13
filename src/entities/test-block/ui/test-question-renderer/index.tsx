import { TestQuestion, TestUserAnswer } from '../../types'
import { MultipleChoice } from '../multiple-choice'
import { TrueFalse } from '../true-false'
// import { FillBlank } from '../fill-blank'
import { MatchPairs } from '../match-pairs'
// import { OrderSteps } from '../order-steps'
import styles from './index.module.scss'
import { FillBlank } from '../fill-blank'
import { cn } from 'shared/lib/styles/class-names'
import { OrderSteps } from '../order-steps'


interface TestQuestionRendererProps {
  isSubmitted     : boolean
  isAnswerCorrect : boolean
  question        : TestQuestion
  userAnswer?     : TestUserAnswer
  showResult?     : boolean
  onAnswer        : (answer: TestUserAnswer) => void
}

// Визуальные индикаторы для разных типов
const TypeIcon: Record<TestQuestion['type'], string> = {
  'multiple-choice': '🔘',
  'true-false': '✓✗',
  'fill-blank': '___',
  'match-pairs': '🔗',
  'order-steps': '📊'
}

const TypeColor: Record<TestQuestion['type'], string> = {
  'multiple-choice': 'blue',
  'true-false': 'green',
  'fill-blank': 'orange',
  'match-pairs': 'purple',
  'order-steps': 'teal'
}


/** Визуальное различение через фабрику компонентов */
export const TestQuestionRenderer: React.FC<TestQuestionRendererProps> = ({
  question,
  userAnswer,
  showResult,
  isSubmitted,
  isAnswerCorrect,
  onAnswer
}) => {
  const renderQuestion = () => {
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
        return <div>Этот компонент теста ещё не отрисован</div>
    }
  }

  return (
    <div
      className={cn(styles.questionCard, {}, [
        styles[`type${TypeColor[question.type]}`],
        isSubmitted && ! isAnswerCorrect ? styles.wrongAnswer : ''
      ])}
    >
      <div className={styles.questionHeader}>
        <span className={styles.typeIcon}>{TypeIcon[question.type]}</span>
        <span className={styles.typeBadge}>{question.type}</span>
        <span className={styles.pointsBadge}>{question.points} баллов</span>
      </div>

      {renderQuestion()}

      {showResult && question.explanation && (
        <div className={styles.explanation}>{question.explanation}</div>
      )}
    </div>
  )
}
