// @flow
import React, { Component, Fragment } from "react";

import Icon from "components/icon";
import Row from "components/Row";
import Col from "components/Col";

import "./styles.scss";

type ExpandableListProps = {
  onClick: Function,
  isOpen: Boolean,
  title: {
    name: string,
    subTitles?: {
      category: string,
      isDefault: Boolean,
      label: string,
      path: string,
      method: string,
      allow: Boolean
    }[]
  }
};

type ExpandableListState = {
  isToggleOpen: Boolean,
};

class ExpandableList extends Component<
  ExpandableListProps,
  ExpandableListState
> {
  static defaultProps = {
    onClick: () => {}
  };

  constructor(props) {
    super(props);

    this.state = {
      isToggleOpen: true
    };

    // $FlowFixMe
    this.toggleDropdown = this.toggleDropdown.bind(this);
    // $FlowFixMe
    this.handleInnerLock = this.handleInnerLock.bind(this);
  }

  toggleDropdown() {
    this.setState({
      ...this.state,
      isToggleOpen: !this.state.isToggleOpen
    });
  }

  handleInnerLock(label) {
    const {
      title,
      title: { subTitles }
    } = this.props;

    let updatedSubTitles = subTitles.map(subTitle => {
      if (label === subTitle.label) {
        return {
          ...subTitle,
          allow: !subTitle.allow
        };
      }
      return subTitle;
    });

    this.props.onClick({
      ...title,
      subTitles: updatedSubTitles
    });
  }

  getSubTitle = () => {
    const {
      title: { subTitles }
    } = this.props;

    if (subTitles && subTitles.length > 0) {
      return (
        <Fragment>
          {subTitles.map(subTitle => {
            return (
              <Row key={`${subTitle.label}`}>
                {!subTitle.isDefault && (
                  <Col className={"childLess-title"} size="2">
                    <li key={`${subTitle.label}`}>{subTitle.label}</li>
                  </Col>
                )}
                {!subTitle.isDefault && (
                  <Col>
                    <div
                      className="collapse-icon"
                      onClick={() => {
                        this.handleInnerLock(subTitle.label);
                      }}
                    >
                      {subTitle.allow ? (
                        <Icon icon="padlock-unlocked" />
                      ) : (
                        <Icon icon="padlock-locked" />
                      )}
                    </div>
                  </Col>
                )}
              </Row>
            );
          })}
        </Fragment>
      );
    } else return null;
  };

  render() {
    const {
      isOpen,
      title: { name, subTitles }
    } = this.props;

    const { isToggleOpen } = this.state;

    return (
      <div className="expand-list-container">
        <div className="title-container">
          <Row>
            {subTitles && subTitles.length > 0 && (
              <div className="collapse-icon" onClick={this.toggleDropdown}>
                {isToggleOpen && isOpen ? (
                  <Icon icon="chevron-up" />
                ) : (
                  <Icon icon="chevron-down" />
                )}
              </div>
            )}
            <Col
              className={
                subTitles && subTitles.length > 0
                  ? "childWith-title"
                  : "childLess-title"
              }
              size="2"
            >
              {name}
            </Col>
          </Row>
        </div>
        {isToggleOpen && isOpen && (
          <div className="sub-title-container">
            <ul className="dropdown">{this.getSubTitle()}</ul>
          </div>
        )}
      </div>
    );
  }
}

export default ExpandableList;
