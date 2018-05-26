import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FaMinusCircle from 'react-icons/lib/fa/minus-circle';
import { TextInput, MyModal } from './FormControl';
import DistinctViewPage from './DistinctViewPage';
import { PERMISSION_EDIT_NAME } from '../consts';
import { fetchData, updateData, createData, deleteData } from '../actions';


class PermissionEditDumb extends React.Component {
  constructor(props) {
    super(props);
    const modalId = 'permissionModal';
    // state position is changed and used to render changes, when save, changed for pushed
    this.state = { positions: {}, modalPositionId: null };
    // modalPositionId and modalPermissionId for adding permission from modal
    // modalPositionId is in state because it is used for a label in modal
    this.modalPermissionId = null;
    // For new position name
    this.newPositionName = '';

    // all position name inpiut field
    this.handleInputChange = (event, positionId) => {
      const { name, value } = event.target;
      this.state.positions[positionId][name] = value;
      this.forceUpdate();
    };

    this.addPosition = (name) => {
      this.props.createPosition({
        name,
        parent: null,
        department: null,
        permission: [],
      });
    };

    // deletePosition can be called directly from props

    this.lastUpdated = null; // used to display error to the correct card
    this.pushUpdate = (positionId) => {
      this.props.updatePositionPermission(`position/${positionId}`, this.state.positions[positionId]);
      this.lastUpdated = positionId;
    };

    this.addPermission = (positionId, permissionId) => {
      this.state.positions[positionId].permissions.push(permissionId);
      this.forceUpdate();
    };

    this.removePermission = (positionId, permissionId) => {
      const body = this.state.positions[positionId],
        index = body.permissions.indexOf(permissionId);
      if (index > -1) {
        body.permissions.splice(index, 1);
        this.forceUpdate();
      }
    };

    this.mobileRender = () => {
      const modalBody = (
        <div>
          <select
            className="custom-select"
            onChange={(event) => {
              this.modalPermissionId = event.target.value; // set modal's permission selected
            }}
          >
            {
              Object.keys(this.props.permissions).map((permissionId) => {
                const permission = this.props.permissions[permissionId];
                return (
                  <option value={permissionId} key={permissionId}>{permission.description}</option>
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
                Object.keys(this.state.positions).map((positionId) => {
                  const position = this.state.positions[positionId];
                  return (
                    <div className="col-12" key={positionId}>
                      <div className="card border-primary mb-3">
                        <div className="card-header center-display">
                          <TextInput
                            labelClassName="mr-1"
                            containerClassName="mb-2"
                            name="name"
                            label="岗位"
                            error={(this.lastUpdated
                              && this.lastUpdated === positionId
                              && this.props.errors.name
                              && this.props.errors.name[0]) || ''}
                            onChange={event => this.handleInputChange(event, positionId)}
                            value={position.name}
                          />
                          <label htmlFor={`select-${positionId}`} className="ml-3">上阶岗位</label>
                          <select
                            id={`select-${positionId}`}
                            className="custom-select col-3 ml-1 mb-2"
                            value={position.parent || ''}
                            onChange={(event) => {
                              position.parent = event.target.value; // temporarily set parent
                              this.forceUpdate();
                            }}
                          >
                            <option value="" />
                            {
                              Object.keys(this.state.positions).map(posId => (
                                <option value={posId} key={posId}>
                                  {this.state.positions[posId].name}
                                </option>
                              ))
                            }
                          </select>
                        </div>
                        <div className="card-body">
                          {
                            position.permissions.map((permissionId) => {
                              const permission = this.props.permissions[permissionId];
                              if (!permission) return null; // if permissions not received yet
                              return (
                                <div key={permissionId}>
                                  <span className="card-text">{permission.description}</span>
                                  <a
                                    className=""
                                    href="#remove"
                                    onClick={() => this.removePermission(positionId, permissionId)}
                                  >
                                    <FaMinusCircle className="text-primary ml-3 mb-1" size={20} />
                                  </a>
                                </div>

                              );
                            })
                          }
                        </div>
                        <div className="card-footer d-flex">
                          <button
                            type="button"
                            className="btn btn-primary"
                            data-toggle="modal"
                            data-target={`#${modalId}-1`}
                            onClick={() => {
                              this.setState({ modalPositionId: positionId });
                            }}
                          >
                            添加权限
                          </button>
                          <button
                            type="button"
                            className="btn btn-primary ml-4"
                            onClick={() => this.pushUpdate(positionId)}
                          >
                            保存
                          </button>
                          <button
                            type="button"
                            className="btn btn-primary ml-auto"
                            data-toggle="modal"
                            data-target={`#${modalId}-3`}
                            onClick={() => {
                              this.setState({ modalPositionId: positionId });
                            }}
                          >
                            删除岗位
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              }
            </div>
            <div className="row center-display">
              <button
                type="button"
                className="btn btn-primary"
                data-toggle="modal"
                data-target={`#${modalId}-2`}
              >
                {NAMES.POSITION_ADD}
              </button>
            </div>
          </div>
          <MyModal
            id={`${modalId}-1`}
            title={`${NAMES.PERMISSION_ADD} (${this.state.modalPositionId
              && this.props.positions[this.state.modalPositionId].name})`}
            body={modalBody}
            onSubmit={() => this.addPermission(this.state.modalPositionId, this.modalPermissionId)}
          />
          <MyModal
            id={`${modalId}-2`}
            title="添加岗位"
            body={
              <TextInput
                name="name"
                label=""
                error={(this.props.createerrors.name
                  && this.props.createerrors.name[0]) || ''}
                onChange={(event) => {
                  this.newPositionName = event.target.value;
                }}
              />
            }
            onSubmit={() => this.addPosition(this.newPositionName)}
          />
          <MyModal
            id={`${modalId}-3`}
            title={`删除岗位 (${this.state.modalPositionId
              && this.props.positions[this.state.modalPositionId].name})`}
            body={
              <p>{`你确定要删除(${this.state.modalPositionId
              && this.props.positions[this.state.modalPositionId].name})这个岗位么?`}
              </p>
            }
            onSubmit={() => this.props.deletePosition(this.state.modalPositionId)}
          />
        </div>
      );
    };
    props.fetchPermissions();
    props.fetchPositions();
  }

  componentWillReceiveProps(nextProps) {
    // default modal permission selected to first permission
    if (nextProps.permissions) [this.modalPermissionId] = Object.keys(nextProps.permissions);
    if (nextProps.positions) {
      const [firstPositionId] = Object.keys(nextProps.positions);
      this.setState({
        positions: nextProps.positions,
        modalPositionId: firstPositionId,
      });
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
