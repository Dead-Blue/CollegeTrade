var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
	User = require('mongoose').model('User');
	
module.exports = function(){
	passport.use(new LocalStrategy(function(username,password, done) {
		User.findOne({
			username: username.toLowerCase()
		}, function(err, user) {
			if(err){
				return done(err);
			}
			
			if(!user) {
				return done(null, false, {
					message: '用户不存在！'
				});
			}
			if(!user.authenticate(password)) {
				return done(null,false, {
					message: '密码错误！'
				});
			}
           user.password="";
           user.salt="";
			return done(null, user);
		});
	}));
};