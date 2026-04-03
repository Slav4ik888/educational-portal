import { Reducer } from '@reduxjs/toolkit';
import { ReduxStoreWithManager, StateKey, StateSchema } from 'app/providers/store';
import { FC, useEffect } from 'react';
import { useDispatch, useStore } from 'react-redux';



export type ReducersList = {
  [name in StateKey]?: Reducer<NonNullable<StateSchema[name]>>
}


interface Props {
  reducers            : ReducersList
  removeAfterUnmount? : boolean
  children            : React.ReactNode
}

export const DynamicModuleLoader: FC<Props> = ({
  children, reducers,
  removeAfterUnmount = false
}) => {
  const
    store    = useStore() as ReduxStoreWithManager,
    dispatch = useDispatch();


  useEffect(() => {
    const mountedReducers = store.reducerManager.getMountedReducers();

    Object.entries(reducers).forEach(([key, reducer]) => {
      const mounted = mountedReducers[key as StateKey];

      // Add new reducer if not mounted
      if (! mounted) {
        store.reducerManager.add(key as StateKey, reducer);
        dispatch({ type: `@INIT ${key} reducer` });
      }
    });

    return () => {
      if (removeAfterUnmount) {
        Object.entries(reducers).forEach(([key, reducer]) => {
          store.reducerManager.remove(key as StateKey);
          dispatch({ type: `@DESTROY ${key} reducer` });
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {children}
    </>
  )
};
