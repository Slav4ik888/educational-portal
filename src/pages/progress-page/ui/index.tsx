import { FC, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { StateSchema } from 'app/providers/store'
import {
  personalContextActions,
  buildUserContextSummary,
  getStrongTopics,
  getWeakTopics,
  JourneyRecord,
} from 'entities/personal-context'
import styles from './progress-page.module.scss'


function topicStats(history: JourneyRecord[]) {
  const map: Record<string, { sum: number; count: number }> = {}
  for (const r of history) {
    if (!map[r.topic]) map[r.topic] = { sum: 0, count: 0 }
    map[r.topic].sum   += r.accuracy
    map[r.topic].count += 1
  }
  return Object.entries(map)
    .map(([topic, { sum, count }]) => ({ topic, accuracy: Math.round(sum / count) }))
    .sort((a, b) => b.accuracy - a.accuracy)
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })
}

function formatDuration(sec: number): string {
  if (!sec || sec <= 0) return ''
  const m = Math.round(sec / 60)
  return m < 1 ? '<1 мин' : `${m} мин`
}

function accClass(acc: number): string {
  if (acc >= 75) return styles.historyAccHigh
  if (acc >= 50) return styles.historyAccMid
  return styles.historyAccLow
}


export const ProgressPage: FC = () => {
  const navigate  = useNavigate()
  const dispatch  = useDispatch()
  const history   = useSelector((s: StateSchema) => s.personalContext.journeyHistory)
  const totalXP   = useSelector((s: StateSchema) => s.gamification.totalXP)

  const [confirmClear, setConfirmClear] = useState(false)

  const topics      = topicStats(history)
  const strong      = getStrongTopics(history)
  const weak        = getWeakTopics(history)
  const avgAcc      = history.length
    ? Math.round(history.reduce((s, r) => s + r.accuracy, 0) / history.length)
    : 0
  const totalTimeSec = history.reduce((s, r) => s + (r.durationSec ?? 0), 0)

  const handleClear = () => {
    dispatch(personalContextActions.clearAllHistory())
    setConfirmClear(false)
  }

  return (
    <div className={styles.page}>
      {/* ── Header ── */}
      <div className={styles.header}>
        <h1 className={styles.title}>📊 Мой прогресс</h1>
        <div className={styles.headerActions}>
          <button className={styles.btnOutline} onClick={() => navigate('/')}>
            ← На главную
          </button>
          <button className={styles.btnOutline} onClick={() => navigate('/journey/new')}>
            ✨ Новое путешествие
          </button>
          {history.length > 0 && (
            <button className={styles.btnDanger} onClick={() => setConfirmClear(true)}>
              🗑 Очистить данные
            </button>
          )}
        </div>
      </div>

      {history.length === 0 ? (
        <div className={styles.emptyCard}>
          <div className={styles.emptyIcon}>🗺️</div>
          <h2 className={styles.emptyTitle}>Ещё нет данных</h2>
          <p className={styles.emptyText}>
            Завершите своё первое путешествие, и здесь появится ваша статистика.
          </p>
          <button className={styles.primaryBtn} onClick={() => navigate('/journey/new')}>
            Начать путешествие
          </button>
        </div>
      ) : (
        <>
          {/* ── Stats ── */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statVal}>{history.length}</div>
              <div className={styles.statKey}>Путешествий</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statVal}>{totalXP}</div>
              <div className={styles.statKey}>Всего XP</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statVal}>{avgAcc}%</div>
              <div className={styles.statKey}>Ср. точность</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statVal}>{formatDuration(totalTimeSec) || topics.length}</div>
              <div className={styles.statKey}>{totalTimeSec > 0 ? 'Время обучения' : 'Изученных тем'}</div>
            </div>
          </div>

          {/* ── Topics ── */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>📈 Темы</h2>
            <div className={styles.topicsGrid}>
              <div className={styles.topicBox}>
                <div className={`${styles.topicBoxLabel} ${styles.topicBoxStrong}`}>
                  ✅ Сильные темы
                </div>
                {strong.length === 0 ? (
                  <p className={styles.emptyTopics}>Ещё нет — продолжайте учиться!</p>
                ) : (
                  <ul className={styles.topicList}>
                    {topics.filter(t => strong.includes(t.topic)).map(t => (
                      <li key={t.topic} className={styles.topicItem}>
                        <span>{t.topic}</span>
                        <span className={`${styles.topicAcc} ${styles.topicAccStrong}`}>
                          {t.accuracy}%
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className={styles.topicBox}>
                <div className={`${styles.topicBoxLabel} ${styles.topicBoxWeak}`}>
                  ⚠️ Слабые темы
                </div>
                {weak.length === 0 ? (
                  <p className={styles.emptyTopics}>Отлично! Слабых тем нет.</p>
                ) : (
                  <ul className={styles.topicList}>
                    {topics.filter(t => weak.includes(t.topic)).map(t => (
                      <li key={t.topic} className={styles.topicItem}>
                        <span>{t.topic}</span>
                        <span className={`${styles.topicAcc} ${styles.topicAccWeak}`}>
                          {t.accuracy}%
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </section>

          {/* ── AI Context Summary ── */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>🤖 AI-резюме прогресса</h2>
            <div className={styles.topicBox} style={{ gridColumn: 'span 2' }}>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: '#94a3b8' }}>
                {buildUserContextSummary(history)}
              </p>
            </div>
          </section>

          {/* ── History ── */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>📚 История путешествий</h2>
            <div className={styles.historyList}>
              {history.map(r => (
                <div key={r.id + r.completedAt} className={styles.historyCard}>
                  <div className={`${styles.historyAcc} ${accClass(r.accuracy)}`}>
                    {r.accuracy}%
                  </div>
                  <div className={styles.historyInfo}>
                    <div className={styles.historyTitle}>{r.title}</div>
                    <div className={styles.historyMeta}>
                      {r.topic} · {formatDate(r.completedAt)}
                      {r.durationSec > 0 && ` · ${formatDuration(r.durationSec)}`}
                    </div>
                  </div>
                  <div className={styles.historyXP}>+{r.xpEarned} XP</div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* ── Confirm clear dialog ── */}
      {confirmClear && (
        <div className={styles.confirmOverlay}>
          <div className={styles.confirmBox}>
            <h3 className={styles.confirmTitle}>Очистить все данные?</h3>
            <p className={styles.confirmText}>
              История путешествий будет удалена. Это действие необратимо.
            </p>
            <div className={styles.confirmBtns}>
              <button className={styles.btnOutline} onClick={() => setConfirmClear(false)}>
                Отмена
              </button>
              <button className={styles.btnDanger} onClick={handleClear}>
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
