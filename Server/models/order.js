var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var OrderSchema = new Schema({
	seller:{
		type:Schema.ObjectId,
		ref: 'User'
	},
	item:{
	    type:Schema.ObjectId,
		ref: 'Item'	
	},
	customer:{
		type:Schema.ObjectId,
		ref: 'User'
	},
	created: {
		type: Date,
		default: Date.now
	},
	unitPrice:{
		type:Number,
		required: '价格错误'
	},
	quantity:{
		type:Number,
		required:'购买数量必须大于0'
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
OrderSchema.virtual('price').get(function() {
	return this.quantity*this.unitPrice;
});
OrderSchema.set('toJSON', {
	getters:true,
	virtuals: true
});
mongoose.model('Order', OrderSchema);