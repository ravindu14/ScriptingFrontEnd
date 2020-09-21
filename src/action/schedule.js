// @flow
import {
  ASYNC_SCHEDULE_INIT,
  HANDLE_NOTIFICATION,
  INITIALIZE_SCHEDULE,
  GET_SCHEDULE_SUCCESS,
  ON_CHANGE_SCENE_NUMBER,
} from "actionTypes/schedule";
import Alert from "components/Alert";

export function initializeSchedule() {
  return (dispatch) => {
    dispatch({ type: INITIALIZE_SCHEDULE });
  };
}

function asyncScheduleInit() {
  return {
    type: ASYNC_SCHEDULE_INIT,
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

export function getAllSchedule(scriptId: string) {
  return (dispatch, getState, serviceManager) => {
    dispatch(asyncScheduleInit());

    let scheduleService = serviceManager.get("ScheduleService");

    scheduleService
      .getSchedule(scriptId)
      .then(({ success, data }) => {
        if (success) {
          dispatch({ type: GET_SCHEDULE_SUCCESS, payload: data });
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

export function onChangeScene(payload) {
  return (dispatch) => {
    dispatch({ type: ON_CHANGE_SCENE_NUMBER, payload });
  };
}

export function saveSchedule(payload: Object) {
  return (dispatch, getState, serviceManager) => {
    dispatch(asyncScheduleInit());

    let scheduleService = serviceManager.get("ScheduleService");

    scheduleService
      .saveSchedule(payload)
      .then(({ success }) => {
        dispatch(
          notificationHandler(
            success,
            success
              ? "Schedule saved successfully"
              : "Something went wrong. Please try again"
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
