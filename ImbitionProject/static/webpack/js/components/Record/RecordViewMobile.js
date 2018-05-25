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
import { DirectUpdateText } from '../FormControl';
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

    this.sum = {};
    this.sumTexts = {};
    this.previousTarget = null;
    this.tableChanged = this.tableChanged.bind(this);

    this.options = {
      afterColumnFilter: this.tableChanged,
      afterSearch: this.tableChanged,
      searchDelayTime: 500,
      defaultSearch: this.props.initFilterProfile.searchText,
      noDataText: NAMES.RECORD_VIEW_NO_DATA,
      exportCSVBtn: onClick => (
        <div className="center-display">
          <button
            className="btn btn-light center-display p-1 pl-2 pr-2"
            onClick={() => {
              const newRow = {};
              Object.keys(this.sum).forEach((key) => {
                newRow[key] = this.sum[key];
              });
              newRow[NAMES.RECORD_VIEW_EMPLOYEE_FULL_NAME] = NAMES.SUM;

              if (this.table.store.data[0]) {
                Object.keys(this.table.store.data[0]).forEach((key) => {
                  if (!(key in newRow)) newRow[key] = '';
                });
              }

              if (this.table.store.isOnFilter) {
                this.table.store.filteredData.push(newRow);
                onClick();
                this.table.store.filteredData.pop();
              } else {
                this.table.store.data.push(newRow);
                onClick();
                this.table.store.data.pop();
              }
            }}
          >
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
      searchField: rest => <SearchField placeholder={NAMES.SEARCH} defaultValue={rest.defaultValue} />,
      sizePerPageDropDown: () => (
        <SizePerPageDropDown
          btnContextual="btn-light"
          variation="dropup"
        />
      ),
    };
  }

  tableChanged(target) {
    if (this.table && target !== null) {
      const data = this.table.getTableDataIgnorePaging(),
        sum = {};
      if (data[0]) {
        Object.keys(data[0]).filter(key => (key !== NAMES.RECORD_VIEW_EMPLOYEE_FULL_NAME
            && key !== NAMES.DATE && key !== NAMES.POSITION && key !== NAMES.DEPARTMENT
            && key !== NAMES.PHONE && !key.includes(NAMES.COMMENT)))
          .forEach((key) => {
            sum[key] = data.map(row => row[key]).reduce((acc, val) => acc + val);
          });
      }

      this.sum = sum;
      Object.keys(this.sumTexts).forEach((key) => {
        this.sumTexts[key].updateText(this.sum[key]);
      });
    }
  }

  render() {
    const tableColumns = [];
    if (this.props.recordsummary.data && this.props.recordsummary.data[0]) {
      let counter = 0;
      this.props.recordsummary.order.forEach((key) => {
        const isNotField = (key === NAMES.RECORD_VIEW_EMPLOYEE_FULL_NAME
          || key === NAMES.DATE || key === NAMES.POSITION || key === NAMES.DEPARTMENT
          || key === NAMES.PHONE);
        let rowFilter = null;
        if (isNotField || counter === 1) {
          rowFilter = {
            type: 'TextFilter',
            defaultValue: (this.props.initFilterProfile.filterObj
              && this.props.initFilterProfile.filterObj[key]
              && this.initFilterProfile.filterObj[key].value) || null,
          };
        } else {
          rowFilter = {
            type: 'NumberFilter',
            numberComparators: ['=', '>', '<='],
            defaultValue: (this.props.initFilterProfile.filterObj
              && this.props.initFilterProfile.filterObj[key]
              && this.initFilterProfile.filterObj[key].value) || { number: null },
          };
        }
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
                <div className="bg-warning rounded center-display p-1">
                  {NAMES.SUM}:&nbsp;
                  <DirectUpdateText
                    ref={(ref) => {
                      this.sumTexts[key] = ref;
                    }}
                  />
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
              ref={(table) => {
                this.table = table;
                this.tableChanged('');
              }}
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
          <div className="row center-display">
            <button
              className="btn btn-info"
              onClick={() => {
                if (this.table && this.table.store && this.table.store.isOnFilter) {
                  const filterProfile = {
                      searchText: this.table.store.searchText,
                      user: this.props.user.id,
                    },
                    filterObj = {};

                  Object.keys(this.table.store.filterObj).forEach((key) => {
                    filterObj[key] = {
                      value: this.table.store.filterObj[key].value,
                    };
                  });

                  filterProfile.filterObj = JSON.stringify(filterObj);
                  this.props.createFilterProfile(filterProfile);
                } else {
                  this.props.notifyError(NAMES.NO_FILTER_PROFILE_TO_SAVE);
                }
              }}
            >
              {NAMES.SAVE_FILTER_PROFILE}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

RecordViewMobile.propTypes = {
  user: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  recordsummary: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  fetchRecordSummary: PropTypes.func.isRequired,
  notifyError: PropTypes.func.isRequired,
  createFilterProfile: PropTypes.func.isRequired,
  initFilterProfile: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default RecordViewMobile;
