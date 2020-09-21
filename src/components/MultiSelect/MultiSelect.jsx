// @flow
import React, { PureComponent, Fragment } from "react";
import classnames from "classnames";

import Icon from "components/icon";
import Checkbox from "components/checkbox";

import "./styles.scss";

type MultiSelectObject = {
  value: string,
  name: string,
  isSelected: Boolean,
};

type MultiSelectInputType = MultiSelectObject | string;

type MultiSelectProps = {
  onChange: Function,
  options: MultiSelectInputType[],
  placeholder?: string,
};

type MultiSelectState = {
  isOpen: boolean,
  options: MultiSelectObject[],
};

class MultiSelect extends PureComponent<MultiSelectProps, MultiSelectState> {
  static defaultProps = {
    onChange: () => {},
  };

  constructor(props: MultiSelectProps) {
    super(props);
    this.state = {
      isOpen: false,
      options: [],
    };

    //$FlowFixMe Forced to do that for perf issues
    this.toggleDropdown = this.toggleDropdown.bind(this);
    // $FlowFixMe
    this.closeDropdown = this.closeDropdown.bind(this);
    // $FlowFixMe
    this.onClick = this.onClick.bind(this);
    // $FlowFixMe
    this.filterSelectedOptions = this.filterSelectedOptions.bind(this);
  }

  componentDidMount() {
    const options = this.getFormattedOptions(this.props);
    this.setState({
      options,
    });
  }

  componentDidUpdate(prevProps: MultiSelectProps) {
    if (prevProps.options !== this.props.options) {
      const options = this.getFormattedOptions(this.props);
      this.setState({
        options,
      });
    }
  }

  getFormattedOptions(props: MultiSelectProps) {
    const { options } = props;
    // $FlowFixMe
    return options.map((option) => {
      let name, value, isSelected;
      if (typeof option === "object") {
        name = option.name;
        value = option.value;
        isSelected = option.isSelected;
      } else {
        name = option;
        value = option;
        isSelected = false;
      }
      return {
        name,
        value,
        isSelected,
      };
    });
  }

  toggleDropdown() {
    const { options } = this.props;
    const { isOpen } = this.state;

    if (isOpen) {
      this.filterSelectedOptions();
    }

    if (options && options.length > 0) {
      this.setState(({ isOpen }) => ({
        isOpen: !isOpen,
      }));
    }
  }

  closeDropdown() {
    this.setState({
      isOpen: false,
    });
  }

  onClick(
    name: $PropertyType<MultiSelectObject, "name">,
    value: $PropertyType<MultiSelectObject, "value">,
    isSelected: $PropertyType<MultiSelectObject, "isSelected">
  ) {
    let updatedOptions = this.state.options.map((item) => {
      if (item.name === name) {
        return { ...item, isSelected: !isSelected };
      }
      return item;
    });

    this.setState(
      {
        ...this.state,
        options: updatedOptions,
      }
      //this.filterSelectedOptions
    );
  }

  filterSelectedOptions() {
    let selectedOptions = this.state.options.filter((option) => {
      return option.isSelected;
    });

    this.props.onChange(selectedOptions);
  }

  onSearchChange(e: SyntheticEvent<HTMLButtonElement>) {
    const options = this.getFormattedOptions(this.props);
    const userInput = e.currentTarget.value;

    // Filter our options that don't contain the user's input
    let filteredOptions = options.filter(
      (option) =>
        option.name.toLowerCase().indexOf(userInput.toLowerCase()) > -1
    );

    if (filteredOptions.length === 0) {
      filteredOptions = [
        {
          name: "No Results",
          value: "no-results",
        },
      ];
    }

    this.setState({
      options: filteredOptions,
    });
  }

  getOptions = () => {
    const { options } = this.state;

    if (options && options.length > 0) {
      return (
        <Fragment>
          {options.map(({ value, name, isSelected }, key) => (
            <li key={`${key}_${value}`}>
              <Checkbox
                onChange={() => {
                  this.onClick(name, value, isSelected);
                }}
                isChecked={isSelected}
              >
                {name}
              </Checkbox>
            </li>
          ))}
        </Fragment>
      );
    }
  };

  getFieldErrors(error: string | null) {
    return error !== null ? (
      <ul className="form-errors">
        <li>{error}</li>
      </ul>
    ) : (
      ""
    );
  }

  render() {
    const { isOpen } = this.state;
    const { options, placeholder } = this.props;
    //const isSelected = selectedName !== null || selectedValue !== null;

    return (
      <div className="multi-select-container">
        <div className="form-group">
          <div
            className={classnames("form-select", {
              "dropdown-open": isOpen,
            })}
          >
            <div className="selected-dropdown" onClick={this.toggleDropdown}>
              <span className="placeholder">{placeholder}</span>
              <span className="selector pull-right">
                {isOpen && options && options.length > 0 ? (
                  <Icon icon="chevron-up" />
                ) : (
                  <Icon icon="chevron-down" />
                )}
              </span>
            </div>
            <div className="dropdown-container">
              <ul className="dropdown">{this.getOptions()} </ul>
            </div>
          </div>
          {isOpen && <div className="backdrop" onClick={this.toggleDropdown} />}
        </div>
      </div>
    );
  }
}

export default MultiSelect;
