import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import FaEye from 'react-icons/lib/fa/eye';
import FaEyeSlash from 'react-icons/lib/fa/eye-slash';
import FaCloudDownload from 'react-icons/lib/fa/cloud-download';
import 'bootstrap/js/dist/dropdown';
import
{
  BootstrapTable, TableHeaderColumn, SearchField,
  SizePerPageDropDown,
}
  from 'react-bootstrap-table';
import { DirectUpdateText, MyModal, TextInput } from '../FormControl';
import { NAMES } from '../../consts';


const NON_FIELDS = [
  NAMES.RECORD_VIEW_EMPLOYEE_FULL_NAME,
  NAMES.DATE,
  NAMES.POSITION,
  NAMES.DEPARTMENT,
  NAMES.PHONE,
];

class RecordViewMobile extends React.Component {
  constructor(props) {
    super(props);
    this.dateNow = moment();
    this.modalId = 'recordview';
    this.newFilterProfileName = '';
    this.state = {
      startDate: this.dateNow,
      endDate: this.dateNow,
      showComment: this.props.initFilterProfile.showComment || {},
      columnHidden: this.props.initFilterProfile.columnHidden || {},
    };

    this.columns = {};
    this.sum = {};
    this.sumTexts = {};
    this.previousTarget = null;
    this.getRowFilter = this.getRowFilter.bind(this);
    this.tableChanged = this.tableChanged.bind(this);
    this.onHideColumnClick = this.onHideColumnClick.bind(this);


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
              this.props.fetchRecordSummary({
                start_date: date.format('YYYY-MM-DD'),
                end_date: this.state.endDate.format('YYYY-MM-DD'),
              });
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
              this.props.fetchRecordSummary({
                start_date: this.state.startDate.format('YYYY-MM-DD'),
                end_date: date.format('YYYY-MM-DD'),
              });
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
          <button
            className="btn btn-light ml-3"
            data-toggle="modal"
            data-target={`#${this.modalId}-2`}
          >
            {NAMES.COLUMN_HIDDEN}
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

  onHideColumnClick(key, event) {
    event.preventDefault();
    event.stopPropagation();
    this.state.columnHidden[key] = true;
    if (NON_FIELDS.indexOf(key) === -1) delete this.state.showComment[`${key} ${NAMES.COMMENT}`];
    this.forceUpdate();
  }

  onShowColumnClick(key) {
    delete this.state.columnHidden[key];
    this.forceUpdate();
  }

  getRowFilter(key, isNotField, counter) {
    let rowFilter = null;
    if (key === NAMES.DEPARTMENT) {
      const options = {};
      this.props.departments.forEach((department) => {
        options[department.name] = department.name;
      });
      rowFilter = {
        type: 'SelectFilter',
        options,
        defaultValue: (this.props.initFilterProfile.filterObj
          && this.props.initFilterProfile.filterObj[key]
          && this.props.initFilterProfile.filterObj[key].value) || null,
      };
    } else if (key === NAMES.POSITION) {
      const options = {};
      this.props.positions.forEach((position) => {
        options[position.name] = position.name;
      });
      rowFilter = {
        type: 'SelectFilter',
        options,
        defaultValue: (this.props.initFilterProfile.filterObj
          && this.props.initFilterProfile.filterObj[key]
          && this.props.initFilterProfile.filterObj[key].value) || null,
      };
    } else if (isNotField || counter === 1) {
      rowFilter = {
        type: 'TextFilter',
        defaultValue: (this.props.initFilterProfile.filterObj
          && this.props.initFilterProfile.filterObj[key]
          && this.props.initFilterProfile.filterObj[key].value) || null,
      };
    } else {
      rowFilter = {
        type: 'NumberFilter',
        numberComparators: ['=', '>', '<='],
        defaultValue: (this.props.initFilterProfile.filterObj
          && this.props.initFilterProfile.filterObj[key]
          && this.props.initFilterProfile.filterObj[key].value
          && Object.assign({}, this.props.initFilterProfile.filterObj[key].value, {
            number: parseInt(this.props.initFilterProfile.filterObj[key].value.number, 10),
          })) || { number: null },
      };
    }

    if (key === NAMES.PHONE) rowFilter.condition = 'eq';
    rowFilter.placeholder = NAMES.FILTER + key;
    return rowFilter;
  }

  tableChanged(target) {
    if (this.table && target !== null) {
      const data = this.table.getTableDataIgnorePaging(),
        sum = {};
      if (data[0]) {
        Object.keys(data[0]).filter(key => (NON_FIELDS.indexOf(key) === -1 && !key.includes(NAMES.COMMENT)))
          .forEach((key) => {
            sum[key] = data.map(row => row[key]).reduce((acc, val) => acc + val);
          });
      }

      this.sum = sum;
      Object.keys(this.sumTexts).forEach((key) => {
        if (this.sumTexts[key]) this.sumTexts[key].updateText(this.sum[key]);
      });
    }
  }

  render() {
    const tableColumns = [];
    if (this.props.recordsummary.order
      && this.props.recordsummary.order.indexOf(NAMES.RECORD_VIEW_EMPLOYEE_FULL_NAME) !== -1
      && this.props.departments.length !== 0 && this.props.positions.length !== 0) {
      let counter = 0;
      this.props.recordsummary.order.forEach((key) => {
        const isNotField = NON_FIELDS.indexOf(key) !== -1;
        if (!isNotField) {
          if (counter === 0) {
            tableColumns.push((
              <TableHeaderColumn
                key={`${key}-header`}
                row="0"
                colSpan={this.state.showComment[`${key} ${NAMES.COMMENT}`] ? '2' : '1'}
                csvHeader={key}
                hidden={this.state.columnHidden[key]}
              >
                {key}
                <a
                  onClick={event => this.onHideColumnClick(key, event)}
                  href={`#${key}-Hide`}
                >
                  <FaEye size={20} className="text-secondary ml-1" />
                </a>
                <div className="form-check d-inline-flex float-right">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id={`${key}-checkbox`}
                    onChange={(event) => {
                      if (event.target.checked) {
                        this.state.showComment[`${key} ${NAMES.COMMENT}`] = event.target.checked;
                      } else {
                        delete this.state.showComment[`${key} ${NAMES.COMMENT}`];
                      }
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
            ref={(ref) => {
              this.columns[key] = ref;
            }}
            key={key}
            dataSort
            width={(isNotField || this.state.showComment[key]
              || this.state.showComment[`${key} ${NAMES.COMMENT}`]) ? '150' : '300'}
            isKey={key === NAMES.RECORD_VIEW_EMPLOYEE_FULL_NAME}
            filter={this.getRowFilter(key, isNotField, counter)}
            row={isNotField ? '0' : '1'}
            rowSpan={isNotField ? '2' : '1'}
            hidden={this.state.columnHidden[key]
              || (!isNotField && counter === 0 && !this.state.showComment[key])}
            dataField={key}
            dataFormat={cell => (
              <div
                className="text-light fill-container pointer"
                href="#search"
                onKeyDown={null}
                role="presentation"
                onDoubleClick={() => {
                  if (this.columns[key]) {
                    this.columns[key].applyFilter(cell);
                  }
                }}
              >{cell}
              </div>
            )}
            multiColumnSort={2}
          >
            {key}
            {isNotField ?
              <a
                onClick={event => this.onHideColumnClick(key, event)}
                href={`#${key}-Hide`}
              >
                <FaEye size={20} className="text-secondary ml-1" />
              </a>
            : null}
          </TableHeaderColumn>
        ));
      });

      return (
        <div>
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
                  data-toggle="modal"
                  data-target={`#${this.modalId}-1`}
                >
                  {NAMES.SAVE_FILTER_PROFILE}
                </button>
              </div>
            </div>
          </div>
          <MyModal
            id={`${this.modalId}-1`}
            title={NAMES.SAVE_FILTER_PROFILE}
            body={
              <TextInput
                name="name"
                label={NAMES.FILTER_PROFILE_NAME}
                labelClassName="mr-2"
                onChange={(event) => {
                  this.newFilterProfileName = event.target.value;
                }}
              />
            }
            onSubmit={() => {
              if ((this.table && this.table.store && this.table.store.isOnFilter)
                || Object.keys(this.state.showComment).length !== 0
                || Object.keys(this.state.columnHidden).length !== 0) {
                const filterProfile = {
                    searchText: this.table.store.searchText,
                    user: this.props.user.id,
                    name: this.newFilterProfileName,
                    showComment: JSON.stringify(this.state.showComment),
                    columnHidden: JSON.stringify(this.state.columnHidden),
                  },
                  filterObj = {};

                if (this.table && this.table.store && this.table.store.filterObj) {
                  Object.keys(this.table.store.filterObj).forEach((key) => {
                    filterObj[key] = {
                      value: this.table.store.filterObj[key].value,
                    };
                  });
                }
                filterProfile.filterObj = JSON.stringify(filterObj);
                this.props.createFilterProfile(filterProfile);
              } else {
                this.props.notifyError(NAMES.NO_FILTER_PROFILE_TO_SAVE);
              }
            }}
          />
          <MyModal
            id={`${this.modalId}-2`}
            title={NAMES.COLUMN_HIDDEN}
            body={
              <div>
                {Object.keys(this.state.columnHidden).filter(key => this.state.columnHidden[key])
                  .map(key => (
                    <div key={key} className="center-display">
                      {key}
                      <a
                        onClick={() => this.onShowColumnClick(key)}
                        href={`#${key}-Show`}
                      >
                        <FaEyeSlash size={20} className="text-secondary ml-2" />
                      </a>
                    </div>
                  ))}
              </div>}
          />
        </div>
      );
    }
    return null;
  }
}

RecordViewMobile.propTypes = {
  user: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  recordsummary: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  departments: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
  positions: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
  fetchRecordSummary: PropTypes.func.isRequired,
  notifyError: PropTypes.func.isRequired,
  createFilterProfile: PropTypes.func.isRequired,
  initFilterProfile: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default RecordViewMobile;
