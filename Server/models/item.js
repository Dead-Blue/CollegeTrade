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
	itemname:{
		type: String,
		default: '',
		trim: true,
		required: '必须填写商品名称'
	},
	description:{
		type: String,
		default: '',
		trim: true
	},
	quantity:{
		type: Number,
		default: 1,
		validate: [
			function(quantity){
				return quantity>=1&&quantity<=9999;
			},
			'数量必须大于1或小于9999'
		]
	},
	unitPrice: {
		type: Number,
		required: '请输入价格'
	},
	state: {
		type: String,
		enum: ['selling', 'noStock', 'invalid']
	}
});

ItemSchema.virtual('price').get(function() {
	return this.quantity*this.unitPrice;
});
ItemSchema.set('toJSON', {
	getters:true,
	virtuals: true
});
mongoose.model('Item', ItemSchema);