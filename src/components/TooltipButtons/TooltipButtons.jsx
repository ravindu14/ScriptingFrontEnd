// @flow
import React, { Component } from "react";

import Button from "components/button";
import Link from "components/Link";

import "./styles.scss";

type TooltipButtonsProps = {
  buttons: Array<any>,
  position: string,
  children: any
};

type TooltipButtonsState = {
  displayTooltip: boolean
};

class TooltipButtons extends Component<
  TooltipButtonsProps,
  TooltipButtonsState
> {
  static position = {
    TOP: "top",
    BOTTOM: "bottom",
    LEFT: "left",
    RIGHT: "right"
  };

  constructor(props: TooltipProps) {
    super(props);

    this.state = {
      displayTooltip: false
    };

    // $FlowFixMe
    this.hideTooltip = this.hideTooltip.bind(this);
    // $FlowFixMe
    this.showTooltip = this.showTooltip.bind(this);
  }

  hideTooltip() {
    this.setState({ displayTooltip: false });
  }
  showTooltip() {
    this.setState({ displayTooltip: true });
  }

  render() {
    let { buttons, position } = this.props;
    return (
      <span className="tooltip" onMouseLeave={this.hideTooltip}>
        {this.state.displayTooltip && (
          <div className={`tooltip-bubble tooltip-${position}`}>
            <ul className="tooltip-buttons">
              {buttons &&
                buttons.length > 0 &&
                buttons.map(({ name, type, onClick }, key) => {
                  if (type === Button.HTML_TYPE.LINK) {
                    return (
                      <li key={key}>
                        <Link to={onClick}>{name}</Link>
                      </li>
                    );
                  }
                  return (
                    <li key={key} onClick={onClick}>
                      {name}
                    </li>
                  );
                })}
            </ul>
          </div>
        )}
        <span className="tooltip-trigger" onMouseOver={this.showTooltip}>
          {this.props.children}
        </span>
      </span>
    );
  }
}

export default TooltipButtons;
