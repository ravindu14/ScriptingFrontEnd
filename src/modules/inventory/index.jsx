// @flow
import React, { Component } from "react";
import { connect } from "react-redux";

import Layout from "components/layout";
import Input from "components/Input";
import Button from "components/button";
import Alert from "components/Alert";
import Row from "components/Row";
import Col from "components/Col";
import Select from "components/Select";
import Switch from "components/Switch";

import { asyncAuthInit, saveInventoryData } from "action/auth";

import "./styles.scss";
import { isNotEmpty } from "shared/utils";

type InventoryPageProps = {
  saveInventoryData: Function,
  asyncAuthInit: Function,
  notification: string | null,
  scripts: Array<any>,
};

type InventoryPageState = {
  scriptName: string,
  uploading: boolean,
};

class InventoryPage extends Component<InventoryPageProps, InventoryPageState> {
  state = {
    scriptName: "",
    inventory: [],
    data: {
      itemName: "",
      amount: "",
      availability: false,
    },
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
        inventory: selectedData[0].inventory,
      });
    }
  };

  onFieldDataChange = (field) => {
    this.setState({
      ...this.state,
      data: {
        ...this.state.data,
        ...field,
      },
    });
  };

  onFieldSwitchChange = () => {
    this.setState({
      ...this.state,
      data: {
        ...this.state.data,
        availability: !this.state.data.availability,
      },
    });
  };

  addInventory = () => {
    const { data } = this.state;

    let updatedInventory = this.state.inventory;

    updatedInventory.push(data);

    this.setState({
      ...this.state,
      inventory: updatedInventory,
    });

    this.resetDataFields();
  };

  resetDataFields = () => {
    this.setState({
      ...this.state,
      data: {
        itemName: "",
        amount: "",
        availability: false,
      },
    });
  };

  onTableSwitchChange = (itemName) => {
    let updatedInventory = this.state.inventory.map((item) => {
      if (item.itemName === itemName) {
        return {
          ...item,
          availability: !item.availability,
        };
      }
      return item;
    });

    this.setState({
      ...this.state,
      inventory: updatedInventory,
    });
  };

  onSubmit = () => {
    const { scriptName, inventory } = this.state;

    this.props.saveInventoryData({ script: scriptName, inventory });
  };

  render() {
    const { notification, scripts } = this.props;

    const {
      scriptName,
      data: { itemName, amount, availability },
      inventory,
    } = this.state;

    let scriptOptions =
      scripts.length > 0 ? [...scripts.map(({ script }) => script)] : [];

    return (
      <Layout
        actions={
          <Button type={Button.TYPE.SUCCESS} onClick={this.onSubmit}>
            Save Inventory
          </Button>
        }
      >
        {notification && (
          <Alert type={Alert.TYPE.SUCCESS}>{notification}</Alert>
        )}
        <div className="inventory">
          <div className="inventory-header">
            <Row>
              <Col>
                <div className="inventory-header-label">Select Script Name</div>
              </Col>
              <Col>
                <div className="inventory-header-select">
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
          <div className="inventory-content">
            <div className="inventory-content-name">{scriptName}</div>
            {isNotEmpty(scriptName) && (
              <div className="inventory-content-fill">
                <Row>
                  <Col>
                    <Input
                      id="itemName"
                      placeholder="item name"
                      text={itemName}
                      onChange={(itemName) =>
                        this.onFieldDataChange({ itemName })
                      }
                    />
                  </Col>
                  <Col>
                    <Input
                      id="amount"
                      placeholder="amount"
                      text={amount}
                      onChange={(amount) => this.onFieldDataChange({ amount })}
                    />
                  </Col>
                  <Col>
                    <Switch
                      id="availability"
                      isChecked={availability}
                      onChange={this.onFieldSwitchChange}
                    />
                  </Col>
                  <Col>
                    <Button onClick={this.addInventory}>Add Inventory</Button>
                  </Col>
                </Row>
              </div>
            )}
            {isNotEmpty(scriptName) && (
              <div className="inventory-content-table">
                <table>
                  <tbody>
                    <tr>
                      <th>Item Name</th>
                      <th>Amount</th>
                      <th>Availability</th>
                    </tr>
                    {inventory.length > 0 &&
                      inventory.map((detail, index) => {
                        return (
                          <tr key={index}>
                            <td>{detail.itemName}</td>
                            <td>{detail.amount}</td>
                            <td>
                              <Switch
                                id={`${itemName}-switch`}
                                isChecked={detail.availability}
                                onChange={() =>
                                  this.onTableSwitchChange(detail.itemName)
                                }
                              />
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
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

const Actions = { asyncAuthInit, saveInventoryData };

export default connect(mapStateToProps, Actions)(InventoryPage);
