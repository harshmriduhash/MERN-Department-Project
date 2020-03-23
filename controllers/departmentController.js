const Department = require('../models/Department.js');

class departmentController{

    constructor(){

    }


    create(req,res){
        console.log(req.body)
        const {name} = req.body;
        Department.findOne({name}).then(department =>{
            console.log(department);
            if(department){
                res.json({success:false,error:"Department already exists"});
            }else{
                let newDept = {};
                newDept.name = name;
                new Department(newDept).save().then(newDepartment =>{
                    res.json({success:true,department:newDepartment});
                }).catch(err => res.json({success:false,error:err}))
            }
        }).catch(err => res.json({success:false,error:err}))
    }


    getDepartments(req, res){
        Department.find().then(departments =>{
            res.json({success:true,departments})
        }).catch(err => res.json({success:false,error:err}))
    }
    

    getDepartmentsForReq(req,res){
        console.log(req.user)
        Department.find({_id:{$ne:req.user.department_id}}).then(departments =>{
            res.json({success:true,departments})
        }).catch(err => res.json({success:false,error:err}))
    }


}


module.exports = new departmentController();