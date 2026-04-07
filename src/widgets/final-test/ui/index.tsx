import { FC, useState, useEffect } from 'react';
import { TestBox, TestQuestionType } from 'entities/test-block';
import styles from './final-test.module.scss';



interface FinalTestProps {
  questions: TestQuestionType[];
  isCompleted: boolean;
  savedScore?: number | null;
  onComplete: (score: number) => void;
}

export const FinalTest: FC<FinalTestProps> = ({
  questions,
  isCompleted,
  savedScore,
  onComplete
}) => {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(isCompleted);
  const [score, setScore] = useState<number | null>(savedScore || null);
  const [retry, setRetry] = useState<boolean>(false);


  useEffect(() => {
    if (savedScore !== undefined && savedScore !== null && isCompleted) {
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

  const handleRetry = () => {
    setSubmitted(false);
    setRetry(true);
  };


  if (submitted && score !== null) {
    const isPassed = score >= 70;

    return (
      <div className={styles.finalTestResult}>
        <div className={`${styles.resultIcon} ${isPassed ? styles.passed : styles.failed}`}>
          {isPassed ? '🎓' : '📖'}
        </div>
        <h3>Итоговый результат: {score.toFixed(0)}%</h3>
        <p>
          {isPassed
            ? 'Поздравляем! Вы успешно освоили материал. Можете переходить к следующей статье.'
            : 'К сожалению, вы не набрали проходной балл. Рекомендуем повторить материал и попробовать снова.'}
        </p>

        {!isPassed && (
          <button
            type='button'
            className={styles.retryButton}
            onClick={handleRetry}
          >
            Пройти тест заново
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={styles.finalTest}>
      <div className={styles.testDescription}>
        <p>Итоговый тест состоит из {questions.length} вопросов.
        Для успешного завершения необходимо набрать не менее 70%.</p>
      </div>

      <div className={styles.questionsList}>
        {questions.map((question, index) => (
          <div key={question.id} className={styles.question}>
            <div className={styles.questionText}>
              {index + 1}. {question.text}
            </div>
            <TestBox
              isRetry            = {false}
              isSubmitted        = {submitted}
              question           = {question}
              initialAnswerIndex = {answers[question.id]}
              onAnswerChange     = {handleAnswerChange}
            />
          </div>
        ))}
      </div>

      <button
        type      = 'button'
        className = {styles.submitFinalButton}
        onClick   = {handleSubmit}
        disabled  = {Object.keys(answers).length !== questions.length}
      >
        Завершить итоговый тест
      </button>
    </div>
  );
};
