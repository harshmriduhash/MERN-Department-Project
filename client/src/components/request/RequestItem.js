import React, { Component } from 'react'
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import {deleteRequest,updateRequest} from '../../actions/requestActions.js';
import moment from 'moment';
import { userInfo } from 'os';

class RequestItem extends Component {
    constructor(props){
        super(props);
        this.state = {
            type:'',
            dropdownOpen:false
        }
        this.toggle = this.toggle.bind(this);
        this._renderOption = this._renderOption.bind(this);
        this.deleteRequest = this.deleteRequest.bind(this);
        this._renderInfo = this._renderInfo.bind(this);
        this.updateRequest = this.updateRequest.bind(this);
        this._renderUpdateTime = this._renderUpdateTime.bind(this);
    }


    componentDidMount(){
      
    }
   
    toggle(){
        this.setState({dropdownOpen:!this.state.dropdownOpen})
    }

    deleteRequest(){
        const {deleteRequest,request} = this.props;
        const id = request._id;
        deleteRequest(id).then(res =>{
            console.log(res)
        })
    }

    updateRequest(data){
        const {updateRequest,request} = this.props;
        updateRequest(request._id,data).then(res =>{
            console.log(res);
        })
    }

    _renderInfo(){
        const {type,request} = this.props;
        let title;
        
            title =(
                <div className="d-flex request-item-title">
                  <div clasName="title-text">Reques for : {request.created_for.name}</div>
                  <div className="dept-info">{'('} Dept : {request.created_for.department_id.name} { ')'}</div>
                </div>
            )
        
        return title;
    }
    _renderUpdateTime(){
        const {type,request} = this.props;
        let text;
        let date = moment(new Date(request.updated_on)).format('DD MMM YY')
        if(type === 'approved'){
            text = `Approved on : ${date}`
        }else if(type === 'rejected'){
            text = `Rejected On : ${date}`
        }
        return (
            <div className="request-item-footer">
                {text} 
            </div>
        )
    }

    _renderOption(){
        const {type,request,user} = this.props;
        const user_id = user.id;
        let options;
        if(type === 'pending'){
            options = (
                <DropdownItem onClick={this.deleteRequest}>Delete</DropdownItem>
            );
        }else if(type === 'approved'){

        }else if(type === 'incoming-request'){
            console.log(user_id);
            console.log(request.created_for._id)
            if(request.created_for._id == user_id){
                options = (
                    <div>
                        <DropdownItem onClick={()=> this.updateRequest({status:'approved'})}>Approve</DropdownItem>
                        <DropdownItem onClick={() => this.updateRequest({status:'rejected'})}>Reject</DropdownItem>
                    </div>
                );
            }else{
                return null;
            }
            
        }

       return type === 'pending'  || type === 'incoming-request' ? (
                   <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                     <DropdownToggle tag="span" className="common-pointer">
                        <i class="material-icons">more_vert</i>
                     </DropdownToggle>
                     <DropdownMenu right>
                          {options}
                     </DropdownMenu>
                    </Dropdown>
       ) : (null)
    }






    render() {
        const {request,type} = this.props;
        
        return (
            <div className="request-item-container">
           
              <div className="d-flex justify-content-between">
                 <div>
                     <div className="request-item-top">Created on :{moment(new Date(request.created_at)).format('DD MMM YY')} </div>
                     <div className="request-text-box">{request.text}</div>
                 </div>
                 {this._renderOption()}
             </div>
             {this._renderInfo()}
             {(type === 'rejected' || type==='approved')&&this._renderUpdateTime()}
            </div>
        )
    }
}





const mapStateToProps = state => ({
  user:state.auth.user
});

export default withRouter(connect(mapStateToProps, { deleteRequest,updateRequest})(RequestItem));
