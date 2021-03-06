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
    expireDate:{
      type:Date,
      default:(Date.now()+60*60*24*5*1000)
    },
	unitPrice:{
		type:Number,
		required: '价格错误'
	},
	quantity:{
		type:Number,
        validate: [
			function(quantity){
				return quantity>0;
			},
			'购买数量必须大于0'
		]
	},
	rate:{
		type:String,
		default:'',
		trim:true
	},
    rateValue:{
		type:Number,
		validate: [
			function(quantity){
				return quantity>=0&&quantity<=5;
			},
			'购买数量必须在0到5之间'
		]
	},
	state: {
		type: String,
		enum: ['selling', 'trading', 'evaluating','successCompleted','failedCompleted','closed']
	}
});
OrderSchema.virtual('price').get(function() {
	return this.quantity*this.unitPrice;
});
// OrderSchema.virtual('expireDate').get(function() {
// 	return new Date(this.created.getTime()+60*60*24*5*1000);
// });
OrderSchema.set('toJSON', {
	getters:true,
	virtuals: true
});
mongoose.model('Order', OrderSchema);