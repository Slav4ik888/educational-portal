import { TrueFalseQuestion, TestUserAnswer } from '../../types'
import { Explanation } from '../explanation'
import styles from './index.module.scss'


interface TrueFalseProps {
  question        : TrueFalseQuestion
  isSubmitted     : boolean
  isAnswerCorrect : boolean
  userAnswer?     : boolean
  showResult?     : boolean
  disabled?       : boolean
  onAnswer        : (answer: TestUserAnswer) => void
}

export const TrueFalse: React.FC<TrueFalseProps> = ({
  question,
  userAnswer,
  isSubmitted,
  isAnswerCorrect,
  showResult = false,
  disabled = false,
  onAnswer
}) => {
  const handleAnswer = (value: boolean) => {
    if (disabled) return

    onAnswer({
      questionId: question.id,
      type: 'true-false',
      value
    })
  }

  // Фиксированные варианты ответа
  const options = [
    { value: true, label: '✅ Верно' },
    { value: false, label: '❌ Неверно' }
  ]

  return (
    <div className={styles.trueFalse}>
      <h3>{question.text}</h3>

      {question.points && (
        <p className={styles.points}>Баллов: {question.points}</p>
      )}

      <div className={styles.options}>
        {options.map(option => {
          const isSelected = userAnswer === option.value
          const isCorrect = showResult && option.value === question.correctAnswer
          const isWrong = showResult && isSelected && option.value !== question.correctAnswer

          return (
            <button
              key       = {option.value.toString()}
              type      = 'button'
              disabled  = {disabled}
              className = {`
                ${styles.optionBtn} 
                ${isSelected ? styles.selected : ''} 
                ${isCorrect ? styles.correct : ''} 
                ${isWrong ? styles.incorrect : ''}
              `}
              onClick   = {() => handleAnswer(option.value)}
            >
              {option.label}
            </button>
          )
        })}
      </div>

      <Explanation
        isAnswerCorrect = {isAnswerCorrect}
        question        = {question}
        isSubmitted     = {isSubmitted}
      />
      {/* {showResult && question.explanation && (
        <div className='explanation'>{question.explanation}</div>
      )} */}
    </div>
  )
}
