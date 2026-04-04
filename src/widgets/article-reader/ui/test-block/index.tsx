import { FC, useState } from 'react';
import { TestQuestionType } from 'entities/test-block';
import styles from './test-block.module.scss';



interface TestBlockProps {
  questions: TestQuestionType[];
  onComplete: (score: number, total: number) => void;
}

export const TestBlock: FC<TestBlockProps> = ({ questions, onComplete }) => {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswer = (questionId: string, answerIndex: number) => {
    if (!isSubmitted) {
      setAnswers(prev => ({ ...prev, [questionId]: answerIndex }));
    }
  };

  const handleSubmit = () => {
    let correctCount = 0;
    questions.forEach(question => {
      if (answers[question.id] === question.correctAnswer) {
        correctCount++;
      }
    });

    setScore(correctCount);
    setIsSubmitted(true);
    onComplete(correctCount, questions.length);
  };

  const handleReset = () => {
    setAnswers({});
    setIsSubmitted(false);
    setScore(0);
  };

  const allQuestionsAnswered = questions.every(q => answers[q.id] !== undefined);

  return (
    <div className={styles.quizBlock}>
      <div className={styles.questions}>
        {questions.map((question, index) => (
          <div key={question.id} className={styles.questionCard}>
            <h4 className={styles.questionText}>
              Вопрос {index + 1}: {question.text}
            </h4>
            <div className={styles.options}>
              {question.options.map((option, optIndex) => (
                // eslint-disable-next-line jsx-a11y/label-has-associated-control
                <label
                  key={optIndex}
                  className={`${styles.option} 
                    ${isSubmitted && optIndex === question.correctAnswer ? styles.correct : ''}
                    ${isSubmitted && answers[question.id] === optIndex && optIndex !== question.correctAnswer
                      ? styles.incorrect : ''}
                    ${answers[question.id] === optIndex ? styles.selected : ''}
                  `}
                >
                  <input
                    type='radio'
                    name={question.id}
                    value={optIndex}
                    checked={answers[question.id] === optIndex}
                    onChange={() => handleAnswer(question.id, optIndex)}
                    disabled={isSubmitted}
                  />
                  <span>{option}</span>
                  {isSubmitted && optIndex === question.correctAnswer && (
                    <span className={styles.checkmark}>✓</span>
                  )}
                  {isSubmitted && answers[question.id] === optIndex && optIndex !== question.correctAnswer && (
                    <span className={styles.crossmark}>✗</span>
                  )}
                </label>
              ))}
            </div>

            {isSubmitted && answers[question.id] !== undefined && (
              <div className={styles.feedback}>
                {answers[question.id] === question.correctAnswer ? (
                  <span className={styles.correctFeedback}>✅ Правильно!</span>
                ) : (
                  <span className={styles.incorrectFeedback}>
                    ❌ Неправильно. Правильный ответ: {question.options[question.correctAnswer]}
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {!isSubmitted ? (
        <button
          type      = 'button'
          className = {styles.submitButton}
          disabled  = {!allQuestionsAnswered}
          onClick   = {handleSubmit}
        >
          Проверить ответы
        </button>
      ) : (
        <div className={styles.results}>
          <div className={styles.scoreCard}>
            <span className={styles.scoreValue}>{score}</span>
            <span className={styles.scoreTotal}>/{questions.length}</span>
            <span className={styles.scoreLabel}>правильных ответов</span>
          </div>
          <div className={styles.percentage}>
            {Math.round((score / questions.length) * 100)}%
          </div>
          <button
            type      = 'button'
            className = {styles.resetButton}
            onClick   = {handleReset}
          >
            Пройти заново
          </button>
        </div>
      )}
    </div>
  );
};
