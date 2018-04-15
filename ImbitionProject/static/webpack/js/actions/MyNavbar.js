export const SET_TITLE = 'SET_TITLE',
  SET_ISMOBILE = 'SET_ISMOBILE';


export function setTitle(title) {
  return { type: SET_TITLE, title };
}


export function setIsMobile(isMobile) {
  return { type: SET_ISMOBILE, isMobile };
}
