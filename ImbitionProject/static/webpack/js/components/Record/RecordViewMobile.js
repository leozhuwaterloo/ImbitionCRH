import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import FaCloudDownload from 'react-icons/lib/fa/cloud-download';
import 'bootstrap/js/dist/dropdown';
import
{
  BootstrapTable, TableHeaderColumn, SearchField,
  SizePerPageDropDown, TableRow, TableHeader,
}
  from 'react-bootstrap-table';
import { NAMES } from '../../consts';

class RecordViewMobile extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: [], date: moment(), showComment: {} };
    this.options = {
      exportCSVBtn: onClick => (
        <button className="btn btn-light center-displayp p-1 pl-2 pr-2" onClick={onClick}>
          <FaCloudDownload className="mr-1" size={20} /> {NAMES.CSV_EXPORT}
        </button>
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

  componentWillReceiveProps(nextProps) {
    if (nextProps.employees && nextProps.employees.length !== 0
      && nextProps.recordfields && Object.keys(nextProps.recordfields).length !== 0) {
      const data = [],
        fields = {},
        recordmaps = {},
        { recordfields, employees } = nextProps,
        date = this.state.date.format('YYYY-MM-DD'),
        records = nextProps.record[date] || [];
      records.forEach((record) => {
        const field = recordfields[record.field],
          fieldName = `${field.name}${field.unit ? ` (${field.unit})` : ''}`;
        fields[fieldName] = field.name;
        if (!recordmaps[record.employee]) recordmaps[record.employee] = {};
        recordmaps[record.employee][fieldName] = record;
      });
      employees.forEach((employee) => {
        const employeeData = {};
        employeeData[NAMES.EMPLOYEE_NAME] = `${employee.user.last_name}${employee.user.first_name}`;
        employeeData[NAMES.DATE] = date;
        Object.keys(fields).forEach((fieldName) => {
          employeeData[fieldName] = (recordmaps[employee.id]
            && recordmaps[employee.id][fieldName] && recordmaps[employee.id][fieldName].value) || null;
          employeeData[`${fieldName} ${NAMES.COMMENT}`] = (recordmaps[employee.id]
            && recordmaps[employee.id][fieldName] && recordmaps[employee.id][fieldName].comment) || null;
        });
        data.push(employeeData);
        data.push(employeeData);
        data.push(employeeData);
        data.push(employeeData);
        data.push(employeeData);
      });
      this.setState({ data });
    }
  }

  render() {
    const tableColumns = [];
    if (this.state.data[0]) {
      let counter = 0;
      Object.keys(this.state.data[0]).forEach((key) => {
        const isNotField = (key === NAMES.EMPLOYEE_NAME || key === NAMES.DATE);
        let rowFilter = { type: 'NumberFilter', numberComparators: ['=', '>', '<='] };
        if (isNotField || counter === 1) rowFilter = { type: 'TextFilter' };
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
            isKey={key === NAMES.EMPLOYEE_NAME}
            filter={rowFilter}
            row={isNotField ? '0' : '1'}
            rowSpan={isNotField ? '2' : '1'}
            hidden={!isNotField && counter === 0 && !this.state.showComment[key]}
            dataField={key}
          >
            {key}
          </TableHeaderColumn>
        ));
      });
    }


    return (
      <div className="container-fluid mt-4">
        <div className="ml-2 mr-2">
          {this.state.data[0] &&
            <BootstrapTable
              tableBodyClass="table table-dark"
              tableContainerClass="card"
              version="4"
              data={this.state.data}
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
  employees: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
  record: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  recordfields: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default RecordViewMobile;
