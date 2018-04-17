import storage from 'redux-persist/es/storage';
import { applyMiddleware, createStore } from 'redux';
import { createFilter } from 'redux-persist-transform-filter';
import { persistReducer, persistStore } from 'redux-persist';
import { routerMiddleware } from 'react-router-redux';
import rootReducer from './reducers';
import { apiMiddleware, logger, crashReporter } from './middlewares';

export default (history) => {
  const persistedFilter = createFilter('auth', ['access', 'refresh']),
    reducer = persistReducer(
      {
        key: 'polls',
        storage,
        whitelist: ['auth'],
        transforms: [persistedFilter],
      },
      rootReducer,
    ),

    store = createStore(
      reducer, {},
      applyMiddleware(
        logger, crashReporter,
        apiMiddleware,
        routerMiddleware(history),
      ),
    );

  persistStore(store);
  return store;
};
