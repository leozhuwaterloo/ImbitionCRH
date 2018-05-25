import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import Notifications from 'react-notification-system-redux';
import DistinctViewPage from '../DistinctViewPage';
import { NAMES } from '../../consts';
import { fetchData, createData } from '../../actions';
import RecordViewMobile from './RecordViewMobile';

class RecordViewDumb extends React.Component {
  constructor(props) {
    super(props);
    const dateNow = moment().format('YYYY-MM-DD');
    props.fetchRecordSummary(dateNow, dateNow);
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
  fetchRecordSummary: PropTypes.func.isRequired,
  notifyError: PropTypes.func.isRequired,
  createFilterProfile: PropTypes.func.isRequired,
  initFilterProfile: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

const mapStateToProps = state => ({
    user: state.data.user,
    recordsummary: state.data.recordsummary,
    initFilterProfile: {},
  }),
  mapDispatchToProps = dispatch => ({
    fetchRecordSummary: (startDate, endDate) => {
      dispatch(fetchData('recordsummary', 'recordsummary', null, `startDate=${startDate}&endDate=${endDate}`));
    },
    notifyError: message => dispatch(Notifications.error({
      title: NAMES.ERROR,
      message,
      position: 'br',
    })),
    createFilterProfile: body => dispatch(createData('filterprofile', body, 'recordview', null)),
  }),
  RecordView = connect(mapStateToProps, mapDispatchToProps)(RecordViewDumb);

export default RecordView;
