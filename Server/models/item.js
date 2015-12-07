var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ItemSchema = new Schema({
	seller:{
		type:Schema.ObjectId,
		ref: 'User'
	},
	created: {
		type: Date,
		default: Date.now
	},
	state: {
		type: String,
		enum: ['selling', 'noStock', 'invalid']
	}
});
mongoose.model('Item', ItemSchema);