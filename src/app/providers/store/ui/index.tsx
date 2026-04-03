import { ReducersMapObject } from '@reduxjs/toolkit';
import { FC, ReactNode } from 'react';
import { Provider } from 'react-redux';
import { StateSchema } from '../config/state';
import { createReduxStore } from '../config/store';



interface Props {
  children?      : ReactNode
  initialState?  : DeepPartial<StateSchema>
  asyncReducers? : DeepPartial<ReducersMapObject<StateSchema>>
}


export const StoreProvider: FC<Props> = ({ initialState, children, asyncReducers }) => {
  const
    store = createReduxStore(
      initialState as StateSchema,
      asyncReducers as ReducersMapObject<StateSchema>,
    );

  return (
    <Provider store={store}>
      {children}
    </Provider>
  )
};
