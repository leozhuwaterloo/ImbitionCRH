import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reducer from './reducers';
import App from './components/App';
import { logger, crashReporter } from './middlewares';

const store = createStore(
  reducer,
  applyMiddleware(logger, crashReporter),
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('react-app'),
);
