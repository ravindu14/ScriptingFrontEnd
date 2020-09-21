// @flow
import React, { Component } from "react";
import { connect } from "react-redux";
import {
  type AsyncStatusType,
  type NotificationType,
} from "shared/types/General";

import Layout from "components/layout";
import Alert from "components/Alert";

import {
  initializeActors,
  getAllActors,
  updateActors,
  addFreeDate,
} from "action/actors";
import { ASYNC_STATUS } from "constants/async";
import Loader from "components/loader";
import Button from "components/button";
import Input from "components/Input";

import "./styles.scss";
import { formatDate } from "shared/utils";

type ActorsProps = {
  initializeActors: Function,
  getAllActors: Function,
  updateActors: Function,
  notification: NotificationType,
  status: AsyncStatusType,
  actors: Array<any> | null,
  addFreeDate: Function,
  onSaveFreeDate: Function,
};

class Actors extends Component<ActorsProps> {
  componentDidMount() {
    this.props.initializeActors();
    this.props.getAllActors();
  }

  onAddFreeDate = (actorId, freeDate) => {
    this.props.addFreeDate(actorId, freeDate);

    this.setState({
      freeDate: freeDate,
    });
  };

  onSaveDates = (actorId) => {
    let filteredActor = this.props.actors.filter(
      (actor) => actor.actorId === actorId
    );

    this.props.updateActors({ ...filteredActor[0] });
  };

  render() {
    const { notification, status, actors } = this.props;

    return (
      <Layout>
        {notification && (
          <Alert type={notification.type}>{notification.message}</Alert>
        )}
        {status === ASYNC_STATUS.LOADING ? (
          <Loader isLoading />
        ) : (
          <div className="actors">
            <div className="actors-header">Actors Free Dates</div>
            {actors && (
              <div className="actors-content">
                <div className="actors-content-view">
                  {actors.map((actor) => {
                    return (
                      <div key={actor.actorId} className="actor-card">
                        <div className="actor-card-name">{actor.actorName}</div>
                        {actor.freeDates.map((date, index) => {
                          return (
                            <div key={index} className="actor-card-date">
                              {date}
                            </div>
                          );
                        })}
                        <div className="actor-card-input">
                          <Input
                            type="date"
                            onChange={(date) =>
                              this.onAddFreeDate(
                                actor.actorId,
                                formatDate(date)
                              )
                            }
                          />
                        </div>
                        <div className="actor-card-button">
                          <Button
                            onClick={() => this.onSaveDates(actor.actorId)}
                          >
                            Add Dates
                          </Button>
                        </div>
                      </div>
                    );
                  })}
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
    notification: state.actors.notification,
    status: state.actors.status,
    actors: state.actors.actors,
  };
};

const Actions = {
  initializeActors,
  getAllActors,
  updateActors,
  addFreeDate,
};

export default connect(mapStateToProps, Actions)(Actors);
