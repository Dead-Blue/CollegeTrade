var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MessageSchema = new Schema({
	user:{
		type:Schema.ObjectId,
		ref: 'User'
	},
	creator:{
		type:Schema.ObjectId,
		ref: 'User'
	},
	created: {
		type: Date,
		default: Date.now
	},
    content:{
        type:String,
        default:'',
        trim: true
    }
});
mongoose.model('Message', MessageSchema);