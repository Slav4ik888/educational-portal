import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StateSchemaUserProgress } from './state-schema';



const loadFromLocalStorage = (): StateSchemaUserProgress => {
  const saved = localStorage.getItem('userProgress');
  if (saved) {
    return JSON.parse(saved);
  }
  return { articlesProgress: {} };
};

const initialState: StateSchemaUserProgress = loadFromLocalStorage();

// const progressSlice = createSlice({
//   name: 'progress',

export const slice = createSlice({
  name: 'entities/article',
  initialState,
  reducers: {
    updateBlockProgress: (
      state,
      action: PayloadAction<{
        articleId: string;
        blockId: string;
        completed: boolean;
        score?: number;
      }>
    ) => {
      const { articleId, blockId, completed, score } = action.payload;

      if (!state.articlesProgress[articleId]) {
        state.articlesProgress[articleId] = {
          lastBlockIndex: 0,
          blockResults: {},
        };
      }

      state.articlesProgress[articleId].blockResults[blockId] = { completed, score };

      // Сохраняем в localStorage
      localStorage.setItem('userProgress', JSON.stringify(state));
    },

    updateLastBlockIndex: (
      state,
      action: PayloadAction<{ articleId: string; blockIndex: number }>
    ) => {
      const { articleId, blockIndex } = action.payload;
      if (state.articlesProgress[articleId]) {
        state.articlesProgress[articleId].lastBlockIndex = blockIndex;
        localStorage.setItem('userProgress', JSON.stringify(state));
      }
    },

    completeArticle: (
      state,
      action: PayloadAction<{ articleId: string; score: number }>
    ) => {
      const { articleId, score } = action.payload;
      if (state.articlesProgress[articleId]) {
        state.articlesProgress[articleId].completedAt = new Date().toISOString();
        localStorage.setItem('userProgress', JSON.stringify(state));
      }
    },

    clearProgress: (state, action: PayloadAction<string>) => {
      delete state.articlesProgress[action.payload];
      localStorage.setItem('userProgress', JSON.stringify(state));
    },
  },
});

export const { actions, reducer } = slice;
