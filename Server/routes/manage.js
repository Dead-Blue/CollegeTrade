var manage = require('../../Server/controllers/manage.js');
module.exports = function(app) {
	app.route('/manage/login')
    .get(manage.renderSignin)
    .post(manage.signin)
    
    app.route('/manage/addManager')
    .get(manage.userInfo)
	.post(manage.addManager)
    .put(manage.changePassword);
    
     app.route('/manage/manageIndex')
     .get(manage.renderIndex)
};