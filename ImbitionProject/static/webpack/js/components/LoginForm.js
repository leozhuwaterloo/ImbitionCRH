import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import TextInput from './TextInput';
import {
  LOGIN_USERNAME_NAME, LOGIN_PASSWORD_NAME, LOGIN_SUBMIT_NAME,
  LOGIN_FIRST_NAME, LOGIN_FIRST_URL, translate,
} from '../consts';


class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    };

    this.handleInputChange = (event) => {
      const { name, value } = event.target;
      this.setState({
        [name]: value,
      });
    };

    this.onSubmit = (event) => {
      event.preventDefault();
      this.props.onSubmit(this.state.username, this.state.password);
    };
  }

  render() {
    const { errors } = this.props;
    return (
      <form onSubmit={this.onSubmit} className="fill-container">
        <TextInput
          name="username"
          label={LOGIN_USERNAME_NAME}
          error={(errors.username && translate(errors.username[0])) || ''}
          onChange={this.handleInputChange}
          value={this.state.username}
          containerClassName="mb-2"
          labelClassName="col-3"
        />
        <TextInput
          name="password"
          label={LOGIN_PASSWORD_NAME}
          error={(errors.password && translate(errors.password[0])) || ''}
          type="password"
          onChange={this.handleInputChange}
          value={this.state.password}
          containerClassName="mb-4"
          labelClassName="col-3"
        />
        <div className="form-group center-display">
          <button type="submit" className="btn btn-primary mr-3">{LOGIN_SUBMIT_NAME}</button>
          <Link className="btn btn-primary" to={LOGIN_FIRST_URL}>{LOGIN_FIRST_NAME}</Link>
        </div>
        {
          errors.non_field_errors ?
            <div className="alert alert-primary">
              { translate(errors.non_field_errors) }
            </div> : ''
        }
      </form>
    );
  }
}

LoginForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default LoginForm;
