var mongoose = require('mongoose'),
    Item = mongoose.model('Item');
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
    var item = new Item(req.body);
    item.seller = req.user;
	item.state = "selling";
	item.save(function (err) {
		if (err) {
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			res.json(item);
		}
	});
};

exports.list = function (req, res) {
	Item.find().sort('-created').populate('seller','firstName lastName fullName').exec(function (err, items) {
		if (err) {
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			res.json(items);
		}
	});
};

exports.articleByID = function (req, res, next, id) {
	Item.findById(id).populate('seller')//或者使用populate('seller','xx'),其中xx为限定返回的内容
		.exec(function (err, item) {
			if (err)
				return next(err);
			if (!item) return next(new Error('载入商品信息' + id + '失败'));
		req.item=item;
		next();
	});
};

exports.renderPublish = function(req, res, next) {
	if (req.user) {
		res.render('items_publish', {
			title: 'Publish items Form',
			messages: req.flash('error')
		});
	} else {
		return res.redirect('/signin');
	}
};