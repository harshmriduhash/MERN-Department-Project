const Request = require('../models/request.js');
const User = require('../models/User.js');
const app = require('express')();
const NotificationController = require('./NotificationController');
const Notification = require('../models/notification.js');
const notifType = require('../utils/notificationTypes')();

class RequestController{

    constructor(){
        
    }

   
   
    create(req,res){
    
        const {text,department_id,created_for} = req.body;
        let newRequest = {text,department_id,created_for};
        newRequest.created_by = req.user.id;
        new Request(newRequest).save().then(request =>{
            Request.populate(request,[
                  {path:'created_for',populate:{path:'department_id'}},
                  {path:'created_by',populate:{path:'department_id'}}])
                  .then(populatedRequest =>{
                    res.json({success:true,request:populatedRequest})
                    // this.sendRequestToAllDeptUser(populatedRequest);


                    const department_id = populatedRequest.created_for.department_id._id;
                    User.find({department_id}).then(users =>{
                        const  sockets = req.app.get("sockets");
                        users.forEach((user,index) =>{
                            let data = {}


                            if(sockets[user._id]){
                                sockets[user._id].emit('new-incoming-request',populatedRequest)
                            }

                             data.actor_id = req.user.id;
                             data.user_id = user._id;
                             data.request_for = created_for;
                             console.log(notifType)
                             data.type = notifType.create_request;
                             let payload = {}
                             payload.request_id = populatedRequest._id;
                             payload.request_text = populatedRequest.text;
                             data.payload = payload; 
                             console.log(data)
                             NotificationController.createNotification(data).then(notification =>{
                                 Notification.populate(notification,[{path:'user_id'},{path:'actor_id'},{path:'request_for'},{path:'payload.request_id'}])
                                         .then(populatedNotif =>{
                                            if(sockets[populatedNotif.user_id._id]){
                                                sockets[populatedNotif.user_id._id].emit('notification',populatedNotif)
                                            }
                                         }).catch(err => console.log("--------err ---------",err));
                                 
                             })
                           
                        })
                    })
                  }).catch(err => console.log(err))



                 
        }).catch(err => res.json({success:false,error:err}))
    }


    update(req, res){
        let data = req.body;
        let type;
        data.updated_on =  Date.now();
        const  sockets = req.app.get("sockets");
        Request.findOneAndUpdate({_id:req.params.id},{$set:data},{new:true})
               .populate({path:'created_for created_by',populate:{path:'department_id'}})
               .then(request =>{
                   res.json({success:true,request})


                   if(req.body.status === 'approved'){
                       type = notifType.request_approved;
                       if(sockets[request.created_by._id]){
                        sockets[request.created_by._id].emit('request-approved',request);
                       }
                   }else{
                       type=notifType.request_rejected
                     if(sockets[request.created_by._id]){
                        sockets[request.created_by._id].emit('request-rejected',request);
                       }
                   }


                   let data = {}
                   data.actor_id = req.user.id;
                   data.request_for = request.created_for._id;
                                 
                   data.type = type;
                   let payload = {}
                   payload.request_id = request._id;
                   payload.request_text = request.text;
                   data.payload = payload; 
                   

                   const department_id = request.created_for.department_id._id;
                    User.find({department_id}).then(users =>{
                        let allUsers = [request.created_by];
                        let allNewUsers = allUsers.concat(users)
                        

                        allNewUsers.forEach((user,index) =>{
                            if(user._id != req.user.id){

                                if(sockets[user._id]){
                                    sockets[user._id].emit('remove-incoming-request',request)
                                }

                                data.user_id = user._id;                                
                                 console.log(data);
                                 NotificationController.createNotification(data).then(notification =>{
                                     Notification.populate(notification,[{path:'user_id'},{path:'actor_id'},{path:'request_for'},{path:'payload.request_id'}])
                                             .then(populatedNotif =>{
                                                if(sockets[populatedNotif.user_id._id]){
                                                    sockets[populatedNotif.user_id._id].emit('notification',populatedNotif)
                                                }
                                             }).catch(err => console.log("--------err ---------",err));
                                     
                                 })

                            }
                        })
                    }).catch(err => res.json({success:false,error:err}))
               }).catch(err => res.json({success:false,error:err}))
    }

    delete(req,res){
        Request.findOneAndDelete({_id:req.params.id})
               .populate({path:'created_for created_by',populate:{path:'department_id'}})
               .then(request =>{
                console.log(request)
                   res.json({success:true,request})
                   
                   const department_id = request.created_for.department_id._id;
                    User.find({department_id}).then(users =>{
                        const  sockets = req.app.get("sockets");
                           let data = {};
                           data.actor_id = req.user.id;                 
                            data.request_for = request.created_for;
                            data.type = notifType.delete_pending_request;
                            let payload = {}
                            payload.request_text = request.text;
                            data.payload = payload; 
                        users.forEach((user,index) =>{
                            if(sockets[user._id]){
                                sockets[user._id].emit('delete-pending-request',request)
                            }
                            data.user_id = user._id;
                            NotificationController.createNotification(data).then(notification =>{
                                Notification.populate(notification,[{path:'user_id'},{path:'actor_id'},{path:'request_for'},{path:'payload.request_id'}])
                                        .then(populatedNotif =>{
                                           if(sockets[populatedNotif.user_id._id]){
                                               sockets[populatedNotif.user_id._id].emit('notification',populatedNotif)
                                           }
                                        }).catch(err => console.log("--------err ---------",err));
                                
                            })
                        })
                    }).catch(err => res.json({success:false,error:err}))
               }).catch(err => res.json({success:false,error:err}))
    }


    pending(req,res){
        Request.find({created_by:req.user.id,status:'pending'})
        .populate({path:'created_for created_by',populate:{path:'department_id'}})
               .sort({created_at:-1})
               .then(requests =>{
                   res.json({success:true,requests})
               }).catch(err => res.json({success:false,error:err}))
    }


    approved(req,res){
        Request.find({created_by:req.user.id,status:'approved'})
              .populate({path:'created_for created_by',populate:{path:'department_id'}})
              .sort({created_at:-1})
               .then(requests =>{
                   res.json({success:true,requests})
               }).catch(err => res.json({success:false,error:err}))
    }


    rejected(req,res){
        Request.find({created_by:req.user.id,status:'rejected'})
              .populate({path:'created_for created_by',populate:{path:'department_id'}})
              .sort({created_at:-1})
               .then(requests =>{
                   res.json({success:true,requests})
               }).catch(err => res.json({success:false,error:err}))
    }



    incoming(req,res){
        User.find({department_id:req.params.departmentId})
            .then(users =>{
                const userIds = users.map(user => user._id);
                Request.find({created_for:{$in:userIds},status:'pending'})
                       .populate({path:'created_for created_by',populate:{path:'department_id'}})
                       .sort({created_at:-1})
                       .then(requests =>{
                           res.json({success:true,requests})
                       }).catch(err => res.json({success:false,error:err}))
            }).catch(err => res.json({success:false,error:err}))
    }

  


    getUserInfo(req,res){
        User.findOne({_id:req.user.id})
            .then(user =>{
                if(user){
                    res.json({success:true,user})
                }
            }).catch(err => res.json({success:false,error:err}))
    }



    // sendRequestToAllDeptUser(newRequest){
    //     const department_id = newRequest.created_for.department_id._id;
    //     User.find({department_id}).then(users =>{
    //         const  sockets = req.app.get("sockets");
    //         users.forEach((user,index) =>{
    //             if(sockets[user._id]){
    //                 sockets[user._id].emit('new-incoming-request',newRequest)
    //             }
    //         })
    //     })
    // }


    getNotifictions(req,res){
        NotificationController.getNotifications(req,res)
    }



}


module.exports = new RequestController();