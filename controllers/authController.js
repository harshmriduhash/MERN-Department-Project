const bcrypt = require('bcryptjs');
const keys = require('../config/keys');
const User = require('../models/User.js');
const jwt = require('jsonwebtoken');
const validateRegisterInput = require('../validation/validateRegister.js');
const validateLoginInput = require('../validation/validateLogin.js');


class authController{

    constructor(){

    }



     //--------------- Register method ----------------

     register(req,res){

        const { errors, isValid } = validateRegisterInput(req.body);
        if (!isValid) {
            res.json({ success: false, errors: errors });
        }
    
        User.findOne({ email: req.body.email })
            .then(user => {
                if (user) {
                    errors.email = "Email already exists";
                    return res.json({ success: false, errors: errors });
                }
                const newUser = {
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password,
                    department_id:req.body.department_id
                };
    
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) {
                            throw err;
                        }
                        newUser.password = hash;
                        new User(newUser)
                            .save()
                            .then(user => res.status(200).json({ success: true, user: user }))
                            .catch(err => res.json({success:false,error:err}))
                    })
                })
    
    
            }).catch(err => res.json({success:false,error:err}))
    }



       //Login method

       login(req, res){

        const { errors, isValid } = validateLoginInput(req.body);
        if (!isValid) {
            return res.json({ success: false, errors: errors });
        }
        const { email } = req.body;
        const { password } = req.body;
        User.findOne({ email: email })
            .then(user => {
               
                if (!user) {
                    errors.email = "Email does not exist";
                    return res.json({ success: false,errors });
                }
                bcrypt.compare(password, user.password)
                    .then(isMatch => {
                      
                        if (!isMatch) {
                            errors.password = "Incorrect password";
                            return res.json({ success: false, errors: errors });
                        }
                        const payload = {
                            id: user._id,
                            name: user.name,
                            email: user.email,
                            department_id:user.department_id
                        };
                        console.log("payload value",payload);
                        jwt.sign(payload,
                            keys.secretOrKey,
                            (err, token) => {
                                res.json({
                                    success: true,
                                    token: 'Bearer ' + token
                                });
                            }
                        )
                    });
            }).catch(err => res.json({success:false,error:err}))
    }



    getUsersByDepartment(req,res){
        console.log(req.params)
        User.find({department_id:req.params.departmentId})
            .then(users =>{
                res.json({success:true,users})
            }).catch(err => res.json({success:false,error:err}))
    }


  

}


module.exports = new authController();