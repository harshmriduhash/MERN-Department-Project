import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

const TextFieldGroup = ({
    name,
    value,
    type,
    placeholder,
    label,
    error,
    onChange,
    disabled
}) => {
    return (
        <div className="form-group">
            {label && <label className={classnames("d-flex form_label",)} htmlFor={name}>{label}</label>}
            <input
                type={type}
                value={value}
                className={classnames("form-control input-field", { 'is-valid': error })}
                name={name}
                placeholder={placeholder}
                onChange={onChange}
                disabled={disabled}
            />
            {error && <div className="error-info">{error}</div>}
        </div>
    )
}

TextFieldGroup.propTypes = {
    name: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    value: PropTypes.string.isRequired,
    error: PropTypes.string,
    type: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.string
};

TextFieldGroup.defaultProps = {
    type: 'text'
};

export default TextFieldGroup;
