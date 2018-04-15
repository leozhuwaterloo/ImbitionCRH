import { SET_TITLE, SET_ISMOBILE } from '../actions';

const initialState = {
  title: '首页',
  isMobile: true,
};


export default function mainPage(state = initialState, action) {
  switch (action.type) {
    case SET_TITLE:
      return Object.assign({}, state, {
        title: action.title,
      });
    case SET_ISMOBILE:
      return Object.assign({}, state, {
        isMobile: action.isMobile,
      });
    default:
      return state;
  }
}
