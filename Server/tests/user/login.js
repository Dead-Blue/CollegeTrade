var superagent = require('superagent');
var agent = superagent.agent();
var theAccount = {
  username: "username",
  password: "password"
};

exports.login = function (request, done) {
  request
    .post('/api/authentication')
    .send(theAccount)
    .end(function (err, res) {
      if (err) {
        throw err;
      }
      agent.saveCookies(res);
      done(agent);
    });
};