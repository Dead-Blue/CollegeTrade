var users = require('../../Server/controllers/users.js');
var items = require('../../Server/controllers/items.js');
var orders = require('../../Server/controllers/orders.js');
module.exports = function(app){
	app.route('/item')
	   .post(users.requiresLogin, items.create)
	   .get(items.renderPublish);
	   
	   app.route('/items')
	   .get(items.list)
	   .post(users.requiresLogin, orders.create);
	   
	   app.route('/items/:itemId')
	   .get(items.read);
	   
	   app.param('itemId',items.itemByID);
}