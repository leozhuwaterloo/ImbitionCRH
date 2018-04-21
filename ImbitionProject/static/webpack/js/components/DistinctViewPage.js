import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setTitle } from '../actions';
import SideNavWrapper from './SideNavWrapper';
import { NAMES } from '../consts';

class DistinctViewPageDumb extends React.Component {
  componentWillMount() {
    const { storeTitle, title } = this.props;
    if (title) storeTitle(title);
  }
  render() {
    const {
      isMobile, mobileRender, desktopRender, sideNav,
    } = this.props;
    if (isMobile) {
      return (
        <div>
          {mobileRender()}
          <div className="container-fluid center-display text-secondary mt-5 mb-4">
            {NAMES.FOOTER_TEXT}
          </div>
        </div>
      );
    }
    if (sideNav) {
      return (
        <SideNavWrapper>
          {desktopRender() || mobileRender()}
        </SideNavWrapper>
      );
    }

    return desktopRender() || mobileRender();
  }
}

DistinctViewPageDumb.propTypes = {
  title: PropTypes.string.isRequired,
  storeTitle: PropTypes.func.isRequired,
  isMobile: PropTypes.bool.isRequired,
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
  }),
  mapDispatchToProps = dispatch => ({
    storeTitle: title => dispatch(setTitle(title)),
  }),
  DistinctViewPage = connect(mapStateToProps, mapDispatchToProps)(DistinctViewPageDumb);

export default DistinctViewPage;
