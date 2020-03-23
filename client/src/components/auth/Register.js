import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import TextFieldGroup from '../common/TextFieldGroup';
import PropTypes from 'prop-types';
import { registerUser } from '../../actions/authActions';
import { getDepartments } from '../../actions/departmentActions';
import './auth.css';

class Register extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            errors: {},
            department_id:''
        };
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }



    componentWillMount() {
        this.props.getDepartments();
        if (this.props.auth.isAuthenticated) {
            this.props.history.push('/');
        }
    }

    onChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    onSubmit(e) {
        e.preventDefault();
        const { registerUser } = this.props;
        const { name, email, password, confirmPassword,department_id } = this.state;
        const userData = { name, email, password, confirmPassword, department_id };
        registerUser(userData).then(res=>{
            if(res.data.success){
                this.props.history.push('/login');
            }else{
                const registerErrors = res.data.errors;
                let errors = {}
                if(registerErrors.email)errors.email = registerErrors.email;
                if(registerErrors.password)errors.password = registerErrors.password;
                if(registerErrors.confirmPassword)errors.confirmPassword = registerErrors.confirmPassword;
                if(registerErrors.department_id)errors.department_id = registerErrors.department_id;
                if(registerErrors.name)errors.name = registerErrors.name;

                this.setState({errors})
            }
        })
        
    }

    _renderdepartmentOptions = () =>{
        const {departments} = this.props;
        return departments.length > 0 ? (
            departments.map(department =>{ 
              return (
                <option key={department._id} value={department._id}>{department.name}</option>
              )
              })
          ) : (null)
    }


    render() {
        const { errors } = this.state;
        return (
            <div className="d-flex align-items-center justify-content-center">
                <div className="login-form-container">
                    <div className="d-flex align-items-center justify-content-center form-header">
                        <h2>Register</h2>
                    </div>
                    <div className="form-container">
                        <form className="d-flex flex-column justify-content-center" onSubmit={this.onSubmit}>
                            <TextFieldGroup
                                name="name"
                                type="name"
                                label="Name"
                                value={this.state.name}
                                placeholder="Full Name"
                                onChange={this.onChange}
                                error={errors.name}
                            />
                            <TextFieldGroup
                                name="email"
                                type="email"
                                label="Email"
                                value={this.state.email}
                                placeholder="Email Address"
                                onChange={this.onChange}
                                error={errors.email}
                            />
                            <TextFieldGroup
                                name="password"
                                type="password"
                                label="Password"
                                onChange={this.onChange}
                                value={this.state.password}
                                placeholder="Password"
                                error={errors.password}
                            />
                            <TextFieldGroup
                                name="confirmPassword"
                                type="password"
                                label="Confirm Password"
                                onChange={this.onChange}
                                value={this.state.confirmPassword}
                                placeholder="Confirm Password"
                                error={errors.confirmPassword}
                            />
                            <div className="custom-select-container">
                                 <select 
                                   className="select-department-item" 
                                   name="department_id" 
                                   value={this.state.department_id} 
                                   onChange={this.onChange}
                                   >
                                  <option key="1" value="">Select the Department</option>
                                     {this._renderdepartmentOptions()}
                                 </select>
                                 {errors.department_id && <div className="error-info">{errors.department_id}</div>}
                            </div>
                            <input className="btn btn-primary auth-submit-button" type="submit" value="Register" />
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

Register.propTypes = {
    registerUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    departments: PropTypes.object.isRequired

}

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors,
    departments:state.department.departments
});

export default withRouter(connect(mapStateToProps, { registerUser,getDepartments })(Register));
