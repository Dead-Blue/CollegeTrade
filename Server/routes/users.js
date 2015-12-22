var users = require('../../Server/controllers/users');
var passport = require('passport');

module.exports = function(app) {
	
	app.route('/api/user')
	.post(users.signup);

	
	app.route('/api/authentication')
    .post(users.signin)
    .delete('/api/authentication', users.signout);
};