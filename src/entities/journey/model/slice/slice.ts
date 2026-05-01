import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { StateSchemaJourney } from './state-schema'
import { Journey, ActivityAnswer } from '../../types'

const LS_KEY = 'journeyState'

function loadFromLocalStorage(): StateSchemaJourney {
  try {
    const saved = localStorage.getItem(LS_KEY)
    if (saved) {
      const parsed = JSON.parse(saved) as Partial<StateSchemaJourney>
      return {
        current      : parsed.current      ?? null,
        isGenerating : false,
        error        : null,
        answers      : parsed.answers      ?? {},
        progress     : parsed.progress     ?? {
          currentCheckpointIdx : 0,
          completedCheckpoints : [],
          timedOutCheckpoints  : [],
        },
      }
    }
  } catch {
    // ignore corrupted data
  }
  return {
    current      : null,
    isGenerating : false,
    error        : null,
    answers      : {},
    progress     : {
      currentCheckpointIdx : 0,
      completedCheckpoints : [],
      timedOutCheckpoints  : [],
    },
  }
}

function saveToLocalStorage(state: StateSchemaJourney) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify({
      current  : state.current,
      answers  : state.answers,
      progress : state.progress,
    }))
  } catch {
    // quota exceeded or private mode — silently skip
  }
}

const initialState: StateSchemaJourney = loadFromLocalStorage()

export const journeySlice = createSlice({
  name: 'journey',
  initialState,
  reducers: {
    setJourney: (state, action: PayloadAction<Journey>) => {
      state.current  = action.payload
      state.error    = null
      state.answers  = {}
      state.progress = { currentCheckpointIdx: 0, completedCheckpoints: [], timedOutCheckpoints: [] }
      saveToLocalStorage(state)
    },

    clearJourney: (state) => {
      state.current      = null
      state.error        = null
      state.answers      = {}
      state.progress     = { currentCheckpointIdx: 0, completedCheckpoints: [], timedOutCheckpoints: [] }
      state.isGenerating = false
      try { localStorage.removeItem(LS_KEY) } catch { /* ignore */ }
    },

    setGenerating: (state, action: PayloadAction<boolean>) => {
      state.isGenerating = action.payload
      if (action.payload) state.error = null
    },

    setError: (state, action: PayloadAction<string>) => {
      state.error        = action.payload
      state.isGenerating = false
    },

    setActivityAnswer: (state, action: PayloadAction<ActivityAnswer>) => {
      state.answers[action.payload.activityId] = action.payload
      saveToLocalStorage(state)
    },

    setAiEvaluation: (
      state,
      action: PayloadAction<{
        activityId   : string
        score        : number
        feedback     : string
        strengths?   : string | null
        improvements?: string | null
      }>
    ) => {
      const a = state.answers[action.payload.activityId]
      if (a) {
        a.aiScore        = action.payload.score
        a.aiFeedback     = action.payload.feedback
        a.aiStrengths    = action.payload.strengths    ?? null
        a.aiImprovements = action.payload.improvements ?? null
        a.isEvaluated    = true
      }
      saveToLocalStorage(state)
    },

    completeCheckpoint: (state, action: PayloadAction<string>) => {
      if (!state.progress.completedCheckpoints.includes(action.payload)) {
        state.progress.completedCheckpoints.push(action.payload)
      }
      saveToLocalStorage(state)
    },

    completeCheckpointTimedOut: (state, action: PayloadAction<string>) => {
      if (!state.progress.completedCheckpoints.includes(action.payload)) {
        state.progress.completedCheckpoints.push(action.payload)
      }
      if (!state.progress.timedOutCheckpoints.includes(action.payload)) {
        state.progress.timedOutCheckpoints.push(action.payload)
      }
      saveToLocalStorage(state)
    },

    clearCheckpointAnswers: (state, action: PayloadAction<string[]>) => {
      action.payload.forEach(id => {
        delete state.answers[id]
      })
      saveToLocalStorage(state)
    },

    nextCheckpoint: (state) => {
      if (state.current && state.progress.currentCheckpointIdx < state.current.checkpoints.length - 1) {
        state.progress.currentCheckpointIdx += 1
      }
      saveToLocalStorage(state)
    },
  }
})

export const journeyActions = journeySlice.actions
export const journeyReducer = journeySlice.reducer
