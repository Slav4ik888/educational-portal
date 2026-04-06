
export interface BlockProgress {
  completed : boolean
  score?    : number
}

export interface ArticleProgress {
  completedBlockIds  : string[] // Пройденные тесты по блокам
  testResults        : Record<string, number>
  finalTestCompleted : boolean
  finalTestScore     : number | null
  lastBlockIndex     : number
  blockResults       : Record<string, BlockProgress>
  completedAt?       : string
}
