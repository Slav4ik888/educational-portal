import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { StateSchemaJourney } from './state-schema'
import { Journey, ActivityAnswer } from '../../types'

const initialState: StateSchemaJourney = {
  current     : null,
  isGenerating: false,
  error       : null,
  answers     : {},
  progress    : {
    currentCheckpointIdx : 0,
    completedCheckpoints : [],
    timedOutCheckpoints  : [],
  }
}

export const journeySlice = createSlice({
  name: 'journey',
  initialState,
  reducers: {
    setJourney: (state, action: PayloadAction<Journey>) => {
      state.current  = action.payload
      state.error    = null
      state.answers  = {}
      state.progress = { currentCheckpointIdx: 0, completedCheckpoints: [], timedOutCheckpoints: [] }
    },

    clearJourney: (state) => {
      state.current      = null
      state.error        = null
      state.answers      = {}
      state.progress     = { currentCheckpointIdx: 0, completedCheckpoints: [], timedOutCheckpoints: [] }
      state.isGenerating = false
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
    },

    completeCheckpoint: (state, action: PayloadAction<string>) => {
      if (!state.progress.completedCheckpoints.includes(action.payload)) {
        state.progress.completedCheckpoints.push(action.payload)
      }
    },

    completeCheckpointTimedOut: (state, action: PayloadAction<string>) => {
      if (!state.progress.completedCheckpoints.includes(action.payload)) {
        state.progress.completedCheckpoints.push(action.payload)
      }
      if (!state.progress.timedOutCheckpoints.includes(action.payload)) {
        state.progress.timedOutCheckpoints.push(action.payload)
      }
    },

    nextCheckpoint: (state) => {
      if (state.current && state.progress.currentCheckpointIdx < state.current.checkpoints.length - 1) {
        state.progress.currentCheckpointIdx += 1
      }
    },
  }
})

export const journeyActions = journeySlice.actions
export const journeyReducer = journeySlice.reducer
