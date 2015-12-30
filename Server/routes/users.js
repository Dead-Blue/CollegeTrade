var users = require('../../Server/controllers/users');
var passport = require('passport');

module.exports = function(app) {
	
	app.route('/api/user')
    .get(users.userInfo)
	.post(users.signup)
    .put(users.changePassword);
	
	app.route('/api/authentication')
    .get(users.isLogin)
    .post(users.signin)
    .delete(users.signout);
    
    app.route('/signin')
    .get(users.renderSignin);
    
    app.route('/signup')
    .get(users.renderSignup);
    app.route('/signout')
    .get(users.signout);
};