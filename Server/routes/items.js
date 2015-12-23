var users = require('../../Server/controllers/users.js');
var items = require('../../Server/controllers/items.js');
var orders = require('../../Server/controllers/orders.js');
module.exports = function(app){
	app.route('/api/item')
	   .post(users.requiresLogin, items.create)
	   
	   app.route('/api/items')
	   .get(items.list)
	   
	   app.route('/api/items/:itemId')
	   .get(items.read);
	   
	   app.param('itemId',items.itemByID);
}