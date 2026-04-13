import { useState } from 'react';
import { MultipleChoiceQuestion, TestUserAnswer } from '../../types';
import { Explanation } from '../explanation';
import styles from './index.module.scss';



interface MultipleChoiceProps {
  question        : MultipleChoiceQuestion
  isSubmitted     : boolean
  isAnswerCorrect : boolean
  userAnswer?     : number[]
  showResult?     : boolean
  onAnswer        : (answer: TestUserAnswer) => void
}

export const MultipleChoice: React.FC<MultipleChoiceProps> = ({
  question,
  isSubmitted,
  isAnswerCorrect,
  userAnswer = [],
  showResult = false,
  onAnswer
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(userAnswer);

  const handleToggle = (index: number) => {
    if (isSubmitted) return

    let newSelected: number[];
    if (question.allowMultiple) {
      newSelected = selectedAnswers.includes(index)
        ? selectedAnswers.filter(i => i !== index)
        : [...selectedAnswers, index];
    }
    else {
      newSelected = [index];
    }

    setSelectedAnswers(newSelected);
    onAnswer({
      questionId : question.id,
      type       : 'multiple-choice',
      value      : newSelected
    });
  }

  const isCorrect = (index: number): boolean | null => {
    if (!showResult) return null
    const isSelected = selectedAnswers.includes(index)
    const shouldBeSelected = question.correctAnswers.includes(index)

    if (isSelected && shouldBeSelected) return true
    if (isSelected && !shouldBeSelected) return false
    return null
  }

  return (
    <div className={styles.multipleChoice}>
      <h3>{question.text}</h3>
      <p className={styles.points}>Баллов: {question.points}</p>

      <div className={styles.options}>
        {question.options.map((option, index) => {
          const correctness = isCorrect(index)
          return (
            // eslint-disable-next-line jsx-a11y/label-has-associated-control
            <label
              key       = {index}
              className = {`${styles.option} ${correctness === true ? styles.correct : ''} 
                         ${correctness === false ? styles.incorrect : ''}`}
            >
              <input
                type     = {question.allowMultiple ? 'checkbox' : 'radio'}
                checked  = {selectedAnswers.includes(index)}
                disabled = {isSubmitted}
                onChange = {() => handleToggle(index)}
              />
              <span>{option}</span>
            </label>
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
