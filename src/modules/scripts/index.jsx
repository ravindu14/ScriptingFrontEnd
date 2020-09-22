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
import Row from "components/Row";
import Col from "components/Col";
import Select from "components/Select";
import Alert from "components/Alert";
import uuid from "uuid";
import Textarea from "components/TextArea";
import Crew from "constants/crew";
import Actors from "constants/actors";
import MultiSelect from "components/MultiSelect";
import Loader from "components/loader";

import { getAllScripts, initializeScript } from "action/script";
import {
  initializeScene,
  getAllScenes,
  onChangeSceneField,
  updateScene,
  onAddNewLayer,
} from "action/scene";
import { getAllInventory } from "action/inventory";
import { queryParamsParse } from "shared/helpers/url";
import { ASYNC_STATUS } from "constants/async";

import "./styles.scss";

type ScriptsPageProps = {
  getAllInventory: Function,
  onAddNewLayer: Function,
  updateScene: Function,
  onChangeSceneField: Function,
  initializeScene: Function,
  getAllScenes: Function,
  initializeScript: Function,
  getAllScripts: Function,
  scriptNotification: NotificationType,
  scriptStatus: AsyncStatusType,
  scripts: Array<any>,
  sceneNotification: NotificationType,
  sceneStatus: AsyncStatusType,
  scenes: Array<any> | null,
  location: {
    search: string,
  },
  inventoryNotification: NotificationType,
  inventoryStatus: AsyncStatusType,
  inventory: Array<any>,
};

type ScriptsPageState = {
  scriptName: string,
  data: Array<any>,
};

class ScriptsPage extends Component<ScriptsPageProps, ScriptsPageState> {
  state = {
    selectedScript: "",
  };

  componentDidMount() {
    const {
      location: { search },
      getAllScripts,
      initializeScript,
      initializeScene,
    } = this.props;

    let filter = queryParamsParse(search);

    initializeScript();
    initializeScene();

    if (filter.scriptName) {
      this.onSelectScript(filter.scriptName);
    } else {
      getAllScripts();
    }
  }

  onSelectScript = (scriptId) => {
    this.setState(
      {
        ...this.state,
        selectedScript: scriptId,
      },
      this.getDependents(scriptId)
    );
  };

  getDependents = (scriptId) => {
    this.props.getAllScenes(scriptId);
    this.props.getAllInventory(scriptId);
  };

  addNewLayer = () => {
    const { scenes } = this.props;
    const { selectedScript } = this.state;

    const newLayer = {
      id: uuid.v4(),
      sceneNumber: (scenes.length + 1).toString(),
      scriptId: selectedScript,
      location: "",
      dayPart: "",
      description: "",
      time: "",
      actors: [],
      inventory: [],
      crew: [],
      stories: [],
      weatherstatus: "",
    };

    this.props.onAddNewLayer(newLayer);

    this.setState({
      newLayer,
    });
  };

  onChangeSceneField = (sceneId, field) => {
    this.props.onChangeSceneField({ sceneId, field });
  };

  onSelectActors = (sceneId, actors) => {
    const selectedActors = actors.map((actor) => {
      let details = Actors.filter(({ actorName }) => actorName === actor.name);

      return details[0];
    });

    this.props.onChangeSceneField({
      sceneId,
      field: { actors: selectedActors },
    });
  };

  onSelectCrew = (sceneId, crew) => {
    const selectedCrew = crew.map((member) => {
      let details = Crew.filter(
        ({ employeeName }) => employeeName === member.name
      );

      return details[0];
    });

    this.props.onChangeSceneField({
      sceneId,
      field: { crew: selectedCrew },
    });
  };

  onSelectInventory = (sceneId, inInventory) => {
    const { inventory } = this.props;

    const selectedInventory = inInventory.map((item) => {
      let details = inventory.filter(({ itemId }) => itemId === item.value);

      return details[0];
    });

    this.props.onChangeSceneField({
      sceneId,
      field: { inventory: selectedInventory },
    });
  };

  onSubmit = (sceneId) => {
    const { scenes } = this.props;

    let sceneToBeSubmit = scenes.filter((scene) => scene.id === sceneId);

    this.props.updateScene(sceneToBeSubmit[0]);
  };

  render() {
    const {
      scriptNotification,
      scripts,
      scriptStatus,
      sceneNotification,
      sceneStatus,
      scenes,
      inventory,
      inventoryStatus,
    } = this.props;

    const { scriptName } = this.state;

    let scriptOptions =
      scripts.length > 0
        ? [
            ...scripts.map(({ id, script }) => {
              return { name: script, value: id };
            }),
          ]
        : [];

    let actorOptions = Actors.map(({ actorName }) => actorName);

    let crewOptions = Crew.map(({ employeeName }) => employeeName);

    let inventoryOptions =
      inventory && inventory.length > 0
        ? inventory.map(({ itemId, itemName }) => {
            return { name: itemName, value: itemId };
          })
        : [];

    return (
      <Layout>
        {scriptNotification && (
          <Alert type={scriptNotification.type}>
            {scriptNotification.message}
          </Alert>
        )}
        {sceneNotification && (
          <Alert type={sceneNotification.type}>
            {sceneNotification.message}
          </Alert>
        )}
        {scriptStatus === ASYNC_STATUS.LOADING ||
        sceneStatus === ASYNC_STATUS.LOADING ||
        inventoryStatus === ASYNC_STATUS.LOADING ? (
          <Loader isLoading />
        ) : (
          <div className="scripts">
            <div className="scripts-header">
              <Row>
                <Col>
                  <div className="scripts-header-label">Select Script Name</div>
                </Col>
                <Col>
                  <div className="scripts-header-select">
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
            {scenes && (
              <div className="scripts-content">
                <div className="scripts-content-name">{scriptName}</div>
                {scenes.length > 0 &&
                  scenes.map((scene) => {
                    return (
                      <div key={scene.id} className="scripts-content-item">
                        <Row>
                          <Col>
                            <Input
                              id={`${scene.id}-number`}
                              text={scene.sceneNumber}
                              disabled
                            />
                          </Col>
                          <Col>
                            <Select
                              placeholder="Day type"
                              selected={scene.dayPart}
                              options={[
                                "Morning",
                                "Afternoon",
                                "Evening",
                                "Night",
                              ]}
                              onChange={(dayPart) =>
                                this.onChangeSceneField(scene.id, { dayPart })
                              }
                            />
                          </Col>
                          <Col>
                            <Input
                              id={`${scene.id}-location`}
                              placeholder="script location"
                              text={scene.location}
                              onChange={(location) =>
                                this.onChangeSceneField(scene.id, { location })
                              }
                            />
                          </Col>
                          <Col>
                            <Input
                              type="time"
                              placeholder={`${scene.id}-time`}
                              text={scene.time}
                              onChange={(time) =>
                                this.onChangeSceneField(scene.id, { time })
                              }
                            />
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <MultiSelect
                              placeholder="Actors"
                              options={actorOptions}
                              onChange={(selectedActors) =>
                                this.onSelectActors(scene.id, selectedActors)
                              }
                            />
                          </Col>
                          <Col>
                            <MultiSelect
                              placeholder="Crew"
                              options={crewOptions}
                              onChange={(selectedCrew) =>
                                this.onSelectCrew(scene.id, selectedCrew)
                              }
                            />
                          </Col>
                          <Col>
                            <MultiSelect
                              placeholder="Inventory"
                              options={inventoryOptions}
                              onChange={(selectedInventory) =>
                                this.onSelectInventory(
                                  scene.id,
                                  selectedInventory
                                )
                              }
                            />
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <Textarea
                              id={`${scene.id}-detail`}
                              text={scene.description}
                              onChange={(description) =>
                                this.onChangeSceneField(scene.id, {
                                  description,
                                })
                              }
                            />
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <Button
                              type={Button.TYPE.SUCCESS}
                              onClick={() => this.onSubmit(scene.id)}
                            >
                              Save
                            </Button>
                          </Col>
                        </Row>
                      </div>
                    );
                  })}
                <div className="scripts-content-add">
                  <Button onClick={this.addNewLayer}>Add Layer</Button>
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
    sceneNotification: state.scene.notification,
    sceneStatus: state.scene.status,
    scenes: state.scene.scenes,
    inventoryNotification: state.inventory.notification,
    inventoryStatus: state.inventory.status,
    inventory: state.inventory.inventory,
  };
};

const Actions = {
  initializeScript,
  getAllScripts,
  initializeScene,
  getAllScenes,
  onChangeSceneField,
  updateScene,
  onAddNewLayer,
  getAllInventory,
};

export default connect(mapStateToProps, Actions)(ScriptsPage);
