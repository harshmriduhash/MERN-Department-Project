import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import TextAreaFieldGroup from '../common/TextAreaFieldGroup';
import PropTypes from 'prop-types';
import { getDepartmentUsers } from '../../actions/authActions';
import { getDepartmentsForReq } from '../../actions/departmentActions';
import { createRequest } from '../../actions/requestActions';
import '../auth/auth.css';

class Register extends Component {

    constructor(props) {
        super(props);
        this.state = {
            text: "",
            created_for: "",
            errors: {},
            department_id:''
        };
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }



    componentWillMount() {
        // this.props.getDepartments();
        // if (this.props.auth.isAuthenticated) {
        //     this.props.history.push('/');
        // }

        this.props.getDepartmentsForReq();
    }

    onChange(e) {
        if(e.target.name === 'department_id'){
            const department_id = e.target.value;
            this.props.getDepartmentUsers(department_id)
                 .then(res =>{
                     console.log(res.data);
                 })
        }
        this.setState({
            [e.target.name]: e.target.value
        });
    };



    onSubmit(e) {
        e.preventDefault();
        const { createRequest } = this.props;
        const { text,created_for,department_id } = this.state;
        let errors = {};
        if(text === '')errors.text = "Message field is required";
        if(created_for === '')errors.created_for = "Select a user to send a request";
        if(department_id === '')errors.department_id = "Department field is required";
        if(errors.text || errors.department_id || errors.created_for){
            this.setState({errors})
        }else{
            const userData = { text, department_id ,created_for};
            createRequest(userData);
        }
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

    _renderUserOptions = () =>{
        const {users} = this.props;
        return users.length > 0 ? (
            users.map(user =>{ 
              return (
                <option key={user._id} value={user._id}>{user.name}</option>
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
                        <h2>Create Request</h2>
                    </div>
                    <div className="form-container">
                        <form className="d-flex flex-column justify-content-center" onSubmit={this.onSubmit}>
                            <TextAreaFieldGroup
                                name="text"
                                type="text"
                                label="Message"
                                value={this.state.text}
                                placeholder="Type Message"
                                onChange={this.onChange}
                            />
                            {errors.text && <div className="error-info">{errors.text}</div>}
                            <div className="custom-select-container">
                                 <select 
                                   className="select-department-item" 
                                   name="department_id" 
                                   value={this.state.department_id} 
                                   onChange={this.onChange}
                                   >
                                  <option key="1" value="">Select Department</option>
                                     {this._renderdepartmentOptions()}
                                 </select>
                                 {errors.department_id && <div className="error-info">{errors.department_id}</div>}
                            </div>
                            {this.state.department_id &&
                            <div className="custom-select-container">
                              <select 
                              className="select-department-item" 
                              name="created_for" 
                              value={this.state.created_for} 
                              onChange={this.onChange}
                              >
                              <option key="1" value="">Select User</option>
                                {this._renderUserOptions()}
                             </select>
                             {errors.created_for && <div className="error-info">{errors.created_for}</div>}
                            </div>
                            }
                            <input className="btn btn-primary auth-submit-button" type="submit" value="Send Request" />
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

Register.propTypes = {
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    departments: PropTypes.object.isRequired,
    users: PropTypes.object.isRequired,
   

}

const mapStateToProps = state => ({
    auth: state.auth,
    users:state.auth.users,
    errors: state.errors,
    departments:state.department.departments
});

export default withRouter(connect(mapStateToProps, { createRequest,getDepartmentsForReq, getDepartmentUsers })(Register));
