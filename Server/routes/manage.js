var manage = require('../../Server/controllers/manage.js');
module.exports = function(app) {
	app.route('/manage/login')
    .get(manage.renderSignin)
    .post(manage.signin)
    
    app.route('/manage/addManager')
    .get(manage.requiresLogin,manage.renderAddmanage)
	.post(manage.requiresLogin,manage.addManager)
    .put(manage.requiresLogin,manage.changePassword);
    app.route('/manage/sellData')
    .get(manage.requiresLogin,manage.renderGetSellData)
    
    app.route('/api/sellData')
    .get(manage.getSellData)
    
     app.route('/manage/manageIndex')
     .get(manage.renderIndex)
     
     app.route('/manage/dataTable')
     .get(manage.renderDataTable)
     
     app.route('/manage/orderData')
     .get(manage.requiresLogin,manage.getOrderList)
     
     app.route('/manage/deleteUser')
    .post(manage.requiresLogin,manage.deleteUser)
    
    app.route('/manage/findUserList')
    .get(manage.requiresLogin,manage.findUserList)
    
     app.route('/manage/deleteItem')
    .post(manage.requiresLogin,manage.deleteItem)
};