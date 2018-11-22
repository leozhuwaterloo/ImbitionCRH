import React from 'react';
import { Link } from 'react-router-dom';
import * as FontAwesome from 'react-icons/lib/fa';
import { URLS, NAMES } from '../../consts';

const MainPageMobile = () => (
  <div className="container mt-5">
    <div className="container-fluid mb-4">
      <div className="row center-display">
        <img src={`${URLS.IMAGE}logo.png`} alt="车融汇" />
      </div>
      <blockquote className="blockquote text-center">
        <p className="mb-0">{NAMES.MAIN_TITLE}</p>
        <footer className="blockquote-footer">{NAMES.MAIN_SUB_TITLE}</footer>
      </blockquote>
    </div>
    <div className="container-fluid">
      <div className="row mb-3">
        <Link className="col text-primary nav-link" to={URLS.RECORD_SELF_EDIT}>
          <div className="center-display">
            <FontAwesome.FaLeanpub size={80} />
          </div>
          <p className="center-display">{NAMES.RECORD_SELF_EDIT}</p>
        </Link>
        <Link className="col text-secondary nav-link" to={URLS.FILTER_PROFILE_VIEW}>
          <div className="center-display">
            <FontAwesome.FaArchive size={80} />
          </div>
          <p className="center-display">{NAMES.FILTER_PROFILE_VIEW}</p>
        </Link>
        <Link className="col text-success nav-link" to={URLS.RECORD_VIEW}>
          <div className="center-display">
            <FontAwesome.FaCalendar size={80} />
          </div>
          <p className="center-display">{NAMES.RECORD_VIEW}</p>
        </Link>
      </div>
      <div className="row">
        <Link className="col text-info nav-link" to={URLS.RECORD_EDIT}>
          <div className="center-display">
            <FontAwesome.FaCalendarPlusO size={80} />
          </div>
          <p className="center-display">{NAMES.RECORD_EDIT}</p>
        </Link>
        <Link className="col text-warning nav-link" to={URLS.EMPLOYEE_EDIT}>
          <div className="center-display">
            <FontAwesome.FaGroup size={80} />
          </div>
          <p className="center-display">{NAMES.EMPLOYEE_EDIT}</p>
        </Link>
        <Link className="col text-danger nav-link" to={URLS.PERMISSION_EDIT}>
          <div className="center-display">
            <FontAwesome.FaLock size={80} />
          </div>
          <p className="center-display">{NAMES.PERMISSION_EDIT}</p>
        </Link>
      </div>
      <div className="row">
        <Link className="col text-primary nav-link" to={URLS.DEPARTMENT_EDIT}>
          <div className="center-display">
            <FontAwesome.FaFlag size={80} />
          </div>
          <p className="center-display">{NAMES.DEPARTMENT_EDIT}</p>
        </Link>
        <Link className="col text-secondary nav-link" to={URLS.PENDING_EMPLOYEE_EDIT}>
          <div className="center-display">
            <FontAwesome.FaUserPlus size={80} />
          </div>
          <p className="center-display">{NAMES.PENDING_EMPLOYEE_EDIT}</p>
        </Link>
        <Link className="col text-success nav-link" to={URLS.DASHBOARD}>
          <div className="center-display">
            <FontAwesome.FaDashboard size={80} />
          </div>
          <p className="center-display">{NAMES.DASHBOARD}</p>
        </Link>
      </div>
      <div className="row center-display">
        <Link className="col text-info nav-link" to={URLS.SETTINGS}>
          <div className="center-display">
            <FontAwesome.FaCogs size={80} />
          </div>
          <p className="center-display">{NAMES.SETTINGS}</p>
        </Link>
        <Link className="col text-warning nav-link" to={URLS.LOGOUT}>
          <div className="center-display">
            <FontAwesome.FaSignOut size={80} />
          </div>
          <p className="center-display">{NAMES.LOGOUT_SUBMIT}</p>
        </Link>
      </div>
    </div>
  </div>
);

export default MainPageMobile;
