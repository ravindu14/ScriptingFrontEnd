// @flow
import { type Action } from "shared/types/ReducerAction";
import {
  type AsyncStatusType,
  type NotificationType,
} from "shared/types/General";

import { ASYNC_STATUS } from "constants/async";
import {
  ASYNC_ACTORS_INIT,
  INITIALIZE_ACTORS,
  HANDLE_NOTIFICATION,
  GET_ALL_ACTORS_SUCCESS,
  ON_ADD_FREE_DATE,
} from "actionTypes/actors";

export type ActorsStateType = {
  notification: NotificationType,
  status: AsyncStatusType,
  actors: Array<any> | null,
};

const initialState: ActorsStateType = {
  status: ASYNC_STATUS.INIT,
  notification: null,
  actors: null,
};

function asyncActorsInit(state: ActorsStateType) {
  return {
    ...state,
    notification: null,
    status: ASYNC_STATUS.LOADING,
  };
}

function initializeActors(state: ActorsStateType) {
  return {
    ...state,
    notification: null,
    status: ASYNC_STATUS.INIT,
    actors: null,
  };
}

function handleNotification(
  state: ActorsStateType,
  { isSuccess, notification }
) {
  return {
    ...state,
    notification,
    status: isSuccess ? ASYNC_STATUS.SUCCESS : ASYNC_STATUS.FAILURE,
  };
}

function onAddFreeDate(state: ActorsStateType, { actorId, freeDate }) {
  let updatedActors = state.actors;

  updatedActors.map((actor) => {
    if (actor.actorId === actorId) {
      let updatedFreeDates = actor.freeDates;
      updatedFreeDates.push(freeDate);
      return {
        ...actor,
        freeDates: updatedFreeDates,
      };
    }
    return actor;
  });
  return {
    ...state,
    actors: updatedActors,
  };
}

export default (
  state: InventoryStateType = initialState,
  { type, payload = {} }: Action
) => {
  switch (type) {
    case ASYNC_ACTORS_INIT:
      return asyncActorsInit(state);
    case INITIALIZE_ACTORS:
      return initializeActors(state);
    case HANDLE_NOTIFICATION:
      return handleNotification(state, payload);
    case GET_ALL_ACTORS_SUCCESS:
      return {
        ...state,
        actors: payload,
        status: ASYNC_STATUS.SUCCESS,
      };
    case ON_ADD_FREE_DATE:
      return onAddFreeDate(state, payload);
    default:
      return state;
  }
};
