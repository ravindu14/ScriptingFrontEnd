// @flow
import React, { PureComponent } from "react";
import "./styles.scss";

type SearchInputProps = {
  suggestions: Array<string>,
  placeholder?: string,
  name?: string,
  text: string,
  onChange: Function,
  onSelect: Function,
  disabled: boolean
};

type SearchInputState = {
  showSuggestions: boolean
};

class SearchInput extends PureComponent<SearchInputProps, SearchInputState> {
  constructor(props) {
    super(props);

    this.state = {
      showSuggestions: false
    };
    // $FlowFixMe
    this.onInputClick = this.onInputClick.bind(this);
  }
  static defaultProps = {
    suggestions: [],
    onChange: () => {}
  };

  onChange = (e: SyntheticEvent<HTMLButtonElement>) => {
    if (e.currentTarget.value !== "") {
      this.setState({
        showSuggestions: true
      });
    } else {
      this.setState({
        showSuggestions: false
      });
    }
    this.props.onChange(e.currentTarget.value);
  };

  onClick = (e: SyntheticEvent<HTMLButtonElement>) => {
    this.setState({
      showSuggestions: false
    });
    this.props.onSelect(e.currentTarget.innerText);
  };

  onKeyDown = (e: SyntheticKeyboardEvent<HTMLElement>) => {
    // User pressed the enter key
    if (e.keyCode === 13) {
      this.setState({ showSuggestions: false });
      this.props.onSelect(e.currentTarget.innerText);
    }
  };

  onInputClick() {
    this.setState({
      showSuggestions: true
    });
  }

  render() {
    const {
      onChange,
      onClick,
      onKeyDown,
      onInputClick,
      state: { showSuggestions }
    } = this;

    const { name, placeholder, disabled, suggestions, text } = this.props;

    let suggestionsListComponent;

    if (suggestions.length && showSuggestions) {
      suggestionsListComponent = (
        <ul className="suggestions">
          {suggestions.map(suggestion => {
            return (
              <li key={suggestion} onClick={onClick}>
                {suggestion}
              </li>
            );
          })}
        </ul>
      );
    }

    return (
      <div className="auto-complete-input">
        <input
          type="text"
          autoComplete="off"
          name={name}
          placeholder={placeholder}
          onChange={onChange}
          onClick={onInputClick}
          value={text}
          onKeyDown={onKeyDown}
          disabled={disabled}
        />
        {suggestionsListComponent}
      </div>
    );
  }
}

export default SearchInput;
