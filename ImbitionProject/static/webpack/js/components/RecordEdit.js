import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setTitle } from '../actions';

class RecordEditDumb extends React.Component {
  componentWillMount() {
    const { storeTitle } = this.props;
    storeTitle('日志编辑');
  }

  render() {
    if (this.props.isMobile) {
      return (
        <div>Hello</div>
      );
    }
    return <div />;
  }
}

RecordEditDumb.propTypes = {
  isMobile: PropTypes.bool.isRequired,
  storeTitle: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    isMobile: state.myNavbar.isMobile,
  }),
  mapDispatchToProps = dispatch => ({
    storeTitle: title => dispatch(setTitle(title)),
  }),
  RecordEdit = connect(mapStateToProps, mapDispatchToProps)(RecordEditDumb);


export default RecordEdit;
