import React from "react";
import PropTypes from "prop-types";
import ReactDropzone from "react-dropzone";

const DropZoneField = ({
  handleOnDrop,
  input,
  imagefile,
  meta: { error, touched }
}) => (
  <div className="image shadowed" style={{ height: 256, width: 256, background: 'white' }}>
    <ReactDropzone
      accept="image/jpeg, image/png"
      className="upload-container"
      onDrop={handleOnDrop}
      multiple={false}
      onChange={file => input.onChange(file)}
    >
        {({getRootProps, getInputProps, isDragActive}) => {
          return (
            <div className="dropzone-box" {...getRootProps()}>
              <input {...getInputProps()} />
              {imagefile && imagefile.length > 0 ? (
                    <div><img src={imagefile[0].preview} alt={imagefile[0].name} /></div>
                ) : (
                    <div className="placeholder-preview">
                    <span className="fa fa-upload fa-5x" />
                    <br/>
                    <p>Drop or select an image.</p>
                </div>
                )}
            </div>
          )
        }}
    </ReactDropzone>
    {touched && error && <div className="error">{error}</div>}
  </div>
);

DropZoneField.propTypes = {
  handleOnDrop: PropTypes.func.isRequired,
  input: PropTypes.shape({
    name: PropTypes.string,
    onBlur: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onDragStart: PropTypes.func.isRequired,
    onDrop: PropTypes.func.isRequired,
    onFocus: PropTypes.func.isRequired,
    value: PropTypes.shape({
      preview: PropTypes.string
    })
  }),
  imagefile: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)),
  label: PropTypes.string,
  touched: PropTypes.bool,
  error: PropTypes.string
};

export default DropZoneField;
