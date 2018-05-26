import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as FontAwesome from 'react-icons/lib/fa';
import 'bootstrap/js/dist/collapse';
import { NAMES, URLS } from '../../consts';

const SideNavWrapperDumb = ({
    user,
  }) => (
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
              <FontAwesome.FaAngleRight className="float-right" />
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
          <Link className="nav-link text-secondary" to={URLS.SETTINGS}>
            <FontAwesome.FaCogs className="mb-1 mr-1" />{NAMES.SETTINGS}
          </Link>
        </li>
        <hr className="mb-0" />
      </div>
      <div className="m-3">
        <li className="nav-item mb-1" style={{ fontSize: '0.8rem' }}>{NAMES.NAVIGATION_PANEL}</li>
        <li className="nav-item">
          <Link className="nav-link text-secondary" to={URLS.RECORD_SELF_EDIT}>
            <FontAwesome.FaLeanpub className="mb-1 mr-1" />{NAMES.RECORD_SELF_EDIT}
          </Link>
        </li>
        <li
          className="nav-item"
          data-toggle="collapse"
          data-target="#view"
          aria-expanded="false"
          aria-controls="edit"
        >
          <a className="nav-link text-secondary" href="#view">
            <FontAwesome.FaInbox className="mb-1 mr-1" />{NAMES.VIEW}
            <FontAwesome.FaAngleRight className="float-right" />
          </a>
        </li>
        <div className="collapse" id="view">
          <li className="nav-item ml-3 mr-3">
            <Link className="nav-link text-secondary" to={URLS.RECORD_VIEW}>
              <FontAwesome.FaCalendar className="mb-1 mr-1" />{NAMES.RECORD_VIEW}
            </Link>
          </li>
          <li className="nav-item ml-3 mr-3">
            <Link className="nav-link text-secondary" to={URLS.POSITION_TREE_VIEW}>
              <FontAwesome.FaTree className="mb-1 mr-1" />{NAMES.POSITION_TREE_VIEW}
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
              <FontAwesome.FaGroup className="mb-1 mr-1" />{NAMES.EMPLOYEE_EDIT}
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
          <li className="nav-item ml-3 mr-3">
            <Link className="nav-link text-secondary" to={URLS.PENDING_EMPLOYEE_EDIT}>
              <FontAwesome.FaUserPlus className="mb-1 mr-1" />{NAMES.PENDING_EMPLOYEE_EDIT}
            </Link>
          </li>
        </div>
      </div>
    </ul>
  ),
  mapStateToProps = state => ({
    user: state.data.user,
  }),
  SideNavWrapper = connect(mapStateToProps)(SideNavWrapperDumb);

SideNavWrapperDumb.propTypes = {
  user: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default SideNavWrapper;
