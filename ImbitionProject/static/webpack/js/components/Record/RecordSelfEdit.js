import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import DistinctViewPage from '../DistinctViewPage';
import { NAMES } from '../../consts';
import { fetchData, createData, delData } from '../../actions';
import RecordSelfEditMobile from './RecordSelfEditMobile';

class RecordSelfEditDumb extends React.Component {
  constructor(props) {
    super(props);
    props.fetchRecordFields();

    this.tryFetch = () => {
      if (this.props.user && this.props.user.id) {
        this.props.fetchEmployeeRecord(this.props.user.id);
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
      />
    );
  }
}

RecordSelfEditDumb.propTypes = {
  user: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  recordfields: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  employee: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  fetchRecordFields: PropTypes.func.isRequired,
  fetchEmployeeRecord: PropTypes.func.isRequired,
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
    };
  },
  mapDispatchToProps = dispatch => ({
    fetchRecordFields: () => dispatch(fetchData('recordfield', 'recordfields')),
    fetchEmployeeRecord: employeeId => dispatch(fetchData(`employeerecord/${employeeId}`, 'employeerecord')),
  }),
  RecordSelfEdit = connect(mapStateToProps, mapDispatchToProps)(RecordSelfEditDumb);

export default RecordSelfEdit;
