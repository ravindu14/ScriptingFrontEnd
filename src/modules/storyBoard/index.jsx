// @flow
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import {
  type AsyncStatusType,
  type NotificationType,
} from "shared/types/General";

import Layout from "components/layout";
import Input from "components/Input";
import Button from "components/button";
import Alert from "components/Alert";
import uploadImage from "assets/image/upload.png";
import Row from "components/Row";
import Col from "components/Col";
import Select from "components/Select";
import DotLoader from "components/DotLoader";
import Link from "components/Link";
import Loader from "components/loader";
import uuid from "uuid";

import { getAllScripts, initializeScript } from "action/script";
import {
  getAllScenes,
  onSelectSingleScene,
  initializeScene,
  onAddNewStory,
  onChangeStoryField,
  updateScene,
} from "action/scene";
import { isNotEmpty } from "shared/utils";
import { ASYNC_STATUS } from "constants/async";

import "./styles.scss";

type StoryBoardPageProps = {
  updateScene: Function,
  onChangeStoryField: Function,
  onAddNewStory: Function,
  initializeScene: Function,
  onSelectSingleScene: Function,
  getAllScenes: Function,
  getAllScripts: Function,
  initializeScript: Function,
  scriptNotification: NotificationType,
  scriptStatus: AsyncStatusType,
  scripts: Array<any>,
  sceneNotification: NotificationType,
  sceneStatus: AsyncStatusType,
  scenes: Array<any>,
  scene: null | Object,
};

type StoryBoardPageState = {
  scriptName: string,
  uploading: boolean,
};

class StoryBoardPage extends Component<
  StoryBoardPageProps,
  StoryBoardPageState
> {
  state = {
    scriptName: "",
    data: [],
    uploading: false,
  };

  componentDidMount() {
    const { initializeScript, getAllScripts, initializeScene } = this.props;

    initializeScript();
    initializeScene();
    getAllScripts();
  }

  onSelectScript = (scriptId) => {
    this.setState(
      {
        ...this.state,
        selectedScript: scriptId,
      },
      this.props.getAllScenes(scriptId)
    );
  };

  onSelectScene = (sceneId) => {
    this.props.onSelectSingleScene(sceneId);
  };

  async onImageUpload(event: SyntheticInputEvent<HTMLInputElement>, storyId) {
    event.stopPropagation();
    event.preventDefault();

    this.setState({
      ...this.state,
      uploading: true,
    });

    if (event.target.files.length > 0) {
      const file = event.target.files[0];

      this.props.onChangeStoryField({
        storyId,
        field: { image: URL.createObjectURL(file) },
      });

      this.setState({
        ...this.state,
        uploading: false,
      });
    }
  }

  onChangeShot = (field, storyId) => {
    this.props.onChangeStoryField({ storyId, field });
  };

  onSubmit = () => {
    const { scene } = this.props;

    this.props.updateScene(scene);
  };

  onAddNewStory = () => {
    const newStory = {
      storyId: uuid.v4(),
      image: "",
      shot: "",
    };

    this.props.onAddNewStory(newStory);

    this.setState({
      newStory,
    });
  };

  getScriptNameByScriptId = (scriptId) => {
    const { scripts } = this.props;

    let scriptName = "";

    scripts.map((script) => {
      if (script.id === scriptId) {
        scriptName = script.script;
      }
      return script;
    });

    return scriptName;
  };

  render() {
    const {
      scriptNotification,
      scripts,
      scriptStatus,
      sceneNotification,
      sceneStatus,
      scenes,
      scene,
    } = this.props;

    const { uploading } = this.state;

    let scriptOptions =
      scripts.length > 0
        ? [
            ...scripts.map(({ id, script }) => {
              return { name: script, value: id };
            }),
          ]
        : [];

    let sceneOptions =
      scenes && scenes.length > 0
        ? [
            ...scenes.map(({ id, sceneNumber }) => {
              return { name: sceneNumber, value: id };
            }),
          ]
        : [];

    return (
      <Layout
        actions={
          <Button type={Button.TYPE.SUCCESS} onClick={this.onSubmit}>
            Save Template
          </Button>
        }
      >
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
        sceneStatus === ASYNC_STATUS.LOADING ? (
          <Loader isLoading />
        ) : (
          <div className="board">
            <div className="board-header">
              <Row>
                <Col>
                  <div className="board-header-label">Select Script Name</div>
                </Col>
                <Col>
                  <div className="board-header-select">
                    <Select
                      placeholder="select"
                      options={scriptOptions}
                      selected={this.state.scriptName}
                      onChange={this.onSelectScript}
                    />
                  </div>
                </Col>
              </Row>
              {scenes && (
                <Row>
                  <Col>
                    <div className="board-header-label">Select Scene Name</div>
                  </Col>
                  <Col>
                    <div className="board-header-select">
                      <Select
                        placeholder="select"
                        options={sceneOptions}
                        selected={this.state.sceneName}
                        onChange={this.onSelectScene}
                      />
                    </div>
                  </Col>
                </Row>
              )}
            </div>
            {scene && (
              <div className="board-content">
                <div className="board-content-view">
                  {scene.stories.length > 0 &&
                    scene.stories.map((story) => {
                      return (
                        <div key={story.storyId} className="card">
                          <div className="image-wrapper">
                            <label
                              htmlFor="photo-upload-1"
                              className="image-frame"
                            >
                              <div className="preview-image">
                                {uploading ? (
                                  <DotLoader />
                                ) : isNotEmpty(story.image) ? (
                                  <Fragment>
                                    <img
                                      htmlFor="photo-upload-1"
                                      alt="preview"
                                      src={story.image}
                                    />
                                  </Fragment>
                                ) : (
                                  <Fragment>
                                    <div className="img-wrap img-upload">
                                      <img
                                        htmlFor="photo-upload-1"
                                        className="empty-upload"
                                        alt="preview"
                                        src={uploadImage}
                                      />
                                    </div>
                                    <input
                                      id="photo-upload-1"
                                      type="file"
                                      accept="image/*"
                                      multiple={false}
                                      onChange={(event) =>
                                        this.onImageUpload(event, story.storyId)
                                      }
                                    />
                                  </Fragment>
                                )}
                              </div>
                            </label>
                          </div>
                          <div className="card-number">
                            <Link
                              to={`scripts?scriptName=${scene.scriptId}`}
                            >{`${this.getScriptNameByScriptId(
                              scene.scriptId
                            )}`}</Link>
                          </div>
                          <div className="card-input">
                            <Input
                              placeholder="Enter Shot"
                              text={story.shot}
                              onChange={(shot) =>
                                this.onChangeShot({ shot }, story.storyId)
                              }
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
                <div className="scripts-content-add">
                  <Button onClick={this.onAddNewStory}>Add Story</Button>
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
    scenes: state.scene.scenes,
    sceneNotification: state.scene.notification,
    sceneStatus: state.scene.status,
    scene: state.scene.scene,
  };
};

const Actions = {
  getAllScripts,
  initializeScript,
  getAllScenes,
  onSelectSingleScene,
  initializeScene,
  onAddNewStory,
  onChangeStoryField,
  updateScene,
};

export default connect(mapStateToProps, Actions)(StoryBoardPage);
