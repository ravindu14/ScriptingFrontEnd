// @flow
import { type Action } from "shared/types/ReducerAction";

import { USER_ROLES } from "constants/user";
import { ASYNC_STATUS } from "constants/async";
import {
  ASYNC_AUTH_INIT,
  ADD_NEW_SCRIPT_SUCCESS,
  ON_SAVE_SCRIPT_DATA,
  ON_SAVE_INVENTORY_DATA,
  SET_INITIAL_SCRIPTS,
  INITIALIZE_AUTH_INIT,
} from "actionTypes/auth";
import uuid from "uuid";

export type AuthStateType = {
  notification: null | string,
  isAuthenticated: boolean,
  isUserInitiated: boolean,
  role: null | typeof USER_ROLES.ADMIN,
  scripts: Array<any>,
};

const initialState: AuthStateType = {
  status: ASYNC_STATUS.INIT,
  notification: null,
  isAuthenticated: true,
  isUserInitiated: true,
  role: USER_ROLES.ADMIN,
  scripts: [],
};

function asyncAuthInit(state: AuthStateType) {
  return {
    ...state,
    status: ASYNC_STATUS.INIT,
    notification: null,
  };
}

function asyncInitializeAuthInit(state: AuthStateType) {
  return {
    ...state,
    status: ASYNC_STATUS.LOADING,
    notification: null,
  };
}

function onAddNewScript(state, payload) {
  let updatedScripts = state.scripts;

  let newScript = {
    script: payload,
    data: [
      {
        id: uuid.v4(),
        image: "",
        caseId: "",
        type: "",
        location: "",
        time: "",
        details: "",
        shot: "",
      },
    ],
    inventory: [],
  };

  updatedScripts.push(newScript);

  localStorage.setItem("scripts", JSON.stringify(updatedScripts));

  return {
    ...state,
    scripts: updatedScripts,
    notification: "Script added successfully",
  };
}

function onSaveScriptData(state, payload) {
  let { scripts } = state;

  let updatedScripts = scripts.map((script) => {
    if (script.script === payload.script) {
      return {
        ...script,
        data: payload.data,
      };
    }
    return script;
  });

  localStorage.setItem("scripts", JSON.stringify(updatedScripts));

  return {
    ...state,
    scripts: updatedScripts,
    notification: "Script template saved successfully",
  };
}

function onSaveInventoryData(state, payload) {
  let { scripts } = state;

  let updatedScripts = scripts.map((script) => {
    if (script.script === payload.script) {
      return {
        ...script,
        inventory: payload.inventory,
      };
    }
    return script;
  });

  localStorage.setItem("scripts", JSON.stringify(updatedScripts));

  return {
    ...state,
    scripts: updatedScripts,
    notification: "Inventory details saved successfully",
  };
}

export default (
  state: AuthStateType = initialState,
  { type, payload = {} }: Action
) => {
  switch (type) {
    case ASYNC_AUTH_INIT:
      return asyncAuthInit(state);
    case INITIALIZE_AUTH_INIT:
      return asyncInitializeAuthInit(state);
    case ADD_NEW_SCRIPT_SUCCESS:
      return onAddNewScript(state, payload);
    case ON_SAVE_SCRIPT_DATA:
      return onSaveScriptData(state, payload);
    case ON_SAVE_INVENTORY_DATA:
      return onSaveInventoryData(state, payload);
    case SET_INITIAL_SCRIPTS:
      return {
        ...state,
        scripts: payload,
      };
    default:
      return state;
  }
};
