var manage = require('../../Server/controllers/manage');
var articles = require('../../Server/controllers/articles');
module.exports = function(app) {
    app.route('/api/articles')
       .get(articles.list)
       .post(manage.requiresLogin, articles.create);
       
    app.route('/api/articles/:articleId')
       .get(articles.read)
       .put(manage.requiresLogin, articles.hasAuthorization, articles.update)
       .delete(manage.requiresLogin, articles.hasAuthorization, articles.delete);
       app.param('articleId', articles.articleByID);
};