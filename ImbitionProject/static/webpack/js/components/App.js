import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { AnimatedSwitch } from 'react-router-transition';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MainPage from './MainPage';
import { MyNavbar, SideNav } from './MyNavbar';
import MyNotifications from './MyNotifications';
import { RecordEdit, RecordSelfEdit, RecordView } from './Record';
import { EmployeeEdit, PendingEmployeeEdit } from './Employee';
import PermissionEdit from './Permission';
import PositionTreeView from './Position';
import DepartmentEdit from './Department';
import EnsureLoggedInContainer from './EnsureLoggedInContainer';
import Settings from './Settings';
import { Login, Logout, LoginFirst } from './Login';
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
          {this.props.sideNav ? <SideNav /> : null}
          <Switch>
            <Route exact path={URLS.LOGIN} component={Login} />
            <Route path={URLS.LOGIN_FIRST} component={LoginFirst} />
            <Route path={URLS.LOGOUT} component={Logout} />
            <EnsureLoggedInContainer>
              <AnimatedSwitch
                atEnter={{ offset: -100 }}
                atLeave={{ offset: 100 }}
                atActive={{ offset: 0 }}
                mapStyles={(styles) => {
                  if (styles.offset === 0) {
                    return null;
                  }
                  return {
                    transform: `translateX(${styles.offset}%)`,
                    position: 'absolute',
                  };
                }}
                className="switch-wrapper"
              >
                <Route exact path={URLS.ROOT} component={MainPage} />
                <Route path={URLS.SETTINGS} component={Settings} />
                <Route path={URLS.RECORD_EDIT} component={RecordEdit} />
                <Route path={URLS.RECORD_SELF_EDIT} component={RecordSelfEdit} />
                <Route path={URLS.RECORD_VIEW} component={RecordView} />
                <Route path={URLS.EMPLOYEE_EDIT} component={EmployeeEdit} />
                <Route path={URLS.PENDING_EMPLOYEE_EDIT} component={PendingEmployeeEdit} />
                <Route path={URLS.POSITION_TREE_VIEW} component={PositionTreeView} />
                <Route path={URLS.PERMISSION_EDIT} component={PermissionEdit} />
                <Route path={URLS.DEPARTMENT_EDIT} component={DepartmentEdit} />
                <Route path={URLS.SUMMARY} component={MainPage} />
                <Route path={URLS.ANALYSIS} component={MainPage} />
              </AnimatedSwitch>
            </EnsureLoggedInContainer>
          </Switch>
          <MyNotifications />
        </div>
      </BrowserRouter>
    );
  }
}

AppDumb.propTypes = {
  storeIsMobile: PropTypes.func.isRequired,
  sideNav: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
    sideNav: state.myNavbar.sideNav,
  }),
  mapDispatchToProps = dispatch => ({
    storeIsMobile: isMobile => dispatch(setIsMobile(isMobile)),
  }),
  App = connect(mapStateToProps, mapDispatchToProps)(AppDumb);

export default App;
