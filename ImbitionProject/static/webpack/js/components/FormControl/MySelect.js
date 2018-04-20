import React from 'react';
import PropTypes from 'prop-types';

const MySelect = ({
  list, dict, displayField, valueField, canBeNull, className, ...rest
}) => (
  <select
    className={`custom-select ${className}`}
    {...rest}
  >
    {canBeNull ? <option value="" /> : ''}
    {list ? list.map(obj => (
      <option value={obj[valueField]} key={obj.id}>{obj[displayField]}</option>
    )) : ''}
    {dict ? Object.keys(dict).map(key => (
      <option value={dict[key][valueField]} key={dict[key].id}>{dict[key][displayField]}</option>
    )) : ''}
  </select>
);

MySelect.propTypes = {
  displayField: PropTypes.string.isRequired,
  valueField: PropTypes.string,
  list: PropTypes.array, // eslint-disable-line react/forbid-prop-types
  dict: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  canBeNull: PropTypes.bool,
  className: PropTypes.string,
};

MySelect.defaultProps = {
  list: [],
  dict: {},
  valueField: 'id',
  canBeNull: false,
  className: '',
};

export default MySelect;
