var mongoose = require('mongoose');
var Order = mongoose.model('Order');
var User = mongoose.model('User');
var Item = mongoose.model('Item');
var xssFilters = require('xss-filters');

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
exports.customerList = function (req, res) {
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
exports.sellerList = function (req, res) {
	Order.find({seller:req.user._id}).sort('-created')
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
exports.orderById = function (req, res, next, id) {
    Order.findById(id)
        .populate('customer', 'firstName lastName fullName')
        .populate('seller', 'firstName lastName fullName')
        .populate('item', 'itemname description unitPrice')
        .exec(function (err, order) {
            if (err)
                return next(err);
            if (!order) return next(new Error('载入订单信息' + id + '失败'));
            var now = new Date();
            if (order.expireDate.getTime() < now.getTime()) {
                if (order.state != 'closed') {
                    order.state = 'closed';
                    order.save(function (err) {
                        if (err) {
                            return res.send({
                                message: '载入订单信息' + id + '失败'
                            });
                        }
                    });
                }
                return res.send({
                    message: '订单' + id + '已过期'
                });
            }

            req.order = order;
            next();
        })
};
exports.read = function(req, res){
	res.json(req.order);
};
exports.customerUpdate=function(req,res){
    var order = req.order;
    if (!order) return res.send({message: '载入订单信息失败'});
    switch(req.body.updateType){
        case 'rate': 
             order.rate=xssFilters.inHTMLData(req.body.rate);
             order.rateValue=req.body.rateValue;
             break;
        case 'state':
             order.state=xssFilters.inHTMLData(req.body.state);
             break;
        case 'rate&state': 
             order.state=xssFilters.inHTMLData(req.body.state);
             order.rate=xssFilters.inHTMLData(req.body.rate);
             order.rateValue=req.body.rateValue;
             break;
    }
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
exports.sellerUpdate=function(req,res){
    var order = req.order;
    if (!order) return res.send({message: '载入订单信息失败'});
    switch(req.body.updateType){
        case 'rate': order.rate=xssFilters.inHTMLData(req.body.rate);break;
        case 'state': order.state=xssFilters.inHTMLData(req.body.state);break; 
        case 'rate&state': order.state=xssFilters.inHTMLData(req.body.state);order.rate=req.body.rate;break;
    }
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
exports.customerHasAuthorization = function(req, res, next) {
	if (req.order.customer.id !== req.user.id) {
		return res.status(403).send({
			message: '用户未授权'
		});
	}
	next();
};
exports.sellerHasAuthorization = function(req, res, next) {
	if (req.order.seller.id !== req.user.id) {
		return res.status(403).send({
			message: '用户未授权'
		});
	}
	next();
};
exports.addRate= function(req,res,next,id){
   var order = req.order;
    if (!order) return res.send({message: '载入订单信息失败'});
    order.rate=req.body.rate;
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