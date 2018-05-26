/* eslint arrow-parens: 0 */

import Notifications from 'react-notification-system-redux';
import {
  FETCH_REQUEST, FETCH_SUCCESS, FETCH_FAILURE,
  UPDATE_REQUEST, UPDATE_SUCCESS, UPDATE_FAILURE,
  CREATE_REQUEST, CREATE_SUCCESS, CREATE_FAILURE,
  DELETE_REQUEST, DELETE_SUCCESS, DELETE_FAILURE,
  LOGIN_FIRST_FAILURE, PASSWORD_RESET_FAILURE, PASSWORD_RESET_SUCCESS,
} from '../actions';
import { NAMES, translate } from '../consts';

const REQUEST_MAP = {};
REQUEST_MAP[FETCH_REQUEST] = 1;
REQUEST_MAP[UPDATE_REQUEST] = 1;
REQUEST_MAP[CREATE_REQUEST] = 1;
REQUEST_MAP[DELETE_REQUEST] = 1;
REQUEST_MAP[FETCH_SUCCESS] = 2;
REQUEST_MAP[UPDATE_SUCCESS] = 2;
REQUEST_MAP[CREATE_SUCCESS] = 2;
REQUEST_MAP[DELETE_SUCCESS] = 2;
REQUEST_MAP[PASSWORD_RESET_SUCCESS] = 2;
REQUEST_MAP[FETCH_FAILURE] = 3;
REQUEST_MAP[UPDATE_FAILURE] = 3;
REQUEST_MAP[CREATE_FAILURE] = 3;
REQUEST_MAP[DELETE_FAILURE] = 3;
REQUEST_MAP[LOGIN_FIRST_FAILURE] = 3;
REQUEST_MAP[PASSWORD_RESET_FAILURE] = 3;

export default store => next => action => {
  if (action.type in REQUEST_MAP) {
    const state = store.getState();
    if (REQUEST_MAP[action.type] === 3 || REQUEST_MAP[action.type] === 2) {
      const messages = {};
      state.notifications.forEach(notification => {
        messages[notification.message] = notification.uid;
      });
      if (NAMES.FETCH_REQUEST_MESSAGE in messages) {
        next(Notifications.hide(messages[NAMES.FETCH_REQUEST_MESSAGE]));
      }
      if (REQUEST_MAP[action.type] === 3) {
        if (action.payload && action.payload.response) {
          next(Notifications.removeAll());
          next(Notifications.error({
            title: NAMES.ERROR,
            message: action.payload.response.detail
              || Object.values(action.payload.response)[0].detail
              || JSON.stringify(action.payload.response),
            position: 'br',
          }));
        }
      } else if (REQUEST_MAP[action.type] === 2) {
        if (Object.keys(action.payload).length === 1 || action.type !== FETCH_SUCCESS) {
          let message = '';
          if (action.type === FETCH_SUCCESS) {
            message = NAMES.FETCH_SUCCESS_MESSAGE(translate(Object.keys(action.payload)[0]));
          } else if (action.type === UPDATE_SUCCESS) {
            message = NAMES.UPDATE_SUCCESS_MESSAGE;
          } else if (action.type === DELETE_SUCCESS) {
            message = NAMES.DELETE_SUCCESS_MESSAGE;
          } else if (action.type === CREATE_SUCCESS) {
            message = NAMES.CREATE_SUCCESS_MESSAGE;
          } else if (action.type === PASSWORD_RESET_SUCCESS) {
            message = NAMES.PASSWORD_RESET_SUCCESS_MESSAGE;
          }
          if (!(message in messages)) {
            next(Notifications.success({
              title: NAMES.SUCCESS,
              message,
              position: 'br',
            }));
          }
        }
      } else if (REQUEST_MAP[action.type] === 1) {
        next(Notifications.removeAll());
        next(Notifications.warning({
          title: NAMES.PROCESSING,
          message: NAMES.REQUEST_MESSAGE(action.type),
          position: 'br',
          autoDismiss: 0,
        }));
      }
    }
  }

  return next(action);
};
