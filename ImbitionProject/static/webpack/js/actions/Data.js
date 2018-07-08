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

function apiRequest(method, requestTag, successTag, failureTag, target, body, key, callback, query) {
  return {
    [RSAA]: {
      endpoint: `/api/imbition/${target}/${query ? `?${query}` : ''}`,
      method,
      body: body && JSON.stringify(body),
      headers: withAuth({ 'Content-Type': 'application/json' }),
      types: [
        requestTag, successTag, failureTag,
      ],
      fetch: async (...args) => {
        const res = await fetch(...args),
          json = await res.json();

        let newJson = {};
        if (key) newJson[key] = json;
        else newJson = json;

        if (callback) callback(newJson);
        return new Response(
          JSON.stringify(newJson),
          {
            status: res.status,
            statusText: res.statusText,
            headers: res.headers,
          },
        );
      },
    },
  };
}

export function fetchRecordSummary(body, callback) {
  return apiRequest(
    'POST', FETCH_REQUEST, FETCH_SUCCESS, FETCH_FAILURE,
    'recordsummary', body, 'recordsummary', callback, null,
  );
}

export function fetchData(target, key, callback, query) {
  return apiRequest('GET', FETCH_REQUEST, FETCH_SUCCESS, FETCH_FAILURE, target, null, key, callback, query);
}

export function updateData(target, body, key, callback) {
  return apiRequest('PUT', UPDATE_REQUEST, UPDATE_SUCCESS, UPDATE_FAILURE, target, body, key, callback, null);
}

export function createData(target, body, key, callback) {
  return apiRequest('POST', CREATE_REQUEST, CREATE_SUCCESS, CREATE_FAILURE, target, body, key, callback, null);
}

export function delData(target, key, callback) {
  return apiRequest('DELETE', DELETE_REQUEST, DELETE_SUCCESS, DELETE_FAILURE, target, null, key, callback, null);
}
