import React from 'react';
import { Link } from 'react-router-dom';

import FaCalendarPlusO from 'react-icons/lib/fa/calendar-plus-o';
import FaBarChart from 'react-icons/lib/fa/bar-chart';
import FaLineChart from 'react-icons/lib/fa/line-chart';
import FaUserPlus from 'react-icons/lib/fa/user-plus';
import FaLock from 'react-icons/lib/fa/lock';
import FaAutomobile from 'react-icons/lib/fa/automobile';

import DistinctViewPage from './DistinctViewPage';
import {
  IMAGE_URL, RECORD_EDIT_URL, RECORD_EDIT_NAME, EMPLOYEE_EDIT_URL,
  EMPLOYEE_EDIT_NAME, PERMISSION_EDIT_NAME, PERMISSION_EDIT_URL,
} from '../consts';


class MainPage extends React.Component {
  constructor(props) {
    super(props);
    this.mobileRender = () => (
      <div className="container mt-5">
        <div className="container-fluid mb-4">
          <div className="row center-display mb-3">
            <img src={`${IMAGE_URL}logo.png`} alt="车融汇" />
          </div>
          <blockquote className="blockquote text-center">
            <p className="mb-0 bold">员工工作日志记录与分析</p>
            <footer className="blockquote-footer">车融汇专属</footer>
          </blockquote>
        </div>
        <div className="container-fluid">
          <div className="row mb-3">
            <Link className="col text-primary" to={RECORD_EDIT_URL}>
              <div className="center-display">
                <FaCalendarPlusO size={80} />
              </div>
              <p className="center-display bold">{RECORD_EDIT_NAME}</p>
            </Link>
            <div className="col">
              <div className="center-display">
                <FaBarChart className="text-secondary" size={80} />
              </div>
              <p className="center-display bold">数据统计</p>
            </div>
            <div className="col">
              <div className="center-display">
                <FaLineChart className="text-success" size={80} />
              </div>
              <p className="center-display bold">数据分析</p>
            </div>
          </div>
          <div className="row">
            <Link className="col text-info" to={EMPLOYEE_EDIT_URL}>
              <div className="center-display">
                <FaUserPlus size={80} />
              </div>
              <p className="center-display bold">{EMPLOYEE_EDIT_NAME}</p>
            </Link>
            <Link className="col text-warning" to={PERMISSION_EDIT_URL}>
              <div className="center-display">
                <FaLock size={80} />
              </div>
              <p className="center-display bold">{PERMISSION_EDIT_NAME}</p>
            </Link>
            <div className="col">
              <div className="center-display">
                <FaAutomobile className="text-danger" size={80} />
              </div>
              <p className="center-display bold">更多更新</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <DistinctViewPage
        title="首页"
        mobileRender={() => this.mobileRender()}
      />
    );
  }
}

export default MainPage;
