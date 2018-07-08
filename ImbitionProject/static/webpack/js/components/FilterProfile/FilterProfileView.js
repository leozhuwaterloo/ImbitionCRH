import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import DistinctViewPage from '../DistinctViewPage';
import { NAMES } from '../../consts';
import { fetchData, setFilterProfile, delData } from '../../actions';
import { getUserId, getFilterProfiles } from '../../reducers';
import FilterProfileViewMobile from './FilterProfileViewMobile';

class FilterProfileViewDumb extends React.Component {
  constructor(props) {
    super(props);
    props.fetchFilterProfiles(props.userId);
  }

  render() {
    return (
      <DistinctViewPage
        title={NAMES.FILTER_PROFILE_VIEW}
        mobileRender={() => <FilterProfileViewMobile {...this.props} />}
      />
    );
  }
}

FilterProfileViewDumb.propTypes = {
  filterprofiles: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
  fetchFilterProfiles: PropTypes.func.isRequired,
  deleteFilterProfile: PropTypes.func.isRequired,
  loadFilterProfile: PropTypes.func.isRequired,
  userId: PropTypes.number.isRequired,
};

const mapStateToProps = state => ({
    filterprofiles: getFilterProfiles(state),
    userId: getUserId(state),
  }),
  mapDispatchToProps = dispatch => ({
    fetchFilterProfiles: userId => dispatch(fetchData(`filterprofile/${userId}`, 'filterprofiles')),
    deleteFilterProfile: (userId, filterProfileId) => dispatch(delData(`filterprofile/${filterProfileId}`, null, () => {
      dispatch(fetchData(`filterprofile/${userId}`, 'filterprofiles'));
    })),
    loadFilterProfile: filterProfile => dispatch(setFilterProfile(filterProfile)),
  }),
  FilterProfileView = connect(mapStateToProps, mapDispatchToProps)(FilterProfileViewDumb);

export default FilterProfileView;
