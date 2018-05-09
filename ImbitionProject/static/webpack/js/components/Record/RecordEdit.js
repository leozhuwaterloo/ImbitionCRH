import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import DistinctViewPage from '../DistinctViewPage';
import { NAMES } from '../../consts';
import { fetchData, createData, updateData, delData } from '../../actions';
import RecordEditMobile from './RecordEditMobile';
import RecordEditDesktop from './RecordEditDesktop';


class RecordEditDumb extends React.Component {
  constructor(props) {
    super(props);
    props.fetchPositions();
    props.fetchDepartments();
  }

  render() {
    return (
      <DistinctViewPage
        title={NAMES.RECORD_EDIT}
        mobileRender={() => <RecordEditMobile {...this.props} />}
        desktopRender={() => <RecordEditDesktop {...this.props} />}
      />
    );
  }
}

RecordEditDumb.propTypes = {
  positions: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  departments: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
  createerrors: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  updateerrors: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  fetchPositions: PropTypes.func.isRequired,
  fetchDepartments: PropTypes.func.isRequired,
  createRecordField: PropTypes.func.isRequired,
  updateRecordField: PropTypes.func.isRequired,
  deleteRecordField: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
    const positions = {};
    // change position and permissions from list to id -> self dict
    state.data.positionrecords.forEach((position) => {
      positions[position.id] = position;
    });
    return {
      positions,
      departments: state.data.departments,
      updateerrors: state.data.updateerrors,
      createerrors: state.data.createerrors,
    };
  },
  mapDispatchToProps = dispatch => ({
    fetchPositions: () => dispatch(fetchData('positionrecord', 'positionrecords')),
    fetchDepartments: () => dispatch(fetchData('department', 'departments')),
    createRecordField: body => dispatch(createData('recordfield', body, 'recordedit', () => {
      dispatch(fetchData('positionrecord', 'positionrecords'));
    })),
    updateRecordField: (recordFieldId, body) => dispatch(updateData(`recordfield/${
      recordFieldId}`, body, 'recordedit', () => {
      dispatch(fetchData('positionrecord', 'positionrecords'));
    })),
    deleteRecordField: recordFieldId => dispatch(delData(`recordfield/${recordFieldId}`, null, () => {
      dispatch(fetchData('positionrecord', 'positionrecords'));
    })),
  }),
  RecordEdit = connect(mapStateToProps, mapDispatchToProps)(RecordEditDumb);

export default RecordEdit;
