var users = require('../../Server/controllers/users');
var passport = require('passport');

module.exports = function(app) {
	
	app.route('/api/user')
    .get(users.userInfo)
	.post(users.signup)
    .put(users.changePassword);
	
    app.route('/api/user/avatar')
    .post(users.requiresLogin,users.parseForm,users.updateAvatar)
    

    app.route('/api/user/message')
    .get(users.requiresLogin,users.getMessages)
    
app.route('/api/user/message/:userId')
    .post(users.requiresLogin,users.sendMessageToUser)
app.param('userId', users.userByID);
     
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