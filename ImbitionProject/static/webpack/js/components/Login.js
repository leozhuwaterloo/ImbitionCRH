import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import DistinctViewPage from './DistinctViewPage';
import { LOGIN_NAME, ROOT_URL } from '../consts';
import LoginForm from './LoginForm';
import { isAuthenticated, authErrors } from '../reducers';
import { login } from '../actions';

class LoginDumb extends React.Component {
  constructor(props) {
    super(props);
    this.mobileRender = () => (
      <div className="container mt-5">
        <LoginForm
          onSubmit={this.props.onSubmit}
          errors={this.props.errors}
        />
      </div>
    );
  }

  render() {
    if (!this.props.isAuthenticated) {
      return (
        <DistinctViewPage
          title={LOGIN_NAME}
          mobileRender={() => this.mobileRender()}
        />
      );
    }
    return <Redirect to={ROOT_URL} />;
  }
}

LoginDumb.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  errors: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  onSubmit: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    isAuthenticated: isAuthenticated(state),
    errors: authErrors(state),
  }),
  mapDispatchToProps = dispatch => ({
    onSubmit: (username, password) => dispatch(login(username, password)),
  }),
  Login = connect(mapStateToProps, mapDispatchToProps)(LoginDumb);

export default Login;
