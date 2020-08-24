// @flow
import React, { Component } from "react";
import { connect } from "react-redux";

import Layout from "components/layout";
import Input from "components/Input";
import Button from "components/button";
import Alert from "components/Alert";

import { addNewScript, asyncAuthInit } from "action/auth";

import "./styles.scss";

type HomePageProps = {
  addNewScript: Function,
  asyncAuthInit: Function,
  notification: string | null,
};

type HomePageState = {
  scriptName: string,
};

class HomePage extends Component<HomePageProps, HomePageState> {
  state = {
    scriptName: "",
  };

  componentDidMount() {
    this.props.asyncAuthInit();
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

    this.props.addNewScript(scriptName);

    this.resetScript();
  };

  render() {
    const { notification } = this.props;

    return (
      <Layout>
        {notification && (
          <Alert type={Alert.TYPE.SUCCESS}>{notification}</Alert>
        )}
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
              <Button onClick={this.onClickAddScript}>ADD SCRIPT</Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    notification: state.auth.notification,
  };
};

const Actions = { addNewScript, asyncAuthInit };

export default connect(mapStateToProps, Actions)(HomePage);
