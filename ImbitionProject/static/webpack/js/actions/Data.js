import { RSAA } from 'redux-api-middleware';
import { withAuth } from '../reducers';

export const FETCH_REQUEST = '@@data/FETCH_REQUEST',
  FETCH_SUCCESS = '@@data/FETCH_SUCCESS',
  FETCH_FAILURE = '@@data/FETCH_FAILURE',
  UPDATE_REQUEST = '@@data/UPDATE_REQUEST',
  UPDATE_SUCCESS = '@@data/UPDATE_SUCCESS',
  UPDATE_FAILURE = '@@data/UPDATE_FAILURE';

export function fetchData(target) {
  return {
    [RSAA]: {
      endpoint: `/api/imbition/${target}/`,
      method: 'GET',
      headers: withAuth({ 'Content-Type': 'application/json' }),
      types: [
        FETCH_REQUEST, FETCH_SUCCESS, FETCH_FAILURE,
      ],
    },
  };
}

export function updateData(target, body) {
  return {
    [RSAA]: {
      endpoint: `/api/imbition/${target}/`,
      method: 'PUT',
      body: body && JSON.stringify(body),
      headers: withAuth({ 'Content-Type': 'application/json' }),
      types: [
        UPDATE_REQUEST, UPDATE_SUCCESS, UPDATE_FAILURE,
      ],
    },
  };
}
