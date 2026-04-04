import { StateSchema } from 'app/providers/store';
import { FC, ReactNode } from 'react';
import { Provider } from 'react-redux';
import { createReduxStore } from '../create-redux-store';



interface Props {
  children       : ReactNode
  initialState   : DeepPartial<StateSchema>
}


export const StoreProvider: FC<Props> = ({ initialState, children }) => {
  const store = createReduxStore(initialState as StateSchema);

  return (
    <Provider store={store}>
      {children}
    </Provider>
  )
};
