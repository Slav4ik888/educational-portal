import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StateSchemaArticle } from './state-schema';
import { getPayloadError as getError } from 'shared/lib/errors';
import { Errors } from 'shared/lib/validators';
import { Article } from 'entities/article';



const initialState: StateSchemaArticle = {
  loading        : false,
  errors         : {},
  articles       : Article[]
  currentArticle : Article | null
  isLoading      : boolean
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
  }
})

export const { actions, reducer } = slice;
