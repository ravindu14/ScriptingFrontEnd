// @flow
import { lazy } from "react";
import { USER_ROLES } from "constants/user";

export default [
  {
    path: "/",
    exact: true,
    auth: true,
    roles: [USER_ROLES.ADMIN],
    component: lazy(() => import("modules/dashboard/home")),
  },
  {
    path: "/scripts",
    exact: true,
    auth: true,
    roles: [USER_ROLES.ADMIN],
    component: lazy(() => import("modules/scripts")),
  },
  {
    path: "/story-board",
    exact: true,
    auth: true,
    roles: [USER_ROLES.ADMIN],
    component: lazy(() => import("modules/storyBoard")),
  },
  {
    path: "/inventory",
    exact: true,
    auth: true,
    roles: [USER_ROLES.ADMIN],
    component: lazy(() => import("modules/inventory")),
  },
  {
    path: "/time-table",
    exact: true,
    auth: true,
    roles: [USER_ROLES.ADMIN],
    component: lazy(() => import("modules/timeTable")),
  },
];
