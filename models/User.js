const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String,required: true},
    password: {type: String, required: true},
    department_id:{type:Schema.Types.ObjectId,ref:'departments',required:true},
    created_at: {type: Date,default: Date.now}
});

module.exports = User = mongoose.model('users', UserSchema);