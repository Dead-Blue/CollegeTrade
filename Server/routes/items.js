var users = require('../../Server/controllers/users.js');
var items = require('../../Server/controllers/items.js');
var orders = require('../../Server/controllers/orders.js');
module.exports = function(app){
	app.route('/publish_items')
	   .post(users.requiresLogin, items.create)
	   .get(items.renderPublish);
	   
	   app.route('/show_items')
	   .get(items.list)
	   app.route('/buy_items')
	   .post(users.requiresLogin, orders.create)
}