import { configureStore, ReducersMapObject } from '@reduxjs/toolkit'
import { uiReducer } from 'entities/ui';
import { api } from 'shared/api';
import { StateSchema } from 'app/providers/store';
import { createReducerManager } from 'app/providers/store/config/reducer-manager';
import { articleReducer } from 'entities/article';
import { userProgressReducer } from 'entities/user-progress';



export function createReduxStore(initialState: DeepPartial<StateSchema>) {
  const
    rootReducers: ReducersMapObject<StateSchema> = {
      ui           : uiReducer,
      article      : articleReducer,
      userProgress : userProgressReducer,
    },
    reducerManager = createReducerManager(rootReducers),
    extraArg = {
      api
    };

  const store = configureStore({
    reducer        : reducerManager.reduce,
    devTools       : __IS_DEV__,
    preloadedState : initialState || {},
    // @ts-ignore
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
