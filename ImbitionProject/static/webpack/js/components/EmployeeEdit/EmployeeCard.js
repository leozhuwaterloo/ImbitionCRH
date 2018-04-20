import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { TextInput } from '../FormControl';
import { updateData } from '../../actions';
import { translate } from '../../consts';

class EmployeeCardDumb extends React.Component {
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
    const { employee } = this.state;
    return (
      <div className={`card p-0 mb-2 ${this.props.cardClassName}`}>
        <div className="card-header bg-dark text-light">{(employee && employee.user
            && `${employee.user.last_name}${employee.user.first_name}`)
            || '名字'}
        </div>
        <div className="card-img-top center-display mt-4">
          <div className="card-img-container center-display rounded-circle fill-container bg-secondary">
            <img
              src={(employee && employee.portrait) || ''}
              alt="员工照片"
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
                        if (userKey === 'id' || userKey === 'username') return null;
                        return (
                          <TextInput
                            key={userKey}
                            name={userKey}
                            labelClassName="w-1"
                            label={translate(userKey)}
                            error={(this.props.errors[userKey] && this.props.errors[userKey][0]) || ''}
                            onChange={this.handleInputChange}
                            value={employee[key][userKey] || ''}
                          />
                        );
                      })
                    }
                  </div>
                );
              }
              return (
                <TextInput
                  key={key}
                  name={key}
                  labelClassName="w-1"
                  label={translate(key)}
                  error={(this.props.errors.password && this.props.errors.password[0]) || ''}
                  onChange={this.handleInputChange}
                  value={(key === 'position'
                    ? (employee[key] && employee[key].name)
                    : employee[key]) || ''}
                />
              );
            })
          }
        </div>
      </div>
    );
  }
}

EmployeeCardDumb.propTypes = {
  employee: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  errors: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  updateEmployee: PropTypes.func.isRequired,
  cardClassName: PropTypes.string,
};

EmployeeCardDumb.defaultProps = {
  employee: {},
  cardClassName: 'col-12',
};

const mapStateToProps = state => ({
    errors: state.data.updateerrors,
  }),
  mapDispatchToProps = dispatch => ({
    updateEmployee: (target, body) => dispatch(updateData(target, body)),
  }),
  EmployeeCard = connect(mapStateToProps, mapDispatchToProps)(EmployeeCardDumb);

export default EmployeeCard;
