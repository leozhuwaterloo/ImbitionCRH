import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import DistinctViewPage from '../DistinctViewPage';
import { NAMES } from '../../consts';
import { fetchData } from '../../actions';
import RecordViewMobile from './RecordViewMobile';

class RecordViewDumb extends React.Component {
  constructor(props) {
    super(props);
    props.fetchEmployees();
    props.fetchRecords(moment().format('YYYY-MM-DD'));
    props.fetchRecordFields();
  }

  render() {
    return (
      <DistinctViewPage
        title={NAMES.RECORD_VIEW}
        mobileRender={() => <RecordViewMobile {...this.props} />}
      />
    );
  }
}

RecordViewDumb.propTypes = {
  employees: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
  record: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  recordfields: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  fetchEmployees: PropTypes.func.isRequired,
  fetchRecords: PropTypes.func.isRequired,
  fetchRecordFields: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
    const recordfields = {};

    state.data.recordfields.forEach((recordfield) => {
      recordfields[recordfield.id] = recordfield;
    });

    return {
      recordfields,
      employees: state.data.employees,
      record: state.data.record,
    };
  },
  mapDispatchToProps = dispatch => ({
    fetchEmployees: () => dispatch(fetchData('employee', 'employees')),
    fetchRecordFields: () => dispatch(fetchData('recordfield', 'recordfields')),
    fetchRecords: date => dispatch(fetchData('record', 'record', (data) => {
      const tmpRecord = data.record;
      data.record = {};
      data.record[date] = tmpRecord;
    }, `date=${date}`)),
  }),
  RecordView = connect(mapStateToProps, mapDispatchToProps)(RecordViewDumb);

export default RecordView;
