import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MainPage from './MainPage';
import MyNavbar from './MyNavbar';
import { RecordEdit, RecordSelfEdit } from './Record';
import EmployeeEdit from './Employee';
import PermissionEdit from './Permission';
import PositionTreeView from './Position';
import DepartmentEdit from './Department';
import EnsureLoggedInContainer from './EnsureLoggedInContainer';
import { Login, Logout } from './Login';
import { URLS } from '../consts';
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
            <Route path={URLS.LOGIN} component={Login} />
            <Route path={URLS.LOGOUT} component={Logout} />
            <EnsureLoggedInContainer>
              <Route exact path={URLS.ROOT} component={MainPage} />
              <Route path={URLS.RECORD_EDIT} component={RecordEdit} />
              <Route path={URLS.RECORD_SELF_EDIT} component={RecordSelfEdit} />
              <Route path={URLS.EMPLOYEE_EDIT} component={EmployeeEdit} />
              <Route exact path={URLS.POSITION_TREE_VIEW} component={PositionTreeView} />
              <Route path={URLS.PERMISSION_EDIT} component={PermissionEdit} />
              <Route path={URLS.DEPARTMENT_EDIT} component={DepartmentEdit} />
              <Route path={URLS.SUMMARY} component={MainPage} />
              <Route path={URLS.ANALYSIS} component={MainPage} />
            </EnsureLoggedInContainer>
          </Switch>
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
