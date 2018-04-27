import React from 'react';
import PropTypes from 'prop-types';
import FaPlus from 'react-icons/lib/fa/plus';
import FaMinusCircle from 'react-icons/lib/fa/minus-circle';
import { TextInput, MyModal, MySelect } from '../FormControl';
import { NAMES, translate } from '../../consts';

class RecordSelfEditMobile extends React.Component {
  constructor(props) {
    super(props);
    this.state = { records: {} };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.employee && nextProps.user && nextProps.employee[nextProps.user.id]
      && nextProps.employee[nextProps.user.id].records
      && nextProps.employee[nextProps.user.id].records.length !== 0) {
      const records = {};
      nextProps.employee[nextProps.user.id].records.forEach((record) => {
        records[record.field] = record;
      });
      this.setState({
        records,
      });
    }
  }

  render() {
    console.log(this.state.records);
    const { user, recordfields } = this.props;
    if (!user || !user.position) return null;
    return (
      <div>
        {user.position.record_fields.map((recordFieldId => (
          <div key={recordFieldId}>{recordfields[recordFieldId] && recordfields[recordFieldId].name}</div>
        )))}
      </div>
    );
  }
}


RecordSelfEditMobile.propTypes = {
  user: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  recordfields: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  employee: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};


export default RecordSelfEditMobile;
