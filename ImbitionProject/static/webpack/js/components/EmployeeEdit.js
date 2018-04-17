import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import DistinctViewPage from './DistinctViewPage';
import { EMPLOYEE_EDIT_NAME } from '../consts';
import { fetchData } from '../actions';

class EmpolyeeEditDumb extends React.Component {
  constructor(props) {
    super(props);
    this.mobileRender = () => (
      <div className="container-fluid mt-4 x-scroll">
        <table className="table table-hover">
          <thead>
            <tr>
              <th scope="col">员工</th>
              <th scope="col">权限</th>
              <th scope="col">邮箱</th>
              <th scope="col">手机</th>
              <th scope="col">上次登录</th>
              <th scope="col">注册时间</th>
            </tr>
          </thead>
          {
            this.props.employees.map(employee => (
              <tbody key={employee.id}>
                <tr className="table-Info">
                  <th scope="row">{employee.user.last_name}{employee.user.first_name}</th>
                  <td>{(employee.permission_group && employee.permission_group.group_name)}</td>
                  <td>{employee.user.email}</td>
                  <td>{employee.phone}</td>
                  <td>{employee.user.last_login}</td>
                  <td>{employee.user.date_joined}</td>
                </tr>
              </tbody>
            ))
          }
        </table>
      </div>
    );
    props.fetchEmployees();
  }

  render() {
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
