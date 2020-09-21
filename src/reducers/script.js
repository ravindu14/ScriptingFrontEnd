// @flow
import { type Action } from "shared/types/ReducerAction";
import {
  type AsyncStatusType,
  type NotificationType,
} from "shared/types/General";

import { ASYNC_STATUS } from "constants/async";
import {
  INITIALIZE_SCRIPT,
  ASYNC_SCRIPT_INIT,
  HANDLE_NOTIFICATION,
  GET_ALL_SCRIPTS_SUCCESS,
} from "actionTypes/script";

export type ScriptStateType = {
  notification: NotificationType,
  status: AsyncStatusType,
  scripts: Array<any>,
};

const initialState: ScriptStateType = {
  status: ASYNC_STATUS.INIT,
  notification: null,
  scripts: [],
};

function asyncScriptInit(state: ScriptStateType) {
  return {
    ...state,
    notification: null,
    status: ASYNC_STATUS.LOADING,
  };
}

function initializeScript(state: ScriptStateType) {
  return {
    ...state,
    notification: null,
    status: ASYNC_STATUS.INIT,
    scripts: [],
  };
}

function handleNotification(
  state: ScriptStateType,
  { isSuccess, notification }
) {
  return {
    ...state,
    notification,
    status: isSuccess ? ASYNC_STATUS.SUCCESS : ASYNC_STATUS.FAILURE,
  };
}

export default (
  state: ScriptStateType = initialState,
  { type, payload = {} }: Action
) => {
  switch (type) {
    case ASYNC_SCRIPT_INIT:
      return asyncScriptInit(state);
    case INITIALIZE_SCRIPT:
      return initializeScript(state);
    case HANDLE_NOTIFICATION:
      return handleNotification(state, payload);
    case GET_ALL_SCRIPTS_SUCCESS:
      return {
        ...state,
        scripts: payload,
        status: ASYNC_STATUS.SUCCESS,
      };
    default:
      return state;
  }
};
