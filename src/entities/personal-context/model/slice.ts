import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { PersonalContextState, JourneyRecord } from '../types'

const LS_KEY = 'personalContext'

function loadFromLocalStorage(): PersonalContextState {
  try {
    const saved = localStorage.getItem(LS_KEY)
    if (saved) {
      const parsed = JSON.parse(saved) as Partial<PersonalContextState>
      return {
        journeyHistory: parsed.journeyHistory ?? [],
      }
    }
  } catch {
    // ignore corrupted data
  }
  return { journeyHistory: [] }
}

function saveToLocalStorage(state: PersonalContextState) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(state))
  } catch {
    // quota exceeded or private mode — silently skip
  }
}

const initialState: PersonalContextState = loadFromLocalStorage()

const personalContextSlice = createSlice({
  name: 'personalContext',
  initialState,
  reducers: {
    addJourneyRecord(state, action: PayloadAction<JourneyRecord>) {
      // Always prepend as a new immutable completion event.
      // completionId is unique per completion attempt, so repeated runs
      // of the same journey each create their own history entry.
      state.journeyHistory.unshift(action.payload)
      saveToLocalStorage(state)
    },

    clearAllHistory(state) {
      state.journeyHistory = []
      try { localStorage.removeItem(LS_KEY) } catch { /* ignore */ }
    },
  },
})

export const personalContextActions = personalContextSlice.actions
export const personalContextReducer = personalContextSlice.reducer
