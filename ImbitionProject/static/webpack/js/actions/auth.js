import { RSAA } from 'redux-api-middleware';

export const LOGIN_REQUEST = '@@auth/LOGIN_REQUEST',
  LOGIN_SUCCESS = '@@auth/LOGIN_SUCCESS',
  LOGIN_FAILURE = '@@auth/LOGIN_FAILURE',
  LOGIN_FIRST_REQUEST = '@@auth/LOGIN_FIRST_REQUEST',
  LOGIN_FIRST_SUCCESS = '@@auth/LOGIN_FIRST_SUCCESS',
  LOGIN_FIRST_FAILURE = '@@auth/LOGIN_FIRST_FAILURE',
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

export function loginFirst(phone, lastName, firstName, callback) {
  return {
    [RSAA]: {
      endpoint: `/api/auth/pendingemployee/check/?phone=${phone}&last_name=${lastName}&first_name=${firstName}`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      types: [
        LOGIN_FIRST_REQUEST, LOGIN_FIRST_SUCCESS, LOGIN_FIRST_FAILURE,
      ],
      fetch: async (...args) => {
        const res = await fetch(...args),
          json = await res.json();

        if (callback) callback(json);
        return new Response(
          JSON.stringify(json),
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
