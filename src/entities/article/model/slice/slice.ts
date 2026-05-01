import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StateSchemaArticle } from './state-schema';
import { getPayloadError as getError } from 'shared/lib/errors';
import { Errors } from 'shared/lib/validators';
import { Article } from '../../types';



const initialState: StateSchemaArticle = {
  loading        : false,
  errors         : {},
  articles       : [],
  currentArticle : null,
  isLoading      : false
};

export const slice = createSlice({
  name: 'entities/article',
  initialState,
  reducers: {
    setErrors: (state, { payload }: PayloadAction<Errors>) => {
      state.errors = getError(payload);
    },
    clearErrors: (state) => {
      state.errors = {};
    },
    setArticles: (state, action: PayloadAction<Article[]>) => {
      state.articles = action.payload;
    },
    setCurrentArticle: (state, action: PayloadAction<Article | null>) => {
      state.currentArticle = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  }
})

export const { actions, reducer } = slice;
