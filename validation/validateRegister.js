const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateRegisterInput(data) {
    let errors = {};
    console.log(data);
    data.name = !isEmpty(data.name) ? data.name : '';
    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';
    data.confirmPassword = !isEmpty(data.confirmPassword) ? data.confirmPassword : '';
    data.department_id = !isEmpty(data.department_id) ? data.department_id : '';
    console.log(data);
    if (Validator.isEmpty(data.name)) {
        errors.name = "name field is required";
    }
    if (!Validator.isEmail(data.email)) {
        errors.email = "Invalid email address";
    }
    if (Validator.isEmpty(data.email)) {
        errors.email = "email field is required";
    }
    if (Validator.isEmpty(data.password)) {
        errors.password = "Password field is requird";
    }
    if (Validator.isEmpty(data.confirmPassword)) {
        errors.confirmPassword = "Confirm password field is requird";
    }
    if (data.password !== data.confirmPassword) {
        errors.confirmPassword = "password does not matches";
    }
    if (Validator.isEmpty(data.department_id)) {
        errors.name = "department field is required";
    }
    return {
        errors,
        isValid: isEmpty(errors)
    };
}