export const SET_TITLE = 'navbar/SET_TITLE',
  SET_ISMOBILE = 'navbar/SET_ISMOBILE',
  SET_SIDE_NAV = 'navbar/SET_SIDE_NAV',
  SET_LOADING = 'navbar/SET_LOADING';

export function setTitle(title) {
  return { type: SET_TITLE, title };
}

export function setIsMobile(isMobile) {
  return { type: SET_ISMOBILE, isMobile };
}

export function setSideNav(sideNav) {
  return { type: SET_SIDE_NAV, sideNav };
}

export function setLoading(loading) {
  return { type: SET_LOADING, loading };
}
