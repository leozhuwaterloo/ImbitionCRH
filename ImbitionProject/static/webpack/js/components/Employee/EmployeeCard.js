import React from 'react';
import PropTypes from 'prop-types';
import { TextInput, MySelect } from '../FormControl';
import { translate, NAMES } from '../../consts';

class EmployeeCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { employee: props.employee };
    this.handleInputChange = (event) => {
      if (!this.state.employee) return;
      const { name, value } = event.target;
      if (this.state.employee[name]) this.state.employee[name] = value;
      else this.state.employee.user[name] = value;
      this.setState(this.state);
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ employee: nextProps.employee });
  }

  render() {
    const { employee } = this.state,
      { errors } = this.props;
    return (
      <div className={`card p-0 mb-3 ${this.props.cardClassName}`}>
        <div className="card-header bg-dark text-light">{(employee && employee.user
            && `${employee.user.last_name}${employee.user.first_name}`)
            || NAMES.EMPLOYEE_NAME}
        </div>
        <div className="card-img-top center-display mt-4">
          <div className="card-img-container center-display rounded-circle fill-container bg-secondary">
            <img
              src={(employee && employee.portrait) || ''}
              alt={NAMES.EMPLOYEE_PORTRAIT}
            />
          </div>
        </div>
        <div className="card-body">
          {
            Object.keys(employee).map((key) => {
              if (key === 'id' || key === 'portrait') return null;
              if (key === 'user') {
                return (
                  <div key={key}>
                    {
                      Object.keys(employee[key]).map((userKey) => {
                        if (userKey === 'id' || userKey === 'username' || userKey === 'setting') return null;
                        return (
                          <TextInput
                            disabled={userKey === 'last_login' || userKey === 'date_joined'}
                            key={userKey}
                            name={userKey}
                            labelClassName="w-1"
                            inputClassName="w-1"
                            label={translate(userKey)}
                            error={(errors[employee.id] && errors[employee.id][key]
                              && errors[employee.id][key][userKey]
                              && translate(errors[employee.id][key][userKey][0])) || ''}
                            onChange={this.handleInputChange}
                            value={employee[key][userKey] || ''}
                          />
                        );
                      })
                    }
                  </div>
                );
              }
              if (key === 'position') {
                return (
                  <div key={key}>
                    <div className="form-group center-display m-0">
                      <label htmlFor="permission-select" className="m-0 w-1">{NAMES.POSITION}</label>
                      <MySelect
                        id="permission-select"
                        canBeNull
                        className="w-1 mb-0"
                        displayField="name"
                        dict={this.props.positions}
                        value={(employee.position && employee.position.id) || ''}
                        onChange={(event) => {
                          employee.position = this.props.positions[event.target.value];
                          this.forceUpdate();
                        }}
                      />
                    </div>
                    <TextInput
                      name="name"
                      disabled
                      labelClassName="w-1"
                      inputClassName="w-1"
                      label={translate('department')}
                      value={(employee.position
                        && employee.position.department
                        && employee.position.department.name) || ''}
                    />
                  </div>
                );
              }
              return (
                <TextInput
                  key={key}
                  name={key}
                  labelClassName="w-1"
                  inputClassName="w-1"
                  label={translate(key)}
                  error={(errors[employee.id] && errors[employee.id][key]
                    && translate(errors[employee.id][key])) || ''}
                  onChange={this.handleInputChange}
                  value={employee[key] || ''}
                />
              );
            })
          }
        </div>
        <div className="card-footer center-display">
          <button
            type="button"
            className="btn btn-info"
            onClick={() => {
              this.props.updateEmployee(employee.id, Object.assign({}, employee, {
                position: (employee.position && employee.position.id) || null,
                portrait: '',
              }));
            }}
          >
            {NAMES.EMPLOYEE_SAVE}
          </button>
        </div>
      </div>
    );
  }
}

EmployeeCard.propTypes = {
  employee: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  positions: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  errors: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  updateEmployee: PropTypes.func.isRequired,
  cardClassName: PropTypes.string,
};

EmployeeCard.defaultProps = {
  cardClassName: 'col-12',
};

export default EmployeeCard;
