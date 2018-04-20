import React from 'react';
import { Link } from 'react-router-dom';
import FaCalendarPlusO from 'react-icons/lib/fa/calendar-plus-o';
import FaBarChart from 'react-icons/lib/fa/bar-chart';
import FaLineChart from 'react-icons/lib/fa/line-chart';
import FaUserPlus from 'react-icons/lib/fa/user-plus';
import FaLock from 'react-icons/lib/fa/lock';
import FaFlag from 'react-icons/lib/fa/flag';
import { URLS, NAMES } from '../../consts';

const MainPageMobile = () => (
  <div className="container mt-5">
    <div className="container-fluid mb-4">
      <div className="row center-display mb-3">
        <img src={`${URLS.IMAGE}logo.png`} alt="车融汇" />
      </div>
      <blockquote className="blockquote text-center">
        <p className="mb-0">{NAMES.MAIN_TITLE}</p>
        <footer className="blockquote-footer">{NAMES.MAIN_SUB_TITLE}</footer>
      </blockquote>
    </div>
    <div className="container-fluid">
      <div className="row mb-3">
        <Link className="col text-primary nav-link" to={URLS.RECORD_EDIT}>
          <div className="center-display">
            <FaCalendarPlusO size={80} />
          </div>
          <p className="center-display">{NAMES.RECORD_EDIT}</p>
        </Link>
        <Link className="col text-secondary nav-link" to={URLS.SUMMARY}>
          <div className="center-display">
            <FaBarChart size={80} />
          </div>
          <p className="center-display">{NAMES.SUMMARY}</p>
        </Link>
        <Link className="col text-success nav-link" to={URLS.ANALYSIS}>
          <div className="center-display">
            <FaLineChart size={80} />
          </div>
          <p className="center-display">{NAMES.ANALYSIS}</p>
        </Link>
      </div>
      <div className="row">
        <Link className="col text-info nav-link" to={URLS.EMPLOYEE_EDIT}>
          <div className="center-display">
            <FaUserPlus size={80} />
          </div>
          <p className="center-display">{NAMES.EMPLOYEE_EDIT}</p>
        </Link>
        <Link className="col text-warning nav-link" to={URLS.PERMISSION_EDIT}>
          <div className="center-display">
            <FaLock size={80} />
          </div>
          <p className="center-display">{NAMES.PERMISSION_EDIT}</p>
        </Link>
        <Link className="col text-danger nav-link" to={URLS.DEPARTMENT_EDIT}>
          <div className="center-display">
            <FaFlag size={80} />
          </div>
          <p className="center-display">{NAMES.DEPARTMENT_EDIT}</p>
        </Link>
      </div>
    </div>
  </div>
);

export default MainPageMobile;
