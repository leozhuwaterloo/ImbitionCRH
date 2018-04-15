import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FaAngleDoubleLeft from 'react-icons/lib/fa/angle-double-left';

const MyNavbarDumb = ({ title, isMobile }) => {
    if (isMobile) {
      return (
        <nav className="navbar navbar-expand-sm bg-primary navbar-dark sticky-top">
          <ul className="navbar-nav center-display fill-container">
            <li className="nav-item">
              <span className="nav-link">{title}</span>
            </li>
            <li className="nav-item back-btn fill-container absolute">
              <a
                className="nav-link"
                href="#back"
                onClick={(e) => {
                  e.preventDefault();
                  window.history.back();
                }}
              >
                <FaAngleDoubleLeft />返回
              </a>
            </li>
          </ul>
        </nav>
      );
    }
    return <div />;
  },

  mapStateToProps = state => ({
    title: state.myNavbar.title,
    isMobile: state.myNavbar.isMobile,
  }),
  MyNavbar = connect(mapStateToProps)(MyNavbarDumb);

MyNavbarDumb.propTypes = {
  title: PropTypes.string.isRequired,
  isMobile: PropTypes.bool.isRequired,
};

export default MyNavbar;
