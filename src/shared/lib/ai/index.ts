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

// ── AI Feature Types ────────────────────────────────────────────────────────

export interface WeakArea {
  topic  : string
  issue  : string
  advice : string
}

export interface ProgressAnalysis {
  summary   : string
  weakAreas : WeakArea[]
  strengths : string
  nextFocus : string
}

export interface Recommendation {
  title            : string
  reason           : string
  difficulty       : 'beginner' | 'intermediate' | 'advanced'
  estimatedMinutes : number
}

export interface RecommendNextResult {
  recommendations : Recommendation[]
  advice          : string
}

export interface ExplainResult {
  explanation : string
  keyPoints   : string[]
  analogy     : string
}

// ── AI Feature Functions ─────────────────────────────────────────────────────

export async function analyzeProgress(params: {
  contextSummary    : string
  weakTopics?       : string[]
  checkpointResults?: Array<{ concept: string; accuracy: number }>
}): Promise<ProgressAnalysis> {
  try {
    const { data } = await aiApi.post<ProgressAnalysis>('/analyze-progress', params)
    return data
  } catch (err) {
    throw new Error(extractErrorMessage(err, 'Ошибка анализа прогресса'))
  }
}

export async function recommendNext(params: {
  contextSummary   : string
  completedTopics? : string[]
  weakTopics?      : string[]
}): Promise<RecommendNextResult> {
  try {
    const { data } = await aiApi.post<RecommendNextResult>('/recommend-next', params)
    return data
  } catch (err) {
    throw new Error(extractErrorMessage(err, 'Ошибка получения рекомендаций'))
  }
}

export async function explainSimpler(params: {
  content  : string
  concept? : string
}): Promise<ExplainResult> {
  try {
    const { data } = await aiApi.post<ExplainResult>('/explain', params)
    return data
  } catch (err) {
    throw new Error(extractErrorMessage(err, 'Ошибка объяснения'))
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

const RAG_JOURNEY_STORE_KEY = 'ragIndexedJourneys'

function saveJourneyToRagStore(journey: Journey): void {
  try {
    const raw  = localStorage.getItem(RAG_JOURNEY_STORE_KEY)
    const store: Record<string, Journey> = raw ? JSON.parse(raw) : {}
    store[journey.id] = journey
    // Keep at most 20 journeys to avoid localStorage bloat
    const ids = Object.keys(store)
    if (ids.length > 20) {
      delete store[ids[0]]
    }
    localStorage.setItem(RAG_JOURNEY_STORE_KEY, JSON.stringify(store))
  } catch {
    // quota exceeded or private mode — silently skip
  }
}

export async function ragIndexJourney(journey: Journey): Promise<void> {
  saveJourneyToRagStore(journey)
  try {
    await ragApi.post('/index-journey', { journey })
  } catch {
    // Non-critical: silently ignore indexing failures
  }
}

/** Call once on app startup to re-index all locally persisted journeys */
export async function ragRehydrateJourneys(): Promise<void> {
  try {
    const raw = localStorage.getItem(RAG_JOURNEY_STORE_KEY)
    if (!raw) return
    const store = JSON.parse(raw) as Record<string, Journey>
    const journeys = Object.values(store)
    // Fire-and-forget all rehydration calls; ignore individual failures
    await Promise.allSettled(
      journeys.map(j => ragApi.post('/index-journey', { journey: j }))
    )
  } catch {
    // silently ignore
  }
}
