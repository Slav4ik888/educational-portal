import { useEffect, useRef, useState } from 'react';
import { OrderStepsQuestion, TestUserAnswer } from '../../types';
import { Explanation } from '../explanation';
import styles from './index.module.scss';



interface OrderStepsProps {
  question        : OrderStepsQuestion
  isSubmitted     : boolean
  isAnswerCorrect : boolean
  userAnswer?     : string[]
  showResult?     : boolean
  onAnswer        : (answer: TestUserAnswer) => void
}

export const OrderSteps: React.FC<OrderStepsProps> = ({
  question,
  isSubmitted,
  isAnswerCorrect,
  userAnswer = [],
  showResult = false,
  onAnswer
}) => {
  const [steps, setSteps] = useState<typeof question.steps>(() => {
    // Если есть сохраненный ответ, используем его порядок
    if (userAnswer.length > 0) {
      const orderedSteps = userAnswer
        .map(id => question.steps.find(step => step.id === id))
        .filter((step): step is typeof question.steps[0] => step !== undefined);
      return orderedSteps.length === question.steps.length ? orderedSteps : [...question.steps];
    }
    return [...question.steps];
  });

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const prevUserAnswerRef = useRef<string[]>(userAnswer);

  // Синхронизация внутреннего состояния с входящим пропсом userAnswer
  useEffect(() => {
    const hasChanged = userAnswer.length !== prevUserAnswerRef.current.length
      || userAnswer.some((value, index) => value !== prevUserAnswerRef.current[index]);

    if (hasChanged && userAnswer.length > 0) {
      const orderedSteps = userAnswer
        .map(id => question.steps.find(step => step.id === id))
        .filter((step): step is typeof question.steps[0] => step !== undefined);

      if (orderedSteps.length === question.steps.length) {
        setSteps(orderedSteps);
      }
      prevUserAnswerRef.current = userAnswer;
    }
  }, [userAnswer, question.steps, question]);

  // Обновление ответа при изменении порядка
  const updateAnswer = (newSteps: typeof question.steps) => {
    const stepIds = newSteps.map(step => step.id);
    onAnswer({
      questionId : question.id,
      type       : 'order-steps',
      value      : stepIds
    });
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    if (isSubmitted) return;
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(index));

    // Добавляем класс для визуального эффекта
    (e.target as HTMLElement).classList.add(styles.dragging);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggedIndex(null);
    // Убираем класс dragging
    document.querySelectorAll(`.${styles.dragging}`).forEach(el => {
      el.classList.remove(styles.dragging);
    });
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';

    if (draggedIndex === null || draggedIndex === index || isSubmitted) return;

    // Перемещаем элемент
    const newSteps = [...steps];
    const [draggedItem] = newSteps.splice(draggedIndex, 1);
    newSteps.splice(index, 0, draggedItem);

    setSteps(newSteps);
    setDraggedIndex(index);
    updateAnswer(newSteps);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDraggedIndex(null);
  };

  // Кнопки для перемещения (альтернативный способ без drag-and-drop)
  const moveStep = (fromIndex: number, toIndex: number) => {
    if (isSubmitted) return;

    if (toIndex < 0 || toIndex >= steps.length) return;

    const newSteps = [...steps];
    const [movedItem] = newSteps.splice(fromIndex, 1);
    newSteps.splice(toIndex, 0, movedItem);

    setSteps(newSteps);
    updateAnswer(newSteps);
  };

  const moveUp = (index: number) => {
    moveStep(index, index - 1);
  };

  const moveDown = (index: number) => {
    moveStep(index, index + 1);
  };

  // Проверка правильности порядка
  const isStepCorrect = (index: number): boolean | null => {
    if (!showResult) return null;
    const stepId = steps[index]?.id;
    return stepId === question.correctOrder[index];
  };

  // Расчет баллов
  const calculateScore = (): { score: number; correctCount: number } => {
    let correctCount = 0;
    steps.forEach((step, index) => {
      if (step.id === question.correctOrder[index]) {
        correctCount++;
      }
    });

    const score = (correctCount / steps.length) * question.points;
    return { score, correctCount };
  };

  const scoreInfo = calculateScore();

  return (
    <div className={styles.orderSteps}>
      <h3>{question.text}</h3>

      {question.points && (
        <p className={styles.points}>Баллов: {question.points}</p>
      )}

      <div className={styles.stepsContainer}>
        <div className={styles.stepsList}>
          {steps.map((step, index) => {
            const isCorrect = isStepCorrect(index);

            return (
              <div
                key         = {step.id}
                className   = {`
                  ${styles.stepItem}
                  ${isCorrect === true ? styles.correct : ''}
                  ${isCorrect === false ? styles.incorrect : ''}
                  ${draggedIndex === index ? styles.dragging : ''}
                `}
                draggable   = {!isSubmitted}
                onDragStart = {(e) => handleDragStart(e, index)}
                onDragEnd   = {handleDragEnd}
                onDragOver  = {(e) => handleDragOver(e, index)}
                onDrop      = {handleDrop}
              >
                <div className={styles.stepNumber}>
                  <span className={styles.number}>{index + 1}</span>
                </div>

                <div className={styles.stepContent}>
                  <div className={styles.stepText}>
                    <strong>{step.text}</strong>
                    {step.description && (
                      <p className={styles.stepDescription}>{step.description}</p>
                    )}
                  </div>

                  {!isSubmitted && (
                    <div className={styles.stepControls}>
                      <button
                        type      = 'button'
                        className = {styles.moveUp}
                        onClick   = {() => moveUp(index)}
                        disabled  = {index === 0}
                        title     = 'Переместить вверх'
                      >
                        ↑
                      </button>
                      <button
                        type      = 'button'
                        className = {styles.moveDown}
                        onClick   = {() => moveDown(index)}
                        disabled  = {index === steps.length - 1}
                        title     = 'Переместить вниз'
                      >
                        ↓
                      </button>
                    </div>
                  )}
                </div>

                {showResult && isCorrect !== null && (
                  <div className={styles.resultIcon}>
                    {isCorrect ? '✓' : '✗'}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Drag-and-drop подсказка */}
        {!isSubmitted && !showResult && (
          <div className={styles.dragHint}>
            <span className={styles.hintIcon}>↕️</span>
            <span className={styles.hintText}>
              Перетащите элементы мышкой или используйте кнопки ↑↓ для изменения порядка
            </span>
          </div>
        )}
      </div>

      {showResult && (
        <div className={styles.resultInfo}>
          <div className={styles.scoreBadge}>
            <span className={styles.scoreValue}>
              {Math.round(scoreInfo.score)} / {question.points}
            </span>
            <span className={styles.scoreLabel}>баллов</span>
          </div>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${(scoreInfo.correctCount / steps.length) * 100}%` }}
            />
          </div>
          <p className={styles.scoreText}>
            Правильных позиций: {scoreInfo.correctCount} из {steps.length}
          </p>
        </div>
      )}

      <Explanation
        isAnswerCorrect={isAnswerCorrect}
        question={question}
        isSubmitted={isSubmitted}
      />
    </div>
  );
};
