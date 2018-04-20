import React from 'react';
import PropTypes from 'prop-types';
import FaMinusCircle from 'react-icons/lib/fa/minus-circle';
import FaPlus from 'react-icons/lib/fa/plus';
import { TextInput, MyModal } from '../FormControl';
import { NAMES, translate } from '../../consts';

class PermissionEditMobile extends React.Component {
  constructor(props) {
    super(props);
    this.modalId = 'permissionModal';
    // state position is changed and used to render changes, when save, changed for pushed
    this.state = { positions: {}, modalPositionId: null, searchFilter: '' };
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
          <div className="center-display">
            <input
              className="form-control mr-2"
              type="search"
              placeholder={NAMES.POSITION_SEARCH}
              aria-label="Search"
              onChange={(event) => {
                this.setState({ searchFilter: event.target.value });
              }}
              value={this.state.searchFilter}
            />
          </div>
          <div className="row mt-3">
            {
              Object.keys(this.state.positions).map((positionId) => {
                const position = this.state.positions[positionId];
                if (this.state.searchFilter
                  && !position.name.toLowerCase().includes(this.state.searchFilter.toLowerCase())) return null;
                return (
                  <div className={this.props.cardClassName} key={positionId}>
                    <div className="card mb-3">
                      <div className="card-header center-display bg-dark text-light pb-1 pl-1 pr-1">
                        <TextInput
                          labelClassName="mr-1"
                          containerClassName="mb-2 col-5"
                          name="name"
                          label={NAMES.POSITION}
                          error={(this.lastUpdated
                            && this.lastUpdated === positionId
                            && this.props.errors.name
                            && translate(this.props.errors.name[0])) || ''}
                          onChange={event => this.handleInputChange(event, positionId)}
                          value={position.name}
                        />
                        <label htmlFor={`select-${positionId}`} className="ml-1">{NAMES.POSITION_PARENT}</label>
                        <select
                          id={`select-${positionId}`}
                          className="custom-select col-4 ml-1 mb-2"
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
                                  href="#remove"
                                  onClick={() => this.removePermission(positionId, permissionId)}
                                >
                                  <FaMinusCircle className="text-danger ml-3 mb-1" size={20} />
                                </a>
                              </div>

                            );
                          })
                        }
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
                  </div>
                );
              })
            }
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
        <MyModal
          id={`${this.modalId}-1`}
          title={`${NAMES.PERMISSION_ADD} (${this.state.modalPositionId
            && this.props.positions[this.state.modalPositionId].name})`}
          body={modalBody}
          onSubmit={() => this.addPermission(this.state.modalPositionId, this.modalPermissionId)}
        />
        <MyModal
          id={`${this.modalId}-2`}
          title={NAMES.POSITION_ADD}
          body={
            <TextInput
              name="name"
              label=""
              error={(this.props.createerrors.name
                && translate(this.props.createerrors.name[0])) || ''}
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
            && this.props.positions[this.state.modalPositionId].name})`}
          body={
            <p>{NAMES.POSITION_DELETE_CONFIRM(this.state.modalPositionId
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
