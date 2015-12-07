var users = require('../../Server/controllers/users.js');
var items = require('../../Server/controllers/items.js')

module.exports = function(app){
	app.route('/items')
	   .post(users.requiresLogin, items.create);
}