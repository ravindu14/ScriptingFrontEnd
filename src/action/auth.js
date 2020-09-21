// @flow
import {
  ASYNC_AUTH_INIT,
  ON_SAVE_SCRIPT_DATA,
  ON_SAVE_INVENTORY_DATA,
  SET_INITIAL_SCRIPTS,
  INITIALIZE_AUTH_INIT,
} from "actionTypes/auth";

function asyncInitializeAuthInit() {
  return {
    type: INITIALIZE_AUTH_INIT,
  };
}

export function asyncAuthInit() {
  return {
    type: ASYNC_AUTH_INIT,
  };
}

export function addNewScript(payload) {
  return (dispatch, getState, serviceManager) => {
    dispatch(asyncInitializeAuthInit());
  };
}

export function saveScriptData(payload) {
  return (dispatch) => {
    dispatch({ type: ON_SAVE_SCRIPT_DATA, payload });
  };
}

export function saveInventoryData(payload) {
  return (dispatch) => {
    dispatch({ type: ON_SAVE_INVENTORY_DATA, payload });
  };
}

export function setInitialScripts() {
  return (dispatch) => {
    let scripts = JSON.parse(localStorage.getItem("scripts"));

    if (scripts) {
      dispatch({ type: SET_INITIAL_SCRIPTS, payload: scripts });
    }
  };
}
