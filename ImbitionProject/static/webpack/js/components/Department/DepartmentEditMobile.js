import React from 'react';
import PropTypes from 'prop-types';
import FaPlus from 'react-icons/lib/fa/plus';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { translate, NAMES } from '../../consts';
import { MyModal, TextInput } from '../FormControl';

class DepartmentEditMobile extends React.Component {
  constructor(props) {
    super(props);
    this.modalId = 'departmentModal';

    this.state = { modalDepartmentId: null, department: {} };
    // modalDepartmentId is in state because it is used for a label in modal
    this.newDepartmentName = '';
    this.onDragEnd = this.onDragEnd.bind(this);
    this.renderDepartment = this.renderDepartment.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    // default modal permission selected to first permission
    if (Object.keys(nextProps.department).length !== 0 && nextProps.positions.length !== 0) {
      this.setState({
        department: Object.assign({}, nextProps.department, {
          '-1': {
            id: -1,
            name: '尚未分布部门',
            positions: Object.keys(nextProps.positions).filter(positionId => (
              nextProps.positions[positionId].department === null
            )),
          },
        }),
      });
    }
  }

  onDragEnd(res) {
    if (!res.destination) {
      return;
    }
    // it is already a copy, won't mutate state
    const [removed] = this.state.department[res.source.droppableId].positions.splice(res.source.index, 1);
    this.state.department[res.destination.droppableId].positions.splice(res.destination.index, 0, removed);
    this.forceUpdate();
  }


  renderDepartment(departmentId) {
    const department = this.state.department[departmentId],
      headerClassName = departmentId === -1 ? 'bg-info text-light' : 'bg-dark text-light';
    if (!department) return null;
    return (
      <Droppable droppableId={`${department.id}`} key={department.id}>
        {provided => (
          <div className={`card mb-3 p-0 ${this.props.cardClassName}`} ref={provided.innerRef}>
            <div className={`card-header center-display ${headerClassName}`}>
              {department.name}
            </div>
            <div className="card-body">
              {department.positions.map((positionId, index) => (
                <Draggable key={positionId} draggableId={positionId} index={index}>
                  {prov => (
                    <div
                      ref={prov.innerRef}
                      {...prov.draggableProps}
                      {...prov.dragHandleProps}
                    >
                      {this.props.positions[positionId] && this.props.positions[positionId].name}
                    </div>
                  )}
                </Draggable>
              ))}
            </div>
            { departmentId === -1 ? null :
            <div className="card-footer center-display">
              <button
                type="button"
                className="btn btn-info"
                data-toggle="modal"
                data-target={`#${this.modalId}-2`}
                onClick={() => {
                  this.setState({ modalDepartmentId: department.id });
                }}
              >
                {NAMES.DEPARTMENT_DELETE}
              </button>
            </div>
            }
          </div>
        )}
      </Droppable>
    );
  }

  render() {
    return (
      <div>
        <div className="container-fluid mt-4">
          <div className="ml-4 mr-4">
            <div className="row mb-1">
              <DragDropContext onDragEnd={this.onDragEnd}>
                {this.props.departments.map(department => this.renderDepartment(department.id))}
                {this.renderDepartment(-1)}
              </DragDropContext>
            </div>
            <div className="row center-display">
              <button
                type="button"
                className="btn btn-info mr-3"
                onClick={() => {
                  Object.keys(this.state.department).forEach((departmentId, index) => {
                    if (departmentId === '-1') return;
                    let callback = null;
                    if (index === Object.keys(this.state.department).length - 2) {
                      callback = () => this.props.fetchPositions();
                    }
                    this.props.updateDepartment(departmentId, this.state.department[departmentId], callback);
                  });
                }}
              >
                {NAMES.DEPARTMENT_SAVE_ALL}
              </button>
              <button
                type="button"
                className="btn btn-info"
                data-toggle="modal"
                data-target={`#${this.modalId}-1`}
              >
                <FaPlus />{NAMES.DEPARTMENT_ADD}
              </button>
            </div>
          </div>
        </div>
        <MyModal
          id={`${this.modalId}-1`}
          title={NAMES.DEPARTMENT_ADD}
          body={
            <TextInput
              name="name"
              label=""
              error={(this.props.createerrors
                && this.props.createerrors.departmentedit
                && this.props.createerrors.departmentedit.name
                && translate(this.props.createerrors.departmentedit.name[0])) || ''}
              onChange={(event) => {
                this.newDepartmentName = event.target.value;
              }}
            />
          }
          onSubmit={() => this.props.createDepartment(this.newDepartmentName)}
        />
        <MyModal
          id={`${this.modalId}-2`}
          title={`${NAMES.DEPARTMENT_DELETE} (${this.state.modalDepartmentId
            && this.props.department[this.state.modalDepartmentId].name})`}
          body={
            <p>{NAMES.DEPARTMENT_DELETE_CONFIRM(this.state.modalDepartmentId
            && this.props.department[this.state.modalDepartmentId].name)}
            </p>
          }
          onSubmit={() => this.props.deleteDepartment(this.state.modalDepartmentId)}
        />
      </div>
    );
  }
}


DepartmentEditMobile.propTypes = {
  positions: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  departments: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
  department: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  createerrors: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  createDepartment: PropTypes.func.isRequired,
  deleteDepartment: PropTypes.func.isRequired,
  updateDepartment: PropTypes.func.isRequired,
  fetchPositions: PropTypes.func.isRequired,
  cardClassName: PropTypes.string,
};

DepartmentEditMobile.defaultProps = {
  cardClassName: 'col-6',
};

export default DepartmentEditMobile;
