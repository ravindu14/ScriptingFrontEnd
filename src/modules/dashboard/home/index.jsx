// @flow
import React, { Component } from "react";
import { connect } from "react-redux";
import {
  type AsyncStatusType,
  type NotificationType,
} from "shared/types/General";

import Layout from "components/layout";
import Input from "components/Input";
import Button from "components/button";
import Alert from "components/Alert";
import uuid from "uuid";

import { initializeScript, addNewScript } from "action/script";

import "./styles.scss";
import { ASYNC_STATUS } from "constants/async";
import Loader from "components/loader";
import { isNotEmpty } from "shared/utils";

type HomePageProps = {
  addNewScript: Function,
  initializeScript: Function,
  notification: NotificationType,
  status: AsyncStatusType,
};

type HomePageState = {
  scriptName: string,
};

class HomePage extends Component<HomePageProps, HomePageState> {
  state = {
    scriptName: "",
  };

  componentDidMount() {
    this.props.initializeScript();
  }

  onHandleFieldChange = (field) => {
    this.setState({
      ...this.state,
      ...field,
    });
  };

  resetScript = () => {
    this.setState({
      scriptName: "",
    });
  };

  onClickAddScript = () => {
    const { scriptName } = this.state;

    this.props.addNewScript({ id: uuid.v4(), script: scriptName });

    this.resetScript();
  };

  render() {
    const { notification, status } = this.props;

    return (
      <Layout>
        {notification && (
          <Alert type={notification.type}>{notification.message}</Alert>
        )}
        {status === ASYNC_STATUS.LOADING ? (
          <Loader isLoading />
        ) : (
          <div className="home">
            <div className="home-header">Add New Scripts</div>
            <div className="home-content">
              <div className="home-content-label">Script name</div>
              <div className="home-content-input">
                <Input
                  placeholder="Enter script name"
                  id="newScript"
                  text={this.state.scriptName}
                  onChange={(scriptName) =>
                    this.onHandleFieldChange({ scriptName })
                  }
                />
              </div>
              <div className="home-content-button">
                <Button
                  type={
                    isNotEmpty(this.state.scriptName)
                      ? Button.TYPE.SUCCESS
                      : Button.TYPE.DEFAULT
                  }
                  onClick={this.onClickAddScript}
                >
                  ADD SCRIPT
                </Button>
              </div>
            </div>
          </div>
        )}
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    notification: state.script.notification,
    status: state.script.status,
  };
};

const Actions = { addNewScript, initializeScript };

export default connect(mapStateToProps, Actions)(HomePage);
