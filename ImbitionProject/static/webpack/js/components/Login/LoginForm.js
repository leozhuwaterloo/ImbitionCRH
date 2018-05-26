import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import FaWechat from 'react-icons/lib/fa/wechat';
import { TextInput } from '../FormControl';
import { NAMES, URLS, translate } from '../../consts';


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
          placeholder={NAMES.LOGIN_FIELD_1}
          error={(errors.username && translate(errors.username[0])) || ''}
          onChange={this.handleInputChange}
          value={this.state.username}
          containerClassName="mb-2"
          className="fill-container"
        />
        <TextInput
          name="password"
          placeholder={NAMES.LOGIN_FIELD_2}
          error={(errors.password && translate(errors.password[0])) || ''}
          type="password"
          onChange={this.handleInputChange}
          value={this.state.password}
          containerClassName="mb-4"
          className="fill-container"
        />
        {
          errors.non_field_errors ?
            <div className="alert alert-warning">
              { translate(errors.non_field_errors) }
            </div> : ''
        }
        <div className="form-group center-display">
          <button type="submit" className="btn btn-primary fill-container">{NAMES.LOGIN_SUBMIT}</button>
        </div>
        <div className="form-group center-display">
          <Link className="nav-link" to={URLS.LOGIN_FIRST}>{NAMES.LOGIN_FIRST}</Link>
        </div>
        <hr />
        <div className="form-group center-display">
          <button
            className="btn btn-success fill-container"
            onClick={(event) => {
              event.preventDefault();
              alert(NAMES.FEATURE_NOT_SUPPORTED); // eslint-disable-line no-alert
            }}
          >
            <FaWechat /> {NAMES.LOGIN_WECHAT}
          </button>
        </div>
        <div className="form-group center-display">
          <Link className="nav-link" to={URLS.LOGIN_OTHER}>{NAMES.LOGIN_OTHER}</Link>
        </div>
      </form>
    );
  }
}

LoginForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default LoginForm;
