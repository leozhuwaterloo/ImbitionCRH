import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as FontAwesome from 'react-icons/lib/fa';
import 'bootstrap/js/dist/collapse';
import { fetchData } from '../actions';
import { getUserId } from '../reducers';
import { NAMES, URLS } from '../consts';

class SideNavWrapperDumb extends React.Component {
  constructor(props) {
    super(props);

    if (props.userId) {
      props.fetchUser(props.userId);
    }
  }

  render() {
    const { user } = this.props;
    return (
      <div className="container-fluid">
        <div className="row">
          <ul className="nav flex-column bg-dark text-secondary side-nav">
            { (user && user.user) ?
              <li
                className="nav-item"
                data-toggle="collapse"
                data-target="#user-items"
                aria-expanded="false"
                aria-controls="user-items"
              >
                <div className="portrait-container" style={{ backgroundImage: `url(${URLS.IMAGE}portrait-bg.png)` }}>
                  <div className="position-absolute portrait-filter" />
                  <div className="p-3 pl-4">
                    <div className="rounded-circle center-display bg-secondary mt-1 mb-2">
                      <img src={user.portrait} alt="头像" />
                    </div>
                    <div className="text-light">{user.user.last_name}{user.user.first_name}</div>
                    {user.position ? <div className="text-secondary">{user.position.name}</div> : ''}
                  </div>
                </div>
              </li>
              : ''
            }
            <div className="collapse" id="user-items">
              <li className="nav-item ml-3 mr-3 mt-2">
                <Link className="nav-link text-secondary" to={URLS.LOGOUT}>
                  <FontAwesome.FaSignOut className="mb-1 mr-1" />{NAMES.LOGOUT_SUBMIT}
                </Link>
              </li>
              <li className="nav-item ml-3 mr-3">
                <a className="nav-link text-secondary" href="#">
                  <FontAwesome.FaCogs className="mb-1 mr-1" />{NAMES.SETTINGS}
                </a>
              </li>
              <hr className="mb-0" />
            </div>
            <div className="m-3">
              <li className="nav-item mb-1" style={{ fontSize: '0.8rem' }}>{NAMES.NAVIGATION_PANEL}</li>
              <li
                className="nav-item"
                data-toggle="collapse"
                data-target="#view"
                aria-expanded="false"
                aria-controls="edit"
              >
                <a className="nav-link text-secondary" href="#view">
                  <FontAwesome.FaEdit className="mb-1 mr-1" />{NAMES.VIEW}
                  <FontAwesome.FaAngleRight className="float-right" />
                </a>
              </li>
              <div className="collapse" id="view">
                <li className="nav-item ml-3 mr-3">
                  <Link className="nav-link text-secondary" to={URLS.PERMISSION_TREE_VIEW}>
                    <FontAwesome.FaTree className="mb-1 mr-1" />{NAMES.PERMISSION_TREE_VIEW}
                  </Link>
                </li>
              </div>
              <li
                className="nav-item"
                data-toggle="collapse"
                data-target="#edit"
                aria-expanded="false"
                aria-controls="edit"
              >
                <a className="nav-link text-secondary" href="#edit">
                  <FontAwesome.FaEdit className="mb-1 mr-1" />{NAMES.EDIT}
                  <FontAwesome.FaAngleRight className="float-right" />
                </a>
              </li>
              <div className="collapse" id="edit">
                <li className="nav-item ml-3 mr-3">
                  <Link className="nav-link text-secondary" to={URLS.RECORD_EDIT}>
                    <FontAwesome.FaCalendarPlusO className="mb-1 mr-1" />{NAMES.RECORD_EDIT}
                  </Link>
                </li>
                <li className="nav-item ml-3 mr-3">
                  <Link className="nav-link text-secondary" to={URLS.EMPLOYEE_EDIT}>
                    <FontAwesome.FaUserPlus className="mb-1 mr-1" />{NAMES.EMPLOYEE_EDIT}
                  </Link>
                </li>
                <li className="nav-item ml-3 mr-3">
                  <Link className="nav-link text-secondary" to={URLS.PERMISSION_EDIT}>
                    <FontAwesome.FaLock className="mb-1 mr-1" />{NAMES.PERMISSION_EDIT}
                  </Link>
                </li>
                <li className="nav-item ml-3 mr-3">
                  <Link className="nav-link text-secondary" to={URLS.DEPARTMENT_EDIT}>
                    <FontAwesome.FaFlag className="mb-1 mr-1" />{NAMES.DEPARTMENT_EDIT}
                  </Link>
                </li>
              </div>
            </div>
          </ul>
          <div className="content fill-container">
            {this.props.children}
            <div className="container-fluid center-display text-secondary mt-5 mb-4">
              {NAMES.FOOTER_TEXT}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

SideNavWrapperDumb.propTypes = {
  userId: PropTypes.number,
  user: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  fetchUser: PropTypes.func.isRequired,
};

SideNavWrapperDumb.defaultProps = {
  userId: null,
};

const mapStateToProps = state => ({
    user: state.data.user,
    userId: getUserId(state),
  }),
  mapDispatchToProps = dispatch => ({
    fetchUser: userId => dispatch(fetchData(`user/${userId}`)),
  }),
  SideNavWrapper = connect(mapStateToProps, mapDispatchToProps)(SideNavWrapperDumb);

export default SideNavWrapper;
