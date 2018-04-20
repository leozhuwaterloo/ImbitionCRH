import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import DistinctViewPage from '../DistinctViewPage';
import { NAMES } from '../../consts';
import { fetchData } from '../../actions';

import EmployeeEditMobile from './EmployeeEditMobile';
import EmployeeEditDesktop from './EmployeeEditDesktop';

class EmpolyeeEditDumb extends React.Component {
  constructor(props) {
    super(props);
    props.fetchEmployees();
    props.fetchDepartments();
  }

  render() {
    return (
      <DistinctViewPage
        title={NAMES.EMPLOYEE_EDIT}
        mobileRender={() => <EmployeeEditMobile {...this.props} />}
        desktopRender={() => <EmployeeEditDesktop {...this.props} />}
      />
    );
  }
}

EmpolyeeEditDumb.propTypes = {
  employees: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  employee: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  departments: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
  fetchEmployees: PropTypes.func.isRequired,
  fetchEmployee: PropTypes.func.isRequired,
  fetchDepartments: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
    const employees = {};
    state.data.employees.forEach((employee) => {
      employees[employee.id] = employee;
      employees[employee.id].full_name = employee.user.last_name + employee.user.first_name;
    });
    return {
      employees,
      employee: state.data.employee,
      departments: state.data.departments,
    };
  },
  mapDispatchToProps = dispatch => ({
    fetchEmployees: () => dispatch(fetchData('employee')),
    fetchEmployee: employeeId => dispatch(fetchData(`employee/${employeeId}`)),
    fetchDepartments: () => dispatch(fetchData('department')),
  }),
  EmpolyeeEdit = connect(mapStateToProps, mapDispatchToProps)(EmpolyeeEditDumb);

export default EmpolyeeEdit;
