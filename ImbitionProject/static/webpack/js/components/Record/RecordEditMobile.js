import React from 'react';
import PropTypes from 'prop-types';
import FaPlus from 'react-icons/lib/fa/plus';
import FaMinusCircle from 'react-icons/lib/fa/minus-circle';
import FaEdit from 'react-icons/lib/fa/edit';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { TextInput, MyModal, MySelect } from '../FormControl';
import { NAMES, translate } from '../../consts';

class RecordEditMobile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalPositionId: null,
      modalRecordField: null,
      searchFilter: '',
      departmentFilter: '',
      modalEdit: false,
      newRecordFieldName: '',
      newRecordFieldUnit: '',
    };
    this.modalId = 'recordedit';
    this.onDragEnd = this.onDragEnd.bind(this);
    this.draggableRecordField = this.draggableRecordField.bind(this);
  }

  onDragEnd(res) {
    if (!res.destination || res.destination.index === res.source.index) {
      return;
    }

    const recordfields = this.props.positions[res.source.droppableId].record_fields,
      [removed] = recordfields.splice(res.source.index, 1);
    recordfields.splice(res.destination.index, 0, removed);

    recordfields.forEach((recordfield, index) => {
      this.props.updateRecordField(recordfield.id, {
        position: recordfield.position,
        name: recordfield.name,
        unit: recordfield.unit,
        order: index + 1,
        disabled: recordfield.disabled,
      });
    });
  }

  draggableRecordField(recordField, positionId, index) {
    return (
      <Draggable key={recordField.id} draggableId={recordField.id} index={index}>
        {provided => (
          <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
            <a
              href="#edit"
              data-toggle="modal"
              data-target={`#${this.modalId}-1`}
              onClick={() => this.setState({
                modalRecordField: recordField,
                modalPositionId: positionId,
                modalEdit: true,
                newRecordFieldName: recordField.name,
                newRecordFieldUnit: recordField.unit || '',
              })}
            >
              <FaEdit className="text-success" size={20} />
            </a>
            <a
              href={recordField.disabled ? '#enable' : '#disable'}
              className={`nav-link d-inline mr-3 ml-1 ${recordField.disabled ? 'text-secondary' : 'text-dark'}`}
              onClick={() => {
                this.props.updateRecordField(recordField.id, {
                  position: recordField.position,
                  name: recordField.name,
                  unit: recordField.unit,
                  order: recordField.order,
                  disabled: !recordField.disabled,
                });
              }}
            >
              {recordField.name}{(recordField.unit && ` (${recordField.unit})`) || ''}
              {recordField.disabled ? ` - ${NAMES.RECORD_FIELD_DISABLED}` : ''}
            </a>
            <a
              href="#remove"
              data-toggle="modal"
              data-target={`#${this.modalId}-2`}
              onClick={() => this.setState({ modalRecordField: recordField })}
            >
              <FaMinusCircle className="text-danger mb-1" size={20} />
            </a>
          </div>
        )}
      </Draggable>
    );
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
                onChange={event => this.setState({ searchFilter: event.target.value })}
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
            <div className="row mb-1">
              {Object.keys(this.props.positions).map((positionId) => {
                const position = this.props.positions[positionId];
                if (this.state.searchFilter
                  && !position.name.toLowerCase().includes(this.state.searchFilter.toLowerCase())) return null;
                if (this.state.departmentFilter
                  && position.department !== this.state.departmentFilter) return null;
                return (
                  <div className={`card mb-3 p-0 ${this.props.cardClassName}`} key={positionId}>
                    <div className="card-header bg-dark text-light">
                      {position.name}
                    </div>
                    <DragDropContext onDragEnd={this.onDragEnd}>
                      <Droppable droppableId={`${position.id}`}>
                        {provided => (
                          <div className="card-body" ref={provided.innerRef}>
                            {position.record_fields.sort((a, b) => {
                                if (a.order < b.order) return -1;
                                if (a.order > b.order) return 1;
                                return 0;
                              }).map((recordField, index) => this.draggableRecordField(recordField, positionId, index))}
                          </div>)}
                      </Droppable>
                    </DragDropContext>
                    <div className="card-footer center-display">
                      <button
                        type="button"
                        className="btn btn-info"
                        data-toggle="modal"
                        data-target={`#${this.modalId}-1`}
                        onClick={() => this.setState({ modalPositionId: positionId, modalEdit: false })}
                      >
                        <FaPlus />{NAMES.RECORD_FIELD_ADD}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <MyModal
          id={`${this.modalId}-1`}
          title={`${(this.state.modalEdit ? NAMES.RECORD_FIELD_UPDATE
            : NAMES.RECORD_FIELD_ADD)} (${this.state.modalPositionId
            && this.props.positions[this.state.modalPositionId].name})`}
          body={
            <div className="center-display">
              <TextInput
                name="name"
                inputClassName="ml-1"
                label={NAMES.RECORD_FIELD_NAME}
                error={(!this.state.modalEdit && this.props.createerrors.recordedit
                  && this.props.createerrors.recordedit.non_field_errors
                  && translate(this.props.createerrors.recordedit.non_field_errors[0]))
                  || (this.state.modalEdit && this.props.updateerrors.recordedit
                    && this.props.updateerrors.recordedit.non_field_errors
                    && translate(this.props.updateerrors.recordedit.non_field_errors[0])) || ''}
                onChange={(event) => {
                  this.setState({ newRecordFieldName: event.target.value });
                }}
                value={this.state.newRecordFieldName}
              />
              <TextInput
                name="unit"
                inputClassName="ml-1"
                containerClassName="ml-3"
                label={NAMES.RECORD_FIELD_UNIT}
                error={(!this.state.modalEdit && this.props.createerrors.recordedit
                  && this.props.createerrors.recordedit.unit
                  && translate(this.props.createerrors.recordedit.unit[0]))
                  || (this.state.modalEdit && this.props.updateerrors.recordedit
                    && this.props.updateerrors.recordedit.unit
                    && translate(this.props.updateerrors.recordedit.unit[0])) || ''}
                onChange={(event) => {
                  this.setState({ newRecordFieldUnit: event.target.value });
                }}
                value={this.state.newRecordFieldUnit}
              />
            </div>}
          onSubmit={() => {
            const res = {
              position: this.state.modalPositionId,
              name: this.state.newRecordFieldName,
              unit: this.state.newRecordFieldUnit || null,
              order: this.state.modalEdit ? this.state.modalRecordField.order
                : this.props.positions[this.state.modalPositionId].record_fields.length + 1,
              disabled: false,
            };
            if (this.state.modalEdit) this.props.updateRecordField(this.state.modalRecordField.id, res);
            else this.props.createRecordField(res);
          }}
        />
        <MyModal
          id={`${this.modalId}-2`}
          title={`${NAMES.RECORD_FIELD_DELETE} (${this.state.modalRecordField
            && this.state.modalRecordField.name})`}
          body={
            <p>{NAMES.RECORD_FIELD_DELETE_CONFIRM(this.state.modalRecordField
              && this.state.modalRecordField.name)}
            </p>
          }
          onSubmit={() => this.props.deleteRecordField(this.state.modalRecordField.id)}
        />
      </div>
    );
  }
}

RecordEditMobile.propTypes = {
  positions: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  departments: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
  createerrors: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  updateerrors: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  createRecordField: PropTypes.func.isRequired,
  updateRecordField: PropTypes.func.isRequired,
  deleteRecordField: PropTypes.func.isRequired,
  cardClassName: PropTypes.string,
};


RecordEditMobile.defaultProps = {
  cardClassName: 'col-12',
};

export default RecordEditMobile;
