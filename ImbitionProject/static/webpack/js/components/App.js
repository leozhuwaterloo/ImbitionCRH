import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MainPage from './MainPage';
import MyNavbar from './MyNavbar';
import RecordEdit from './RecordEdit';
import { ROOT_URL, RECORD_EDIT_URL } from '../consts';
import { setIsMobile } from '../actions';

class AppDumb extends React.Component {
  componentWillMount() {
    this.props.storeIsMobile(window.innerWidth <= 900);
  }

  render() {
    return (
      <BrowserRouter>
        <div>
          <MyNavbar />
          <Route exact path={ROOT_URL} component={MainPage} />
          <Route path={RECORD_EDIT_URL} component={RecordEdit} />
        </div>
      </BrowserRouter>
    );
  }
}

AppDumb.propTypes = {
  storeIsMobile: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
    storeIsMobile: isMobile => dispatch(setIsMobile(isMobile)),
  }),
  App = connect(null, mapDispatchToProps)(AppDumb);

export default App;
