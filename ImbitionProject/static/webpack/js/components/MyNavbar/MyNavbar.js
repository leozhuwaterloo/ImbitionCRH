import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FaAngleDoubleLeft from 'react-icons/lib/fa/angle-double-left';
import { NAMES } from '../../consts';

const MyNavbarDumb = ({ title }) => (
  <nav className="navbar bg-light navbar-light sticky-top">
    <ul className="navbar-nav center-display fill-container">
      <li className="nav-item">
        <span className="nav-link">{title}</span>
      </li>
      <li className="nav-item back-btn">
        <a
          className="nav-link"
          href="#back"
          onClick={(e) => {
            e.preventDefault();
            window.history.back();
          }}
        >
          <FaAngleDoubleLeft />{NAMES.NAVBAR_BACK}
        </a>
      </li>
    </ul>
  </nav>
  ),
  mapStateToProps = state => ({
    title: state.myNavbar.title,
  }),
  MyNavbar = connect(mapStateToProps)(MyNavbarDumb);

MyNavbarDumb.propTypes = {
  title: PropTypes.string.isRequired,
};

export default MyNavbar;
