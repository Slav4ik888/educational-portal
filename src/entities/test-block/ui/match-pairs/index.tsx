import { useState } from 'react'
// @ts-ignore
import { DndProvider, useDrag, useDrop } from 'react-dnd'
// @ts-ignore
import { HTML5Backend } from 'react-dnd-html5-backend'
import { MatchPairsQuestion, TestUserAnswer } from '../../types'


const ItemType = 'MATCH_ITEM'

interface DraggableItemProps {
  id: string
  text: string
  matchedTo?: string
  onDrop: (draggedId: string, targetId: string) => void
}

const DraggableItem: React.FC<DraggableItemProps> = ({ id, text, matchedTo, onDrop }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemType,
    item: { id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    }),
    canDrag: !matchedTo // уже сопоставленные нельзя перетаскивать
  }))

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemType,
    drop: (item: { id: string }) => onDrop(item.id, id),
    collect: (monitor) => ({
      isOver: monitor.isOver()
    })
  }))

  const dragAndDropRef = (element: HTMLDivElement | null) => {
    if (element) {
      drag(element);
      drop(element);
    }
  };

  return (
    <div
      // ref={(node) => drag(drop(node))}
      ref={dragAndDropRef}
      className={`match-item ${matchedTo ? 'matched' : ''} ${isDragging ? 'dragging' : ''} ${isOver ? 'over' : ''}`}
    >
      {text}
      {matchedTo && <span className='match-badge'>✓</span>}
    </div>
  )
}


interface MatchPairsProps {
  question: MatchPairsQuestion
  userAnswer: TestUserAnswer
  showResult?: boolean
  disabled?: boolean
  onAnswer: (answer: TestUserAnswer) => void
}
export const MatchPairs: React.FC<MatchPairsProps> = ({
  question,
  userAnswer = {} as TestUserAnswer,
  onAnswer,
  showResult,
  disabled
}) => {
  console.log('userAnswer: ', userAnswer);

  const [matches, setMatches] = useState<Record<string, string>>(userAnswer.value as Record<string, string>)

  const handleMatch = (leftId: string, rightId: string) => {
    if (disabled) return

    const newMatches = { ...matches }

    // Если элемент уже сопоставлен, разрываем старую связь
    const existingMatch = Object.entries(newMatches).find(([_, rId]) => rId === rightId)
    if (existingMatch) {
      delete newMatches[existingMatch[0]]
    }

    newMatches[leftId] = rightId
    setMatches(newMatches)

    onAnswer({
      questionId: question.id,
      type: 'match-pairs',
      value: newMatches
    })
  }

  const isMatchCorrect = (leftId: string, rightId: string): boolean => {
    const leftItem = question.leftItems.find(item => item.id === leftId)
    return leftItem?.matchId === rightId
  }

  // Расчет частичного балла
  const calculateScore = (): { score: number; correctMatches: number } => {
    let correctMatches = 0
    Object.entries(matches).forEach(([leftId, rightId]) => {
      if (isMatchCorrect(leftId, rightId)) correctMatches++
    })

    let score = 0
    // eslint-disable-next-line default-case
    switch (question.scoringType) {
      case 'exact':
        score = correctMatches === question.leftItems.length ? question.points : 0
        break
      case 'partial':
        score = (correctMatches / question.leftItems.length) * question.points
        break
      case 'points-per-match':
        score = correctMatches * (question.pointsPerMatch || 0)
        break
    }

    return { score, correctMatches }
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className='match-pairs'>
        <h3>{question.text}</h3>

        <div className='match-container'>
          <div className='left-column'>
            <h4>Термины</h4>
            {question.leftItems.map(item => (
              <div key={item.id} className='left-item'>
                <span>{item.text}</span>
                {matches[item.id] && showResult && (
                  <span className={isMatchCorrect(item.id, matches[item.id]) ? 'correct' : 'incorrect'}>
                    {isMatchCorrect(item.id, matches[item.id]) ? '✓' : '✗'}
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className='right-column'>
            <h4>Определения</h4>
            {question.rightItems.map(item => (
              <DraggableItem
                key={item.id}
                id={item.id}
                text={item.text}
                matchedTo={Object.entries(matches).find(([_, rId]) => rId === item.id)?.[0]}
                onDrop={handleMatch}
              />
            ))}
          </div>
        </div>

        {showResult && (
          <div className='result'>
            <p>Правильных сопоставлений: {calculateScore().correctMatches} из {question.leftItems.length}</p>
            <p>Баллов: {calculateScore().score} / {question.points}</p>
          </div>
        )}
      </div>
    </DndProvider>
  )
}
