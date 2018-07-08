export const SET_FILTER_PROFILE = 'filterprofile/SET_FILTER_PROFILE';

export function setFilterProfile(filterProfile) {
  return { type: SET_FILTER_PROFILE, filterProfile };
}

export function clearFilterProfile() {
  return {
    type: SET_FILTER_PROFILE,
    filterProfile: {
      searchText: null,
      filterObj: null,
      showComment: null,
      columnHidden: null,
    },
  };
}
