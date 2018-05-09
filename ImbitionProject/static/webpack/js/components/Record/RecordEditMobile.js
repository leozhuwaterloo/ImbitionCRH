import React from 'react';
import PropTypes from 'prop-types';
import FaPlus from 'react-icons/lib/fa/plus';
import FaMinusCircle from 'react-icons/lib/fa/minus-circle';
import FaEdit from 'react-icons/lib/fa/edit';
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
                    <div className="card-body">
                      {position.record_fields.map(recordField => (
                        <div key={recordField.id}>
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
                          <span className="mr-3 ml-1">
                            {recordField.name}{(recordField.unit && ` (${recordField.unit})`) || ''}
                          </span>
                          <a
                            href="#remove"
                            data-toggle="modal"
                            data-target={`#${this.modalId}-2`}
                            onClick={() => this.setState({ modalRecordField: recordField })}
                          >
                            <FaMinusCircle className="text-danger mb-1" size={20} />
                          </a>
                        </div>
                      ))}
                    </div>
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
