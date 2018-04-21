import {
  FETCH_SUCCESS, FETCH_FAILURE,
  UPDATE_SUCCESS, UPDATE_FAILURE,
  CREATE_SUCCESS, CREATE_FAILURE,
  DELETE_SUCCESS, DELETE_FAILURE,
} from '../actions';

const initialState = {
  positions: [],
  employees: [],
  departments: [],
  permissions: [],

  fetcherrors: {},
  updateerrors: {},
  createerrors: {},
  deleteerrors: {},

  user: {},
  positionpermissions: [],
  employee: {},
  positiontree: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_SUCCESS:
      if (action.payload.employee) {
        const employeeDict = {};
        employeeDict[action.payload.employee.id] = action.payload.employee;
        return Object.assign({}, state, {
          employee: Object.assign({}, state.employee, employeeDict),
          fetcherrors: {},
        });
      }
      return Object.assign({}, state, action.payload, {
        fetcherrors: {},
      });
    case UPDATE_SUCCESS:
      return Object.assign({}, state, {
        updateerrors: {},
      });
    case CREATE_SUCCESS:
      return Object.assign({}, state, {
        createerrors: {},
      });
    case DELETE_SUCCESS:
      return Object.assign({}, state, {
        deleteerrors: {},
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
    case CREATE_FAILURE:
      return Object.assign({}, state, {
        createerrors: action.payload.response ||
          { non_field_errors: action.payload.statusText },
      });
    case DELETE_FAILURE:
      return Object.assign({}, state, {
        deleteerrors: action.payload.response ||
          { non_field_errors: action.payload.statusText },
      });
    default:
      return state;
  }
};
