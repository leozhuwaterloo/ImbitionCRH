import React from 'react';
import PropTypes from 'prop-types';


class DirectUpdateText extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: props.text,
    };

    this.updateText = (text) => {
      this.setState({ text });
    };
  }

  render() {
    return <span>{this.state.text}</span>;
  }
}

DirectUpdateText.propTypes = {
  text: PropTypes.string,
};

DirectUpdateText.defaultProps = {
  text: '',
};


export default DirectUpdateText;
