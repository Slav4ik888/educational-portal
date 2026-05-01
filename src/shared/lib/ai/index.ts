import axios from 'axios'
import { Journey } from 'entities/journey'

const aiApi = axios.create({
  baseURL : '/api/ai',
  timeout : 1000 * 90,
})

export interface GenerateJourneyParams {
  topic? : string
  text?  : string
}

export interface AiEvaluationResult {
  score        : number
  isCorrect    : boolean
  feedback     : string
  strengths?   : string
  improvements?: string
}

export async function generateJourney(params: GenerateJourneyParams): Promise<Journey> {
  const { data } = await aiApi.post<{ journey: Journey }>('/generate-journey', params)
  return data.journey
}

export async function evaluateAnswer(params: {
  concept            : string
  question           : string
  exampleAnswer?     : string
  evaluationCriteria : string
  userAnswer         : string
}): Promise<AiEvaluationResult> {
  const { data } = await aiApi.post<AiEvaluationResult>('/evaluate-answer', params)
  return data
}
