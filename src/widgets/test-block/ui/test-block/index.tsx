import { FC, useEffect, useState } from 'react';
import { TestResult } from '../test-result/index';
import { cfg } from 'app/config';
import {
  TestQuestion, TestUserAnswers, TestUserAnswer, isTestCompleted, TestType, isFinalCompleted, useDevAnswers,
  TestQuestionRenderer
} from 'entities/test-block';
import styles from './index.module.scss';
import { TestRetryBtn } from './retry-btn/index';
import { TestCheckBtn } from './check-btn/index';
import { getAnswerDetails, isAnswerCorrect } from './util';



interface Props {
  type        : TestType
  questions   : TestQuestion[]
  isCompleted : boolean
  savedScore  : number | null
  onComplete  : (score: number) => void
}

export const TestBlock: FC<Props> = ({ type, questions, isCompleted, savedScore, onComplete }) => {
  // Автоматически заполняем ответы в режиме разработки
  const devAnswers = useDevAnswers(questions, {
    enabled          : cfg.IS_DEV,
    correctnessRatio : 1,    // Все ответы правильные
    useLocalStorage  : false
  });

  const [answers, setAnswers] = useState<TestUserAnswers>(() => devAnswers || {});
  const [submitted, setSubmitted] = useState(isCompleted);
  const [score, setScore] = useState<number | null>(savedScore || null);
  const isFinal = type === 'final';
  // Определяем, есть ли неверные ответы
  const isPassed = isFinal ? isFinalCompleted(score) : isTestCompleted(score);


  // Восстанавливаем сохраненные ответы
  useEffect(() => {
    if (savedScore !== undefined && isCompleted) {
      setSubmitted(true);
      setScore(savedScore);
    }
  }, [savedScore, isCompleted]);

  const handleAnswerChange = (answer: TestUserAnswer) => {
    if (! submitted) {
      setAnswers((prev: TestUserAnswers) => ({ ...prev, [answer.questionId]: answer }));
    }
    // TODO: В dev режиме не сохраняем ответы пользователя
  };


  const handleSubmit = () => {
    let correctCount = 0;
    questions.forEach(question => {
      // checkAnswer
      const userAnswer = answers[question.id];

      // Простая проверка
      const isCorrect = isAnswerCorrect(question, userAnswer);

      // Детальная проверка
      const details = getAnswerDetails(question, userAnswer);

      if (isCorrect) {
        console.log('✅ Правильно!');
        correctCount += question.points;
      }
      else if (details.details?.partiallyCorrect) {
        console.log(`⚠️ Частично правильно: ${details.details.correctCount} из ${details.details.totalCount}`);
        correctCount += details.details.correctCount || 0;
      }
      else {
        console.log('❌ Неправильно');
      }
    });

    let allScores = 0;
    questions.forEach(question => {
      allScores += question.points;
    });

    const calculatedScore = (correctCount * 100) / allScores;
    setScore(calculatedScore);
    setSubmitted(true);
    onComplete(calculatedScore);
  };

  const handleRetry = () => {
    setSubmitted(false);
  };

  const hasWrongAnswers = submitted && score !== null && score < 100;

  return (
    <div className={styles.testBlock}>
      {
        ! isFinal && (
          <TestResult
            type        = 'inline'
            isPassed    = {isPassed}
            isSubmitted = {submitted}
            score       = {score}
          />
        )
      }

      {questions.map(question => (
        <TestQuestionRenderer
          key             = {question.id}
          isSubmitted     = {submitted}
          isAnswerCorrect = {isAnswerCorrect(question, answers[question.id])}
          question        = {question}
          userAnswer      = {answers[question.id]}
          onAnswer        = {handleAnswerChange}
        />
      ))}

      {! isPassed && submitted && hasWrongAnswers && <TestRetryBtn onClick={handleRetry} />}
      {! isPassed && ! submitted && <TestCheckBtn
        disabled = {! Object.keys(answers).length}
        onClick  = {handleSubmit}
      />}
    </div>
  );
};
