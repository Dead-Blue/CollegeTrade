module.exports = function(app) {
  var index = require('../controllers/index.js');
  app.get('/',index.render);
//   app.get('/api/test',index.test);
  app.get('/api/recentVisitNumber',index.recentVisitNumber)
};
