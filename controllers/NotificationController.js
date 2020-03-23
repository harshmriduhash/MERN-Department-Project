const Notification = require('../models/notification.js');
const Request = require('../models/request.js');
const User = require('../models/User.js');




const createNotification = (data,sockets) =>{
    return new Promise((resolve,reject) =>{
        new Notification(data).save().then(notification =>{
            resolve(notification)
         }).catch(err => reject(err))
    }) 
           
    
}

exports.createNotification = createNotification


const getUserNotifications = (req,res) =>{
        Notification.find({user_id:req.user.id})
                    .populate({path:'user_id actor_id request_id'})
                    .then(notifications =>{
                        res.json({success:true,notifications})
                    }).catch(err => res.json({success:false,error:err}))
}


exports.getUserNotifications = getUserNotifications;


const getNotifications = (req,res) =>{
    Notification.find({user_id:req.user.id})
                .populate({path:'user_id actor_id request_for payload.request_id'})
                .then(notifications =>{
                    res.json({success:true,notifications})
                }).catch(err =>res.json({success:false,error:err}))
}

exports.getNotifications = getNotifications;


