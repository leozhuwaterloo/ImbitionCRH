import { RSAA } from 'redux-api-middleware';

export const LOGIN_REQUEST = '@@auth/LOGIN_REQUEST',
  LOGIN_SUCCESS = '@@auth/LOGIN_SUCCESS',
  LOGIN_FAILURE = '@@auth/LOGIN_FAILURE',
  LOGIN_FIRST_REQUEST = '@@auth/LOGIN_FIRST_REQUEST',
  LOGIN_FIRST_SUCCESS = '@@auth/LOGIN_FIRST_SUCCESS',
  LOGIN_FIRST_FAILURE = '@@auth/LOGIN_FIRST_FAILURE',
  PASSWORD_RESET_REQUEST = '@@auth/PASSWORD_RESET_REQUEST',
  PASSWORD_RESET_SUCCESS = '@@auth/PASSWORD_RESET_SUCCESS',
  PASSWORD_RESET_FAILURE = '@@auth/PASSWORD_RESET_FAILURE',
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

export function passwordReset(userId, oldPassword, newPassword, newPasswordConfirm, callback) {
  return {
    [RSAA]: {
      endpoint: '/api/auth/password/reset/',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: userId,
        old_password: oldPassword,
        new_password: newPassword,
        new_password_confirm: newPasswordConfirm,
      }),
      types: [
        PASSWORD_RESET_REQUEST, PASSWORD_RESET_SUCCESS, PASSWORD_RESET_FAILURE,
      ],
      fetch: async (...args) => {
        const res = await fetch(...args),
          json = await res.json();

        if (callback) callback(res.status);
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

export function loginFirst(phone, lastName, firstName, username, callback) {
  return {
    [RSAA]: {
      endpoint: '/api/auth/pendingemployee/check/',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone,
        last_name: lastName,
        first_name: firstName,
        username,
      }),
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
