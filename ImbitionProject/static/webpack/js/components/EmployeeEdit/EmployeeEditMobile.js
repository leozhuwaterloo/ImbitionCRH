import React from 'react';
import PropTypes from 'prop-types';
import { MySelect } from '../FormControl';
import { NAMES } from '../../consts';
import EmployeeCard from './EmployeeCard';

class EmployeeEditMobile extends React.Component {
  constructor(props) {
    super(props);
    this.state = { departmentFilter: '', searchFilter: '', employeeIds: [] };
  }

  render() {
    const { searchFilter, departmentFilter } = this.state,
      { employee, employees, departments } = this.props;
    return (
      <div className="container-fluid mt-4">
        <div className="ml-3 mr-3">
          <div className="row mb-1">
            <input
              className="form-control col-6"
              type="search"
              placeholder={NAMES.EMPLOYEE_SEARCH}
              aria-label="Search"
              onChange={event => this.setState({ searchFilter: event.target.value })}
              value={searchFilter}
            />
            <MySelect
              displayField="name"
              canBeNull
              className="col-6"
              list={departments}
              onChange={event => this.setState({ departmentFilter: parseInt(event.target.value, 10) })}
              value={departmentFilter}
            />
          </div>
          <div className="row mb-3">
            <MySelect
              displayField="full_name"
              size="5"
              multiple
              onChange={(event) => {
                const { options } = event.target,
                  values = [],
                  l = options.length;

                for (let i = 0; i < l; i += 1) {
                  if (options[i].selected) {
                    values.push(options[i].value);
                  }
                }
                this.setState({ employeeIds: values });
                values.forEach((value) => {
                  if (!employee[value]) {
                    this.props.fetchEmployee(value);
                  }
                });
              }}
              list={Object.keys(employees).filter(key => (
                (!searchFilter
                || employees[key].full_name.toLowerCase().includes(searchFilter.toLowerCase()))
                && (!departmentFilter || (employees[key].position && employees[key].position.department
                && employees[key].position.department.id === departmentFilter)))).map(key => employees[key])}
            />
          </div>
          <div className="row">
            {
              this.state.employeeIds.map((employeeId) => {
                if (!employee[employeeId]) return null;
                return (
                  <EmployeeCard
                    key={employeeId}
                    {...this.props}
                    employee={employee[employeeId]}
                  />
                );
              })
            }
          </div>
        </div>
      </div>
    );
  }
}

EmployeeEditMobile.propTypes = {
  employees: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  employee: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  departments: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
  positions: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  errors: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  fetchEmployee: PropTypes.func.isRequired,
  updateEmployee: PropTypes.func.isRequired,
  cardClassName: PropTypes.string,
};


EmployeeEditMobile.defaultProps = {
  cardClassName: 'col-12',
};

export default EmployeeEditMobile;
