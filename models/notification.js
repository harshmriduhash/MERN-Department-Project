const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    actor_id: { type: Schema.Types.ObjectId, ref: 'users',required:true },
    request_for:{ type: Schema.Types.ObjectId, ref: 'users'},
	created_at: { type: Date, required: true, default: Date.now },
    seen: { type:Boolean,default: false },
    status:{ type: String,default: 'unread' },
    type:{type:String,required:true},
	payload: {
        request_id:{ type: Schema.Types.ObjectId, ref: 'requests' },
        request_text:String,
    }
});


module.exports = Notification = mongoose.model('Notification', NotificationSchema);