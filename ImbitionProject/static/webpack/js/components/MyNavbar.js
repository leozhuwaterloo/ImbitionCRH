import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FaAngleDoubleLeft from 'react-icons/lib/fa/angle-double-left';

import { NAVBAR_BACK_NAME } from '../consts';
import DistinctViewPage from './DistinctViewPage';


class MyNavbarDumb extends React.Component {
  constructor(props) {
    super(props);
    this.mobileRender = () => (
      <nav className="navbar navbar-expand-sm bg-primary navbar-dark sticky-top">
        <ul className="navbar-nav center-display fill-container">
          <li className="nav-item">
            <span className="nav-link">{this.props.title}</span>
          </li>
          <li className="nav-item back-btn absolute">
            <a
              className="nav-link"
              href="#back"
              onClick={(e) => {
                e.preventDefault();
                window.history.back();
              }}
            >
              <FaAngleDoubleLeft />{NAVBAR_BACK_NAME}
            </a>
          </li>
        </ul>
      </nav>
    );
  }

  render() {
    return (
      <DistinctViewPage
        title=""
        mobileRender={() => this.mobileRender()}
      />
    );
  }
}

const mapStateToProps = state => ({
    title: state.myNavbar.title,
  }),
  MyNavbar = connect(mapStateToProps)(MyNavbarDumb);

MyNavbarDumb.propTypes = {
  title: PropTypes.string.isRequired,
};

export default MyNavbar;
