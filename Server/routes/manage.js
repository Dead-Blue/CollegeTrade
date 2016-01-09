var manage = require('../../Server/controllers/manage.js');
module.exports = function(app) {
	app.route('/api/management')
    .get(manage.renderSignin)
    .post(manage.signin)
    
    app.route('/api/manager')
    .get(manage.userInfo)
	.post(manage.addManager)
    .put(manage.changePassword);
};