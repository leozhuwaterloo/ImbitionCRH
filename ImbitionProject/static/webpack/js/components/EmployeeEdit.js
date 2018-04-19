import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import EmployeeCard from './EmployeeCard';
import DistinctViewPage from './DistinctViewPage';
import { EMPLOYEE_EDIT_NAME } from '../consts';
import { fetchData } from '../actions';

class EmpolyeeEditDumb extends React.Component {
  constructor(props) {
    super(props);
    this.mobileRender = () => (
      <div className="container-fluid mt-4">
        <EmployeeCard
          employee={this.props.employees[0]}
        />
      </div>
    );
    props.fetchEmployees();
  }

  render() {
    console.log(this.props.employees);
    return (
      <DistinctViewPage
        title={EMPLOYEE_EDIT_NAME}
        mobileRender={() => this.mobileRender()}
      />
    );
  }
}

EmpolyeeEditDumb.propTypes = {
  employees: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
  fetchEmployees: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    employees: state.data.employees,
  }),
  mapDispatchToProps = dispatch => ({
    fetchEmployees: () => dispatch(fetchData('employee')),
  }),
  EmpolyeeEdit = connect(mapStateToProps, mapDispatchToProps)(EmpolyeeEditDumb);

export default EmpolyeeEdit;
