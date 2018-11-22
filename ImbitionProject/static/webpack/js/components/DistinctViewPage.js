import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setTitle, setSideNav } from '../actions';
import { NAMES } from '../consts';

class DistinctViewPageDumb extends React.Component {
  componentWillMount() {
    const {
      storeTitle, title, sideNav, storeSideNav,
    } = this.props;
    if (title) storeTitle(title);
    storeSideNav(sideNav);
  }

  render() {
    const {
      isMobile, mobileRender, desktopRender, sideNav,
    } = this.props;

    if (isMobile) {
      return (
        <div className="position-absolute fill-container">
          {mobileRender()}
          <div className="container-fluid center-display text-secondary mt-5 mb-4">
            {NAMES.FOOTER_TEXT}
          </div>
        </div>
      );
    }

    if (sideNav) {
      if (this.props.loading) {
        return (
          <div className="content">
            <div className="center-display fill-height">
              <div className="loader" />
            </div>
          </div>
        );
      }
      return (
        <div className="content">
          {desktopRender() || mobileRender()}
          <div className="container-fluid center-display text-secondary mt-5 mb-4">
            {NAMES.FOOTER_TEXT}
          </div>
        </div>
      );
    }

    return (
      <div className="no-switch-wrapper">
        <div className="center-display">
          {desktopRender() || mobileRender()}
        </div>
      </div>
    );
  }
}

DistinctViewPageDumb.propTypes = {
  title: PropTypes.string.isRequired,
  storeTitle: PropTypes.func.isRequired,
  storeSideNav: PropTypes.func.isRequired,
  isMobile: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  mobileRender: PropTypes.func,
  desktopRender: PropTypes.func,
  sideNav: PropTypes.bool,
};

DistinctViewPageDumb.defaultProps = {
  mobileRender: () => <div />,
  desktopRender: () => false,
  sideNav: true,
};

const mapStateToProps = state => ({
    isMobile: state.myNavbar.isMobile,
    loading: state.myNavbar.loading,
  }),
  mapDispatchToProps = dispatch => ({
    storeTitle: title => dispatch(setTitle(title)),
    storeSideNav: sideNav => dispatch(setSideNav(sideNav)),
  }),
  DistinctViewPage = connect(mapStateToProps, mapDispatchToProps)(DistinctViewPageDumb);

export default DistinctViewPage;
