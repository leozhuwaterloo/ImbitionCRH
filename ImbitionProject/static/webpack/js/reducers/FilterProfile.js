import { SET_FILTER_PROFILE } from '../actions';

const initialState = {
  searchText: null,
  filterObj: null,
  showComment: null,
  columnHidden: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_FILTER_PROFILE:
      return {
        searchText: action.filterProfile.searchText,
        filterObj: action.filterProfile.filterObj,
        showComment: action.filterProfile.showComment,
        columnHidden: action.filterProfile.columnHidden,
      };
    default:
      return state;
  }
};
