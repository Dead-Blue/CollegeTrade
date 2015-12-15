var config = require('./config'),
mongoose = require('mongoose');
module.exports = function() {
	var db = mongoose.connect(config.db);
	require('../Server/models/user');
	require('../Server/models/item.js');
	require('../Server/models/order.js')
	return db;
};