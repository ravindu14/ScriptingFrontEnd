// @flow
import {
  ASYNC_ACTORS_INIT,
  INITIALIZE_ACTORS,
  HANDLE_NOTIFICATION,
  GET_ALL_ACTORS_SUCCESS,
  ON_ADD_FREE_DATE,
} from "actionTypes/actors";
import Alert from "components/Alert";

export function initializeActors() {
  return (dispatch) => {
    dispatch({ type: INITIALIZE_ACTORS });
  };
}

function asyncActorsInit() {
  return {
    type: ASYNC_ACTORS_INIT,
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

export function getAllActors() {
  return (dispatch, getState, serviceManager) => {
    dispatch(asyncActorsInit());

    let actorsService = serviceManager.get("ActorsService");

    actorsService
      .getAllActors()
      .then(({ success, data }) => {
        if (success) {
          dispatch({ type: GET_ALL_ACTORS_SUCCESS, payload: data });
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

export function updateActors(payload: object) {
  return (dispatch, getState, serviceManager) => {
    dispatch(asyncActorsInit());

    let actorsService = serviceManager.get("ActorsService");

    actorsService
      .saveActors(payload)
      .then(({ success }) => {
        if (success) {
          actorsService
            .getAllActors()
            .then(({ success, data }) => {
              if (success) {
                dispatch({ type: GET_ALL_ACTORS_SUCCESS, payload: data });
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
                notificationHandler(
                  false,
                  "Something went wrong. Please try again"
                )
              );
            });
        }
        dispatch(
          notificationHandler(
            success,
            success ? "Actors saved successfully." : "Failed to save actors."
          )
        );
      })
      .catch(() => {
        dispatch(
          notificationHandler(false, "Something went wrong. Please try again")
        );
      });
  };
}

export function addFreeDate(actorId, freeDate) {
  return (dispatch) => {
    dispatch({ type: ON_ADD_FREE_DATE, payload: { actorId, freeDate } });
  };
}
