import React, { Component } from 'react'
import {withRouter } from 'react-router-dom';
import { connect } from 'react-redux'; 
import notificationGrammer from '../../utils/notificationGrammer.js';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import notifType from '../../utils/notificationType.json'
import {getNotifications,getNotificationAlert} from '../../actions/authActions';
import moment from 'moment';
import classnames from 'classnames'
import LazyLoad from 'react-lazyload';

class Notification extends Component {
    constructor(props){
        super(props);

        this._renderNotification = this._renderNotification.bind(this);
        this.setNotificationAlert = this.setNotificationAlert.bind(this);
    }



    componentWillMount(){
        const {notifications} = this.props;
        if(notifications.length === 0){
            this.props.getNotifications()
                 .then(res=>{
                     console.log(res);
                 })
        }
    }

    setNotificationAlert(){
        this.props.getNotificationAlert(false)
    }


    _renderNotification(){
        const { notifications,user } = this.props;
        console.log(notifications)
        if (notifications.length > 0) {
           return notifications.map(notification => {
               let notifGrammer;
               let param1;
               let param2;
               let requestText;
               switch(notification.type){
                   case notifType.create_request:
                         param1 = notification.actor_id.name;
                         param2 = notification.request_for.name;
                         requestText = notification.payload.request_text;
                         break;
                    case notifType.request_approved:
                         param1 = notification.actor_id.name;
                         param2 = notification.request_for.name;
                         requestText = notification.payload.request_text;
                         break;
                    case notifType.request_rejected:
                         param1 = notification.actor_id.name;
                         param2 = notification.request_for.name;
                         requestText = notification.payload.request_text;
                         break;
                    case notifType.delete_pending_request:
                         param1 = notification.actor_id.name;
                         param2 = notification.request_for.name;
                         requestText = notification.payload.request_text;
                         break;
                    default:
                        break;
               }
               if(user.id == notification.request_for._id) param2 = "you"
               notifGrammer = notificationGrammer(notification.type, param1, param2, requestText);
               return(
                  
                    <DropdownItem className="notification-item">
                     <div className="notif-grammer">{notifGrammer}</div>
                     <div className="request-item-top">{moment(new Date(notification.created_at)).format('DD MMM YY')} </div>
                   </DropdownItem>
   
               
               )

           })
       } 
  }


    render() {
        const {showNotificationAlert} = this.props;
        return (
            <Dropdown isOpen={this.props.dropdownOpen} toggle={this.props.toggle}>
             <DropdownToggle tag="span">
              <div className="nav_item common-pointer">   
                   <i class="material-icons" onClick={this.setNotificationAlert}>Notifications</i>
                   <div className={classnames("notification-alert",{isAlert:showNotificationAlert})}></div>
                   </div>
            </DropdownToggle>
            <DropdownMenu className="notification-menu" right>
            <DropdownItem header>Notifications</DropdownItem>
               {this._renderNotification()}
            </DropdownMenu>
            </Dropdown>
        )
    }
}

const mapStateToProps = state => ({
    notifications:state.auth.notifications,
    user:state.auth.user,
    showNotificationAlert:state.auth.showNotificationAlert
});


export default withRouter(connect(mapStateToProps, {getNotifications,getNotificationAlert})(Notification));
