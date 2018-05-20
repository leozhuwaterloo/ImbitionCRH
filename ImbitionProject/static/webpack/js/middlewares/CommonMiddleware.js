/* eslint arrow-parens: 0 */
/* eslint no-console: 0 */

export default store => next => action => {
  console.log('dispatching', action);
  const result = next(action);
  console.log('next state', store.getState());
  return result;
};
