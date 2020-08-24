// @flow
import React from "react";
import "./styles.scss";

type SwitchProps = {
  isChecked: boolean,
  onChange: Function,
  disabled?: boolean
};

function Switch(props: SwitchProps) {
  const { isChecked, onChange, disabled } = props;
  return (
    <div className="checkbox-container">
      <input
        className="checkbox"
        type="checkbox"
        onChange={disabled ? () => {} : onChange}
        checked={isChecked}
        disabled={disabled}
      />
      <span className="switch" onClick={disabled ? () => {} : onChange} />
    </div>
  );
}

Switch.defaultProps = {
  isChecked: false,
  onChange: () => {},
  disabled: false
};

export default Switch;
