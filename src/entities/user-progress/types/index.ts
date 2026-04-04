
export interface BlockProgress {
  completed : boolean
  score?    : number
}

export interface ArticleProgress {
  lastBlockIndex : number
  blockResults   : Record<string, BlockProgress>
  completedAt?   : string
}
