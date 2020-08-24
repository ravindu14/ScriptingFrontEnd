import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import { setInitialScripts } from "action/auth";
import { registerServices, serviceManager } from "services/manager";
import * as serviceWorker from "./serviceWorker";
import configureStore from "store";
import Routes from "routes";

import "./index.scss";

const settings = {
  api: {
    baseUrl: "",
  },
};

registerServices(settings);

const store = configureStore({}, serviceManager);

store.dispatch(setInitialScripts());

ReactDOM.render(
  <Provider store={store}>
    <Routes />
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();