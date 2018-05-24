import jwtDecode from 'jwt-decode';
import {
  LOGIN_SUCCESS, LOGIN_FAILURE, LOGIN_FIRST_FAILURE,
  TOKEN_RECEIVED, TOKEN_FAILURE, LOGIN_FIRST_SUCCESS,
  LOGOUT,
} from '../actions';

const initialState = {
  access: null,
  refresh: null,
  errors: {},
  tempPassword: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return Object.assign({}, state, {
        access: Object.assign({}, jwtDecode(action.payload.access), {
          token: action.payload.access,
        }),
        refresh: Object.assign({}, jwtDecode(action.payload.refresh), {
          token: action.payload.refresh,
        }),
        errors: {},
      });
    case LOGIN_FIRST_SUCCESS:
      return Object.assign({}, state, {
        tempPassword: action.payload.password,
      });
    case TOKEN_RECEIVED:
      return Object.assign({}, state, {
        access: Object.assign({}, jwtDecode(action.payload.access), {
          token: action.payload.access,
        }),
      });
    case LOGIN_FAILURE:
    case LOGIN_FIRST_FAILURE:
    case TOKEN_FAILURE:
      return Object.assign({}, state, {
        access: null,
        refresh: null,
        errors: action.payload.response ||
          { non_field_errors: action.payload.statusText },
      });
    case LOGOUT:
      return Object.assign({}, state, {
        access: null,
        refresh: null,
        errors: {},
      });
    default:
      return state;
  }
};

export function getTempPassword(state) {
  return state.tempPassword;
}

export function getUserId(state) {
  if (state.refresh) {
    return state.refresh.user_id;
  }
  return null;
}

export function accessToken(state) {
  if (state.access) {
    return state.access.token;
  }
  return null;
}
export function refreshToken(state) {
  if (state.refresh) {
    return state.refresh.token;
  }
  return null;
}
export function isAccessTokenExpired(state) {
  if (state.access && state.access.exp) {
    return (1000 * state.access.exp) - (new Date()).getTime() < 5000;
  }
  return true;
}
export function isRefreshTokenExpired(state) {
  if (state.refresh && state.refresh.exp) {
    return (1000 * state.refresh.exp) - (new Date()).getTime() < 5000;
  }
  return true;
}
export function isAuthenticated(state) {
  return !isRefreshTokenExpired(state);
}
export function authErrors(state) {
  if (state.errors) {
    return state.errors;
  }
  return {};
}
