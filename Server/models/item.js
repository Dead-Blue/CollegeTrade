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
	stock:{
		type: Number,
		default: 1,
		validate: [
			function(stock){
				return stock>=0&&stock<=9999;
			},
			'剩余库存数量必须大于0或小于9999'
		]
	},
	unitPrice: {
		type: Number,
		required: '请输入价格'
	},
  imagesUrl:[{
		type:String,
		default:'/views/Images/defaultItemImg.jpg'
	}],
    itemType:{
        type:String,
        enum:{
            values:'生活用品 电子产品 学习用品 图书 电脑配件 其他'.split(' '),
            message:'商品类型错误'
        }
    },
	state: {
		type: String,
		enum: 'selling noStock invalid'.split(' ')
	}
});
ItemSchema.methods.isHaveStock = function(stock) {
	return this.stock >= stock;
};
ItemSchema.set('toJSON', {
	getters:true,
	virtuals: true
});
mongoose.model('Item', ItemSchema);
