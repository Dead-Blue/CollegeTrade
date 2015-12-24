/* global res */
/* global _this */
var User = require('mongoose').model('User');
var passport = require('passport');
var getErrorMessage = function(err) {
	var message = '';
	if (err.code) {
		switch (err.code) {
			case 11000:
			case 11001:
			  message = 'Username already exists';
			  break;
			default:
			  message = 'Something went wrong';
		}
	} else {
		for (var errName in err.errors) {
			if (err.errors[errName].message) message = err.errors[errName].message;
		}
	}
	return message;
};

exports.renderSignin = function (req, res, next) {
	if (!req.user) {
		res.render('signin', {
			title: 'Sign-in Form',
			messages: req.flash('error') || req.flash('info')
		});
	} else {
		return res.redirect('/');
	}
};

exports.renderSignup = function(req, res, next) {
	if (!req.user) {
		res.render('signup', {
			title: 'Sign-up Form',
			messages: req.flash('error')
		});
	} else {
		return res.redirect('/');
	}
};

exports.signup = function(req, res, next) {
	if(!req.user) {
		var user = new User(req.body);
		var message = null;
		
		user.provider = 'local';
		
	user.save(function(err) {
		if(err) {
			var message = getErrorMessage(err);
			req.flash('error', message);
			return res.send({
			message: '注册失败',
            success: false
		});
		}
		req.login(user, function(err) {
			if (err) return next(err);
			return res.send({
			message: '登录成功',
            success: true
		});
		});
	});
	} else {
		return res.send({
			message: '用户已登录',
            success: false
		});
	}
};

exports.signout = function(req, res) {
	req.logout();
	return res.send({
			message: '注销成功',
            success: true
            
		});
};

exports.requiresLogin = function(req, res, next) {
	if (!req.isAuthenticated()) {
		return res.status(401).send({
			message: 'User is not logged in',
            success: false
            
		});
	}
	next();
};
exports.signin=function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.status(401).send({
			message: '登陆失败',
            info:info,
            success: false
		}); }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.send({
			message: '登陆成功',
            user:user,
			id:user._id,
            success: true
		});
    });
  })(req, res, next);
};

exports.isLogin = function(req,res){
    if(req.user)
    return res.send({
        isLogin:true,
        messages: req.flash('error')|| req.flash('info')
    });
    else
    return res.send({
        isLogin:false,
        messages: req.flash('error')|| req.flash('info')
    });
}
exports.userInfo = function(req,res){
     if(req.user)
    return res.send({
        success:true,
        user:req.user,
        messages: req.flash('error')|| req.flash('info')
    });
    else
    return res.send({
        success:false,
        messages: req.flash('error')|| req.flash('info')
    });
}