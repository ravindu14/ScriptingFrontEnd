// @flow
import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";

import Icon from "components/icon";
import Button from "components/button";

import "./styles.scss";

const HTML_TYPE = {
  BUTTON: "button",
  SUBMIT: "submit",
  LINK: "Link"
};

type ButtonDropdownProps = {
  options: Array<any>,
  name: string
};

type ButtonDropdownState = {
  isOpen: boolean
};

class ButtonDropdown extends Component<
  ButtonDropdownProps,
  ButtonDropdownState
> {
  static HTML_TYPE = HTML_TYPE;

  constructor(props: SelectProps) {
    super(props);
    this.state = {
      isOpen: false
    };
    // $FlowFixMe
    this.toggleDropdown = this.toggleDropdown.bind(this);
    // $FlowFixMe
    this.closeDropdown = this.closeDropdown.bind(this);
  }

  toggleDropdown() {
    const { options } = this.props;
    if (options && options.length > 0) {
      this.setState(({ isOpen }) => ({
        isOpen: !isOpen
      }));
    }
  }

  closeDropdown() {
    this.setState({
      isOpen: false
    });
  }

  getOptions = () => {
    const { options } = this.props;

    if (options && options.length > 0) {
      return (
        <Fragment>
          {options.map(({ buttonName, type, onClickButton }, key) => {
            if (type === ButtonDropdown.HTML_TYPE.LINK) {
              return (
                <li key={key}>
                  <Link to={onClickButton}>{buttonName}</Link>
                </li>
              );
            }
            return (
              <li key={key} onClick={onClickButton}>
                {buttonName}
              </li>
            );
          })}
        </Fragment>
      );
    }
  };

  render() {
    const { isOpen } = this.state;
    const { options, name } = this.props;
    return (
      <div className="button-container">
        <Button onClick={this.toggleDropdown}>
          {name}
          <span className="dropdown-icon">
            {isOpen && options && options.length > 0 ? (
              <Icon icon="chevron-up" />
            ) : (
              <Icon icon="chevron-down" />
            )}
          </span>
        </Button>
        {isOpen && (
          <div className="button-dropdown">
            <ul className="dropdown">{this.getOptions()} </ul>
          </div>
        )}
        {isOpen && <div className="backdrop" onClick={this.closeDropdown} />}
      </div>
    );
  }
}

export default ButtonDropdown;
