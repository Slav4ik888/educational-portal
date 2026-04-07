import { FC, useState, useEffect } from 'react';
import { TestListBox, TestQuestionType } from 'entities/test-block';
import styles from './final-test.module.scss';
import { TestRetryBtn } from 'entities/test-block/ui/test-block/retry-btn/index';
import { TestCheckBtn } from 'entities/test-block/ui/test-block/check-btn/index';



interface Props {
  questions   : TestQuestionType[];
  isCompleted : boolean;
  savedScore? : number | null;
  onComplete  : (score: number) => void;
}

export const FinalTest: FC<Props> = ({
  questions,
  isCompleted,
  savedScore,
  onComplete
}) => {
  const [answers, setAnswers] = useState<Record<string, number>>(() => {
    const answers: Record<string, number> = {};
    questions.forEach(question => {
      answers[question.id] = question.correctAnswer;
    });

    return answers
  });

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
    setRetry(false);
  };

  const handleRetry = () => {
    setSubmitted(false);
    setRetry(true);
  };

  // Определяем, есть ли неверные ответы
  const hasWrongAnswers = submitted && score !== null && score < 100;
  const allCorrectAnswers = score === 100;
  const isPassed = score ? score >= 70 : false;

  return (
    <div className={styles.finalTest}>
      {! isPassed && (
        <div className={styles.testDescription}>
          <p>Итоговый тест состоит из {questions.length} вопросов.
          Для успешного завершения необходимо набрать не менее 70%.</p>
        </div>
      )}

      {submitted && hasWrongAnswers && (
        <div className={styles.finalTestResult}>
          <div className={`${styles.resultIcon} ${isPassed ? styles.passed : styles.failed}`}>
            {isPassed ? '🎓' : '📖'}
          </div>
          <h3>Итоговый результат: {score && score.toFixed(0)}%</h3>
          <p>
            {
              isPassed
                ? 'Присутствуют неверные ответы, но вы набрали достаточное количество баллов.'
                : 'К сожалению, вы не прошли тест. Рекомендуем повторить материал и попробовать снова.'
            }
          </p>
        </div>
      )}

      <TestListBox
        isPassed       = {allCorrectAnswers}
        isRetry        = {retry}
        isSubmitted    = {submitted}
        answers        = {answers}
        questions      = {questions}
        onAnswerChange = {handleAnswerChange}
      />

      {/* Если уже был submit, показываем кнопку для повторной попытки */}
      {submitted && hasWrongAnswers && <TestRetryBtn onClick={handleRetry} />}
      {! submitted && <TestCheckBtn
        disabled = {Object.keys(answers).length !== questions.length}
        onClick  = {handleSubmit}
      />}
    </div>
  );
};
