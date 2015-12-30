exports.render = function(req,res) {
	res.render('index', {
		title: 'Hello',
		user: JSON.stringify(req.user)
	});
};
exports.test = function(req,res) {
	res.render('../Test/test', {
	});
};