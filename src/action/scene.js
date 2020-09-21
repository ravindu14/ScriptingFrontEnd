// @flow
import {
  ASYNC_SCENE_INIT,
  INITIALIZE_SCENE,
  HANDLE_NOTIFICATION,
  GET_ALL_SCENES_SUCCESS,
  ON_CHANGE_SCENE_FIELD,
  ON_ADD_NEW_LAYER,
  ON_SELECT_SINGLE_SCENE,
  ON_ADD_NEW_STORY,
  ON_CHANGE_STORY_FIELD,
} from "actionTypes/scene";
import Alert from "components/Alert";

export function initializeScene() {
  return (dispatch) => {
    dispatch({ type: INITIALIZE_SCENE });
  };
}

function asyncSceneInit() {
  return {
    type: ASYNC_SCENE_INIT,
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

export function getAllScenes(scriptId: string) {
  return (dispatch, getState, serviceManager) => {
    dispatch(asyncSceneInit());

    let sceneService = serviceManager.get("SceneService");

    sceneService
      .getAllScenes(scriptId)
      .then(({ success, data }) => {
        if (success) {
          dispatch({ type: GET_ALL_SCENES_SUCCESS, payload: data });
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

export function updateScene(payload: object) {
  return (dispatch, getState, serviceManager) => {
    dispatch(asyncSceneInit());

    let sceneService = serviceManager.get("SceneService");

    sceneService
      .saveScene(payload)
      .then(({ success }) => {
        if (success) {
          sceneService
            .getAllScenes(payload.scriptId)
            .then(({ success, data }) => {
              if (success) {
                dispatch({ type: GET_ALL_SCENES_SUCCESS, payload: data });
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
            success ? "Scene saved successfully." : "Failed to save scene."
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

export function onChangeSceneField(payload: Object) {
  return (dispatch) => {
    dispatch({ type: ON_CHANGE_SCENE_FIELD, payload });
  };
}

export function onAddNewLayer(payload: Object) {
  return (dispatch) => {
    dispatch({ type: ON_ADD_NEW_LAYER, payload });
  };
}

export function onSelectSingleScene(sceneId: string) {
  return (dispatch) => {
    dispatch({ type: ON_SELECT_SINGLE_SCENE, payload: sceneId });
  };
}

export function onAddNewStory(payload: Object) {
  return (dispatch) => {
    dispatch({ type: ON_ADD_NEW_STORY, payload });
  };
}

export function onChangeStoryField(payload: Object) {
  return (dispatch) => {
    dispatch({ type: ON_CHANGE_STORY_FIELD, payload });
  };
}
