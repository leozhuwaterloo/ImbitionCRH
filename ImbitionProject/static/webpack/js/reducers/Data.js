import { FETCH_SUCCESS, FETCH_FAILURE, UPDATE_SUCCESS, UPDATE_FAILURE } from '../actions';

const initialState = {
  permissiongroups: [],
  employees: [],
  permissions: [],
  fetcherrors: {},
  updateerrors: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_SUCCESS:
      return Object.assign({}, state, action.payload, {
        fetcherrors: {},
      });
    case UPDATE_SUCCESS:
      return Object.assign({}, state, {
        updateerrors: {},
      });
    case FETCH_FAILURE:
      return Object.assign({}, state, {
        fetcherrors: action.payload.response ||
          { non_field_errors: action.payload.statusText },
      });
    case UPDATE_FAILURE:
      return Object.assign({}, state, {
        updateerrors: action.payload.response ||
          { non_field_errors: action.payload.statusText },
      });
    default:
      return state;
  }
};
