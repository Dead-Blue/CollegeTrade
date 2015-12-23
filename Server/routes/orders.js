var users = require('../../Server/controllers/users.js');
var orders = require('../../Server/controllers/orders.js');
module.exports = function(app){
	app.route('/api/order')
	   .post(users.requiresLogin, orders.create);


	    app.route('/api/orders')
	   .get(users.requiresLogin, orders.list)
       
	   app.route('/api/orders/:orderId')
	   .get(users.requiresLogin,orders.read);
	   
	   app.param('orderId',orders.orderById);
}