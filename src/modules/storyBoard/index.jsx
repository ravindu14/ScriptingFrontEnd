// @flow
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";

import Layout from "components/layout";
import Input from "components/Input";
import Button from "components/button";
import Alert from "components/Alert";
import uploadImage from "assets/image/upload.png";

import { asyncAuthInit, saveScriptData } from "action/auth";

import "./styles.scss";
import Row from "components/Row";
import Col from "components/Col";
import Select from "components/Select";
import DotLoader from "components/DotLoader";
import { isNotEmpty } from "shared/utils";
import Link from "components/Link";

type StoryBoardPageProps = {
  asyncAuthInit: Function,
  saveScriptData: Function,
  notification: string | null,
  scripts: Array<any>,
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
    this.props.asyncAuthInit();
  }

  onSelectScript = (name) => {
    const { scripts } = this.props;

    if (scripts.length > 0) {
      let selectedData = scripts.filter(({ script }) => script === name);

      this.setState({
        scriptName: name,
        data: selectedData[0].data,
      });
    }
  };

  async onImageUpload(event: SyntheticInputEvent<HTMLInputElement>, scriptId) {
    event.stopPropagation();
    event.preventDefault();

    this.setState({
      ...this.state,
      uploading: true,
    });

    if (event.target.files.length > 0) {
      const file = event.target.files[0];

      let updatedScripts = this.state.data.map((script) => {
        if (script.id === scriptId) {
          return {
            ...script,
            image: URL.createObjectURL(file),
          };
        }
        return script;
      });

      this.setState({
        ...this.state,
        uploading: false,
        data: updatedScripts,
      });
    }
  }

  onChangeShot = (field, scriptId) => {
    let updatedScripts = this.state.data.map((script) => {
      if (script.id === scriptId) {
        return {
          ...script,
          ...field,
        };
      }
      return script;
    });

    this.setState({
      ...this.state,
      data: updatedScripts,
    });
  };

  onSubmit = () => {
    const { scriptName, data } = this.state;

    this.props.saveScriptData({ script: scriptName, data });
  };

  render() {
    const { notification, scripts } = this.props;

    const { scriptName, data, uploading } = this.state;

    let scriptOptions =
      scripts.length > 0 ? [...scripts.map(({ script }) => script)] : [];

    return (
      <Layout
        actions={
          <Button type={Button.TYPE.SUCCESS} onClick={this.onSubmit}>
            Save Template
          </Button>
        }
      >
        {notification && (
          <Alert type={Alert.TYPE.SUCCESS}>{notification}</Alert>
        )}
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
          </div>
          <div className="board-content">
            <div className="board-content-name">{scriptName}</div>
            <div className="board-content-view">
              {data.length > 0 &&
                data.map((script, index) => {
                  return (
                    <div key={index} className="card">
                      <div className="image-wrapper">
                        <label htmlFor="photo-upload-1" className="image-frame">
                          <div className="preview-image">
                            {uploading ? (
                              <DotLoader />
                            ) : isNotEmpty(script.image) ? (
                              <Fragment>
                                <img
                                  htmlFor="photo-upload-1"
                                  alt="preview"
                                  src={script.image}
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
                                    this.onImageUpload(event, script.id)
                                  }
                                />
                              </Fragment>
                            )}
                          </div>
                        </label>
                      </div>
                      <div className="card-number">
                        <Link
                          to={`scripts?scriptName=${scriptName}`}
                        >{`Scene No ${script.caseId}`}</Link>
                      </div>
                      <div className="card-input">
                        <Input
                          placeholder="Enter Shot"
                          text={script.shot}
                          onChange={(shot) =>
                            this.onChangeShot({ shot }, script.id)
                          }
                        />
                      </div>
                    </div>
                  );
                })}
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
    scripts: state.auth.scripts,
  };
};

const Actions = { asyncAuthInit, saveScriptData };

export default connect(mapStateToProps, Actions)(StoryBoardPage);
