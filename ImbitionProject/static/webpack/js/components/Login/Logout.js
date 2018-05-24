import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { logout } from '../../actions';
import { URLS } from '../../consts';

const LogoutDumb = (props) => {
    props.logout();
    window.location.reload();
    return <Redirect to={{ pathname: URLS.LOGIN }} />;
  },
  mapDispatchToProps = dispatch => ({
    logout: () => dispatch(logout()),
  }),
  Logout = connect(null, mapDispatchToProps)(LogoutDumb);

LogoutDumb.propTypes = {
  logout: PropTypes.func.isRequired,
};

export default Logout;
