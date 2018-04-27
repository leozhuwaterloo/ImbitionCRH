import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import DistinctViewPage from '../DistinctViewPage';
import { NAMES } from '../../consts';
import { fetchData, createData, delData, updateData } from '../../actions';
import DepartmentEditMobile from './DepartmentEditMobile';
import DepartmentEditDesktop from './DepartmentEditDesktop';

class DepartmentEditDumb extends React.Component {
  constructor(props) {
    super(props);
    props.fetchDepartments();
    props.fetchPositions();
  }

  render() {
    return (
      <DistinctViewPage
        title={NAMES.DEPARTMENT_EDIT}
        mobileRender={() => <DepartmentEditMobile {...this.props} />}
        desktopRender={() => <DepartmentEditDesktop {...this.props} />}
      />
    );
  }
}

DepartmentEditDumb.propTypes = {
  positions: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  departments: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
  department: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  createerrors: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  fetchDepartments: PropTypes.func.isRequired,
  createDepartment: PropTypes.func.isRequired,
  deleteDepartment: PropTypes.func.isRequired,
  updateDepartment: PropTypes.func.isRequired,
  fetchPositions: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
    const positions = {},
      department = {};
    // change position from list to id -> self dict
    state.data.positions.forEach((position) => {
      positions[position.id] = position;
    });

    Object.keys(state.data.department).forEach((departmentId) => {
      const depart = {};
      depart.id = state.data.department[departmentId].id;
      depart.name = state.data.department[departmentId].name;
      // we need to obtain positions as a copy, so that we can't mutate the original in state
      depart.positions = Array.from(state.data.department[departmentId].positions);
      department[departmentId] = depart;
    });
    return {
      positions,
      departments: state.data.departments,
      department,
      createerrors: state.data.createerrors,
    };
  },
  mapDispatchToProps = dispatch => ({
    fetchDepartments: () => dispatch(fetchData('department', 'departments', (data) => {
      data.departments.forEach((department) => {
        dispatch(fetchData(`department/${department.id}`, 'department'));
      });
    })),
    createDepartment: (name) => {
      dispatch(createData('department', { name }, 'departmentedit', (data) => {
        dispatch(fetchData('department', 'departments'));
        dispatch(fetchData(`department/${data.departmentedit.id}`, 'department'));
      }));
    },
    deleteDepartment: (departmentId) => {
      dispatch(delData(`department/${departmentId}`, null, () => { // null as we are not displaying the error anyway
        dispatch(fetchData('department', 'departments'));
      }));
    },
    updateDepartment: (departmentId, body, callback) => {
      dispatch(updateData(`department/${departmentId}`, body, null, () => {
        dispatch(fetchData(`department/${departmentId}`, 'department'));
        if (callback) callback();
      }));
    },
    fetchPositions: () => dispatch(fetchData('position', 'positions')),
  }),
  DepartmentEdit = connect(mapStateToProps, mapDispatchToProps)(DepartmentEditDumb);

export default DepartmentEdit;
