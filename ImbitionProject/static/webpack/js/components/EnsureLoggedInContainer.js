import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { URLS } from '../consts';
import { isAuthenticated } from '../reducers';

class EnsureLoggedInContainerDumb extends React.Component {
  render() {
    if (this.props.isAuthenticated) {
      return this.props.children;
    }
    return <Redirect to={{ pathname: URLS.LOGIN }} />;
  }
}

EnsureLoggedInContainerDumb.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
    isAuthenticated: isAuthenticated(state),
  }),
  EnsureLoggedInContainer = connect(mapStateToProps, null)(EnsureLoggedInContainerDumb);

export default EnsureLoggedInContainer;
