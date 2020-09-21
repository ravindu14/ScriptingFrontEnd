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
import uuid from "uuid";
import Icon from "components/icon";
import Loader from "components/loader";

import { getAllScripts, initializeScript } from "action/script";
import {
  initializeInventory,
  getAllInventory,
  updateInventory,
  onAddNewInventory,
  onChangeInventoryField,
  onRemoveInventory,
} from "action/inventory";
import { isNotEmpty } from "shared/utils";
import { ASYNC_STATUS } from "constants/async";

import "./styles.scss";

type InventoryPageProps = {
  getAllScripts: Function,
  initializeScript: Function,
  initializeInventory: Function,
  getAllInventory: Function,
  updateInventory: Function,
  onAddNewInventory: Function,
  onChangeInventoryField: Function,
  onRemoveInventory: Function,
  scriptNotification: NotificationType,
  scriptStatus: AsyncStatusType,
  scripts: Array<any>,
  notification: NotificationType,
  status: AsyncStatusType,
  inventory: Array<any> | null,
};

type InventoryPageState = {
  scriptName: string,
  scriptId: string,
  data: {
    itemName: string,
    amount: number,
    availability: boolean,
    cost: number,
  },
};

class InventoryPage extends Component<InventoryPageProps, InventoryPageState> {
  state = {
    scriptId: "",
    scriptName: "",
    data: {
      itemName: "",
      amount: 0,
      availability: false,
      cost: 0,
    },
  };

  componentDidMount() {
    const { getAllScripts, initializeScript, initializeInventory } = this.props;

    initializeScript();
    getAllScripts();
    initializeInventory();
  }

  onSelectScript = (scriptId) => {
    this.setState(
      {
        ...this.state,
        scriptId,
      },
      this.props.getAllInventory(scriptId)
    );
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
    const {
      data: { itemName, cost, availability, amount },
    } = this.state;
    let itemId = uuid.v4();

    this.props.onAddNewInventory({
      itemName,
      cost: parseFloat(cost),
      availability,
      amount: parseFloat(amount),
      itemId,
    });

    this.resetDataFields();
  };

  resetDataFields = () => {
    this.setState({
      ...this.state,
      data: {
        itemName: "",
        amount: 0,
        availability: false,
        cost: 0,
      },
    });
  };

  onTableSwitchChange = (itemId) => {
    this.props.onChangeInventoryField(itemId);

    this.setState({
      ...this.state,
      selectedInventory: itemId,
    });
  };

  onSubmit = () => {
    const { inventory } = this.props;
    const { scriptId } = this.state;

    this.props.updateInventory({ scriptId, inventory });
  };

  render() {
    const {
      scriptNotification,
      scripts,
      scriptStatus,
      notification,
      status,
      inventory,
    } = this.props;

    const {
      scriptName,
      data: { itemName, amount, availability, cost },
    } = this.state;

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
          <Button type={Button.TYPE.SUCCESS} onClick={this.onSubmit}>
            Save Inventory
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
          <div className="inventory">
            <div className="inventory-header">
              <Row>
                <Col>
                  <div className="inventory-header-label">
                    Select Script Name
                  </div>
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
              {isNotEmpty(inventory) && (
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
                        type="number"
                        text={amount}
                        onChange={(amount) =>
                          this.onFieldDataChange({ amount })
                        }
                      />
                    </Col>
                    <Col size="1">
                      <Switch
                        id="availability"
                        isChecked={availability}
                        onChange={this.onFieldSwitchChange}
                      />
                    </Col>
                    <Col>
                      <Input
                        id="cost"
                        placeholder="cost"
                        type="number"
                        text={cost}
                        onChange={(cost) => this.onFieldDataChange({ cost })}
                      />
                    </Col>
                    <Col>
                      <Button onClick={this.addInventory}>Add Inventory</Button>
                    </Col>
                  </Row>
                </div>
              )}
              {isNotEmpty(inventory) && inventory.length > 0 && (
                <div className="inventory-content-table">
                  <table>
                    <tbody>
                      <tr>
                        <th>Item Name</th>
                        <th>Amount</th>
                        <th>Availability</th>
                        <th>Cost</th>
                        <th>Action</th>
                      </tr>
                      {inventory.map((detail, index) => {
                        return (
                          <tr key={index}>
                            <td>{detail.itemName}</td>
                            <td>{detail.amount}</td>
                            <td>
                              <Switch
                                id={`${itemName}-switch`}
                                isChecked={detail.availability}
                                onChange={() =>
                                  this.onTableSwitchChange(detail.itemId)
                                }
                              />
                            </td>
                            <td>{detail.cost}</td>
                            <td>
                              <Icon
                                icon="bin"
                                onClick={() =>
                                  this.props.onRemoveInventory(detail.itemId)
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
    notification: state.inventory.notification,
    status: state.inventory.status,
    inventory: state.inventory.inventory,
  };
};

const Actions = {
  getAllScripts,
  initializeScript,
  initializeInventory,
  getAllInventory,
  updateInventory,
  onAddNewInventory,
  onChangeInventoryField,
  onRemoveInventory,
};

export default connect(mapStateToProps, Actions)(InventoryPage);
