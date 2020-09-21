// @flow
import {
  ASYNC_INVENTORY_INIT,
  INITIALIZE_INVENTORY,
  HANDLE_NOTIFICATION,
  GET_ALL_INVENTORY_SUCCESS,
  ON_CHANGE_INVENTORY_FIELD,
  ON_ADD_NEW_INVENTORY,
  ON_REMOVE_INVENTORY,
} from "actionTypes/inventory";
import Alert from "components/Alert";

export function initializeInventory() {
  return (dispatch) => {
    dispatch({ type: INITIALIZE_INVENTORY });
  };
}

function asyncInventoryInit() {
  return {
    type: ASYNC_INVENTORY_INIT,
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

export function getAllInventory(scriptId: string) {
  return (dispatch, getState, serviceManager) => {
    dispatch(asyncInventoryInit());

    let inventoryService = serviceManager.get("InventoryService");

    inventoryService
      .getAllInventory(scriptId)
      .then(({ success, data }) => {
        if (success) {
          dispatch({ type: GET_ALL_INVENTORY_SUCCESS, payload: data });
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

export function updateInventory(payload: object) {
  return (dispatch, getState, serviceManager) => {
    dispatch(asyncInventoryInit());

    let inventoryService = serviceManager.get("InventoryService");

    inventoryService
      .saveInventory(payload)
      .then(({ success }) => {
        if (success) {
          inventoryService
            .getAllInventory(payload.scriptId)
            .then(({ success, data }) => {
              if (success) {
                dispatch({ type: GET_ALL_INVENTORY_SUCCESS, payload: data });
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
            success
              ? "Inventory saved successfully."
              : "Failed to save inventory."
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

export function onChangeInventoryField(payload: string) {
  return (dispatch) => {
    dispatch({ type: ON_CHANGE_INVENTORY_FIELD, payload });
  };
}

export function onAddNewInventory(payload: Object) {
  return (dispatch) => {
    dispatch({ type: ON_ADD_NEW_INVENTORY, payload });
  };
}

export function onRemoveInventory(payload: string) {
  return (dispatch) => {
    dispatch({ type: ON_REMOVE_INVENTORY, payload });
  };
}
