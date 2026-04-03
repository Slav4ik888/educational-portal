import { AnyAction, combineReducers, Reducer, ReducersMapObject } from '@reduxjs/toolkit';
import { ReducerManager, StateSchema, StateKey, MountedReducers } from './state';



export function createReducerManager(initialReducers: ReducersMapObject<StateSchema>): ReducerManager {
  const
    reducers: ReducersMapObject<StateSchema> = { ...initialReducers },
    mountedReducers: MountedReducers = {};

  let combinedReducer = combineReducers(reducers);
  let keysToRemove: StateKey[] = [];

  return {
    getReducerMap: () => reducers,
    getMountedReducers: () => mountedReducers,

    reduce: (state: StateSchema, action: AnyAction) => {
      if (keysToRemove.length > 0) {
        state = { ...state };
        keysToRemove.forEach(key => {
          // @ts-ignore
          delete state[key];
        });

        keysToRemove = [];
      }

      // @ts-ignore
      return combinedReducer(state, action)
    },

    add: (key: StateKey, reducer: Reducer) => {
      if (!key || reducers[key]) return

      reducers[key] = reducer;
      mountedReducers[key] = true;

      combinedReducer = combineReducers(reducers);
    },

    remove: (key: StateKey) => {
      if (!key || !reducers[key]) return

      // @ts-ignore
      delete reducers[key];
      mountedReducers[key] = false;
      keysToRemove.push(key);

      combinedReducer = combineReducers(reducers)
    }
  }
}
