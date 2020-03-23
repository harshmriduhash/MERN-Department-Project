import React, { Component } from 'react'
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import {getPendingRequests,getApprovedRequests, getIncomingRequests, getRejectedRequests} from '../../actions/requestActions';
import RequestItem from './RequestItem';
import './request.css';
import LazyLoad from 'react-lazyload';



class Request extends Component {
    constructor(props){
        super(props);
        this.state = {
            type:''
        }

        this._renderRequests = this._renderRequests.bind(this);
    }


    componentDidMount(){
        const {pathname} = this.props.location;
        const {user} = this.props.auth;
        console.log(user);
    
        const {pending,approved,rejected,incomingRequests,getPendingRequests,
            getApprovedRequests,getIncomingRequests, getRejectedRequests} = this.props;
        if(pathname === '/pending'){
            this.setState({type:'pending'})
            if(pending.length === 0){
                getPendingRequests().then(res=>{
                    console.log(res);
                })
            }
        }else if(pathname === '/approved'){
            this.setState({type:'approved'})
            if(approved.length === 0){
                getApprovedRequests().then(res =>{
                    console.log(res);
                })
            }
        }else if(pathname === '/incoming-request'){
            this.setState({type:'incoming-request'})
            if(incomingRequests.length === 0){
                getIncomingRequests(user.department_id).then(res =>{
                    console.log(res);
                })
            }
        }else if(pathname === '/rejected'){
            this.setState({type:'rejected'});
            if(rejected.length === 0){
                getRejectedRequests().then(res=>{
                    console.log(res);
                })
            }
        }
    }


    _renderRequests(){
        const {type} = this.state;
        const {pending,approved,incomingRequests,rejected} = this.props;
        let requests = []
        if(type === 'pending'){
            requests = pending
        }else if(type === 'approved'){
            requests = approved;
        }else if(type === 'incoming-request'){
            requests = incomingRequests
        }else if(type === 'rejected'){
            requests = rejected;
        }

        return requests.length > 0 ? (
            requests.map(request =>{ 
              return (
                  <LazyLoad height={100}>
                      <RequestItem key={request._id} type={type} request={request} />
                  </LazyLoad>
              )
              })
          ) : (null)
    }





    render() {
        return (
            <div className="d-flex flex-column align-items-center justify-content-center request-container">
                {this._renderRequests()}
            </div>
        )
    }
}





const mapStateToProps = state => ({
    auth: state.auth,
    departments:state.department.departments,
    pending:state.request.pending,
    approved:state.request.approved,
    incomingRequests:state.request.incomingRequests,
    rejected:state.request.rejected
});

export default withRouter(connect(mapStateToProps, {getPendingRequests,getApprovedRequests,getIncomingRequests, getRejectedRequests })(Request));
