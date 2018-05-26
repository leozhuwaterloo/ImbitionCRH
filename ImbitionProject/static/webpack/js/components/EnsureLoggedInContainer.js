import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { URLS } from '../consts';
import { fetchData } from '../actions';
import { isAuthenticated, getUserId } from '../reducers';

class EnsureLoggedInContainerDumb extends React.Component {
  render() {
    if (this.props.isAuthenticated) {
      this.props.fetchUser(this.props.userId);
      return this.props.children;
    }
    return <Redirect to={URLS.LOGIN} />;
  }
}

EnsureLoggedInContainerDumb.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  userId: PropTypes.number,
  fetchUser: PropTypes.func.isRequired,
};

EnsureLoggedInContainerDumb.defaultProps = {
  userId: null,
};

const mapStateToProps = state => ({
    isAuthenticated: isAuthenticated(state),
    userId: getUserId(state),
  }),
  mapDispatchToProps = dispatch => ({
    fetchUser: userId => dispatch(fetchData(`user/${userId}`, 'user')),
  }),
  EnsureLoggedInContainer = connect(mapStateToProps, mapDispatchToProps)(EnsureLoggedInContainerDumb);

export default EnsureLoggedInContainer;
