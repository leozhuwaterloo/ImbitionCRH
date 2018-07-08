import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import Notifications from 'react-notification-system-redux';
import DistinctViewPage from '../DistinctViewPage';
import { NAMES } from '../../consts';
import { fetchRecordSummary, fetchData, createData, clearFilterProfile } from '../../actions';
import RecordViewMobile from './RecordViewMobile';

class RecordViewDumb extends React.Component {
  constructor(props) {
    super(props);
    const dateNow = moment().format('YYYY-MM-DD');
    props.fetchRecordSummary({
      start_date: dateNow,
      end_date: dateNow,
    });

    props.fetchDepartments();
    props.fetchPositions();
  }

  componentWillUnmount() {
    this.props.clearFilterProfile();
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
  user: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  recordsummary: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  departments: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
  positions: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
  fetchRecordSummary: PropTypes.func.isRequired,
  fetchDepartments: PropTypes.func.isRequired,
  fetchPositions: PropTypes.func.isRequired,
  notifyError: PropTypes.func.isRequired,
  createFilterProfile: PropTypes.func.isRequired,
  initFilterProfile: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  clearFilterProfile: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    user: state.data.user,
    recordsummary: state.data.recordsummary,
    departments: state.data.departments,
    positions: state.data.positions,
    initFilterProfile: state.filterProfile,
  }),
  mapDispatchToProps = dispatch => ({
    fetchRecordSummary: body => dispatch(fetchRecordSummary(body)),
    fetchDepartments: () => dispatch(fetchData('department', 'departments')),
    fetchPositions: () => dispatch(fetchData('position', 'positions')),
    notifyError: message => dispatch(Notifications.error({
      title: NAMES.ERROR,
      message,
      position: 'br',
    })),
    createFilterProfile: body => dispatch(createData('filterprofile', body, 'recordview', null)),
    clearFilterProfile: () => dispatch(clearFilterProfile()),
  }),
  RecordView = connect(mapStateToProps, mapDispatchToProps)(RecordViewDumb);

export default RecordView;
