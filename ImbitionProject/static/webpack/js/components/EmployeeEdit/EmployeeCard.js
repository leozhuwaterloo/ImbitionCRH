import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import TextInput from '../FormControl';
import { updateData } from '../../actions';
import { translate } from '../../consts';

class EmployeeCardDumb extends React.Component {
  constructor(props) {
    super(props);
    this.state = { employee: props.employee };
    console.log(this.props.updateEmployee);

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
      <div className="card">
        <img
          className="card-img-top"
          src={(employee && employee.portrait) || ''}
          alt="员工照片"
        />
        <div className="card-body">
          <h5 className="card-title bold center-display">
            {(employee && employee.user
            && `${employee.user.last_name}${employee.user.first_name}`)
            || '名字'}
          </h5>
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
                            label={translate(userKey)}
                            error={(this.props.errors.password && this.props.errors.password[0]) || ''}
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
                  label={translate(key)}
                  error={(this.props.errors.password && this.props.errors.password[0]) || ''}
                  onChange={this.handleInputChange}
                  value={(key === 'permission_group'
                    ? (employee[key] && employee[key].group_name)
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
};

EmployeeCardDumb.defaultProps = {
  employee: {},
};

const mapStateToProps = state => ({
    errors: state.data.updateerrors,
  }),
  mapDispatchToProps = dispatch => ({
    updateEmployee: (target, body) => dispatch(updateData(target, body)),
  }),
  EmployeeCard = connect(mapStateToProps, mapDispatchToProps)(EmployeeCardDumb);

export default EmployeeCard;
