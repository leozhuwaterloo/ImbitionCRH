import React from 'react';
import PropTypes from 'prop-types';

const TextInput = ({
  name, label, error, className, containerClassName, labelClassName, type, ...rest
}) => {
  const id = `id_${name}`;
  if (error === 'This field may not be blank.') error = '此处不能为空';
  return (
    <div className={`form-group center-display m-0 ${containerClassName}`}>
      {label ? <label htmlFor={id} className={`m-0 ${labelClassName}`}>{label}</label> : ''}
      <div className={className}>
        <input
          type={type}
          className={`form-control ${error ? 'is-invalid' : ''}`}
          id={id}
          name={name}
          {...rest}
        />
        <div className="invalid-feedback mytextinput-feedback">{error}</div>
      </div>
    </div>
  );
};


TextInput.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  error: PropTypes.string.isRequired,
  type: PropTypes.string,
  className: PropTypes.string,
  containerClassName: PropTypes.string,
  labelClassName: PropTypes.string,
};

TextInput.defaultProps = {
  type: 'text',
  className: '',
  containerClassName: '',
  labelClassName: '',
};

export default TextInput;
