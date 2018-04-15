import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import MainPage from './MainPage';
import { ROOT_URL } from '../consts';

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Route exact path={ROOT_URL} component={MainPage} />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
