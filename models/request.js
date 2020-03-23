const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const RequestSchema = new Schema({
    text: {type: String, required: true},
    created_by:{type:Schema.Types.ObjectId,ref:'users',required:true},
    created_for:{type:Schema.Types.ObjectId,ref:'users',required:true}, 
    status:{type:String,default:'pending'},   
    created_at: {type: Date,default: Date.now},
    updated_on:{type:Date}
});

module.exports = Request = mongoose.model('requests', RequestSchema);