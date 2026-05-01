import { JourneyActivity, ActivityAnswer } from '../types'

export function checkActivityCorrect(
  activity : JourneyActivity,
  ans      : ActivityAnswer | undefined,
): boolean {
  if (!ans) return false

  if (activity.type === 'multiple-choice') {
    const val = ans.value as number[]
    return val?.length === activity.correctAnswers.length &&
      activity.correctAnswers.every(c => val.includes(c))
  }

  if (activity.type === 'true-false') {
    return ans.value === activity.correctAnswer
  }

  if (activity.type === 'fill-blank') {
    const vals = ans.value as Record<string, string>
    const norm = activity.caseSensitive
      ? (s: string) => s
      : (s: string) => s.toLowerCase()
    return activity.blanks.every(b => {
      const v = (vals?.[b.id] ?? '').trim()
      return norm(v) === norm(b.correctAnswer) ||
        (b.alternatives ?? []).some(a => norm(v) === norm(a))
    })
  }

  return false
}
