import { configureStore, Reducer, ReducersMapObject } from '@reduxjs/toolkit'
import { reducerUI } from 'entities/ui';
import { api } from 'shared/api';
import { StateSchema } from 'app/providers/store1';
import { createReducerManager } from 'app/providers/store/config/reducer-manager';
import { reducerCompany } from 'entities/company';
import { reducerUser } from 'entities/user';
import { reducerDashboardView } from 'entities/dashboard-view';



export function createReduxStore(initialState: DeepPartial<StateSchema>) {
  const
    rootReducers: ReducersMapObject<StateSchema> = {
      // Entities
      ui           : reducerUI,
      user         : reducerUser,
      company      : reducerCompany,

      // @ts-ignore
      dashboardView : reducerDashboardView,
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
