var config = require('./config'),
mongoose = require('mongoose');
module.exports = function() {
	var db = mongoose.connect(config.db);
	require('../Server/models/user');
	require('../Server/models/item.js');
	require('../Server/models/order.js');
    require('../Server/models/manage.js');
    require('../Server/models/article.js');
	return db;
};