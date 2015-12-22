var users = require('../../Server/controllers/users');
var passport = require('passport');

module.exports = function(app) {
	
	app.route('/api/user')
    .get(users.userInfo)
	.post(users.signup);

	
	app.route('/api/authentication')
    .get(users.isLogin)
    .post(users.signin)
    .delete(users.signout);
};