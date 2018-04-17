import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MainPage from './MainPage';
import MyNavbar from './MyNavbar';
import RecordEdit from './RecordEdit';
import EmployeeEdit from './EmployeeEdit';
import PermissionEdit from './PermissionEdit';
import EnsureLoggedInContainer from './EnsureLoggedInContainer';
import Login from './Login';
import Logout from './Logout';
import {
  ROOT_URL, RECORD_EDIT_URL, EMPLOYEE_EDIT_URL,
  LOGIN_URL, LOGOUT_URL, PERMISSION_EDIT_URL,
} from '../consts';
import { setIsMobile } from '../actions';

class AppDumb extends React.Component {
  componentWillMount() {
    this.props.storeIsMobile(window.innerWidth <= 900);
  }

  render() {
    return (
      <BrowserRouter>
        <div>
          <MyNavbar />
          <Switch>
            <Route exact path={ROOT_URL} component={MainPage} />
            <Route path={LOGIN_URL} component={Login} />
            <Route path={LOGOUT_URL} component={Logout} />
            <EnsureLoggedInContainer>
              <Route path={RECORD_EDIT_URL} component={RecordEdit} />
              <Route path={EMPLOYEE_EDIT_URL} component={EmployeeEdit} />
              <Route path={PERMISSION_EDIT_URL} component={PermissionEdit} />
            </EnsureLoggedInContainer>
          </Switch>
          <div className="container-fluid center-display text-secondary mt-5">
            @2018车融汇版权所有
          </div>
        </div>
      </BrowserRouter>
    );
  }
}

AppDumb.propTypes = {
  storeIsMobile: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
    storeIsMobile: isMobile => dispatch(setIsMobile(isMobile)),
  }),
  App = connect(null, mapDispatchToProps)(AppDumb);

export default App;
