import { configureStore, ReducersMapObject } from '@reduxjs/toolkit'
import { uiReducer } from 'entities/ui';
import { StateSchema } from './state';
import { createReducerManager } from './reducer-manager';
import { api } from 'shared/api';
import { articleReducer } from 'entities/article';


export function createReduxStore(
  initialState?  : StateSchema,
  asyncReducers? : ReducersMapObject<StateSchema>,
) {
  const
    rootReducers: ReducersMapObject<StateSchema> = {
      ...asyncReducers,

      // Entities
      ui           : uiReducer,
      article      : articleReducer,
    },
    reducerManager = createReducerManager(rootReducers),
    extraArg = {
      api
    };

  const store = configureStore({
    reducer        : reducerManager.reduce,
    devTools       : __IS_DEV__,
    preloadedState : initialState || {},
    middleware     : getDefaultMiddleware => getDefaultMiddleware({
      thunk: {
        extraArgument: extraArg
      }
    })
  });

  // @ts-ignore
  store.reducerManager = reducerManager;

  return store
}

export type AppDispatch = ReturnType<typeof createReduxStore>['dispatch'];
