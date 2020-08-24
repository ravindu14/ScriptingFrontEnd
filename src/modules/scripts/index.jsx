// @flow
import React, { Component } from "react";
import { connect } from "react-redux";

import Layout from "components/layout";
import Input from "components/Input";
import Button from "components/button";
import Row from "components/Row";
import Col from "components/Col";
import Select from "components/Select";
import Alert from "components/Alert";
import uuid from "uuid";
import Textarea from "components/TextArea";

import { asyncAuthInit, saveScriptData } from "action/auth";
import { queryParamsParse } from "shared/helpers/url";

import "./styles.scss";

type ScriptsPageProps = {
  asyncAuthInit: Function,
  saveScriptData: Function,
  notification: string | null,
  scripts: Array<any>,
  location: {
    search: string,
  },
};

type ScriptsPageState = {
  scriptName: string,
  data: Array<any>,
};

class ScriptsPage extends Component<ScriptsPageProps, ScriptsPageState> {
  state = {
    scriptName: "",
    data: [],
  };

  componentDidMount() {
    const {
      location: { search },
    } = this.props;

    let filter = queryParamsParse(search);

    if (filter.scriptName) {
      this.onSelectScript(filter.scriptName);
    }

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

  addNewLayer = () => {
    const selectedScript = this.state.data;

    let newScript = {
      id: uuid.v4(),
      image: "",
      caseId: "",
      type: "",
      location: "",
      time: "",
      details: "",
      shot: "",
    };
    selectedScript.push(newScript);

    this.setState({ ...this.state, data: selectedScript });
  };

  onChangeFormField = (id, field) => {
    const { data } = this.state;

    let updatedData = [
      ...data.map((script) => {
        if (script.id === id) {
          return {
            ...script,
            ...field,
          };
        }
        return script;
      }),
    ];

    this.setState({
      ...this.state,
      data: updatedData,
    });
  };

  onSubmit = () => {
    const { scriptName, data } = this.state;

    this.props.saveScriptData({ script: scriptName, data });
  };

  render() {
    const { notification, scripts } = this.props;

    const { scriptName, data } = this.state;

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
          <div className="scripts-content">
            <div className="scripts-content-name">{scriptName}</div>
            {data.length > 0 &&
              data.map((script, index) => {
                return (
                  <div key={index} className="scripts-content-item">
                    <Row>
                      <Col>
                        <Input
                          id={`${script.id}-number`}
                          placeholder="script number"
                          text={script.caseId}
                          onChange={(caseId) =>
                            this.onChangeFormField(script.id, { caseId })
                          }
                        />
                      </Col>
                      <Col>
                        <Select
                          placeholder="script type"
                          selected={script.type}
                          options={["Int", "Ext"]}
                          onChange={(type) =>
                            this.onChangeFormField(script.id, { type })
                          }
                        />
                      </Col>
                      <Col>
                        <Input
                          id={`${script.id}-location`}
                          placeholder="script location"
                          text={script.location}
                          onChange={(location) =>
                            this.onChangeFormField(script.id, { location })
                          }
                        />
                      </Col>
                      <Col>
                        <Select
                          placeholder="script time"
                          selected={script.time}
                          options={["Day", "Night"]}
                          onChange={(time) =>
                            this.onChangeFormField(script.id, { time })
                          }
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Textarea
                          id={`${script.id}-detail`}
                          text={script.detail}
                          onChange={(detail) =>
                            this.onChangeFormField(script.id, { detail })
                          }
                        />
                      </Col>
                    </Row>
                  </div>
                );
              })}
            {data.length > 0 && (
              <div className="scripts-content-add">
                <Button onClick={this.addNewLayer}>Add Layer</Button>
              </div>
            )}
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

export default connect(mapStateToProps, Actions)(ScriptsPage);
