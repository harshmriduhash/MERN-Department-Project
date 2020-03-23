const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const DepartmentSchema = new Schema({
    name: {type: String,unique:true,required:true},
    created_at: { type: Date,default: Date.now}
});

module.exports = Department = mongoose.model('departments', DepartmentSchema);