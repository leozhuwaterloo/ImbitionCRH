import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import FaCalendarPlusO from 'react-icons/lib/fa/calendar-plus-o';
import FaBarChart from 'react-icons/lib/fa/bar-chart';
import FaLineChart from 'react-icons/lib/fa/line-chart';
import FaUserPlus from 'react-icons/lib/fa/user-plus';
import FaLock from 'react-icons/lib/fa/lock';
import FaAutomobile from 'react-icons/lib/fa/automobile';

import { IMAGE_URL, RECORD_EDIT_URL } from '../consts';
import { setTitle } from '../actions';


class MainPageDumb extends React.Component {
  componentWillMount() {
    const { storeTitle } = this.props;
    storeTitle('首页');
  }

  render() {
    if (this.props.isMobile) {
      return (
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
              <Link className="col" to={RECORD_EDIT_URL}>
                <div className="center-display">
                  <FaCalendarPlusO className="text-primary" size={80} />
                </div>
                <p className="center-display bold">日志编辑</p>
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
              <div className="col">
                <div className="center-display">
                  <FaUserPlus className="text-info" size={80} />
                </div>
                <p className="center-display bold">人员调配</p>
              </div>
              <div className="col">
                <div className="center-display">
                  <FaLock className="text-warning" size={80} />
                </div>
                <p className="center-display bold">系统管理</p>
              </div>
              <div className="col">
                <div className="center-display">
                  <FaAutomobile className="text-danger" size={80} />
                </div>
                <p className="center-display bold">更多更新</p>
              </div>
            </div>
          </div>
          <div className="container-fluid center-display text-secondary mt-5">
            @2018车融汇版权所有
          </div>
        </div>
      );
    }
    return <div />;
  }
}

MainPageDumb.propTypes = {
  isMobile: PropTypes.bool.isRequired,
  storeTitle: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    isMobile: state.myNavbar.isMobile,
  }),
  mapDispatchToProps = dispatch => ({
    storeTitle: title => dispatch(setTitle(title)),
  }),
  MainPage = connect(mapStateToProps, mapDispatchToProps)(MainPageDumb);


export default MainPage;
