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
  recordsummary: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  fetchRecordSummary: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    recordsummary: state.data.recordsummary,
  }),
  mapDispatchToProps = dispatch => ({
    fetchRecordSummary: (startDate, endDate) => {
      dispatch(fetchData('recordsummary', 'recordsummary', null, `startDate=${startDate}&endDate=${endDate}`));
    },
  }),
  RecordView = connect(mapStateToProps, mapDispatchToProps)(RecordViewDumb);

export default RecordView;
