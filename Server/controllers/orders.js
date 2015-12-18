var mongoose = require('mongoose'),
    Order = mongoose.model('Order');
var User = mongoose.model('User');
var Item = mongoose.model('Item');
var getErrorMessage = function (err) {
	if (err.errors) {
		for (var errName in err.errors) {
			if (err.errors[errName].message)
				return err.errors[errName].message;
		}
	} else {
		return 'Unknown server error';
	}
};
exports.create = function (req, res) {
	var item = req.item;
	var oldQuantity = item.quantity;
	if (oldQuantity <= req.body.quantity)
		return res.status(400).send({
			message: '商品库存不足'
		});
	else {
		item.update({ $set: { quantity: oldQuantity - req.body.quantity } }, { w: 1 }, function (err, item) {
			if (err) {
				return res.status(400).send({
					message: getErrorMessage(err)
				});
			} else {
				req.item.quantity = item.quantity;
				var order = new Order({
					seller:req.item.seller,
					item:req.item,
					customer:req.body.user,
					unitPrice:req.body.user,
					quantity:req.body.quantity,
					state:"trading"
				});
				order.save(function (err) {
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
	}


};