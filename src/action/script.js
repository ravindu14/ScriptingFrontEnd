// @flow
import {
  ASYNC_SCRIPT_INIT,
  INITIALIZE_SCRIPT,
  HANDLE_NOTIFICATION,
  GET_ALL_SCRIPTS_SUCCESS,
} from "actionTypes/script";
import Alert from "components/Alert";

export function initializeScript() {
  return (dispatch) => {
    dispatch({ type: INITIALIZE_SCRIPT });
  };
}

function asyncScriptInit() {
  return {
    type: ASYNC_SCRIPT_INIT,
  };
}

export function notificationHandler(isSuccess, message) {
  return {
    type: HANDLE_NOTIFICATION,
    payload: {
      isSuccess,
      notification: {
        type: isSuccess ? Alert.TYPE.SUCCESS : Alert.TYPE.ERROR,
        message,
      },
    },
  };
}

export function addNewScript(payload: Object) {
  return (dispatch, getState, serviceManager) => {
    dispatch(asyncScriptInit());

    let scriptService = serviceManager.get("ScriptService");

    scriptService
      .isUniqueScript({ script: payload.script })
      .then(({ success }) => {
        if (success) {
          scriptService
            .saveScript(payload)
            .then(({ success }) => {
              dispatch(
                notificationHandler(
                  success,
                  success
                    ? "Script added successfully."
                    : "Failed to add script. Please try again"
                )
              );
            })
            .catch(() => {
              dispatch(
                notificationHandler(
                  false,
                  "Something went wrong. Please try again"
                )
              );
            });
        } else {
          dispatch(
            notificationHandler(success, "Script name is already in use.")
          );
        }
      })
      .catch(() => {
        dispatch(
          notificationHandler(false, "Something went wrong. Please try again")
        );
      });
  };
}

export function getAllScripts() {
  return (dispatch, getState, serviceManager) => {
    dispatch(asyncScriptInit());

    let scriptService = serviceManager.get("ScriptService");

    scriptService
      .getAllScripts()
      .then(({ success, data }) => {
        if (success) {
          dispatch({ type: GET_ALL_SCRIPTS_SUCCESS, payload: data });
        } else {
          dispatch(
            notificationHandler(
              success,
              "Something went wrong. Please try again"
            )
          );
        }
      })
      .catch(() => {
        dispatch(
          notificationHandler(false, "Something went wrong. Please try again")
        );
      });
  };
}
