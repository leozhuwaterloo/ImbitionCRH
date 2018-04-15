import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import 'normalize.css';
import reducer from './reducers';
import App from './components/App';
import { logger, crashReporter } from './middlewares';
import '../css/style.scss';

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
