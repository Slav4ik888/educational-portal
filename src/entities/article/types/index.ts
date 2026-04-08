import { TestQuestion } from 'entities/test-block';


/** Тип блока контента */
export interface ContentBlockType {
  id         : string
  type       : 'theory' | 'test'
  content    : string // для теории
  questions? : TestQuestion[] // для тестовых блоков
}

export type Difficulty = 'beginner' | 'intermediate' | 'advanced'

/** Структура статьи */
export interface Article {
  id          : string
  title       : string
  description : string
  blocks      : ContentBlockType[]
  finalTest   : TestQuestion[]
  coverImage? : string
  duration    : number // в минутах
  difficulty  : Difficulty
  tags        : string[]
  createdAt   : string
}
