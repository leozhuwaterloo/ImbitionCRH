import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import DistinctViewPage from '../DistinctViewPage';
import { NAMES } from '../../consts';
import { fetchData, updateData } from '../../actions';

import EmployeeEditMobile from './EmployeeEditMobile';
import EmployeeEditDesktop from './EmployeeEditDesktop';

class EmpolyeeEditDumb extends React.Component {
  constructor(props) {
    super(props);
    props.fetchEmployees();
    props.fetchDepartments();
    props.fetchPositions();
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
  positions: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  errors: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  fetchEmployees: PropTypes.func.isRequired,
  fetchEmployee: PropTypes.func.isRequired,
  fetchPositions: PropTypes.func.isRequired,
  fetchDepartments: PropTypes.func.isRequired,
  updateEmployee: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
    const employees = {},
      positions = {};
    state.data.employees.forEach((employee) => {
      employees[employee.id] = employee;
      employees[employee.id].full_name = employee.user.last_name + employee.user.first_name;
    });

    state.data.positions.forEach((position) => {
      positions[position.id] = position;
    });
    return {
      employees,
      employee: state.data.employee,
      departments: state.data.departments,
      positions,
      errors: state.data.updateerrors,
    };
  },
  mapDispatchToProps = dispatch => ({
    fetchEmployees: () => dispatch(fetchData('employee')),
    fetchEmployee: employeeId => dispatch(fetchData(`employee/${employeeId}`)),
    fetchDepartments: () => dispatch(fetchData('department')),
    fetchPositions: () => dispatch(fetchData('position')),
    updateEmployee: (employeeId, body) => {
      dispatch(updateData(`employee/${employeeId}`, body))
        .then(setTimeout(() => dispatch(fetchData(`employee/${employeeId}`)), 100));
    },
  }),
  EmpolyeeEdit = connect(mapStateToProps, mapDispatchToProps)(EmpolyeeEditDumb);

export default EmpolyeeEdit;
