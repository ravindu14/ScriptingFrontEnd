// @flow
import React, { Component } from "react";

type FileInputProps = {
  onChange: Function,
  multiple: boolean,
  placeholder: string,
  className: string,
  accept: string
};

class FileInput extends Component<FileInputProps> {
  fileInput = React.createRef();

  render() {
    const { onChange, multiple, placeholder, className, accept } = this.props;
    return (
      <div className={className}>
        <input
          type="file"
          placeholder={placeholder}
          className="file-input"
          multiple={multiple}
          onChange={onChange}
          accept={accept}
        />
      </div>
    );
  }
}
export default FileInput;
