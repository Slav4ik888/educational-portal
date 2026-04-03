import { useState } from 'react';
import { ContentBlock } from 'entities/article';
import { TestQuestion } from 'entities/test-block';
// import { TheoryBlock } from './TheoryBlock';
// import { QuizBlock } from './QuizBlock';

interface ArticleReaderProps {
  blocks: ContentBlock[];
  onBlockComplete: (blockId: string, score?: number) => void;
}

export const ArticleReader: React.FC<ArticleReaderProps> = ({ blocks, onBlockComplete }) => {
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const currentBlock = blocks[currentBlockIndex];

  const handleTestComplete = (correctAnswers: number, total: number) => {
    onBlockComplete(currentBlock.id, (correctAnswers / total) * 100);
    setCurrentBlockIndex(prev => prev + 1);
  };

  const handleTheoryComplete = () => {
    onBlockComplete(currentBlock.id);
    setCurrentBlockIndex(prev => prev + 1);
  };

  return (
    <div>
      {currentBlock.type === 'theory' && (
        <div>TheoryBlock</div>
        // <TheoryBlock content={currentBlock.content} onComplete={handleTheoryComplete} />
      )}
      {currentBlock.type === 'test' && currentBlock.questions && (
         <div>TestBlock</div>
        // <TestBlock questions={currentBlock.questions} onComplete={handleTestComplete} />
      )}
    </div>
  );
};
