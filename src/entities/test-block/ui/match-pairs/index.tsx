// import { DndProvider, useDrag, useDrop } from 'react-dnd'
// import { HTML5Backend } from 'react-dnd-html5-backend'
import { useState, useRef, useEffect } from 'react'
import { MatchPairsQuestion, TestUserAnswer } from '../../types'
import { Explanation } from '../explanation'
import styles from './index.module.scss'

interface MatchPairsProps {
  question        : MatchPairsQuestion
  userAnswer      : Record<string, string>
  isSubmitted     : boolean
  isAnswerCorrect : boolean
  showResult?     : boolean
  disabled?       : boolean
  onAnswer        : (answer: TestUserAnswer) => void
}

interface DragData {
  id   : string
  type : 'left' | 'right'
  text : string
}

export const MatchPairs: React.FC<MatchPairsProps> = ({
  question,
  userAnswer = {},
  isSubmitted,
  isAnswerCorrect,
  showResult,
  disabled,
  onAnswer
}) => {
  const [matches, setMatches] = useState<Record<string, string>>(userAnswer);
  const [draggedItem, setDraggedItem] = useState<DragData | null>(null);
  const [dragOverItemId, setDragOverItemId] = useState<string | null>(null);

  // const leftItemsRef = useRef<Map<string, HTMLDivElement>>(new Map());
  // const rightItemsRef = useRef<Map<string, HTMLDivElement>>(new Map());

  // Синхронизация с userAnswer
  useEffect(() => {
    setMatches(userAnswer);
  }, [userAnswer]);

  const handleDragStart = (e: React.DragEvent, id: string, type: 'left' | 'right', text: string) => {
    if (disabled || isSubmitted) {
      e.preventDefault();
      return
    }

    // Для левых элементов, которые уже сопоставлены, запрещаем перетаскивание
    if (type === 'left' && matches[id]) {
      e.preventDefault();
      return
    }

    setDraggedItem({ id, type, text });
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', JSON.stringify({ id, type, text }));

    // Добавляем класс для визуального эффекта
    e.currentTarget.classList.add(styles.dragging);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggedItem(null);
    setDragOverItemId(null);

    // Убираем классы со всех элементов
    document.querySelectorAll(`.${styles.dragging}`).forEach(el => {
      el.classList.remove(styles.dragging);
    });
    document.querySelectorAll(`.${styles.dragOver}`).forEach(el => {
      el.classList.remove(styles.dragOver);
    });
  };

  const handleDragOver = (e: React.DragEvent, id: string, type: 'left' | 'right') => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';

    if (!draggedItem) return

    // Разрешаем drop только на правые элементы
    if (type === 'right') {
      setDragOverItemId(id);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    setDragOverItemId(null);
  };

  const handleDrop = (e: React.DragEvent, targetId: string, targetType: 'left' | 'right') => {
    e.preventDefault();

    if (!draggedItem || disabled || isSubmitted) return

    // Обрабатываем drop только на правые элементы
    if (targetType === 'right' && draggedItem.type === 'left') {
      handleMatch(draggedItem.id, targetId);
    }

    setDraggedItem(null);
    setDragOverItemId(null);
  };

  const handleMatch = (leftId: string, rightId: string) => {
    const newMatches = { ...matches };

    // Если элемент уже сопоставлен, разрываем старую связь
    const existingMatch = Object.entries(newMatches).find(([_, rId]) => rId === rightId);
    if (existingMatch) {
      delete newMatches[existingMatch[0]];
    }

    newMatches[leftId] = rightId;
    setMatches(newMatches);

    onAnswer({
      questionId : question.id,
      type       : 'match-pairs',
      value      : newMatches
    });
  };

  const handleUnmatch = (leftId: string) => {
    if (disabled || isSubmitted) return

    const newMatches = { ...matches };
    delete newMatches[leftId];
    setMatches(newMatches);

    onAnswer({
      questionId : question.id,
      type       : 'match-pairs',
      value      : newMatches
    });
  };

  const isMatchCorrect = (leftId: string, rightId: string): boolean => {
    const leftItem = question.leftItems.find(item => item.id === leftId);
    return leftItem?.matchId === rightId
  };

  const calculateScore = (): { score: number; correctMatches: number } => {
    let correctMatches = 0;
    Object.entries(matches).forEach(([leftId, rightId]) => {
      if (isMatchCorrect(leftId, rightId)) correctMatches++
    });

    let score = 0;
    // eslint-disable-next-line default-case
    switch (question.scoringType) {
      case 'exact':
        score = correctMatches === question.leftItems.length ? question.points : 0;
        break
      case 'partial':
        score = (correctMatches / question.leftItems.length) * question.points;
        break
      case 'points-per-match':
        score = correctMatches * (question.pointsPerMatch || 0);
        break
    }

    return { score, correctMatches }
  };

  const scoreInfo = calculateScore();

  return (
    <div className={styles.matchPairs}>
      <h3>{question.text}</h3>

      {question.points && (
        <p className={styles.points}>Баллов: {question.points}</p>
      )}

      <div className={styles.matchContainer}>
        {/* Левая колонка - Термины */}
        <div className={styles.leftColumn}>
          <h4 className={styles.columnTitle}>📝 Термины</h4>
          <div className={styles.itemsList}>
            {question.leftItems.map(item => {
              const matchedRightId = matches[item.id];
              const matchedItem = question.rightItems.find(r => r.id === matchedRightId);
              const isCorrect = matchedRightId && isMatchCorrect(item.id, matchedRightId);

              return (
                <div
                  key         = {item.id}
                  className   = {`${styles.leftItem} ${matchedRightId ? styles.matched : ''}`}
                  draggable   = {!disabled && !isSubmitted && !matchedRightId}
                  onDragStart = {(e) => handleDragStart(e, item.id, 'left', item.text)}
                  onDragEnd   = {handleDragEnd}
                >
                  <span className={styles.itemText}>{item.text}</span>
                  {matchedRightId && (
                    <div className={styles.matchInfo}>
                      {
                        isSubmitted && (
                          <span className={`${styles.matchBadge} ${isCorrect ? styles.correct : styles.incorrect}`}>
                            {isCorrect ? '✓' : '✗'}
                          </span>
                        )
                      }
                      <span className={styles.matchedWith}>
                        → {matchedItem?.text}
                      </span>
                      {!isSubmitted && (
                        <button
                          type      = 'button'
                          className = {styles.unmatchBtn}
                          onClick   = {() => handleUnmatch(item.id)}
                          title     = 'Отменить сопоставление'
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Правая колонка - Определения */}
        <div className={styles.rightColumn}>
          <h4 className={styles.columnTitle}>📖 Определения</h4>
          <div className={styles.itemsList}>
            {question.rightItems.map(item => {
              const isMatched = Object.values(matches).includes(item.id)
              const matchedLeftId = Object.entries(matches).find(([_, rId]) => rId === item.id)?.[0]
              const isCorrectMatch = matchedLeftId && isMatchCorrect(matchedLeftId, item.id)

              return (
                <div
                  key         = {item.id}
                  onDragOver  = {(e) => handleDragOver(e, item.id, 'right')}
                  onDragLeave = {handleDragLeave}
                  onDrop      = {(e) => handleDrop(e, item.id, 'right')}
                  className   = {`
                    ${styles.rightItem} 
                    ${isMatched ? styles.matched : ''}
                    ${dragOverItemId === item.id ? styles.dragOver : ''}
                  `}
                >
                  <span className={styles.itemText}>{item.text}</span>
                  {isMatched && isSubmitted && (
                    <span className={`${styles.matchIndicator} ${isCorrectMatch ? styles.correct : styles.incorrect}`}>
                      {isCorrectMatch ? '✓' : '✗'}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
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
              style={{ width: `${(scoreInfo.correctMatches / question.leftItems.length) * 100}%` }}
            />
          </div>
          <p className={styles.scoreText}>
            Правильных сопоставлений: {scoreInfo.correctMatches} из {question.leftItems.length}
          </p>
        </div>
      )}

      <Explanation
        isAnswerCorrect={isAnswerCorrect}
        question={question}
        isSubmitted={isSubmitted}
      />
    </div>
  )
}
