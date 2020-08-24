// @flow
import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { type AsyncStatusType } from "shared/types/General";

import Icon from "components/icon";

import "./styles.scss";

type HeaderProps = {
  isAuthenticated: Boolean,
  toggleAuth: Function,
  displayAuth: boolean,
  user: Object,
  authSignOut: Function,
  status: AsyncStatusType,
};

class Header extends PureComponent<HeaderProps> {
  render() {
    return (
      <div className="header">
        <div className="menu">
          <ul>
            <li>
              <Icon icon="side-menu" />
            </li>
            <li>
              <Icon icon="notifications" />
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    errors: state.auth.errors,
    isAuthSuccess: state.auth.isAuthSuccess,
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user,
    status: state.auth.status,
  };
}

const Actions = {};

export default connect(mapStateToProps, Actions)(Header);
