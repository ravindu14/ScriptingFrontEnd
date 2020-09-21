// @flow
import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";

import auth, { type AuthStateType } from "reducers/auth";
import script, { type ScriptStateType } from "reducers/script";
import scene, { type SceneStateType } from "reducers/scene";
import inventory, { type InventoryStateType } from "reducers/inventory";
import actors, { type ActorsStateType } from "reducers/actors";
import schedule, { type ScheduleStateType } from "reducers/schedule";

export type ApplicationState = {
  auth: AuthStateType,
  script: ScriptStateType,
  scene: SceneStateType,
  inventory: InventoryStateType,
  actors: ActorsStateType,
  schedule: ScheduleStateType,
};

export default (history: History) =>
  combineReducers({
    auth,
    script,
    scene,
    inventory,
    actors,
    schedule,
    router: connectRouter(history),
  });
