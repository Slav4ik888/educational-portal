export interface Achievement {
  id          : string
  title       : string
  description : string
  icon        : string
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id         : 'streak5',
    title      : '5 подряд без ошибок',
    description: 'Вы правильно ответили 5 раз подряд',
    icon       : '🔥',
  },
  {
    id         : 'lightning',
    title      : 'Молниеносный',
    description: 'Чекпоинт пройден менее чем за 60 секунд',
    icon       : '⚡',
  },
  {
    id         : 'unstoppable',
    title      : 'Неудержимый',
    description: '10 правильных ответов подряд без единой ошибки',
    icon       : '🚀',
  },
]

export interface GamificationState {
  totalXP               : number
  sessionXP             : number
  streak                : number
  maxStreak             : number
  unlockedAchievements  : string[]
  pendingAchievement    : Achievement | null
}
