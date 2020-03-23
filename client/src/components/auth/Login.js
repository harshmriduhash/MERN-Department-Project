import React, { Component } from 'react';
import TextFieldGroup from '../common/TextFieldGroup';
import { loginUser } from '../../actions/authActions';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import './auth.css';
import {withRouter,Link} from 'react-router-dom';


class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            errors: {}
        };
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    componentWillMount() {
        if (this.props.auth.isAuthenticated) {
            this.props.history.push('/');
        }
    }

    onSubmit(e) {
        e.preventDefault();
        const { loginUser } = this.props;
        const { email, password } = this.state;
        const userData = { email, password };
        this.props.loginUser(userData).then(res =>{
            if(res.data.success){
                this.props.history.push('/');
            }else{
                const loginErrors = res.data.errors;
                let errors = {}
                if(loginErrors.email)errors.email = loginErrors.email;
                if(loginErrors.password)errors.password = loginErrors.password;
                this.setState({errors})
            }
        })
        
    }


   
    render() {
        const { errors } = this.state;
        console.log(errors)
        return (
            <div className="d-flex align-items-center justify-content-center">
                <div className="login-form-container">
                    <div className="d-flex align-items-center justify-content-center   form-header">
                        <div className="login-intro-text">
                       
                        <div className="text-14">Login or Sign up</div>
                        </div>
                    </div>
                    <div className="form-container">
                        <form className="d-flex flex-column justify-content-center" onSubmit={this.onSubmit}>
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
                            <input className="common-pointer btn btn-primary auth-submit-button" type="submit" value="Login" />
                        </form>
                    </div>
                    <div className="d-flex justify-content-center align-items-center">
                    <div>Don't have account? </div>
                    <div className="common-pointer or-sign-up-btn" >
                    <Link to="/register">Sign Up</Link></div>                    
                    </div>
                </div>
            </div>
        )
    }
}

Login.propTypes = {
    auth: PropTypes.object.isRequired,
    loginUser: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth,
})


export default withRouter(connect(mapStateToProps, { loginUser })(Login));