import React from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { TextInput } from '../FormControl';
import { NAMES } from '../../consts';

class RecordSelfEditMobile extends React.Component {
  constructor(props) {
    super(props);
    this.state = { records: {}, date: moment(), errors: {} };

    this.handleInputChange = (event, recordFieldId) => {
      const { name, value } = event.target;
      this.state.records[recordFieldId][name] = value;
      this.forceUpdate();
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.employee && nextProps.user && nextProps.employee[nextProps.user.id]
      && nextProps.employee[nextProps.user.id].records) {
      const records = {};
      nextProps.employee[nextProps.user.id].records.forEach((record) => {
        records[record.field] = record;
      });
      this.setState({
        records,
      });
    }

    if (nextProps.updateerrors) {
      this.setState({ errors: Object.assign({}, this.state.errors, nextProps.updateerrors) });
    }
  }

  render() {
    const { records, errors } = this.state,
      { user, recordfields, colSize } = this.props;
    if (!user || !user.position) return null;
    if (!recordfields || Object.keys(recordfields).length === 0) return null;
    return (
      <div className={`container mt-5 shadow mb-5 bg-white rounded pt-5 pb-5 col-${colSize}`}>
        <div className="ml-3 mr-3">
          <div className="form-group center-display">
            <label htmlFor="#date" className="m-0 mr-3">{NAMES.DATE}</label>
            <DatePicker
              id="date"
              className="form-control m-0"
              todayButton={NAMES.TODAY}
              dateFormat="YYYY-MM-DD"
              selected={this.state.date}
              onChange={(date) => {
                this.setState({ date });
                this.props.fetchEmployeeRecord(user, recordfields, date.format('YYYY-MM-DD'));
              }}
            />
          </div>
          {user.position.record_fields.filter(recordFieldId => !recordfields[recordFieldId].disabled)
          .sort((a, b) => {
            if (!recordfields[a]) return 0;
            if (!recordfields[b]) return 0;
            if (recordfields[a].order < recordfields[b].order) return -1;
            if (recordfields[a].order > recordfields[b].order) return 1;
            return 0;
          }).map((recordFieldId => (
            <div key={recordFieldId} className="center-display">
              <TextInput
                name="value"
                label={recordfields[recordFieldId]
                  && (recordfields[recordFieldId].unit ?
                  `${recordfields[recordFieldId].name} (${recordfields[recordFieldId].unit})`
                  : recordfields[recordFieldId].name)}
                containerClassName="mb-2"
                labelClassName="w-1"
                error={records && records[recordFieldId] && records[recordFieldId].id
                  && errors[records[recordFieldId].id] && errors[records[recordFieldId].id].value}
                placeholder={NAMES.RECORD_SELF_VALUE}
                onChange={event => this.handleInputChange(event, recordFieldId)}
                value={(records && records[recordFieldId] && records[recordFieldId].value) || ''}
              />
              <TextInput
                name="comment"
                containerClassName="mb-2"
                labelClassName="w-1"
                error={records && records[recordFieldId] && records[recordFieldId].id
                  && errors[records[recordFieldId].id] && errors[records[recordFieldId].id].comment}
                placeholder={NAMES.RECORD_SELF_COMMENT}
                onChange={event => this.handleInputChange(event, recordFieldId)}
                value={(records && records[recordFieldId] && records[recordFieldId].comment) || ''}
              />
            </div>
          )))}
          <div className="center-display mt-2">
            <button
              type="button"
              className="btn btn-info"
              onClick={() => {
                this.setState({ errors: {} });
                this.props.updateRecords(records);
              }}
            >
              {NAMES.RECORD_SELF_SAVE}
            </button>
          </div>
        </div>
      </div>
    );
  }
}


RecordSelfEditMobile.propTypes = {
  user: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  recordfields: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  employee: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  updateerrors: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  fetchEmployeeRecord: PropTypes.func.isRequired,
  updateRecords: PropTypes.func.isRequired,
  colSize: PropTypes.number,
};

RecordSelfEditMobile.defaultProps = {
  colSize: 11,
};

export default RecordSelfEditMobile;
