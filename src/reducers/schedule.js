// @flow
import { type Action } from "shared/types/ReducerAction";
import {
  type AsyncStatusType,
  type NotificationType,
} from "shared/types/General";

import { ASYNC_STATUS } from "constants/async";
import {
  ASYNC_SCHEDULE_INIT,
  INITIALIZE_SCHEDULE,
  HANDLE_NOTIFICATION,
  GET_SCHEDULE_SUCCESS,
  ON_CHANGE_SCENE_NUMBER,
} from "actionTypes/schedule";

export type ScheduleStateType = {
  notification: NotificationType,
  status: AsyncStatusType,
  schedule: Array<any>,
};

const initialState: ScheduleStateType = {
  status: ASYNC_STATUS.INIT,
  notification: null,
  schedule: [],
};

function asyncScheduleInit(state: ScheduleStateType) {
  return {
    ...state,
    notification: null,
    status: ASYNC_STATUS.LOADING,
  };
}

function initializeSchedule(state: ScheduleStateType) {
  return {
    ...state,
    notification: null,
    status: ASYNC_STATUS.INIT,
    scripts: [],
  };
}

function handleNotification(
  state: ScheduleStateType,
  { isSuccess, notification }
) {
  return {
    ...state,
    notification,
    status: isSuccess ? ASYNC_STATUS.SUCCESS : ASYNC_STATUS.FAILURE,
  };
}

function onChangeSceneNumber(state: ScheduleStateType, { scene, date }) {
  let updatedSchedule = state.schedule;

  updatedSchedule = updatedSchedule.map((schedule) => {
    if (schedule.sceneNumber === scene) {
      return {
        ...schedule,
        fixedDate: date,
      };
    }
    return schedule;
  });

  return {
    ...state,
    schedule: updatedSchedule,
  };
}

export default (
  state: ScheduleStateType = initialState,
  { type, payload = {} }: Action
) => {
  switch (type) {
    case ASYNC_SCHEDULE_INIT:
      return asyncScheduleInit(state);
    case INITIALIZE_SCHEDULE:
      return initializeSchedule(state);
    case HANDLE_NOTIFICATION:
      return handleNotification(state, payload);
    case GET_SCHEDULE_SUCCESS:
      return {
        ...state,
        schedule: payload.map((item) => {
          return {
            ...item,
            fixedDate: "",
          };
        }),
        status: ASYNC_STATUS.SUCCESS,
      };
    case ON_CHANGE_SCENE_NUMBER:
      return onChangeSceneNumber(state, payload);
    default:
      return state;
  }
};
