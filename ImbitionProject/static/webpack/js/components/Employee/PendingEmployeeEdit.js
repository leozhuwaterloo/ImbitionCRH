import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import DistinctViewPage from '../DistinctViewPage';
import { MyModal, TextInput, MySelect } from '../FormControl';
import { NAMES, translate } from '../../consts';
import { fetchData, createData, delData } from '../../actions';

class PendingEmployeeEditDumb extends React.Component {
  constructor(props) {
    super(props);
    props.fetchPendingEmployees();
    props.fetchPositions();
    this.modalId = 'pendingEmployee';
    this.state = {
      phone: '',
      lastName: '',
      firstName: '',
      position: null,
    };

    this.handleInputChange = (event) => {
      this.state[event.target.name] = event.target.value;
      this.forceUpdate();
    };

    this.mobileRender = () => (
      <div>
        <div className="container mt-5 col-8 shadow mb-5 bg-white rounded pt-5 pb-5">
          <div className="ml-3 mr-3">
            {this.props.pendingemployees.map(pendingemployee => (
              <div className="card" key={pendingemployee.id}>
                <div
                  className="card-header bg-dark text-light center-display"
                  data-toggle="collapse"
                  data-target={`#collapse${pendingemployee.id}`}
                  aria-expanded="true"
                >
                  <div>
                    {pendingemployee.last_name}{pendingemployee.first_name} - {pendingemployee.phone}
                  </div>
                  <button
                    className="btn btn-danger ml-auto"
                    onClick={() => this.props.deletePendingEmployee(pendingemployee.id)}
                  >
                    {NAMES.DELETE}
                  </button>
                </div>
                <div id={`collapse${pendingemployee.id}`} className="collapse">
                  <div className="card-body d-inline-flex">
                    <div>{NAMES.PENDING_EMPLOYEE_CREATED_AT}: {pendingemployee.created_at}</div>
                    <div className="ml-3">
                      {NAMES.PENDING_EMPLOYEE_CREATED_BY}: {pendingemployee.created_by
                        ? `${pendingemployee.created_by.last_name}${pendingemployee.created_by.first_name} -
                        ${pendingemployee.created_by.position}`
                        : ''}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div className="row center-display mt-3">
              <button className="btn btn-info" data-toggle="modal" data-target={`#${this.modalId}-1`}>
                {NAMES.PENDING_EMPLOYEE_ADD}
              </button>
            </div>
          </div>
        </div>
        <MyModal
          id={`${this.modalId}-1`}
          title={NAMES.PENDING_EMPLOYEE_ADD}
          body={
            <div>
              {Object.keys(this.state).map((key) => {
                if (key === 'position') {
                  return (
                    <div className="form-group center-display m-0" key={key}>
                      <label htmlFor="position-select" className="m-0 w-1">{NAMES.POSITION}</label>
                      <MySelect
                        id="position-select"
                        className="w-1 mb-0"
                        displayField="name"
                        list={this.props.positions}
                        value={this.state.position || ''}
                        onChange={event => this.setState({ position: event.target.value })}
                      />
                    </div>
                  );
                }
                return (
                  <TextInput
                    key={key}
                    name={key}
                    labelClassName="w-1"
                    inputClassName="w-1"
                    label={translate(key)}
                    value={this.state[key]}
                    onChange={this.handleInputChange}
                    error={(this.props.createerrors
                    && this.props.createerrors.pendingemployee
                    && this.props.createerrors.pendingemployee[key]
                    && translate(this.props.createerrors.pendingemployee[key][0])) || ''}
                  />
                );
              })}
            </div>
          }
          onSubmit={() => this.props.createPendingEmployee({
            phone: this.state.phone,
            first_name: this.state.firstName,
            last_name: this.state.lastName,
            position: this.state.position,
          })}
        />
      </div>
    );
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.positions.length !== 0 && this.state.position === null) {
      this.setState({ position: nextProps.positions[0].id });
    }
  }

  render() {
    return (
      <DistinctViewPage
        title={NAMES.PENDING_EMPLOYEE_EDIT}
        mobileRender={() => this.mobileRender()}
      />
    );
  }
}

PendingEmployeeEditDumb.propTypes = {
  pendingemployees: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
  positions: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
  fetchPendingEmployees: PropTypes.func.isRequired,
  fetchPositions: PropTypes.func.isRequired,
  createPendingEmployee: PropTypes.func.isRequired,
  deletePendingEmployee: PropTypes.func.isRequired,
  createerrors: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

const mapStateToProps = state => ({
    pendingemployees: state.data.pendingemployees,
    positions: state.data.positions,
    createerrors: state.data.createerrors,
  }),
  mapDispatchToProps = dispatch => ({
    fetchPendingEmployees: () => dispatch(fetchData('pendingemployee', 'pendingemployees')),
    fetchPositions: () => dispatch(fetchData('position', 'positions')),
    createPendingEmployee: body => dispatch(createData('pendingemployee', body, 'pendingemployee', () => {
      dispatch(fetchData('pendingemployee', 'pendingemployees'));
    })),
    deletePendingEmployee: pendingEmployeeId => dispatch(delData(`pendingemployee/${pendingEmployeeId}`, null, () => {
      dispatch(fetchData('pendingemployee', 'pendingemployees'));
    })),
  }),
  PendingEmployeeEdit = connect(mapStateToProps, mapDispatchToProps)(PendingEmployeeEditDumb);

export default PendingEmployeeEdit;
