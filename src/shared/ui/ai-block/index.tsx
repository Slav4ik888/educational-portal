import { FC } from 'react'
import { ExplainResult } from 'shared/lib/ai'
import styles from './ai-block.module.scss'



interface AiBlockProps {
  loading  : boolean
  error    : string | null
  result   : ExplainResult | null
  expanded : boolean
}

export const AiBlock: FC<AiBlockProps> = ({ loading, error, result, expanded }) => (
  <>
    {loading && (
      <div className={styles.loading}>
        <span /><span /><span />
      </div>
    )}

    {error && !loading && (
      <div className={styles.error}>⚠️ {error}</div>
    )}

    {result && expanded && (
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.icon}>🤖</span>
          <span className={styles.title}>Простое объяснение</span>
          <span className={styles.badge}>AI</span>
        </div>

        <p className={styles.text}>{result.explanation}</p>

        {result.keyPoints.length > 0 && (
          <div className={styles.keyPoints}>
            <div className={styles.keyPointsLabel}>Главные мысли:</div>
            <ul className={styles.keyPointsList}>
              {result.keyPoints.map((kp, i) => (
                <li key={i}>{kp}</li>
              ))}
            </ul>
          </div>
        )}

        {result.analogy && (
          <div className={styles.analogy}>
            <span className={styles.analogyIcon}>🔗</span>
            <span>{result.analogy}</span>
          </div>
        )}
      </div>
    )}
  </>
)
