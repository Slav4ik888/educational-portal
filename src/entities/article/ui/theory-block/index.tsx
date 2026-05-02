import { FC, useState } from 'react';
import { llmGlossaryTerms } from 'entities/glossary';
import { RichTextRenderer } from 'shared/ui/rich-text-render';
import { explainSimpler, ExplainResult } from 'shared/lib/ai';
import { AiBlock } from 'shared/ui/ai-block';
import styles from './theory-block.module.scss';



interface TheoryBlockProps {
  content  : string
  concept? : string
}

export const TheoryBlock: FC<TheoryBlockProps> = ({ content, concept }) => {
  const [loading, setLoading]   = useState(false)
  const [result, setResult]     = useState<ExplainResult | null>(null)
  const [error, setError]       = useState<string | null>(null)
  const [expanded, setExpanded] = useState(false)

  const handleExplain = async () => {
    if (loading) return
    setLoading(true)
    setError(null)
    try {
      const res = await explainSimpler({ content, concept })
      setResult(res)
      setExpanded(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка объяснения')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.theoryBlock}>
      <div className={styles.theoryContent}>
        <RichTextRenderer
          text          = {content}
          glossaryTerms = {llmGlossaryTerms}
        />
      </div>

      {/* ── Explainer button ── */}
      <div className={styles.explainerRow}>
        <button
          className={styles.explainBtn}
          onClick={handleExplain}
          disabled={loading}
          title="Объясни этот раздел простыми словами"
        >
          {loading ? '⏳ Упрощаю...' : '💡 Объясни проще'}
        </button>

        {result && (
          <button
            className={styles.toggleBtn}
            onClick={() => setExpanded(e => !e)}
          >
            {expanded ? '▲ Скрыть' : '▼ Показать'}
          </button>
        )}
      </div>

      <AiBlock loading={loading} error={error} result={result} expanded={expanded} />
    </div>
  );
};
