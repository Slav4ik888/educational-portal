import { AsyncThunkAction } from '@reduxjs/toolkit';
import axios, { AxiosStatic } from 'axios';
import { Errors } from '../../validators';
import { StateSchema } from 'app/providers/store';


type ActionCreator<Return, Arg, RejectedValue> = (arg: Arg) =>
  AsyncThunkAction<Return, Arg, { rejectValue: Errors }>;

jest.mock('axios');
const mockedAxios = jest.mocked(axios, { shallow: true });


export class TestAsyncThunk<Return, Arg, RejectedValue> {
  dispatch      : jest.MockedFn<any>;
  api           : jest.MockedFn<AxiosStatic>;
  navigate      : jest.MockedFn<any>;
  getState      : () => StateSchema;
  actionCreator : ActionCreator<Return, Arg, RejectedValue>;


  constructor(
    actionCreator : ActionCreator<Return, Arg, RejectedValue>,
    state?        : DeepPartial<StateSchema>
  ) {
    this.actionCreator = actionCreator;
    this.dispatch = jest.fn();
    this.getState = jest.fn(() => state as StateSchema || {} as StateSchema);
    this.api      = mockedAxios;
    this.navigate = jest.fn();
  }

  async callThunk(arg: Arg) {
    const
      action = this.actionCreator(arg),
      result = await action(
        this.dispatch,
        this.getState,
        { api: this.api, navigate: this.navigate }
      );

    return result;
  }
}
