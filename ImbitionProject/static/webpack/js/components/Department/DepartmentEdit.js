import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import DistinctViewPage from '../DistinctViewPage';
import { NAMES } from '../../consts';
import { fetchData } from '../../actions';
import DepartmentEditMobile from './DepartmentEditMobile';

class DepartmentEditDumb extends React.Component {
  constructor(props) {
    super(props);
    props.fetchDepartments();
  }

  render() {
    return (
      <DistinctViewPage
        title={NAMES.DEPARTMENT_EDIT}
        mobileRender={() => <DepartmentEditMobile {...this.props} />}
      />
    );
  }
}

DepartmentEditDumb.propTypes = {
  departments: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
  fetchDepartments: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    departments: state.data.departments,
  }),
  mapDispatchToProps = dispatch => ({
    fetchDepartments: () => dispatch(fetchData('department')),
  }),
  DepartmentEdit = connect(mapStateToProps, mapDispatchToProps)(DepartmentEditDumb);

export default DepartmentEdit;
