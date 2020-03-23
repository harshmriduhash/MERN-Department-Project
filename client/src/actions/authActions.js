import { SET_CURRENT_USER,SET_USERS , ADD_INCOMING_REQUEST,REMOVE_INCOMING_REQUEST,
         REMOVE_PENDING_REQUEST, ADD_REJECTED_REQUEST, ADD_APPROVED_REQUEST, SET_NOTIFICATIONS,
        ADD_NOTIFICATION, SET_NOTIFICATION_ALERT} from './types';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import setAuthToken from '../utils/setAuthToken';
import {addIncomingRequest} from './requestActions'
import io from 'socket.io-client';
let socket = io('/request');

export const setCurrentUser = decoded  =>{
   
    return {
        type:SET_CURRENT_USER,
        payload: decoded
    }
    
}

export const setUsers = users =>({
    type:SET_USERS,
    users
})


export const addNotification = (notification) =>({
    type:ADD_NOTIFICATION,
    notification
})

export const setNotifications = (notifications) =>({
    type:SET_NOTIFICATIONS,
    notifications
})

export const setNotificationAlert = (alert) =>({
    type:SET_NOTIFICATION_ALERT,
    alert
})

export const getNotificationAlert =  (userData) =>  dispatch => {
    dispatch(setNotificationAlert(false))
}







export const registerUser =  (userData) =>  dispatch => {
    return   axios.post('/api/users/register', userData)
        .then(res => {
            console.log(res);
            if (res.data.success) {
                console.log("User Registered successfully");
            }
            return res;
        });
}

export const loginUser = (data) => dispatch => {
 return  axios.post('/api/users/login', data)
        .then(res => {
            console.log("res : ", res);
            console.log(res.data.success);
            if (res.data.success) {
                const { token } = res.data;
                //set token to local storage
                console.log("token ", token);
                localStorage.setItem('jwtToken', token);

                //set token to Auth Header
                setAuthToken(token);

                //Decode token to get user data
                const decoded = jwt_decode(token);
                console.log("decoded ", decoded);

                //set Current User
                dispatch(setCurrentUser(decoded));
            }
            console.log(res);
            return res;
        }).catch(err => console.log(err));
};



export const logout = () => dispatch =>{
    localStorage.removeItem('jwtToken')
    dispatch(setCurrentUser({}))
}


export const getNotifications = () => dispatch =>{
    return axios.get('/api/request/notifications')
                .then(res =>{
                    if(res.data.success){
                        dispatch(setNotifications(res.data.notifications))
                    }
                    return res;
                })
}


export const getUserInfo = () => dispatch =>{
    return axios.get('/api/request/getUserInfo').then(res =>{
        if(res.data.success){
            socket.emit('initClientInfo',{userId:res.data.user._id})
           
            socket.on('new-incoming-request', (request) => {
                console.log("----------------- new incoming request ---------------",request);
                    dispatch({type:ADD_INCOMING_REQUEST,request})
             })
           socket.on('remove-incoming-request',(request)=>{
               dispatch({type:REMOVE_INCOMING_REQUEST,id:request._id})
           })

           socket.on('delete-pending-request',(request)=>{
               dispatch({type:REMOVE_INCOMING_REQUEST,id:request._id})
           })

           socket.on('request-approved',(request)=>{
            dispatch({type:REMOVE_INCOMING_REQUEST,id:request._id})
            dispatch({type:REMOVE_PENDING_REQUEST,id:request._id})
            dispatch({type:ADD_APPROVED_REQUEST,request})
          })

          socket.on('request-rejected',(request)=>{
            dispatch({type:REMOVE_INCOMING_REQUEST,id:request._id})
            dispatch({type:REMOVE_PENDING_REQUEST,id:request._id})
            dispatch({type:ADD_REJECTED_REQUEST,request})
         })



         socket.on('notification',(data)=>{
             console.log("------------notification data ----------",data);
             dispatch(addNotification(data))
             dispatch(setNotificationAlert(true))
         })

        }
        return res;
    })
}

export const getDepartmentUsers = (department_id) => dispatch =>{
   return axios.get(`/api/users/${department_id}`).then(res =>{
       if(res.data.success){
           dispatch(setUsers(res.data.users))
       }
       return res; 
   })
}



