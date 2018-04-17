import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setTitle } from '../actions';

class DistinctViewPageDumb extends React.Component {
  componentWillMount() {
    const { storeTitle, title } = this.props;
    if (title) storeTitle(title);
  }
  render() {
    const { isMobile, mobileRender, desktopRender } = this.props;
    if (isMobile) {
      return mobileRender();
    }
    return desktopRender();
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
  desktopRender: () => <div />,
};


const mapStateToProps = state => ({
    isMobile: state.myNavbar.isMobile,
  }),
  mapDispatchToProps = dispatch => ({
    storeTitle: title => dispatch(setTitle(title)),
  }),
  DistinctViewPage = connect(mapStateToProps, mapDispatchToProps)(DistinctViewPageDumb);

export default DistinctViewPage;
