import { FC, useEffect, useState } from 'react';
import { TestQuestionType } from '../../types';
import { TestBox } from '../test-box';
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
  const [retry, setRetry] = useState<boolean>(false);

  // Восстанавливаем сохраненные ответы
  useEffect(() => {
    if (savedScore !== undefined && isCompleted) {
      setSubmitted(true);
      setScore(savedScore);
    }
  }, [savedScore, isCompleted]);

  const handleAnswerChange = (questionId: string, answerIndex: number) => {
    if (! submitted) {
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
    setRetry(false);
  };

  const handleRetry = () => {
    setSubmitted(false);
    // setScore(null);
    setRetry(true);
  };

  // Определяем, есть ли неверные ответы
  const hasWrongAnswers = submitted && score !== null && score < 100;

  const isPassed = score ? score >= 70 : false;

  return (
    <div className={styles.testBlock}>
      {submitted && score !== null && (
        <div className={styles.testResult}>
          <div className={`${styles.resultIcon} ${isPassed ? styles.passed : styles.failed}`}>
            {isPassed ? '🎉' : '📚'}
          </div>
          <h4>Результат теста: {score.toFixed(0)}%</h4>
          <p>
            {isPassed
              ? 'Отлично! Вы успешно прошли тест.'
              : 'Некоторые ответы неверные. Нажмите "Пройти заново", чтобы исправить ошибки.'}
          </p>
        </div>
      )}

      {
        ! isPassed && (
          <div className={styles.questionsList}>
            {questions.map((question, index) => (
              <div
                key={question.id}
                className={styles.question}
              >
                <div className={styles.questionText}>
                  {index + 1}. {question.text}
                </div>
                <TestBox
                  isRetry            = {retry}
                  isSubmitted        = {submitted}
                  question           = {question}
                  initialAnswerIndex = {answers[question.id]}
                  onAnswerChange     = {handleAnswerChange}
                />
              </div>
            ))}
          </div>
        )
      }

      {/* Если уже был submit, показываем кнопку для повторной попытки */}
      {submitted && hasWrongAnswers && (
        <button
          type      = 'button'
          className = {styles.retryButtonBottom}
          onClick   = {handleRetry}
        >
          🔄 Пройти тест заново
        </button>
      )}

      {! submitted && (
        <button
          type      = 'button'
          className = {styles.submitButton}
          onClick   = {handleSubmit}
          disabled  = {Object.keys(answers).length !== questions.length}
        >
          Проверить тест
        </button>
      )}
    </div>
  );
};
