import { FC, useState, useEffect } from 'react';
import { TestQuestionType } from '../../types';
import styles from './test-block.module.scss';



interface TestBlockProps {
  questions   : TestQuestionType[]
  isCompleted : boolean
  savedScore? : number
  onComplete  : (score: number) => void
}

export const TestBlock: FC<TestBlockProps> = ({ questions, isCompleted, savedScore, onComplete }) => {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(isCompleted);
  const [score, setScore] = useState<number | null>(savedScore || null);

  // Восстанавливаем сохраненные ответы
  useEffect(() => {
    if (savedScore !== undefined && isCompleted) {
      setSubmitted(true);
      setScore(savedScore);
    }
  }, [savedScore, isCompleted]);

  const handleAnswerChange = (questionId: string, answerIndex: number) => {
    if (!submitted) {
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

    const calculatedScore = (correctCount / questions.length) * 100;
    setScore(calculatedScore);
    setSubmitted(true);
    onComplete(calculatedScore);
  };

  if (submitted && score !== null) {
    const isPassed = score >= 70;

    return (
      <div className={styles.testResult}>
        <div className={`${styles.resultIcon} ${isPassed ? styles.passed : styles.failed}`}>
          {isPassed ? '🎉' : '📚'}
        </div>
        <h4>Результат теста: {score.toFixed(0)}%</h4>
        <p>
          {isPassed
            ? 'Отлично! Вы успешно прошли тест.'
            : 'Рекомендуем повторить материал и попробовать снова.'}
        </p>
        {!isPassed && (
          <button
            type='button'
            className={styles.retryButton}
            onClick={() => {
              setAnswers({});
              setSubmitted(false);
              setScore(null);
            }}
          >
            Пройти заново
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={styles.testBlock}>
      <div className={styles.questionsList}>
        {questions.map((question, index) => (
          <div key={question.id} className={styles.question}>
            <div className={styles.questionText}>
              {index + 1}. {question.text}
            </div>
            <div className={styles.options}>
              {question.options.map((option, optIndex) => (
                // eslint-disable-next-line jsx-a11y/label-has-associated-control
                <label key={optIndex} className={styles.option}>
                  <input
                    type     = 'radio'
                    name     = {`question-${question.id}`}
                    value    = {optIndex}
                    checked  = {answers[question.id] === optIndex}
                    onChange = {() => handleAnswerChange(question.id, optIndex)}
                    disabled = {submitted}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        type      = 'button'
        className = {styles.submitButton}
        onClick   = {handleSubmit}
        disabled  = {Object.keys(answers).length !== questions.length}
      >
        Проверить тест
      </button>
    </div>
  );
};
