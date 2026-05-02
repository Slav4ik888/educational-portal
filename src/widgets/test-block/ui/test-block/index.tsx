/* eslint-disable no-console */
import { FC, useEffect, useState } from 'react';
import { TestResult } from '../test-result/index';
import { cfg } from 'app/config';
import {
  TestQuestion, TestUserAnswers, TestUserAnswer, isTestCompleted, TestType, isFinalCompleted, useDevAnswers,
  TestQuestionRenderer, TEST_AI_EVALUATED_TYPES,
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
  const [answers, setAnswers] = useState<TestUserAnswers>({});
  const [submitted, setSubmitted] = useState(isCompleted);
  const [retry, setRetry] = useState(false);
  const [score, setScore] = useState<number | null>(savedScore || null);
  const isFinal = type === 'final';
  // Определяем, есть ли неверные ответы
  const isPassed = isFinal ? isFinalCompleted(score) : isTestCompleted(score);

  // Автоматически заполняем ответы в режиме разработки
  const devAnswers = useDevAnswers(questions, {
    enabled          : cfg.IS_DEV, // false, //
    correctnessRatio : 1,    // Все ответы правильные
    useLocalStorage  : false
  });

  useEffect(() => {
    setAnswers(devAnswers || {});
  }, [devAnswers]);


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
  };


  const handleSubmit = () => {
    let earnedPoints = 0;
    questions.forEach(question => {
      const userAnswer = answers[question.id];

      // AI-evaluated: proportional scoring based on aiScore (0-100)
      if (TEST_AI_EVALUATED_TYPES.has(question.type)) {
        const aiAnswer = userAnswer as { aiScore?: number; isEvaluated?: boolean } | undefined;
        if (aiAnswer?.isEvaluated) {
          earnedPoints += Math.round(((aiAnswer.aiScore ?? 0) / 100) * question.points);
        }
        return;
      }

      const isCorrect = isAnswerCorrect(question, userAnswer);
      const details   = getAnswerDetails(question, userAnswer);

      if (isCorrect) {
        cfg.IS_DEV && console.log('✅ Правильно!');
        earnedPoints += question.points;
      } else if (details.details?.partiallyCorrect) {
        const d = details.details;
        cfg.IS_DEV && console.log(`⚠️ Частично правильно: ${d.correctCount} из ${d.totalCount}`);
        earnedPoints += Math.round((question.points * (d.correctCount || 0)) / (d.totalCount || 1));
      } else {
        cfg.IS_DEV && console.log('❌ Неправильно');
      }
    });

    const allScores = questions.reduce((sum, question) => sum + question.points, 0);

    const calculatedScore = allScores > 0 ? (earnedPoints * 100) / allScores : 0;
    setScore(calculatedScore);
    setSubmitted(true);
    onComplete(calculatedScore);
  };

  const handleRetry = () => {
    setAnswers({});
    setScore(null);
    setSubmitted(false);
    setRetry(true);
  };

  const hasWrongAnswers = (submitted && score !== null && score < 100)
    || (! submitted && isPassed);

  if (isPassed && ! hasWrongAnswers) return null

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

      {(! isPassed || hasWrongAnswers) && questions.map(question => (
        <TestQuestionRenderer
          key             = {question.id}
          isSubmitted     = {submitted}
          isAnswerCorrect = {isAnswerCorrect(question, answers[question.id])}
          question        = {question}
          userAnswer      = {answers[question.id]}
          onAnswer        = {handleAnswerChange}
        />
      ))}

      {((! isPassed && submitted) || (submitted && hasWrongAnswers)) && <TestRetryBtn onClick={handleRetry} />}
      {((! submitted && ! retry)
        || (! submitted && ! isPassed)
        || (! submitted && retry))
        && <TestCheckBtn
          disabled = {! Object.keys(answers).length}
          onClick  = {handleSubmit}
        />}
    </div>
  );
};
