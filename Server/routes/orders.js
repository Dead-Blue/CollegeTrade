var users = require('../../Server/controllers/users.js');
var orders = require('../../Server/controllers/orders.js');
module.exports = function(app){
	app.route('/api/order')
	   .post(users.requiresLogin, orders.create);


	    app.route('/api/orders/seller')
	   .get(users.requiresLogin, orders.sellerList)
       
       app.route('/api/orders/customer')
	   .get(users.requiresLogin, orders.customerList)
       
	   app.route('/api/orders/customer/:orderId')
	   .get(users.requiresLogin,orders.customerHasAuthorization,orders.read)
       .put(users.requiresLogin,orders.customerHasAuthorization,orders.customerUpdate);
       
       app.route('/api/orders/seller/:orderId')
	   .get(users.requiresLogin,orders.sellerHasAuthorization,orders.read)
       .put(users.requiresLogin,orders.sellerHasAuthorization,orders.sellerUpdate);
	   
	   app.param('orderId',orders.orderById);
}