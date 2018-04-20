import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { logout } from '../../actions';
import { LOGIN_URL } from '../../consts';

const LogoutDumb = (props) => {
    props.logout();
    return <Redirect to={{ pathname: LOGIN_URL }} />;
  },
  mapDispatchToProps = dispatch => ({
    logout: () => dispatch(logout()),
  }),
  Logout = connect(null, mapDispatchToProps)(LogoutDumb);

LogoutDumb.propTypes = {
  logout: PropTypes.func.isRequired,
};

export default Logout;
