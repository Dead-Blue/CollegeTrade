var mongoose = require('mongoose'),
    Order = mongoose.model('Order');

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
    var order= new Order(req.body);
	order.state = "trading";
	order.customer=req.user;
	order.save(function (err) {
		if (err) {
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			res.json(order);
		}
	});
};