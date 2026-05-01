import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { GamificationState, Achievement, ACHIEVEMENTS } from '../types'

const initialState: GamificationState = {
  totalXP              : 0,
  sessionXP            : 0,
  streak               : 0,
  maxStreak            : 0,
  unlockedAchievements : [],
  pendingAchievement   : null,
}

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
    },

    incrementStreak(state) {
      state.streak++
      if (state.streak > state.maxStreak) state.maxStreak = state.streak

      // streak5: fires when streak reaches exactly 5
      if (state.streak === 5 && !state.unlockedAchievements.includes('streak5')) {
        state.unlockedAchievements.push('streak5')
        if (!state.pendingAchievement) {
          state.pendingAchievement = ACHIEVEMENTS.find(a => a.id === 'streak5') ?? null
        }
      }
      // unstoppable: fires when streak reaches 10
      if (state.streak === 10 && !state.unlockedAchievements.includes('unstoppable')) {
        state.unlockedAchievements.push('unstoppable')
        if (!state.pendingAchievement) {
          state.pendingAchievement = ACHIEVEMENTS.find(a => a.id === 'unstoppable') ?? null
        }
      }
    },

    resetStreak(state) {
      state.streak = 0
    },

    unlockAchievement(state, action: PayloadAction<string>) {
      const id = action.payload
      if (!state.unlockedAchievements.includes(id)) {
        state.unlockedAchievements.push(id)
        const ach = ACHIEVEMENTS.find(a => a.id === id)
        if (ach) state.pendingAchievement = ach
      }
    },

    clearPendingAchievement(state) {
      state.pendingAchievement = null
    },

    resetSession(state) {
      state.sessionXP = 0
      state.streak    = 0
    },
  },
})

export const { actions: gamificationActions, reducer: gamificationReducer } = gamificationSlice
