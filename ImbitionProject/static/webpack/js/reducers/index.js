import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as notifications } from 'react-notification-system-redux';
import myNavbar from './MyNavbar';
import filterProfile from './FilterProfile';
import auth, * as fromAuth from './auth';
import data, * as fromData from './Data';

export default combineReducers({
  auth,
  rounter: routerReducer,
  notifications,
  myNavbar,
  filterProfile,
  data,
});

export const getTempPassword = state => fromAuth.getTempPassword(state.auth),
  getUserId = state => fromAuth.getUserId(state.auth),
  accessToken = state => fromAuth.accessToken(state.auth),
  refreshToken = state => fromAuth.refreshToken(state.auth),
  isAuthenticated = state => fromAuth.isAuthenticated(state.auth),
  isAccessTokenExpired = state => fromAuth.isAccessTokenExpired(state.auth),
  isRefreshTokenExpired = state => fromAuth.isRefreshTokenExpired(state.auth),
  authErrors = state => fromAuth.authErrors(state.auth),
  getFilterProfiles = state => fromData.getFilterProfiles(state.data);

export function withAuth(headers = {}) {
  return state => Object.assign({}, headers, {
    Authorization: `Bearer ${accessToken(state)}`,
  });
}
