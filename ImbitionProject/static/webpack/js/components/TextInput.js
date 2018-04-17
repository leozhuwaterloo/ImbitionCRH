import React from 'react';
import PropTypes from 'prop-types';

const TextInput = ({
  name, label, error, type, placeholder, onChange, value,
}) => {
  const id = `id_${name}`;
  if (error === 'This field may not be blank.') error = '此处不能为空';
  return (
    <div className="form-group center-display mb-0">
      <label htmlFor={id}>
        {label}
        <input
          type={type}
          className={`form-control ${error ? 'is-invalid' : ''}`}
          id={id}
          name={name}
          placeholder={placeholder}
          onChange={onChange}
          value={value}
        />
        <div className="invalid-feedback">{error}</div>
      </label>
    </div>
  );
};


TextInput.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  error: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
};

TextInput.defaultProps = {
  type: 'text',
  placeholder: '',
  onChange: () => {},
};

export default TextInput;
