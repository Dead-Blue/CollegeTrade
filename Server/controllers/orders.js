var mongoose = require('mongoose');
var Order = mongoose.model('Order');
var User = mongoose.model('User');
var Item = mongoose.model('Item');
var getErrorMessage = function (err) {
	if (err.errors) {
		for (var errName in err.errors) {
			if (err.errors[errName].message)
				return err.errors[errName].message;
		}
	} else {
		return '未知服务器错误';
	}
};
exports.create = function (req, res) {
	var item = (req.body.item);
	var stock = item.stock;
    if(!item){
        return res.status(400).send({
			message: '获取商品信息失败'
		});
    }else if (stock < req.body.quantity)
		return res.status(400).send({
			message: '商品库存不足'
		});
	else {
       Item.findById(item._id,function(err,item){
           item.stock=stock-req.body.quantity; 
           if(item.stock===0)
           item.state='noStock'
		item.save(function (err, item) {
			if (err) {
                throw err;
				return res.status(400).send({
					message: getErrorMessage(err)
				});
			} else {
				var order = new Order({
					seller:item.seller,
					item:item,
					customer:req.user,
					unitPrice:req.body.unitPrice,
					quantity:req.body.quantity,
					state:"trading"
				});
				order.save(function (err,order) {
					if (err) {
						return res.status(400).send({
							message: getErrorMessage(err)
						});
					} else {
						res.json(order);
					}
				});
			}
		});
       });        
	}
};
exports.list = function (req, res) {
	Order.find({customer:req.user._id}).sort('-created')
    .populate('customer','firstName lastName fullName')
    .populate('seller','firstName lastName fullName')
    .populate('item','itemname description unitPrice')
    .exec(function (err, orders) {
		if (err) {
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			res.json(orders);
		}
	});
};
exports.orderById= function(req,res,next,id){
    Order.findById(id)
    .populate('customer','firstName lastName fullName')
    .populate('seller','firstName lastName fullName')
    .populate('item','itemname description unitPrice')
    .exec(function(err,order){
        if (err)
				return next(err);
			if (!order) return next(new Error('载入订单信息' + id + '失败'));
		req.order=order;
		next();
    })
};
exports.read = function(req, res){
	res.json(req.order);
};
exports.update=function(req,res){
    var order = req.order;
    if (!order) return res.send({message: '载入订单信息失败'});
    order.state=req.body.state;
    order.save(function(err){
        if(err){           
			return res.status(400).send({
				message: getErrorMessage(err)
			});	
        } else {
			res.json(order);
        }
    })
};
exports.hasAuthorization = function(req, res, next) {
	if (req.order.customer.id !== req.user.id) {
		return res.status(403).send({
			message: '用户未授权'
		});
	}
	next();
};