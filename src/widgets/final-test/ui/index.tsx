import { FC, useState } from 'react';
import { TestQuestionType } from 'entities/test-block';
import { ProgressBar } from 'shared/ui/progress-bar';
import styles from './final-test.module.scss';



interface FinalTestProps {
  questions  : TestQuestionType[];
  onComplete : (score: number) => void;
}

export const FinalTest: FC<FinalTestProps> = ({ questions, onComplete }) => {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const handleAnswer = (questionId: string, answerIndex: number) => {
    if (!isSubmitted) {
      setAnswers(prev => ({ ...prev, [questionId]: answerIndex }));
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    let correctCount = 0;
    questions.forEach(question => {
      if (answers[question.id] === question.correctAnswer) {
        correctCount++;
      }
    });
    const score = (correctCount / questions.length) * 100;
    setIsSubmitted(true);
    onComplete(score);
  };

  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === questions.length;

  if (isSubmitted) {
    const correctCount = questions.filter(q => answers[q.id] === q.correctAnswer).length;
    const percentage = (correctCount / questions.length) * 100;

    return (
      <div className={styles.resultsContainer}>
        <div className={styles.resultsCard}>
          <h2>Результаты теста</h2>
          <div className={styles.scoreCircle}>
            <span className={styles.scoreValue}>{Math.round(percentage)}%</span>
          </div>
          <div className={styles.stats}>
            <p>✅ Правильно: {correctCount}</p>
            <p>❌ Неправильно: {questions.length - correctCount}</p>
          </div>
          <div className={styles.detailedResults}>
            <h3>Детальный разбор:</h3>
            {questions.map((question, index) => (
              <div key={question.id} className={styles.resultItem}>
                <div className={styles.resultQuestion}>
                  <span>{index + 1}. {question.text}</span>
                  {answers[question.id] === question.correctAnswer ? (
                    <span className={styles.correctBadge}>✓</span>
                  ) : (
                    <span className={styles.incorrectBadge}>✗</span>
                  )}
                </div>
                {answers[question.id] !== question.correctAnswer && (
                  <div className={styles.explanation}>
                    Правильный ответ: {question.options[question.correctAnswer]}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = answers[currentQuestion.id];

  return (
    <div className={styles.finalTest}>
      <div className={styles.header}>
        <h2>Итоговый тест</h2>
        <div className={styles.progressInfo}>
          <span>Вопрос {currentQuestionIndex + 1} из {questions.length}</span>
          <span>Отвечено: {answeredCount}/{questions.length}</span>
        </div>
        <ProgressBar current={answeredCount} total={questions.length} />
      </div>

      <div className={styles.questionContainer}>
        <div className={styles.questionCard}>
          <h3 className={styles.questionText}>
            {currentQuestion.text}
          </h3>
          <div className={styles.options}>
            {currentQuestion.options.map((option, index) => (
              // eslint-disable-next-line jsx-a11y/label-has-associated-control
              <label
                key={index}
                className={`${styles.option} 
                  ${currentAnswer === index ? styles.selected : ''}
                `}
              >
                <input
                  type     = 'radio'
                  name     = 'question'
                  value    = {index}
                  checked  = {currentAnswer === index}
                  onChange = {() => handleAnswer(currentQuestion.id, index)}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </div>

        <div className={styles.navigation}>
          <button
            type      = 'button'
            className = {styles.navButton}
            disabled  = {currentQuestionIndex === 0}
            onClick   = {handlePrev}
          >
            ← Назад
          </button>

          {currentQuestionIndex < questions.length - 1 ? (
            <button
              type      = 'button'
              className = {styles.navButton}
              disabled  = {currentAnswer === undefined}
              onClick   = {handleNext}
            >
              Далее →
            </button>
          ) : (
            <button
              type      = 'button'
              className = {styles.submitButton}
              disabled  = {!allAnswered}
              onClick   = {handleSubmit}
            >
              Завершить тест
            </button>
          )}
        </div>
      </div>

      <div className={styles.questionPalette}>
        {questions.map((question, index) => (
          <button
            key       = {question.id}
            type      = 'button'
            className = {`${styles.paletteButton} 
              ${answers[question.id] !== undefined ? styles.answered : ''}
              ${currentQuestionIndex === index ? styles.active : ''}
            `}
            onClick   = {() => setCurrentQuestionIndex(index)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};
