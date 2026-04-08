import { FC, useState, useEffect } from 'react';
import { getRightAnswers, isFinalCompleted, TestListBox, TestQuestionType, TestUserAnswers } from 'entities/test-block';
import { cfg } from 'app/config';
import styles from './final-test.module.scss';



interface Props {
  questions   : TestQuestionType[]
  isCompleted : boolean
  savedScore? : number | null
  onComplete  : (score: number) => void
}

export const FinalTest: FC<Props> = ({
  questions,
  isCompleted,
  savedScore,
  onComplete
}) => {
  const [answers, setAnswers] = useState<TestUserAnswers>(() => cfg.SET_ANSWERS ? getRightAnswers(questions) : {});
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
  // const hasWrongAnswers = submitted && score !== null && score < 100;
  // const allCorrectAnswers = score === 100;
  const isPassed = isFinalCompleted(score);

  return (
    <div className={styles.finalTest}>
      {! isPassed && (
        <div className={styles.testDescription}>
          <p>Итоговый тест состоит из {questions.length} вопросов.
          Для успешного завершения необходимо набрать не менее 70%.</p>
        </div>
      )}

      <TestListBox
        type           = 'inline'
        score          = {score}
        isRetry        = {retry}
        isSubmitted    = {submitted}
        answers        = {answers}
        questions      = {questions}
        onAnswerChange = {handleAnswerChange}
        onSubmit       = {handleSubmit}
        onRetry        = {handleRetry}
      />
    </div>
  );
};
