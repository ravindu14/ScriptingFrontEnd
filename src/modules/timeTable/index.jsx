// @flow
import React, { Component } from "react";
import { connect } from "react-redux";

import Layout from "components/layout";
import Alert from "components/Alert";

import { asyncAuthInit } from "action/auth";

type TimeTableProps = {
  asyncAuthInit: Function,
  notification: string,
};

class TimeTable extends Component<TimeTableProps> {
  componentDidMount() {
    this.props.asyncAuthInit();
  }

  render() {
    const { notification } = this.props;

    return (
      <Layout>
        {notification && (
          <Alert type={Alert.TYPE.SUCCESS}>{notification}</Alert>
        )}
        <div className="time-table">under construction</div>
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    notification: state.auth.notification,
  };
};

const Actions = { asyncAuthInit };

export default connect(mapStateToProps, Actions)(TimeTable);
