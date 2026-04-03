import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { cfg } from 'app/config';
import { LS } from 'shared/lib/local-storage';
import { Errors } from 'shared/lib/validators';
import { Message, MessageType } from '../../types';
import { getScreenFormats, getScreenSize, isAcceptCookie } from '../utils';
import { PageLoading, PageLoadingType, StateSchemaUI } from './state-schema';



const initialState: StateSchemaUI = {
  loading        : false,
  pageLoading    : {},
  errors         : {},
  errorStatus    : 0,
  message        : {} as Message,   // Current message for display
  screenFormats  : getScreenFormats(getScreenSize()), // Сurrent screen format
  screenSize     : getScreenSize(), // Сurrent screen length
  replacePath    : '',              // For replace after login or signup
  acceptedCookie : isAcceptCookie(), // Разрешение user use cookie
};


export const slice = createSlice({
  name: 'entities/ui',
  initialState,
  reducers: {
    // UI
    setErrors: (state, { payload }: PayloadAction<Errors>) => {
      state.errors      = payload;
      state.pageLoading = {};
    },
    setErrorStatus: (state,
      { payload: { status, pathname } }: PayloadAction<{ status: number, pathname?: string }>) => {
      state.errorStatus = status;
      if (pathname) state.replacePath = pathname;

      state.pageLoading = {};
    },

    // PAGE LOADER
    setPageLoading: (state, { payload }: PayloadAction<PageLoading | undefined>) => {
      if (! payload) {
        state.pageLoading = {};
        return;
      }

      Object.entries(payload).forEach(([key, value]) => {
        // @ts-ignore
        if (value && ! value?.text) {
          // console.log(`Remove key: ${key}`); console.log('name: ', value.name);

          if (state.pageLoading?.[key as PageLoadingType]) {
            delete state.pageLoading[key as PageLoadingType];
          }
        }
        else {
          // console.log(`Add key: ${key}`); console.log('name: ', value.name);
          state.pageLoading[key as PageLoadingType] = value;
        }
      });
    },

    // MESSAGES
    setMessage: (state, { payload }: { payload: Message }) => {
      state.message     = payload;
    },

    setInfoMessage: (state, { payload }: { payload: string }) => {
      state.message     = {
        type    : MessageType.INFO,
        message : payload,
        timeout : cfg.DEFAULT_MESSAGE_TIMEOUT
      };
    },
    setSuccessMessage: (state, { payload }: { payload: string }) => {
      state.message     = {
        type    : MessageType.SUCCESS,
        message : payload,
        timeout : cfg.DEFAULT_MESSAGE_TIMEOUT
      };
    },
    setWarningMessage: (state, { payload }: { payload: string }) => {
      state.message     = {
        type    : MessageType.WARNING,
        message : payload,
        timeout : cfg.DEFAULT_MESSAGE_TIMEOUT
      };
    },
    setErrorMessage: (state, { payload }: { payload: string }) => {
      state.message     = {
        type    : MessageType.ERROR,
        message : payload,
        timeout : cfg.DEFAULT_MESSAGE_TIMEOUT
      };
    },
    clearMessage: (state) => {
      state.message = {} as Message;
    },

    // SCREENS
    setScreenFormats: (state, { payload }: PayloadAction<number>) => {
      state.screenFormats = getScreenFormats(payload);
      state.screenSize    = payload;
    },
    setScreenSize: (state, { payload }: PayloadAction<number>) => {
      state.screenSize = payload;
    },

    // SETTINGS
    setReplacePath: (state, { payload }: PayloadAction<string>) => {
      state.replacePath = payload;
    },
    clearReplacePath: (state) => {
      state.replacePath = '';
    },

    setAcceptedCookie: (state, { payload }: PayloadAction<boolean>) => {
      state.acceptedCookie = payload;
      LS.setAcceptedCookie();
    }
  }
})

export const { actions, reducer } = slice;
