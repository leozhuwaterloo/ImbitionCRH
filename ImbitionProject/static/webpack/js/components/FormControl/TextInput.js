import React from 'react';
import PropTypes from 'prop-types';

const TextInput = ({
  name, label, error, className, containerClassName, labelClassName, inputClassName, type, ...rest
}) => {
  const id = `id_${name}`;
  return (
    <div className={`form-group center-display m-0 ${containerClassName}`}>
      {label ? <label htmlFor={id} className={`m-0 ${labelClassName}`}>{label}</label> : ''}
      <div className={className}>
        <input
          type={type}
          className={`form-control ${error ? 'is-invalid' : ''} ${inputClassName}`}
          id={id}
          name={name}
          {...rest}
        />
        {error ? <div className="invalid-feedback">{error}</div> : ''}
      </div>
    </div>
  );
};


TextInput.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  error: PropTypes.string,
  type: PropTypes.string,
  className: PropTypes.string,
  containerClassName: PropTypes.string,
  labelClassName: PropTypes.string,
  inputClassName: PropTypes.string,
};

TextInput.defaultProps = {
  label: '',
  error: '',
  type: 'text',
  className: '',
  containerClassName: '',
  labelClassName: '',
  inputClassName: '',
};

export default TextInput;
