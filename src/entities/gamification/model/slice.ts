import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { GamificationState, Achievement, ACHIEVEMENTS } from '../types'

const LS_KEY = 'gamificationState'

function loadFromLocalStorage(): GamificationState {
  try {
    const saved = localStorage.getItem(LS_KEY)
    if (saved) {
      const parsed = JSON.parse(saved) as Partial<GamificationState>
      return {
        totalXP              : parsed.totalXP              ?? 0,
        sessionXP            : 0,
        streak               : parsed.streak               ?? 0,
        maxStreak            : parsed.maxStreak            ?? 0,
        unlockedAchievements : parsed.unlockedAchievements ?? [],
        pendingAchievement   : null,
      }
    }
  } catch {
    // ignore corrupted data
  }
  return {
    totalXP              : 0,
    sessionXP            : 0,
    streak               : 0,
    maxStreak            : 0,
    unlockedAchievements : [],
    pendingAchievement   : null,
  }
}

function saveToLocalStorage(state: GamificationState) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify({
      totalXP              : state.totalXP,
      streak               : state.streak,
      maxStreak            : state.maxStreak,
      unlockedAchievements : state.unlockedAchievements,
    }))
  } catch {
    // quota exceeded or private mode — silently skip
  }
}

const initialState: GamificationState = loadFromLocalStorage()

const gamificationSlice = createSlice({
  name    : 'gamification',
  initialState,
  reducers: {
    addXP(state, action: PayloadAction<{ base: number; speedBonus?: number }>) {
      const { base, speedBonus = 1 } = action.payload
      const multiplier = 1 + (state.streak >= 5 ? 1 : state.streak >= 3 ? 0.5 : state.streak >= 2 ? 0.25 : 0)
      const earned     = Math.round(base * multiplier * speedBonus)
      state.totalXP   += earned
      state.sessionXP += earned
      saveToLocalStorage(state)
    },

    incrementStreak(state) {
      state.streak++
      if (state.streak > state.maxStreak) state.maxStreak = state.streak

      if (state.streak === 5 && !state.unlockedAchievements.includes('streak5')) {
        state.unlockedAchievements.push('streak5')
        if (!state.pendingAchievement) {
          state.pendingAchievement = ACHIEVEMENTS.find(a => a.id === 'streak5') ?? null
        }
      }
      if (state.streak === 10 && !state.unlockedAchievements.includes('unstoppable')) {
        state.unlockedAchievements.push('unstoppable')
        if (!state.pendingAchievement) {
          state.pendingAchievement = ACHIEVEMENTS.find(a => a.id === 'unstoppable') ?? null
        }
      }
      saveToLocalStorage(state)
    },

    resetStreak(state) {
      state.streak = 0
      saveToLocalStorage(state)
    },

    unlockAchievement(state, action: PayloadAction<string>) {
      const id = action.payload
      if (!state.unlockedAchievements.includes(id)) {
        state.unlockedAchievements.push(id)
        const ach = ACHIEVEMENTS.find(a => a.id === id)
        if (ach) state.pendingAchievement = ach
      }
      saveToLocalStorage(state)
    },

    clearPendingAchievement(state) {
      state.pendingAchievement = null
    },

    resetSession(state) {
      state.sessionXP = 0
      state.streak    = 0
      saveToLocalStorage(state)
    },

    resetSessionXP(state) {
      state.sessionXP = 0
    },
  },
})

export const { actions: gamificationActions, reducer: gamificationReducer } = gamificationSlice
