import { FC, useState, useRef, KeyboardEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { StateSchema } from 'app/providers/store'
import { ragSearch, RagSearchResult } from 'shared/lib/ai'
import styles from './search-page.module.scss'

const EXAMPLE_QUERIES = [
  'Что такое токенизация?',
  'Как работает механизм внимания?',
  'Что такое галлюцинации AI?',
  'Как составить хороший промпт?',
  'Как защитить свои данные при работе с AI?',
  'Что такое RLHF?',
]

const HINT_ARTICLES = [
  { title: 'Как работают LLM', sub: 'LLM, токены, обучение', url: '/articles/how-llm-work-intuitive-guide' },
  { title: 'Структура промптов', sub: 'Роль, контекст, формат', url: '/articles/effective-prompt-structure' },
  { title: 'Безопасность AI', sub: 'Данные, deepfake, риски', url: '/articles/ai-safety-guide' },
]

export const SearchPage: FC = () => {
  const navigate = useNavigate()
  const journeyHistory = useSelector((s: StateSchema) => s.personalContext.journeyHistory)

  const [query, setQuery]     = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)
  const [result, setResult]   = useState<RagSearchResult | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSearch = async (q?: string) => {
    const finalQuery = (q ?? query).trim()
    if (!finalQuery) return
    if (q) setQuery(q)
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await ragSearch({ query: finalQuery })
      setResult(res)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка поиска')
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch()
  }

  return (
    <div className={styles.page}>
      {/* ── Header ── */}
      <div className={styles.header}>
        <h1 className={styles.title}>🔍 Спроси платформу</h1>
        <div className={styles.headerActions}>
          <button className={styles.btnOutline} onClick={() => navigate('/')}>
            ← На главную
          </button>
          <button className={styles.btnOutline} onClick={() => navigate('/progress')}>
            📊 Мой прогресс
          </button>
        </div>
      </div>

      {/* ── Search box ── */}
      <div className={styles.searchBox}>
        <div className={styles.searchLabel}>
          Задайте вопрос — я найду ответ в материалах платформы
        </div>
        <div className={styles.searchRow}>
          <input
            ref          = {inputRef}
            className    = {styles.searchInput}
            type         = "text"
            placeholder  = "Например: как работают трансформеры?"
            value        = {query}
            onChange     = {e => setQuery(e.target.value)}
            onKeyDown    = {handleKey}
            disabled     = {loading}
            autoFocus
          />
          <button
            className = {styles.searchBtn}
            onClick   = {() => handleSearch()}
            disabled  = {loading || !query.trim()}
          >
            {loading ? '⏳' : '🔍 Найти'}
          </button>
        </div>
        <div className={styles.examples}>
          <span className={styles.examplesLabel}>Попробуйте:</span>
          {EXAMPLE_QUERIES.map(q => (
            <button
              key       = {q}
              className = {styles.exampleChip}
              onClick   = {() => handleSearch(q)}
              disabled  = {loading}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* ── Loading ── */}
      {loading && (
        <div className={styles.loading}>
          <div className={styles.loadingDots}>
            <span /><span /><span />
          </div>
          <div className={styles.loadingText}>Ищу ответ в базе знаний...</div>
        </div>
      )}

      {/* ── Error ── */}
      {error && !loading && (
        <div className={styles.errorCard}>⚠️ {error}</div>
      )}

      {/* ── Result ── */}
      {result && !loading && (
        <div className={styles.answerCard}>
          <div className={styles.answerHeader}>
            <span className={styles.answerIcon}>🤖</span>
            <h2 className={styles.answerTitle}>Ответ</h2>
          </div>
          <p className={styles.answerText}>{result.answer}</p>

          {result.sources.length > 0 && (
            <div className={styles.sourcesSection}>
              <p className={styles.sourcesTitle}>Источники</p>
              <div className={styles.sourcesList}>
                {result.sources.map((src, i) => (
                  <div
                    key       = {i}
                    className = {styles.sourceItem}
                    onClick   = {() => navigate(src.url)}
                    role      = "button"
                    tabIndex  = {0}
                    onKeyDown = {e => e.key === 'Enter' && navigate(src.url)}
                  >
                    <span className={styles.sourceIcon}>📄</span>
                    <div className={styles.sourceInfo}>
                      <p className={styles.sourceTitle}>{src.articleTitle}</p>
                      <p className={styles.sourceSub}>{src.heading}</p>
                    </div>
                    <span className={styles.sourceArrow}>→</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Empty state / hints ── */}
      {!result && !loading && !error && (
        <>
          <div className={styles.hint}>
            <p className={styles.hintTitle}>Доступные материалы</p>
            <div className={styles.hintGrid}>
              {HINT_ARTICLES.map(a => (
                <div
                  key       = {a.url}
                  className = {styles.hintCard}
                  onClick   = {() => navigate(a.url)}
                  role      = "button"
                  tabIndex  = {0}
                  onKeyDown = {e => e.key === 'Enter' && navigate(a.url)}
                >
                  <p className={styles.hintCardTitle}>{a.title}</p>
                  <p className={styles.hintCardSub}>{a.sub}</p>
                </div>
              ))}
            </div>
          </div>

          {journeyHistory.length > 0 && (
            <div className={styles.hint}>
              <p className={styles.hintTitle}>Ваши путешествия проиндексированы и учитываются в поиске</p>
              <div className={styles.hintGrid}>
                {journeyHistory.slice(0, 4).map(r => (
                  <div key={r.completionId} className={styles.hintCard} style={{ cursor: 'default' }}>
                    <p className={styles.hintCardTitle}>{r.title}</p>
                    <p className={styles.hintCardSub}>{r.topic} · {r.accuracy}%</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
