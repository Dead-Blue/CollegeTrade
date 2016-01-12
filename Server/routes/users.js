var users = require('../../Server/controllers/users');
var passport = require('passport');

module.exports = function(app) {
	
	app.route('/api/user')
    .get(users.userInfo)
	.post(users.signup)
    .put(users.changePassword);
	
    app.route('/api/user/avatar')
    .post(users.requiresLogin,users.parseForm,users.updateAvatar)
    

    app.route('/api/user/messages')
    .get(users.requiresLogin,users.getMessages)
    
    app.route('/api/user/messages/:messageId')
    .get(users.readMessage)
    .delete(users.requiresLogin,users.messageAuthorization,users.deleteMessage)
    app.param('messageId', users.messageByID);
    
app.route('/api/user/:userId/message')
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