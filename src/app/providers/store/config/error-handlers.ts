import { uiActions } from 'entities/ui';
import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';
import { StateSchema, ThunkExtraArg } from './state';
import { Errors } from 'shared/lib/validators';
import { __devLog } from 'shared/lib/tests/__dev-log';
import { LS } from 'shared/lib/local-storage';
import { objectFieldsToString } from 'shared/helpers/objects';



export interface CustomAxiosError {
  code     : string
  stack    : string
  response : {
    status : number
    data   : Errors
    config : {
      url: string
    }
  }
}


interface ErrorHandlersConfig {
  pathname? : string
}

export const errorHandlers = (
  e        : CustomAxiosError,
  dispatch : ThunkDispatch<StateSchema, ThunkExtraArg, AnyAction>,
  cfg      : ErrorHandlersConfig = {}
) => {
  __devLog('errorHandlers', 'e: ', e);
  __devLog('errorHandlers', 'response: ', e.response);
  __devLog('errorHandlers', 'status: ', e.response?.status);
  __devLog('errorHandlers', 'stack: ', e.stack);

  const errors = e.response?.data || {};
  const status = e.response?.status;
  const { pathname } = cfg;

  __devLog('errorHandlers', 'pathname: ', pathname);

  dispatch(uiActions.setPageLoading(undefined)); // Снять крутилку

  if (errors.updateRequired) {
    LS.clearStorage();
    return dispatch(uiActions.setInfoMessage('Приложение обновилось. Необходимо обновить страницу.'));
  }
  if (e.code === 'ECONNABORTED') {
    return dispatch(uiActions.setWarningMessage('Отсутствует интернет-соединение. Попробуйте позже.'))
  }
  if (errors.general) {
    if (errors.general !== 'auth/user-not-found') return dispatch(uiActions.setWarningMessage(errors.general));
    return dispatch(uiActions.setErrorMessage(errors.general));
  }

  // if (errors.message) return dispatch(uiActions.setWarningMessage(errors.message));

  if (status === 204) { // No Content
    return dispatch(uiActions.setWarningMessage('По вашему запросу отсутствуют данные.'));
  }
  else if (status === 400) {
    return dispatch(uiActions.setWarningMessage(objectFieldsToString(errors)));
  }
  else if (status === 403) return dispatch(uiActions.setErrorStatus({ status: 403, pathname }));
  else if (status === 404) {
    return dispatch(uiActions.setWarningMessage(
      `Сервер вернул ошибку - отсутствует обработчик на данный запрос [${e.response?.config?.url}].
       Повторите действие позже.`
    ));
  }
  else if (status === 500 || status === 501 || status === 502 || status === 504) {
    // dispatch(uiActions.setErrorStatus(504));
    return dispatch(uiActions.setWarningMessage('Извините, сервер временно не доступен...'));
  }
  // else if (e.stack) {
  //   return dispatch(uiActions.setErrorMessage(e.stack));
  // }
}
