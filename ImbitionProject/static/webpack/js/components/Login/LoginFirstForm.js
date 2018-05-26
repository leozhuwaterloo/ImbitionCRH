import React from 'react';
import PropTypes from 'prop-types';
import { TextInput, MyModal } from '../FormControl';
import { NAMES, translate } from '../../consts';

class LoginFirstForm extends React.Component {
  constructor(props) {
    super(props);
    this.modalId = 'loginFirstForm';
    this.state = {
      phone: '',
      last_name: '',
      first_name: '',
      username: '',
    };

    this.handleInputChange = (event) => {
      const { name, value } = event.target;
      this.setState({
        [name]: value,
      });
    };
  }

  render() {
    const { errors } = this.props;
    return (
      <div className="fill-container">
        <TextInput
          name="phone"
          placeholder={NAMES.LOGIN_FIRST_FIELD_1}
          error={(errors.phone && translate(errors.phone[0])) || ''}
          onChange={this.handleInputChange}
          value={this.state.phone}
          containerClassName="mb-2"
          className="fill-container"
        />
        <TextInput
          name="last_name"
          placeholder={NAMES.LOGIN_FIRST_FIELD_2}
          error={(errors.last_name && translate(errors.last_name[0])) || ''}
          onChange={this.handleInputChange}
          value={this.state.last_name}
          containerClassName="mb-2"
          className="fill-container"
        />
        <TextInput
          name="first_name"
          placeholder={NAMES.LOGIN_FIRST_FIELD_3}
          error={(errors.first_name && translate(errors.first_name[0])) || ''}
          onChange={this.handleInputChange}
          value={this.state.first_name}
          containerClassName="mb-2"
          className="fill-container"
        />
        <div className="form-group center-display">
          <button
            className="btn btn-primary fill-container"
            data-toggle="modal"
            data-target={`#${this.modalId}-1`}
          >{NAMES.LOGIN_FIRST_SUBMIT}
          </button>
        </div>
        <MyModal
          id={`${this.modalId}-1`}
          title={NAMES.LOGIN_FIRST_USERNAME_QUESTION}
          body={
            <div>
              <TextInput
                name="username"
                placeholder={NAMES.USERNAME}
                onChange={this.handleInputChange}
                value={this.state.username}
                className="fill-container"
              />
              <p className="text-danger">{NAMES.LOGIN_FIRST_WARNING}</p>
            </div>
          }
          onSubmit={() => {
            this.props.onSubmit(this.state.phone, this.state.last_name, this.state.first_name, this.state.username);
          }}
        />
      </div>
    );
  }
}

LoginFirstForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default LoginFirstForm;
