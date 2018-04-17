import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FaMinusCircle from 'react-icons/lib/fa/minus-circle';
import TextInput from './TextInput';
import MyModal from './MyModal';
import DistinctViewPage from './DistinctViewPage';
import { PERMISSION_EDIT_NAME } from '../consts';
import { fetchData, updateData } from '../actions';


class PermissionEditDumb extends React.Component {
  constructor(props) {
    super(props);
    const modalId = 'permissionModal';

    this.handleInputChange = (event, index) => {
      const { name, value } = event.target;
      this.state.permissiongroups[index][name] = value;
      this.setState(this.state);
    };

    this.lastUpdated = null;
    this.addPermission = () => {
      const target = `permissiongroup/${this.state.csPermissionGroup}`,
        body = this.state.permissiongroups[this.state.csPermissionGroup];
      body.permissions.push(this.csPermission);
      this.props.updatePermissionGroup(target, body);
      this.lastUpdated = this.state.csPermissionGroup;
    };

    this.save = (permissiongroupId) => {
      const target = `permissiongroup/${permissiongroupId}`,
        body = this.state.permissiongroups[permissiongroupId];
      this.props.updatePermissionGroup(target, body);
      this.lastUpdated = permissiongroupId;
    };

    this.remove = (permissiongroupId, permissionId) => {
      const target = `permissiongroup/${permissiongroupId}`,
        body = this.state.permissiongroups[permissiongroupId],
        index = body.permissions.indexOf(permissionId);
      if (index > -1) {
        body.permissions.splice(index, 1);
      }
      this.props.updatePermissionGroup(target, body);
      this.lastUpdated = permissiongroupId;
    };

    this.mobileRender = () => {
      const modalBody = (
        <div>
          <select
            className="custom-select"
            onChange={(event) => {
              this.csPermission = event.target.value;
            }}
          >
            {
              Object.keys(this.props.permissions).map((key) => {
                const permission = this.props.permissions[key];
                if (!permission) return null;
                return (
                  <option value={permission.id} key={permission.id}>{permission.description}</option>
                );
              })
            }
          </select>

        </div>
      );
      return (
        <div>
          <div className="container-fluid mt-4">
            <div className="row">
              {
                Object.keys(this.state.permissiongroups).map((key) => {
                  const permissiongroup = this.state.permissiongroups[key];
                  return (
                    <div className="col-12" key={permissiongroup.id}>
                      <div className="card border-primary mb-3">
                        <div className="card-header">
                          <TextInput
                            name="group_name"
                            label=""
                            error={(this.lastUpdated
                              && this.lastUpdated === permissiongroup.id
                              && this.props.errors.group_name
                              && this.props.errors.group_name[0]) || ''}
                            onChange={event => this.handleInputChange(event, key)}
                            value={permissiongroup.group_name}
                          />
                        </div>
                        <div className="card-body">
                          {
                            permissiongroup.permissions.map((permissionId) => {
                              const permission = this.props.permissions[permissionId];
                              if (!permission) return null;
                              return (
                                <div key={permission.id}>
                                  <span className={`card-text ${permission.permission === 2 ? 'bold' : ''}`}>
                                    {permission.description}
                                  </span>
                                  <a
                                    className=""
                                    href="#remove"
                                    onClick={() => this.remove(permissiongroup.id, permission.id)}
                                  >
                                    <FaMinusCircle className="text-primary ml-3 mb-1" size={20} />
                                  </a>
                                </div>

                              );
                            })
                          }
                        </div>
                        <div className="card-footer">
                          <button
                            type="button"
                            className="btn btn-primary"
                            data-toggle="modal"
                            data-target={`#${modalId}`}
                            onClick={() => {
                              this.setState({ csPermissionGroup: permissiongroup.id });
                            }}
                          >
                            添加权限
                          </button>
                          <button
                            type="button"
                            className="btn btn-primary ml-4"
                            onClick={() => this.save(permissiongroup.id)}
                          >
                            保存
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              }
            </div>
          </div>
          <MyModal
            id={modalId}
            title={`添加权限 (${this.state.csPermissionGroup
              && this.props.permissiongroups[this.state.csPermissionGroup].group_name})`}
            body={modalBody}
            onSubmit={this.addPermission}
          />
        </div>
      );
    };
    this.state = { permissiongroups: {} };
    props.fetchPermissions();
    props.fetchPermissionGroups();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ permissiongroups: nextProps.permissiongroups });
    if (nextProps.permissions) [this.csPermission] = Object.keys(nextProps.permissions);
    if (nextProps.permissiongroups) {
      const [csPermissionGroup] = Object.keys(nextProps.permissiongroups);
      this.setState({ csPermissionGroup });
    }
  }

  render() {
    return (
      <DistinctViewPage
        title={PERMISSION_EDIT_NAME}
        mobileRender={() => this.mobileRender()}
      />
    );
  }
}

PermissionEditDumb.propTypes = {
  permissiongroups: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  fetchPermissionGroups: PropTypes.func.isRequired,
  permissions: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  fetchPermissions: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  updatePermissionGroup: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
    const permissiongroups = {},
      permissions = {};
    state.data.permissiongroups.forEach((permissionGroup) => {
      permissiongroups[permissionGroup.id] = Object.assign({}, permissionGroup);
      permissiongroups[permissionGroup.id].permissions = permissiongroups[permissionGroup.id]
        .permissions.map(permission => permission.id);
    });
    state.data.permissions.forEach((permission) => {
      permissions[permission.id] = permission;
    });
    return {
      permissiongroups,
      permissions,
      errors: state.data.updateerrors,
    };
  },
  mapDispatchToProps = dispatch => ({
    fetchPermissionGroups: () => dispatch(fetchData('permissiongroup')),
    fetchPermissions: () => dispatch(fetchData('permission')),
    updatePermissionGroup: (target, body) => {
      dispatch(updateData(target, body)).then(setTimeout(() => dispatch(fetchData('permissiongroup')), 100));
    },
  }),
  PermissionEdit = connect(mapStateToProps, mapDispatchToProps)(PermissionEditDumb);

export default PermissionEdit;
