import { RSAA } from 'redux-api-middleware';
import { withAuth } from '../reducers';

export const FETCH_REQUEST = '@@data/FETCH_REQUEST',
  FETCH_SUCCESS = '@@data/FETCH_SUCCESS',
  FETCH_FAILURE = '@@data/FETCH_FAILURE',
  UPDATE_REQUEST = '@@data/UPDATE_REQUEST',
  UPDATE_SUCCESS = '@@data/UPDATE_SUCCESS',
  UPDATE_FAILURE = '@@data/UPDATE_FAILURE',
  CREATE_REQUEST = '@@data/CREATE_REQUEST',
  CREATE_SUCCESS = '@@data/CREATE_SUCCESS',
  CREATE_FAILURE = '@@data/CREATE_FAILURE',
  DELETE_REQUEST = '@@data/DELETE_REQUEST',
  DELETE_SUCCESS = '@@data/DELETE_SUCCESS',
  DELETE_FAILURE = '@@data/DELETE_FAILURE';

function apiRequest(method, requestTag, successTag, failureTag, target, body) {
  return {
    [RSAA]: {
      endpoint: `/api/imbition/${target}/`,
      method,
      body: body && JSON.stringify(body),
      headers: withAuth({ 'Content-Type': 'application/json' }),
      types: [
        requestTag, successTag, failureTag,
      ],
    },
  };
}


export function fetchData(target) {
  return apiRequest('GET', FETCH_REQUEST, FETCH_SUCCESS, FETCH_FAILURE, target, null);
}

export function updateData(target, body) {
  return apiRequest('PUT', UPDATE_REQUEST, UPDATE_SUCCESS, UPDATE_FAILURE, target, body);
}

export function createData(target, body) {
  return apiRequest('POST', CREATE_REQUEST, CREATE_SUCCESS, CREATE_FAILURE, target, body);
}

export function deleteData(target) {
  return apiRequest('DELETE', DELETE_REQUEST, DELETE_SUCCESS, DELETE_FAILURE, target, null);
}
