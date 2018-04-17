import React from 'react';
import PropTypes from 'prop-types';
import TextInput from './TextInput';
import { LOGIN_ERROR } from '../consts';

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
          label="用户名"
          error={(errors.username && errors.username[0]) || ''}
          onChange={this.handleInputChange}
          value={this.state.username}
        />
        <TextInput
          name="password"
          label="密码"
          error={(errors.password && errors.password[0]) || ''}
          type="password"
          onChange={this.handleInputChange}
          value={this.state.password}
        />
        <div className="form-group center-display">
          <button type="submit" className="btn btn-primary">登录</button>
        </div>
        {
          errors.non_field_errors ?
            <div className="alert alert-primary">
              { LOGIN_ERROR }
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
