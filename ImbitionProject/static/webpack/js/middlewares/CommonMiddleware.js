/* eslint arrow-parens: 0 */
/* eslint no-console: 0 */

export const logger = store => next => action => {
    console.log('dispatching', action);
    const result = next(action);
    console.log('next state', store.getState());
    return result;
  },
  crashReporter = store => next => action => {
    try {
      return next(action);
    } catch (err) {
      console.error('Caught an exception!', err);
      console.error('Store:', store);
      throw err;
    }
  };
