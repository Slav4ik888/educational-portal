import axios, { AxiosError } from 'axios'
import { Journey, ActivityType } from 'entities/journey'

const aiApi = axios.create({
  baseURL : '/api/ai',
  timeout : 1000 * 90,
})

const ragApi = axios.create({
  baseURL : '/api/rag',
  timeout : 1000 * 60,
})

export interface RagSource {
  articleId    : string
  articleTitle : string
  heading      : string
  url          : string
  type?        : 'article' | 'journey'
}

export interface RagSearchResult {
  answer  : string
  sources : RagSource[]
}

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

interface ApiErrorBody {
  error?: string
}

function extractErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof AxiosError) {
    const body = err.response?.data as ApiErrorBody | undefined
    return body?.error || err.message || fallback
  }
  if (err instanceof Error) return err.message
  return fallback
}

export async function generateJourney(params: GenerateJourneyParams): Promise<Journey> {
  try {
    const { data } = await aiApi.post<{ journey: Journey }>('/generate-journey', params)
    return data.journey
  } catch (err) {
    throw new Error(extractErrorMessage(err, 'Ошибка генерации путешествия'))
  }
}

export async function evaluateAnswer(params: {
  concept            : string
  activityType       : ActivityType
  question           : string
  reasoning?         : string
  exampleAnswer?     : string
  evaluationCriteria : string
  userAnswer         : string
  forbiddenTerms?    : string[]
}): Promise<AiEvaluationResult> {
  try {
    const { data } = await aiApi.post<AiEvaluationResult>('/evaluate-answer', params)
    return data
  } catch (err) {
    throw new Error(extractErrorMessage(err, 'Ошибка оценки ответа'))
  }
}

export async function ragSearch(params: {
  query: string
}): Promise<RagSearchResult> {
  try {
    const { data } = await ragApi.post<RagSearchResult>('/search', params)
    return data
  } catch (err) {
    throw new Error(extractErrorMessage(err, 'Ошибка поиска'))
  }
}

export async function ragIndexJourney(journey: Journey): Promise<void> {
  try {
    await ragApi.post('/index-journey', { journey })
  } catch {
    // Non-critical: silently ignore indexing failures
  }
}
