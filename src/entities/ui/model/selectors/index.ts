import { createSelector } from '@reduxjs/toolkit';
import { StateSchema } from 'app/providers/store';
import { StateSchemaUI } from '../slice/state-schema';


export const selectModule = createSelector([(state: StateSchema) => state.ui || {} as StateSchemaUI],
  (state: StateSchemaUI) => state);

export const selectLoading = createSelector(selectModule, (state: StateSchemaUI) => state.loading);
export const selectErrors  = createSelector(selectModule, (state: StateSchemaUI) => state.errors);

export const selectPageLoading = createSelector(selectModule, (state: StateSchemaUI) => state.pageLoading);

export const selectErrorStatus = createSelector(selectModule, (state: StateSchemaUI) => state.errorStatus);

export const selectMessage = createSelector(selectModule, (state: StateSchemaUI) => state.message);

export const selectScreenFormats = createSelector(selectModule, (state: StateSchemaUI) => state.screenFormats);
export const selectScreenSize = createSelector(selectModule, (state: StateSchemaUI) => state.screenSize);

export const selectAcceptedCookie = createSelector(selectModule, (state: StateSchemaUI) => state.acceptedCookie);
export const selectReplacePath = createSelector(selectModule, (state: StateSchemaUI) => state.replacePath);
