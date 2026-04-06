import { TestQuestionType } from 'entities/test-block';



export interface ContentBlockType {
  id         : string
  type       : 'theory' | 'test'
  content    : string // для теории
  questions? : TestQuestionType[] // для тестовых блоков
}

export type Difficulty = 'beginner' | 'intermediate' | 'advanced'

export interface Article {
  id          : string
  title       : string
  description : string
  blocks      : ContentBlockType[]
  finalTest   : TestQuestionType[]
  coverImage? : string
  duration    : number // в минутах
  difficulty  : Difficulty
  tags        : string[]
  createdAt   : string
}
