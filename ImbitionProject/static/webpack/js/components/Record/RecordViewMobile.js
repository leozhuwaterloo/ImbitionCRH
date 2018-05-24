import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import FaCloudDownload from 'react-icons/lib/fa/cloud-download';
import 'bootstrap/js/dist/dropdown';
import
{
  BootstrapTable, TableHeaderColumn, SearchField,
  SizePerPageDropDown,
}
  from 'react-bootstrap-table';
import { NAMES } from '../../consts';

class RecordViewMobile extends React.Component {
  constructor(props) {
    super(props);
    this.dateNow = moment();
    this.state = {
      startDate: this.dateNow,
      endDate: this.dateNow,
      showComment: {},
    };
    this.options = {
      noDataText: NAMES.RECORD_VIEW_NO_DATA,
      exportCSVBtn: onClick => (
        <div className="center-display">
          <button className="btn btn-light center-display p-1 pl-2 pr-2" onClick={onClick}>
            <FaCloudDownload className="mr-1" size={20} /> {NAMES.CSV_EXPORT}
          </button>
          <DatePicker
            id="startDate"
            className="form-control m-0 ml-3"
            todayButton={NAMES.TODAY}
            dateFormat="YYYY-MM-DD"
            selected={this.state.startDate}
            selectsStart
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            onChange={(date) => {
              this.setState({ startDate: date });
              this.props.fetchRecordSummary(date.format('YYYY-MM-DD'), this.state.endDate.format('YYYY-MM-DD'));
            }}
          />
          <DatePicker
            id="endDate"
            className="form-control m-0 ml-3"
            todayButton={NAMES.TODAY}
            dateFormat="YYYY-MM-DD"
            selected={this.state.endDate}
            selectsEnd
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            onChange={(date) => {
              this.setState({ endDate: date });
              this.props.fetchRecordSummary(this.state.startDate.format('YYYY-MM-DD'), date.format('YYYY-MM-DD'));
            }}
          />
          <button
            className="btn btn-light ml-4"
            onClick={() => {
              this.setState({ startDate: this.dateNow, endDate: this.dateNow });
              const dateNowString = this.dateNow.format('YYYY-MM-DD');
              this.props.fetchRecordSummary(dateNowString, dateNowString);
            }}
          >
            {NAMES.RECORE_VIEW_DATE_RESET}
          </button>
        </div>
      ),
      searchField: () => <SearchField placeholder={NAMES.SEARCH} />,
      sizePerPageDropDown: () => (
        <SizePerPageDropDown
          btnContextual="btn-light"
          variation="dropup"
        />
      ),
    };
  }

  render() {
    const tableColumns = [];
    if (this.props.recordsummary.data && this.props.recordsummary.data[0]) {
      let counter = 0;
      this.props.recordsummary.order.forEach((key) => {
        const isNotField = (key === NAMES.RECORD_VIEW_EMPLOYEE_FULL_NAME
          || key === NAMES.DATE || key === NAMES.POSITION || key === NAMES.DEPARTMENT
          || key === NAMES.PHONE);
        let rowFilter = { type: 'NumberFilter', numberComparators: ['=', '>', '<='] };
        if (isNotField || counter === 1) rowFilter = { type: 'TextFilter' };
        if (key === NAMES.PHONE) rowFilter.condition = 'eq';
        rowFilter.placeholder = NAMES.FILTER;
        if (!isNotField) {
          if (counter === 0) {
            tableColumns.push((
              <TableHeaderColumn
                key={`${key}-header`}
                row="0"
                colSpan={this.state.showComment[key] ? '2' : '1'}
                csvHeader={key}
              >
                {key}
                <div className="form-check d-inline-flex float-right">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id={`${key}-checkbox`}
                    onChange={(event) => {
                      this.state.showComment[key] = event.target.checked;
                      this.state.showComment[`${key} ${NAMES.COMMENT}`] = event.target.checked;
                      this.forceUpdate();
                    }}
                  />
                  <label className="form-check-label" htmlFor={`${key}-checkbox`}>{NAMES.COMMENT}</label>
                </div>
              </TableHeaderColumn>
            ));
            counter = 2;
          }
          counter -= 1;
        }
        tableColumns.push((
          <TableHeaderColumn
            key={key}
            dataSort
            width={(isNotField || this.state.showComment[key]) ? '150' : '300'}
            isKey={key === NAMES.RECORD_VIEW_EMPLOYEE_FULL_NAME}
            filter={rowFilter}
            row={isNotField ? '0' : '1'}
            rowSpan={isNotField ? '2' : '1'}
            hidden={!isNotField && counter === 0 && !this.state.showComment[key]}
            dataField={key}
            multiColumnSort={2}
          >
            {key}
          </TableHeaderColumn>
        ));
      });
    }

    return (
      <div className="container-fluid mt-4">
        <div className="ml-2 mr-2">
          {this.props.recordsummary.data && this.props.recordsummary.data[0] &&
            <BootstrapTable
              tableBodyClass="table table-dark"
              tableContainerClass="card"
              version="4"
              data={this.props.recordsummary.data}
              options={this.options}
              exportCSV
              csvFileName={`${NAMES.RECORD_VIEW}.csv`}
              striped
              hover
              search
              pagination
              multiColumnSearch
              keyBoardNav
            >
              {tableColumns}
            </BootstrapTable>
          }
        </div>
      </div>
    );
  }
}

RecordViewMobile.propTypes = {
  recordsummary: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  fetchRecordSummary: PropTypes.func.isRequired,
};

export default RecordViewMobile;
