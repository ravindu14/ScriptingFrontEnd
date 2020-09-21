// @flow
import { type Action } from "shared/types/ReducerAction";
import {
  type AsyncStatusType,
  type NotificationType,
} from "shared/types/General";

import { ASYNC_STATUS } from "constants/async";
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

export type SceneStateType = {
  notification: NotificationType,
  status: AsyncStatusType,
  scenes: null | Array<any>,
  scene: null | Object,
};

const initialState: SceneStateType = {
  status: ASYNC_STATUS.INIT,
  notification: null,
  scenes: null,
  scene: null,
};

function asyncSceneInit(state: SceneStateType) {
  return {
    ...state,
    notification: null,
    status: ASYNC_STATUS.LOADING,
  };
}

function initializeScene(state: SceneStateType) {
  return {
    ...state,
    notification: null,
    status: ASYNC_STATUS.INIT,
    scenes: null,
    scene: null,
  };
}

function handleNotification(
  state: SceneStateType,
  { isSuccess, notification }
) {
  return {
    ...state,
    notification,
    status: isSuccess ? ASYNC_STATUS.SUCCESS : ASYNC_STATUS.FAILURE,
  };
}

function onChangeSceneField(state: SceneStateType, { sceneId, field }) {
  const updatedScenes = state.scenes
    .map((scene) => {
      if (scene.id === sceneId) {
        return {
          ...scene,
          ...field,
        };
      }
      return null;
    })
    .filter((item) => item !== null);

  return {
    ...state,
    scenes: updatedScenes,
  };
}

function onAddNewLayer(state: SceneStateType, payload) {
  let updatedScenes = state.scenes;

  updatedScenes.push(payload);

  return {
    ...state,
    scenes: updatedScenes,
  };
}

function onSelectSingleScene(state: SceneStateType, payload) {
  const { scenes } = state;

  let selectedScene = scenes.filter(({ id }) => id === payload);

  return {
    ...state,
    scene: selectedScene[0],
  };
}

function onAddNewStory(state: SceneStateType, payload) {
  let updatedScene = state.scene;

  updatedScene.stories.push(payload);

  return {
    ...state,
    scene: updatedScene,
  };
}

function onChangeStoryField(state: SceneStateType, { storyId, field }) {
  const { scene } = state;

  let updatedStory = scene.stories.map((story) => {
    if (story.storyId === storyId) {
      return {
        ...story,
        ...field,
      };
    }
    return story;
  });

  return {
    ...state,
    scene: {
      ...state.scene,
      stories: updatedStory,
    },
  };
}

export default (
  state: SceneStateType = initialState,
  { type, payload = {} }: Action
) => {
  switch (type) {
    case ASYNC_SCENE_INIT:
      return asyncSceneInit(state);
    case INITIALIZE_SCENE:
      return initializeScene(state);
    case HANDLE_NOTIFICATION:
      return handleNotification(state, payload);
    case GET_ALL_SCENES_SUCCESS:
      return {
        ...state,
        scenes: payload,
        status: ASYNC_STATUS.SUCCESS,
      };
    case ON_CHANGE_SCENE_FIELD:
      return onChangeSceneField(state, payload);
    case ON_ADD_NEW_LAYER:
      return onAddNewLayer(state, payload);
    case ON_SELECT_SINGLE_SCENE:
      return onSelectSingleScene(state, payload);
    case ON_ADD_NEW_STORY:
      return onAddNewStory(state, payload);
    case ON_CHANGE_STORY_FIELD:
      return onChangeStoryField(state, payload);
    default:
      return state;
  }
};
