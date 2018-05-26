import React from 'react';
import PropTypes from 'prop-types';
import AvatarEditor from 'react-avatar-editor';
import FaImage from 'react-icons/lib/fa/image';

class ImageEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      image: this.props.initImage,
      scale: this.props.minScale,
      rotate: this.props.initRotate,
    };
    this.onFileChange = this.onFileChange.bind(this);
    this.onClickSave = this.onClickSave.bind(this);
    this.setEditorRef = (editor) => {
      this.editor = editor;
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!this.state.image) {
      this.setState({ image: nextProps.initImage });
    }
  }

  onFileChange(event) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = (e) => {
        this.setState({ image: e.target.result });
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  onClickSave() {
    if (this.editor) {
      const imageURL = this.editor.getImageScaledToCanvas().toDataURL();
      this.props.onClickSave(imageURL);
    }
  }

  render() {
    return (
      <div style={{ width: this.props.width + (this.props.border * 2) }}>
        <div className="fill-container center-display">
          <button className="btn btn-dark d-inline-flex position-relative overflow-hidden">
            <FaImage size={30} />
            <input
              type="file"
              className="position-absolute fill-container"
              onChange={this.onFileChange}
              style={{ left: 0, top: 0, opacity: 0 }}
            />
          </button>
          <input
            className="slider d-inline-flex"
            style={{ width: (this.props.width + (this.props.border * 2)) - 100, marginLeft: 'auto' }}
            type="range"
            min={this.props.minScale}
            max={this.props.maxScale}
            step={this.props.scaleStep}
            value={this.state.scale}
            onChange={event => this.setState({ scale: parseFloat(event.target.value, 10) })}
          />
        </div>
        <div onWheel={(event) => {
          if (event.deltaY > 0) this.state.scale -= this.props.scaleStep;
          else this.state.scale += this.props.scaleStep;
          this.state.scale = Math.min(this.state.scale, this.props.maxScale);
          this.state.scale = Math.max(this.state.scale, this.props.minScale);
          this.forceUpdate();
        }}
        >
          <AvatarEditor
            ref={this.setEditorRef}
            image={this.state.image}
            width={this.props.width}
            height={this.props.height}
            border={this.props.border}
            borderRadius={this.props.borderRadius}
            color={this.props.color}
            scale={this.state.scale}
            rotate={this.state.rotate}
          />
        </div>
      </div>
    );
  }
}

ImageEditor.propTypes = {
  minScale: PropTypes.number,
  maxScale: PropTypes.number,
  scaleStep: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
  border: PropTypes.number,
  borderRadius: PropTypes.number,
  color: PropTypes.array, // eslint-disable-line react/forbid-prop-types
  initRotate: PropTypes.number,
  onClickSave: PropTypes.func.isRequired,
  initImage: PropTypes.string,
};

ImageEditor.defaultProps = {
  minScale: 1,
  maxScale: 3,
  scaleStep: 0.1,
  width: 300,
  height: 300,
  border: 50,
  borderRadius: 360,
  color: [200, 200, 200, 0.6],
  initRotate: 0,
  initImage: '',
};


export default ImageEditor;
