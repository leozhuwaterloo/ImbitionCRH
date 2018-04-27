import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import DistinctViewPage from '../DistinctViewPage';
import { NAMES } from '../../consts';
import { fetchData, updateData, createData, delData } from '../../actions';
import PermissionEditMobile from './PermissionEditMobile';
import PermissionEditDesktop from './PermissionEditDesktop';

class PermissionEditDumb extends React.Component {
  constructor(props) {
    super(props);
    props.fetchPermissions();
    props.fetchPositions();
    props.fetchDepartments();
  }

  render() {
    return (
      <DistinctViewPage
        title={NAMES.PERMISSION_EDIT}
        mobileRender={() => <PermissionEditMobile {...this.props} />}
        desktopRender={() => <PermissionEditDesktop {...this.props} />}
      />
    );
  }
}

PermissionEditDumb.propTypes = {
  positions: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  permissions: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  departments: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
  errors: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  createerrors: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  fetchPositions: PropTypes.func.isRequired,
  fetchPermissions: PropTypes.func.isRequired,
  fetchDepartments: PropTypes.func.isRequired,
  updatePositionPermission: PropTypes.func.isRequired,
  createPosition: PropTypes.func.isRequired,
  deletePosition: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
    const positions = {},
      permissions = {};
    // change position and permissions from list to id -> self dict
    state.data.positionpermissions.forEach((position) => {
      positions[position.id] = position;
    });
    state.data.permissions.forEach((permission) => {
      permissions[permission.id] = permission;
    });
    return {
      positions,
      permissions,
      departments: state.data.departments,
      errors: state.data.updateerrors,
      createerrors: state.data.createerrors,
    };
  },
  mapDispatchToProps = dispatch => ({
    fetchPositions: () => dispatch(fetchData('positionpermission', 'positionpermissions')),
    fetchPermissions: () => dispatch(fetchData('permission', 'permissions')),
    fetchDepartments: () => dispatch(fetchData('department', 'departments')),
    updatePositionPermission: (positionId, body) => {
      dispatch(updateData(`position/${positionId}`, body, positionId, () => {
        dispatch(fetchData('positionpermission', 'positionpermissions'));
      }));
    },
    createPosition: (body) => {
      dispatch(createData('position', body, 'permissionedit', () => {
        dispatch(fetchData('positionpermission', 'positionpermissions'));
        dispatch(fetchData('permission', 'permissions'));
      }));
    },
    deletePosition: (positionId) => {
      dispatch(delData(`position/${positionId}`, null, () => { // null as we are not displaying the error anyway
        dispatch(fetchData('positionpermission', 'positionpermissions'));
        dispatch(fetchData('permission', 'permissions'));
      }));
    },
  }),
  PermissionEdit = connect(mapStateToProps, mapDispatchToProps)(PermissionEditDumb);

export default PermissionEdit;
