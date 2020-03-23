const Department = require('../models/Department.js');
const mongoose = require('mongoose');
const departmetNames = ['Accounts and Finance','HR','Sales and marketing','Research and development','Learning and development','IT services','Product development','Admin department','Security and transport']

mongoose.connect('mongodb://anup:switch027app@ds151523.mlab.com:51523/switch-on-app', function (err) {
    if (err) {
        console.log(err)
    } else {
        console.log('inside');
         createDepartment()
        
    }
})
function createDepartment(){
    departmetNames.forEach(department =>{
        let data = {};
        data.name = department;
        new Department(data).save().then(newDept =>{
            console.log(newDept);
        }).catch(err => console.log(err));
    })
}