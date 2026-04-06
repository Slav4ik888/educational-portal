import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { cfg } from 'app/config/index';
import { StateSchemaUserProgress } from './state-schema';



const loadFromLocalStorage = (): StateSchemaUserProgress => {
  const saved = localStorage.getItem('userProgress');
  if (saved) {
    // На время разработки прогресс начинаем с нуля
    return cfg.IS_DEV ? { articlesProgress: {} } : JSON.parse(saved);
  }
  return { articlesProgress: {} };
};

const initialState: StateSchemaUserProgress = loadFromLocalStorage();


export const slice = createSlice({
  name: 'entities/userProgress',
  initialState,
  reducers: {
    updateBlockProgress: (
      state,
      action: PayloadAction<{
        articleId : string;
        blockId   : string;
        completed : boolean;
        score?    : number;
      }>
    ) => {
      const { articleId, blockId, completed, score } = action.payload;

      if (! state.articlesProgress[articleId]) {
        state.articlesProgress[articleId] = {
          lastBlockIndex     : 0,
          blockResults       : {},
          completedBlockIds  : [], // если используете Set
          testResults        : {},
          finalTestCompleted : false,
          finalTestScore     : null,
        };
      }

      state.articlesProgress[articleId].blockResults[blockId] = { completed, score };

      if (completed) {
        const completedBlockIds = [...state.articlesProgress[articleId].completedBlockIds];
        state.articlesProgress[articleId].completedBlockIds = [...completedBlockIds, blockId];
      }

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
      const { articleId } = action.payload;
      if (state.articlesProgress[articleId]) {
        state.articlesProgress[articleId].completedAt = new Date().toISOString();
        localStorage.setItem('userProgress', JSON.stringify(state));
      }
    },
    updateFinalTestProgress: (state, action: PayloadAction<{
      articleId: string,
      score: number,
      completed: boolean
    }>) => {
      const { articleId, score, completed } = action.payload;
      state.articlesProgress[articleId] = {
        ...state.articlesProgress[articleId],
        finalTestCompleted : completed,
        finalTestScore     : score,
        completedAt        : new Date().toISOString(),
      };
    },

    clearProgress: (state, action: PayloadAction<string>) => {
      delete state.articlesProgress[action.payload];
      localStorage.setItem('userProgress', JSON.stringify(state));
    },
  },
});

export const { actions, reducer } = slice;
