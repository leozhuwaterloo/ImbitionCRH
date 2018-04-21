import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import FaUser from 'react-icons/lib/fa/user';
import DistinctViewPage from '../DistinctViewPage';
import LoginForm from './LoginForm';
import { NAMES, URLS } from '../../consts';
import { isAuthenticated, authErrors } from '../../reducers';
import { login } from '../../actions';

class LoginDumb extends React.Component {
  constructor(props) {
    super(props);
    this.mobileRender = () => (
      <div className="container mt-5 col-8">
        <div className="fill-container center-display mb-3">
          <FaUser size={100} className="text-secondary" />
        </div>
        <LoginForm
          onSubmit={this.props.onSubmit}
          errors={this.props.errors}
        />
      </div>
    );
    this.desktopRender = () => (
      <div className="container mt-5 col-8 shadow mb-5 bg-white rounded pt-5 pb-5">
        <div className="row center-display">
          <div className="col-4 center-display">
            <FaUser size={200} className="text-secondary" />
          </div>
          <div className="col-7">
            <LoginForm
              onSubmit={this.props.onSubmit}
              errors={this.props.errors}
            />
          </div>
        </div>
      </div>
    );
  }

  render() {
    if (!this.props.isAuthenticated) {
      return (
        <DistinctViewPage
          title={NAMES.LOGIN}
          sideNav={false}
          mobileRender={() => this.mobileRender()}
          desktopRender={() => this.desktopRender()}
        />
      );
    }
    return <Redirect to={URLS.ROOT} />;
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
