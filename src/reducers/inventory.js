// @flow
import { type Action } from "shared/types/ReducerAction";
import {
  type AsyncStatusType,
  type NotificationType,
} from "shared/types/General";

import { ASYNC_STATUS } from "constants/async";
import {
  ASYNC_INVENTORY_INIT,
  INITIALIZE_INVENTORY,
  HANDLE_NOTIFICATION,
  GET_ALL_INVENTORY_SUCCESS,
  ON_ADD_NEW_INVENTORY,
  ON_CHANGE_INVENTORY_FIELD,
  ON_REMOVE_INVENTORY,
} from "actionTypes/inventory";

export type InventoryStateType = {
  notification: NotificationType,
  status: AsyncStatusType,
  inventory: Array<any> | null,
};

const initialState: InventoryStateType = {
  status: ASYNC_STATUS.INIT,
  notification: null,
  inventory: null,
};

function asyncInventoryInit(state: InventoryStateType) {
  return {
    ...state,
    notification: null,
    status: ASYNC_STATUS.LOADING,
  };
}

function initializeInventory(state: InventoryStateType) {
  return {
    ...state,
    notification: null,
    status: ASYNC_STATUS.INIT,
    inventory: null,
  };
}

function handleNotification(
  state: InventoryStateType,
  { isSuccess, notification }
) {
  return {
    ...state,
    notification,
    status: isSuccess ? ASYNC_STATUS.SUCCESS : ASYNC_STATUS.FAILURE,
  };
}

function onAddNewInventory(state: InventoryStateType, payload) {
  let updatedInventory = state.inventory;

  updatedInventory.push(payload);

  return {
    ...state,
    inventory: updatedInventory,
  };
}

function onChangeInventoryField(state: InventoryStateType, payload) {
  let updatedInventory = state.inventory.map((inventory) => {
    if (inventory.itemId === payload) {
      return {
        ...inventory,
        availability: !inventory.availability,
      };
    }
    return inventory;
  });

  return {
    ...state,
    inventory: updatedInventory,
  };
}

function onRemoveInventory(state: InventoryStateType, payload) {
  let updatedInventory = state.inventory.filter(
    ({ itemId }) => itemId !== payload
  );

  return {
    ...state,
    inventory: updatedInventory,
  };
}

export default (
  state: InventoryStateType = initialState,
  { type, payload = {} }: Action
) => {
  switch (type) {
    case ASYNC_INVENTORY_INIT:
      return asyncInventoryInit(state);
    case INITIALIZE_INVENTORY:
      return initializeInventory(state);
    case HANDLE_NOTIFICATION:
      return handleNotification(state, payload);
    case GET_ALL_INVENTORY_SUCCESS:
      return {
        ...state,
        inventory: payload[0].inventory ? payload[0].inventory : [],
        status: ASYNC_STATUS.SUCCESS,
      };
    case ON_ADD_NEW_INVENTORY:
      return onAddNewInventory(state, payload);
    case ON_REMOVE_INVENTORY:
      return onRemoveInventory(state, payload);
    case ON_CHANGE_INVENTORY_FIELD:
      return onChangeInventoryField(state, payload);
    default:
      return state;
  }
};
