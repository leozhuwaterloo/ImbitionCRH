import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import DistinctViewPage from '../DistinctViewPage';
import { NAMES } from '../../consts';
import { fetchData, createData, updateData } from '../../actions';
import RecordSelfEditMobile from './RecordSelfEditMobile';
import RecordSelfEditDesktop from './RecordSelfEditDesktop';

class RecordSelfEditDumb extends React.Component {
  constructor(props) {
    super(props);
    props.fetchRecordFields();

    this.tryFetch = () => {
      if (this.props.user && this.props.user.id
        && this.props.recordfields && Object.keys(this.props.recordfields).length !== 0) {
        this.props.fetchEmployeeRecord(this.props.user, this.props.recordfields, moment().format('YYYY-MM-DD'));
      } else {
        setTimeout(() => this.tryFetch(), 100);
      }
    };
    this.tryFetch();
  }

  render() {
    return (
      <DistinctViewPage
        title={NAMES.RECORD_SELF_EDIT}
        mobileRender={() => <RecordSelfEditMobile {...this.props} />}
        desktopRender={() => <RecordSelfEditDesktop {...this.props} />}
      />
    );
  }
}

RecordSelfEditDumb.propTypes = {
  user: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  recordfields: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  employee: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  updateerrors: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  fetchRecordFields: PropTypes.func.isRequired,
  fetchEmployeeRecord: PropTypes.func.isRequired,
  updateRecords: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
    const recordfields = {};

    state.data.recordfields.forEach((recordfield) => {
      recordfields[recordfield.id] = recordfield;
    });

    return {
      recordfields,
      employee: state.data.employeerecord,
      user: state.data.user,
      updateerrors: state.data.updateerrors,
    };
  },
  mapDispatchToProps = dispatch => ({
    fetchRecordFields: () => dispatch(fetchData('recordfield', 'recordfields')),
    fetchEmployeeRecord: (user, recordfields, date) => dispatch(fetchData(`employeerecord/${
      user.id}`, 'employeerecord', (data) => {
      const dataRecords = {};
      let filtered = null;
      data.employeerecord.records.forEach((dataRecord) => {
        dataRecords[dataRecord.field] = dataRecord;
      });
      filtered = user.position.record_fields
        .filter(recordFieldId => !dataRecords[recordFieldId])
        .filter(recordFieldId => !recordfields[recordFieldId].disabled);
      filtered.forEach((recordFieldId, index) => {
        let callback = null;
        if (index === filtered.length - 1) {
          callback = () => dispatch(fetchData(`employeerecord/${user.id}`, 'employeerecord', null, `date=${date}`));
        }
        dispatch(createData('record', {
          employee: user.id,
          field: recordFieldId,
          value: null,
          comment: null,
          date,
        }, null, callback));
      });
    }, `date=${date}`)),
    updateRecords: (records) => {
      Object.keys(records).forEach((key, index) => {
        const record = records[key];
        let callback = null;
        if (index === Object.keys(records).length - 1) {
          callback = () => dispatch(fetchData(`employeerecord/${
            record.employee}`, 'employeerecord', null, `date=${record.date}`));
        }
        dispatch(updateData(`record/${record.id}`, record, record.id, callback));
      });
    },
  }),
  RecordSelfEdit = connect(mapStateToProps, mapDispatchToProps)(RecordSelfEditDumb);

export default RecordSelfEdit;
