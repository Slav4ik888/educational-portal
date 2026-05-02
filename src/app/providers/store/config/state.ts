import { AxiosInstance } from 'axios';
import { NavigateOptions, To } from 'react-router-dom';
import { Action, EnhancedStore, Reducer, ReducersMapObject } from '@reduxjs/toolkit';
import { StateSchemaUI } from 'entities/ui';
import { StateSchemaArticle } from 'entities/article';
import { StateSchemaUserProgress } from 'entities/user-progress';
import { StateSchemaJourney } from 'entities/journey';
import { GamificationState } from 'entities/gamification';
import { PersonalContextState } from 'entities/personal-context';



export interface StateSchema {
  // Entities
  ui              : StateSchemaUI
  article         : StateSchemaArticle
  userProgress    : StateSchemaUserProgress
  journey         : StateSchemaJourney
  gamification    : GamificationState
  personalContext : PersonalContextState

  // Async reducer
  // dashboardData?      : StateSchemaDashboardData
}


// export const selectProps = (_: StateSchema, props: any) => props;
export const selectState = (state: StateSchema) => state;


export type StateKey = keyof StateSchema;
export type MountedReducers = OptionalRecord<StateKey, boolean> // True - mounted, false - not mounted

export interface ReducerManager {
  getReducerMap      : () => ReducersMapObject<StateSchema>
  reduce             : (state: StateSchema, action: Action) => any // CombinedState<StateSchema>
  add                : (key: StateKey, reducer: Reducer) => void
  remove             : (key: StateKey) => void
  getMountedReducers : () => MountedReducers
}

export interface ReduxStoreWithManager extends EnhancedStore<StateSchema> {
  reducerManager: ReducerManager
}

export interface ThunkExtraArg {
  api       : AxiosInstance
  navigate? : (to: To, options?: NavigateOptions) => void
}

export interface ThunkConfig<T> {
  rejectValue : T
  extra       : ThunkExtraArg
  state       : StateSchema
}
