// @flow
import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";

import auth, { type AuthStateType } from "reducers/auth";

export type ApplicationState = {
  auth: AuthStateType
};

export default (history: History) =>
  combineReducers({
    auth,
    router: connectRouter(history)
  });
