import React from 'react';
import PropTypes from 'prop-types';
import FaMinusCircle from 'react-icons/lib/fa/minus-circle';
import FaPlus from 'react-icons/lib/fa/plus';
import { TextInput, MyModal, MySelect } from '../FormControl';
import { NAMES, translate } from '../../consts';

class PermissionEditMobile extends React.Component {
  constructor(props) {
    super(props);
    this.modalId = 'permissionModal';
    // state position is changed and used to render changes, when save, changed for pushed
    this.state = {
      positions: {}, modalPositionId: null, searchFilter: '', departmentFilter: '',
    };
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

    this.pushUpdate = (positionId) => {
      this.props.updatePositionPermission(positionId, this.state.positions[positionId]);
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
  }

  componentWillReceiveProps(nextProps) {
    // default modal permission selected to first permission
    if (Object.keys(nextProps.permissions).length !== 0) {
      [this.modalPermissionId] = Object.keys(nextProps.permissions);
    }
    if (Object.keys(nextProps.positions).length !== 0) {
      this.setState({
        positions: nextProps.positions,
      });
    }
  }

  render() {
    return (
      <div>
        <div className="container-fluid mt-4">
          <div className="ml-4 mr-4">
            <div className="row mb-3">
              <input
                className="form-control col-6"
                type="search"
                placeholder={NAMES.POSITION_SEARCH}
                aria-label="Search"
                onChange={(event) => {
                  this.setState({ searchFilter: event.target.value });
                }}
                value={this.state.searchFilter}
              />
              <MySelect
                displayField="name"
                canBeNull
                className="col-6"
                list={this.props.departments}
                onChange={event => this.setState({ departmentFilter: parseInt(event.target.value, 10) })}
                value={this.state.departmentFilter}
              />
            </div>
            <div className="row">
              {Object.keys(this.state.positions).map((positionId) => {
                  const position = this.state.positions[positionId];
                  if (this.state.searchFilter
                    && !position.name.toLowerCase().includes(this.state.searchFilter.toLowerCase())) return null;
                  if (this.state.departmentFilter
                    && position.department !== this.state.departmentFilter) return null;
                  return (
                    <div className={`card mb-3 p-0 ${this.props.cardClassName}`} key={positionId}>
                      <div className="card-header center-display bg-dark text-light pb-1 pl-1 pr-1">
                        <TextInput
                          labelClassName="mr-1"
                          containerClassName="mb-2 col-5"
                          name="name"
                          label={NAMES.POSITION}
                          error={(this.props.errors[positionId]
                            && this.props.errors[positionId].name
                            && translate(this.props.errors[positionId].name[0])) || ''}
                          onChange={event => this.handleInputChange(event, positionId)}
                          value={position.name}
                        />
                        <label htmlFor={`select-${positionId}`} className="ml-1">{NAMES.POSITION_PARENT}</label>
                        <MySelect
                          id={`select-${positionId}`}
                          canBeNull
                          className="col-4 ml-1 mb-2"
                          value={position.parent || ''}
                          onChange={(event) => {
                            position.parent = event.target.value; // temporarily set parent
                            this.forceUpdate();
                          }}
                          dict={this.state.positions}
                          displayField="name"
                        />
                      </div>
                      <div className="card-body">
                        {position.permissions.map((permissionId) => {
                            const permission = this.props.permissions[permissionId];
                            if (!permission) return null; // if permissions not received yet
                            return (
                              <div key={permissionId}>
                                <span className="card-text">{permission.description}</span>
                                <a
                                  href="#remove"
                                  onClick={() => this.removePermission(positionId, permissionId)}
                                >
                                  <FaMinusCircle className="text-danger ml-3 mb-1" size={20} />
                                </a>
                              </div>

                            );
                          })}
                      </div>
                      <div className="card-footer d-flex bg-light">
                        <button
                          type="button"
                          className="btn btn-info"
                          data-toggle="modal"
                          data-target={`#${this.modalId}-1`}
                          onClick={() => {
                            this.setState({ modalPositionId: positionId });
                          }}
                        >
                          <FaPlus className="mb-1" />{NAMES.PERMISSION_ADD}
                        </button>
                        <button
                          type="button"
                          className="btn btn-info ml-4"
                          onClick={() => this.pushUpdate(positionId)}
                        >
                          {NAMES.PERMISSION_SAVE}
                        </button>
                        <button
                          type="button"
                          className="btn btn-info ml-auto"
                          data-toggle="modal"
                          data-target={`#${this.modalId}-3`}
                          onClick={() => {
                            this.setState({ modalPositionId: positionId });
                          }}
                        >
                          {NAMES.POSITION_DELETE}
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
            <div className="row center-display">
              <button
                type="button"
                className="btn btn-info"
                data-toggle="modal"
                data-target={`#${this.modalId}-2`}
              >
                <FaPlus />{NAMES.POSITION_ADD}
              </button>
            </div>
          </div>
        </div>
        <MyModal
          id={`${this.modalId}-1`}
          title={`${NAMES.PERMISSION_ADD} (${this.state.modalPositionId
            && this.props.positions[this.state.modalPositionId]
            && this.props.positions[this.state.modalPositionId].name})`}
          body={
            <MySelect
              onChange={(event) => {
                this.modalPermissionId = event.target.value; // set modal's permission selected
              }}
              dict={this.props.permissions}
              displayField="description"
            />
          }
          onSubmit={() => this.addPermission(this.state.modalPositionId, this.modalPermissionId)}
        />
        <MyModal
          id={`${this.modalId}-2`}
          title={NAMES.POSITION_ADD}
          body={
            <TextInput
              name="name"
              label=""
              error={(this.props.createerrors.permissionedit
                && this.props.createerrors.permissionedit.name
                && translate(this.props.createerrors.permissionedit.name[0])) || ''}
              onChange={(event) => {
                this.newPositionName = event.target.value;
              }}
            />
          }
          onSubmit={() => this.addPosition(this.newPositionName)}
        />
        <MyModal
          id={`${this.modalId}-3`}
          title={`${NAMES.POSITION_DELETE} (${this.state.modalPositionId
            && this.props.positions[this.state.modalPositionId]
            && this.props.positions[this.state.modalPositionId].name})`}
          body={
            <p>{NAMES.POSITION_DELETE_CONFIRM(this.state.modalPositionId
            && this.props.positions[this.state.modalPositionId]
            && this.props.positions[this.state.modalPositionId].name)}
            </p>
          }
          onSubmit={() => this.props.deletePosition(this.state.modalPositionId)}
        />
      </div>
    );
  }
}

PermissionEditMobile.propTypes = {
  positions: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  permissions: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  departments: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
  errors: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  createerrors: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  updatePositionPermission: PropTypes.func.isRequired,
  createPosition: PropTypes.func.isRequired,
  deletePosition: PropTypes.func.isRequired,
  cardClassName: PropTypes.string,
};

PermissionEditMobile.defaultProps = {
  cardClassName: 'col-12',
};

export default PermissionEditMobile;
