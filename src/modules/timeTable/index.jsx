// @flow
import React, { Component } from "react";
import { connect } from "react-redux";

import Layout from "components/layout";
import Alert from "components/Alert";
import Row from "components/Row";
import Col from "components/Col";
import Select from "components/Select";
import Loader from "components/loader";
import Button from "components/button";

import { getAllScripts, initializeScript } from "action/script";
import { getAllSchedule, onChangeScene, saveSchedule } from "action/schedule";
import { ASYNC_STATUS } from "constants/async";

import "./styles.scss";
import Input from "components/Input";

type TimeTableProps = {
  getAllScripts: Function,
  initializeScript: Function,
  scriptNotification: NotificationType,
  scriptStatus: AsyncStatusType,
  scripts: Array<any>,
  getAllSchedule: Function,
  notification: NotificationType,
  status: AsyncStatusType,
  schedule: Array<any>,
  onChangeScene: Function,
  saveSchedule: Function,
};

type TimeTableState = {
  scriptName: string,
  scriptId: string,
  filterLocation: string,
  filteredLocations: Array<any>,
};

class TimeTable extends Component<TimeTableProps, TimeTableState> {
  state = {
    scriptId: "",
    scriptName: "",
    filterLocation: "",
    filteredLocations: [],
  };

  componentDidMount() {
    const { getAllScripts, initializeScript } = this.props;

    initializeScript();
    getAllScripts();
  }

  onSelectScript = (scriptId) => {
    this.setState(
      {
        ...this.state,
        scriptId,
      },
      this.props.getAllSchedule(scriptId)
    );
  };

  getString = (items) => {
    let x = "";

    items.map((item) => {
      x += `${item},`;
      return null;
    });

    return x;
  };

  onSelectFixedDate = (scene, date) => {
    this.props.onChangeScene({ scene, date });
    this.setState({
      ...this.state,
      scene,
    });
  };

  onSaveSchedule = () => {
    const { scriptId } = this.state;
    const { schedule } = this.props;

    this.props.saveSchedule({ scriptId, schedule });
  };

  filterContent = () => {
    const { filterLocation } = this.state;
    const { schedule } = this.props;

    const updatedSchedule = schedule.filter(
      ({ location }) => location === filterLocation
    );

    this.setState({
      ...this.state,
      filteredLocations: updatedSchedule,
    });
  };

  formFieldChange = (field) => {
    this.setState({
      ...this.state,
      filterLocation: field,
    });
  };

  render() {
    const {
      scriptNotification,
      scripts,
      scriptStatus,
      status,
      notification,
      schedule,
    } = this.props;

    const { filteredLocations } = this.state;

    let scriptOptions =
      scripts.length > 0
        ? [
            ...scripts.map(({ id, script }) => {
              return { name: script, value: id };
            }),
          ]
        : [];

    return (
      <Layout
        actions={
          <Button type={Button.TYPE.SUCCESS} onClick={this.onSaveSchedule}>
            Save Time Table
          </Button>
        }
      >
        {scriptNotification && (
          <Alert type={scriptNotification.type}>
            {scriptNotification.message}
          </Alert>
        )}
        {notification && (
          <Alert type={notification.type}>{notification.message}</Alert>
        )}
        {scriptStatus === ASYNC_STATUS.LOADING ||
        status === ASYNC_STATUS.LOADING ? (
          <Loader isLoading />
        ) : (
          <div className="time-table">
            <div className="time-table-header">
              <Row>
                <Col>
                  <div className="time-table-header-label">
                    Select Script Name
                  </div>
                </Col>
                <Col>
                  <div className="time-table-header-select">
                    <Select
                      placeholder="select"
                      options={scriptOptions}
                      selected={this.state.scriptName}
                      onChange={this.onSelectScript}
                    />
                  </div>
                </Col>
              </Row>
            </div>
            <div className="time-table-content">
              <div className="table-section">
                <table>
                  <tbody>
                    <tr className="table-heading">
                      <th>Scene Number</th>
                      <th>Day Part</th>
                      <th>Location</th>
                      <th>Time</th>
                      <th>Hired Item</th>
                      <th>Dates</th>
                    </tr>
                    {schedule.map((item, index) => {
                      return (
                        <tr key={index}>
                          <td>{item.sceneNumber}</td>
                          <td>{item.dayPart}</td>
                          <td>{item.location}</td>
                          <td>{item.time}</td>
                          <td>{this.getString(item.inventory)}</td>
                          <td>
                            <Select
                              id={`${index}-date`}
                              options={item.dates}
                              selected={item.fixedDate}
                              onChange={(date) =>
                                this.onSelectFixedDate(item.sceneNumber, date)
                              }
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            {schedule.length > 0 && (
              <div>
                <div className="filter-head">
                  <Row>
                    <Col>
                      <div className="filter-head-label">Filter Location</div>
                    </Col>
                    <Col>
                      <div className="filter-head-input">
                        <Input
                          id="filter"
                          text={this.state.filterLocation}
                          onChange={(field) => this.formFieldChange(field)}
                        />
                      </div>
                    </Col>
                    <Col>
                      <Button onClick={this.filterContent}>Filter</Button>
                    </Col>
                  </Row>
                </div>
                <div className="table-section">
                  <table>
                    <tbody>
                      <tr className="table-heading">
                        <th>Scene Number</th>
                        <th>Day Part</th>
                        <th>Location</th>
                        <th>Time</th>
                        <th>Hired Item</th>
                        <th>Dates</th>
                      </tr>
                      {filteredLocations.map((item, index) => {
                        return (
                          <tr key={index}>
                            <td>{item.sceneNumber}</td>
                            <td>{item.dayPart}</td>
                            <td>{item.location}</td>
                            <td>{item.time}</td>
                            <td>{this.getString(item.inventory)}</td>
                            <td>
                              <Select
                                id={`${index}-date`}
                                options={item.dates}
                                selected={item.fixedDate}
                                onChange={(date) =>
                                  this.onSelectFixedDate(item.sceneNumber, date)
                                }
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    scriptNotification: state.script.notification,
    scripts: state.script.scripts,
    scriptStatus: state.script.status,
    status: state.schedule.status,
    notification: state.schedule.notification,
    schedule: state.schedule.schedule,
  };
};

const Actions = {
  getAllScripts,
  initializeScript,
  getAllSchedule,
  saveSchedule,
  onChangeScene,
};

export default connect(mapStateToProps, Actions)(TimeTable);
