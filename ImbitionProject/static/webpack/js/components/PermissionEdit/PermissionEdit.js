import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import DistinctViewPage from '../DistinctViewPage';
import { NAMES } from '../../consts';
import { fetchData, updateData, createData, deleteData } from '../../actions';
import PermissionEditMobile from './PermissionEditMobile';
import PermissionEditDesktop from './PermissionEditDesktop';

class PermissionEditDumb extends React.Component {
  constructor(props) {
    super(props);
    props.fetchPermissions();
    props.fetchPositions();
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
  errors: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  createerrors: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  fetchPositions: PropTypes.func.isRequired,
  fetchPermissions: PropTypes.func.isRequired,
  updatePositionPermission: PropTypes.func.isRequired,
  createPosition: PropTypes.func.isRequired,
  deletePosition: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
    const positions = {},
      permissions = {};
    // change position and permissions from list to id -> self dict
    state.data.positions.forEach((position) => {
      positions[position.id] = position;
    });
    state.data.permissions.forEach((permission) => {
      permissions[permission.id] = permission;
    });
    return {
      positions,
      permissions,
      errors: state.data.updateerrors,
      createerrors: state.data.createerrors,
    };
  },
  mapDispatchToProps = dispatch => ({
    fetchPositions: () => dispatch(fetchData('positionpermission')),
    fetchPermissions: () => dispatch(fetchData('permission')),
    updatePositionPermission: (target, body) => {
      dispatch(updateData(target, body)).then(setTimeout(() => dispatch(fetchData('positionpermission')), 100));
    },
    createPosition: (body) => {
      dispatch(createData('position', body)).then(setTimeout(() => dispatch(fetchData('positionpermission')), 100));
    },
    deletePosition: (positionId) => {
      dispatch(deleteData(`position/${positionId}`))
        .then(setTimeout(() => dispatch(fetchData('positionpermission')), 100));
    },
  }),
  PermissionEdit = connect(mapStateToProps, mapDispatchToProps)(PermissionEditDumb);

export default PermissionEdit;
