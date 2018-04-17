import { RSAA } from 'redux-api-middleware';

export const LOGIN_REQUEST = '@@auth/LOGIN_REQUEST',
  LOGIN_SUCCESS = '@@auth/LOGIN_SUCCESS',
  LOGIN_FAILURE = '@@auth/LOGIN_FAILURE',
  TOKEN_REQUEST = '@@auth/TOKEN_REQUEST',
  TOKEN_RECEIVED = '@@auth/TOKEN_RECEIVED',
  TOKEN_FAILURE = '@@auth/TOKEN_FAILURE',
  LOGOUT = '@@auth/LOGOUT';


export function login(username, password) {
  return {
    [RSAA]: {
      endpoint: '/api/auth/token/obtain/',
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: { 'Content-Type': 'application/json' },
      types: [
        LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE,
      ],
    },
  };
}

export function refreshAccessToken(token) {
  return {
    [RSAA]: {
      endpoint: '/api/auth/token/refresh/',
      method: 'POST',
      body: JSON.stringify({ refresh: token }),
      headers: { 'Content-Type': 'application/json' },
      types: [
        TOKEN_REQUEST, TOKEN_RECEIVED, TOKEN_FAILURE,
      ],
    },
  };
}


export function logout() {
  return { type: LOGOUT };
}
