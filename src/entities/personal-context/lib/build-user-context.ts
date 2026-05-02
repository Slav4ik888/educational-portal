import { JourneyRecord } from '../types'

function daysSince(isoDate: string): number {
  const diff = Date.now() - new Date(isoDate).getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

function topicAccuracy(history: JourneyRecord[]): { topic: string; accuracy: number }[] {
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

export function buildUserContextSummary(history: JourneyRecord[]): string {
  if (history.length === 0) {
    return 'Пользователь ещё не завершил ни одного путешествия.'
  }

  const total    = history.length
  const avgAcc   = Math.round(history.reduce((s, r) => s + r.accuracy, 0) / total)
  const totalXP  = history.reduce((s, r) => s + r.xpEarned, 0)
  const sorted   = topicAccuracy(history)
  const strong   = sorted.filter(t => t.accuracy >= 70).slice(0, 3).map(t => t.topic)
  const weak     = sorted.filter(t => t.accuracy <  70).slice(-3).map(t => t.topic)
  const last     = history[0]
  const lastAgo  = daysSince(last.completedAt)

  const lines: string[] = [
    `Пройдено путешествий: ${total}. Суммарный XP: ${totalXP}. Средняя точность: ${avgAcc}%.`,
  ]

  if (strong.length > 0) {
    lines.push(`Сильные темы: ${strong.join(', ')}.`)
  }
  if (weak.length > 0) {
    lines.push(`Слабые темы (требуют повторения): ${weak.join(', ')}.`)
  }

  const ago = lastAgo === 0 ? 'сегодня' : `${lastAgo} дн. назад`
  lines.push(`Последнее путешествие: "${last.title}" (${ago}, ${last.accuracy}% точность).`)

  return lines.join(' ')
}

export function getWeakTopics(history: JourneyRecord[]): string[] {
  return topicAccuracy(history)
    .filter(t => t.accuracy < 70)
    .map(t => t.topic)
}

export function getStrongTopics(history: JourneyRecord[]): string[] {
  return topicAccuracy(history)
    .filter(t => t.accuracy >= 70)
    .map(t => t.topic)
}
