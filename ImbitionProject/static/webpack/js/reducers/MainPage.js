import { SET_NAME } from '../actions';


const initialState = {
  name: '',
};


export default function mainPage(state = initialState, action) {
  switch (action.type) {
    case SET_NAME:
      return Object.assign({}, state, {
        name: action.name,
      });
    default:
      return state;
  }
}
