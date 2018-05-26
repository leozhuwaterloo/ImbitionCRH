import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import FaUserPlus from 'react-icons/lib/fa/user-plus';
import DistinctViewPage from '../DistinctViewPage';
import LoginFirstForm from './LoginFirstForm';
import { NAMES, URLS } from '../../consts';
import { isAuthenticated, authErrors } from '../../reducers';
import { login, loginFirst } from '../../actions';

class LoginFirstDumb extends React.Component {
  constructor(props) {
    super(props);

    this.mobileRender = () => (
      <div className="container mt-5 col-8">
        <div className="fill-container center-display mb-3">
          <FaUserPlus size={100} className="text-secondary" />
        </div>
        <LoginFirstForm
          onSubmit={this.props.onSubmit}
          errors={this.props.errors}
        />
      </div>
    );
    this.desktopRender = () => (
      <div className="container mt-5 col-8 shadow mb-5 bg-white rounded pt-5 pb-5">
        <div className="row center-display">
          <div className="col-4 center-display">
            <FaUserPlus size={200} className="text-secondary" />
          </div>
          <div className="col-7">
            <LoginFirstForm
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
          sideNav={false}
          title={NAMES.LOGIN}
          mobileRender={() => this.mobileRender()}
          desktopRender={() => this.desktopRender()}
        />
      );
    }
    return <Redirect to={URLS.SETTINGS} />;
  }
}

LoginFirstDumb.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  errors: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  onSubmit: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    isAuthenticated: isAuthenticated(state),
    errors: authErrors(state),
  }),
  mapDispatchToProps = dispatch => ({
    onSubmit: (phone, lastName, firstName, username) => {
      dispatch(loginFirst(phone, lastName, firstName, username, (data) => {
        if (data.username && data.password) {
          dispatch(login(data.username, data.password));
        }
      }));
    },
  }),
  LoginFirst = connect(mapStateToProps, mapDispatchToProps)(LoginFirstDumb);

export default LoginFirst;
