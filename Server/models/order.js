var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var OrderSchema = new Schema({
	seller:{
		type:Schema.ObjectId,
		ref: 'User'
	},
	customer:{
		type:Schema.ObjectId,
		ref: 'User'
	},
	created: {
		type: Date,
		default: Date.now
	},
	rate:{
		type:String,
		default:'',
		trim:true
	},
	state: {
		type: String,
		enum: ['selling', 'trading', 'evaluating','successCompleted','failedCompleted']
	}
});
mongoose.model('Order', OrderSchema);