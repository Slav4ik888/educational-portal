import { TestQuestion } from 'entities/test-block';



export interface ContentBlock {
  id         : string
  type       : 'theory' | 'test'
  content    : string // для теории
  questions? : TestQuestion[] // для тестовых блоков
}

export interface Article {
  id          : string
  title       : string
  description : string
  blocks      : ContentBlock[]
  finalTest   : TestQuestion[]
  coverImage? : string
  duration    : number // в минутах
  difficulty  : 'beginner' | 'intermediate' | 'advanced'
  tags        : string[]
  createdAt   : string
}
