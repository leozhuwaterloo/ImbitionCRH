import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as notifications } from 'react-notification-system-redux';
import myNavbar from './MyNavbar';
import auth, * as fromAuth from './auth';
import data from './Data';

export default combineReducers({
  auth,
  rounter: routerReducer,
  notifications,
  myNavbar,
  data,
});

export const getTempPassword = state => fromAuth.getTempPassword(state.auth),
  getUserId = state => fromAuth.getUserId(state.auth),
  accessToken = state => fromAuth.accessToken(state.auth),
  refreshToken = state => fromAuth.refreshToken(state.auth),
  isAuthenticated = state => fromAuth.isAuthenticated(state.auth),
  isAccessTokenExpired = state => fromAuth.isAccessTokenExpired(state.auth),
  isRefreshTokenExpired = state => fromAuth.isRefreshTokenExpired(state.auth),
  authErrors = state => fromAuth.authErrors(state.auth);

export function withAuth(headers = {}) {
  return state => Object.assign({}, headers, {
    Authorization: `Bearer ${accessToken(state)}`,
  });
}
