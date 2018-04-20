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
    const { isMobile, mobileRender, desktopRender } = this.props;
    let desktop = null;
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
    desktop = desktopRender();
    return (
      <SideNavWrapper>
        {desktop || mobileRender()}
      </SideNavWrapper>
    );
  }
}

DistinctViewPageDumb.propTypes = {
  title: PropTypes.string.isRequired,
  storeTitle: PropTypes.func.isRequired,
  isMobile: PropTypes.bool.isRequired,
  mobileRender: PropTypes.func,
  desktopRender: PropTypes.func,
};

DistinctViewPageDumb.defaultProps = {
  mobileRender: () => <div />,
  desktopRender: () => false,
};


const mapStateToProps = state => ({
    isMobile: state.myNavbar.isMobile,
  }),
  mapDispatchToProps = dispatch => ({
    storeTitle: title => dispatch(setTitle(title)),
  }),
  DistinctViewPage = connect(mapStateToProps, mapDispatchToProps)(DistinctViewPageDumb);

export default DistinctViewPage;
