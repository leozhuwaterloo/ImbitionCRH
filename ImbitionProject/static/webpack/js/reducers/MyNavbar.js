import { SET_TITLE, SET_ISMOBILE, SET_SIDE_NAV } from '../actions';

const initialState = {
  title: '首页',
  isMobile: true,
  sideNav: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_TITLE:
      return Object.assign({}, state, {
        title: action.title,
      });
    case SET_ISMOBILE:
      return Object.assign({}, state, {
        isMobile: action.isMobile,
      });
    case SET_SIDE_NAV:
      return Object.assign({}, state, {
        sideNav: action.sideNav,
      });
    default:
      return state;
  }
};
