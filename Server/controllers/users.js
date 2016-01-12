/* global res */
/* global _this */
var User = require('mongoose').model('User');
var passport = require('passport');
var formidable = require('formidable');
var Message = require('mongoose').model('Message');
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
        user.username=user.username.toLowerCase() ;
		var message = null;
		user.provider = 'local';
		
	user.save(function(err) {
		if(err) {
			var message = getErrorMessage(err);
			req.flash('error', message);
			return res.send({
			message: '注册失败'+message,
            success: false
		});
		}
		req.login(user, function(err) {
			if (err) return next(err);
			return res.send({
			message: '登录成功',
            success: true,
            user:user
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
			message: '用户未登录！',
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
exports.updateAvatar = function(req,res){
     if (!req.isAuthenticated()) { return res.status(403).send({
			message: '用户未登陆！',
            success: false
		}); }
	    User.findOne({
            username:req.body.username.toLowerCase()
        },function(err,user){
            if(err){
				return res.send({
			message: '查找用户失败！',
            success: false 
		});
        }
        if (!user) { return res.send({
			message: '用户不存在！！',
            success: false
		}); }
        user.update({$set:{avatar:req.body.filepaths}},function(err,user){
            if(err){
                return res.send({
			message: '上传头像失败，请重试！！',
            success: false
		});
}
           return res.send({
			message: '上传头像成功！！',
            avatarPath:req.body.filepaths,
            success: true
		});
        })
        
        })
 
};
exports.userByID = function(req,res,next,id) {
    User.findOne({
        _id:id
    },function(err,user){
        if(err)
        return next(err);
        else {
            user.passport="";
            user.salt="";
        req.targetUser=user;
        next();
    }
    });
}
exports.read = function(req,res){
    res.json(req.user);
};
exports.changePassword=function(req,res){
    if (!req.isAuthenticated()) { return res.status(403).send({
			message: '用户未登陆！',
            success: false
		}); }
	    User.findOne({
            username:req.body.username.toLowerCase()
        },function(err,user){
            if(err){
				return res.send({
			message: '查找用户失败！',
            success: false 
		});
        }
        console.log(user);
        if (!user) { return res.send({
			message: '用户不存在！！',
            success: false
		}); }
        if(!user.authenticate(req.body.oldPassword)) {
				return res.send({
			message: '密码错误！！',
            success: false
		});
		}
        user.password=req.body.newPassword;
        user.save(function(err,user){
            if(err){
                return res.send({
			message: '密码修改失败，请重试！！',
            success: false
		});
}
           return res.send({
			message: '密码修改成功！！',
            success: true
		});
        })
        
        })
 
}

exports.parseForm = function (req, res, next) {
    var form = new formidable.IncomingForm();
    form.uploadDir = __dirname + "../../../Client/uploadAvatars/";
    form.encoding = 'utf-8';
    form.maxFieldsSize = 2 * 1024 * 1024;
    form.maxFields = 1000;
    form.multiples = true;
    form.keepExtensions = true;
    form.parse(req, function (err, fields, files) {
        if (err)
            return next(err);
        req.body = fields;
        req.body.filepaths =setImageUrl((files.avatar.path))
        next();
    });
};

function setImageUrl(path){
    var index=path.indexOf("uploadAvatars");
    return '/uploadAvatars/'+path.substring(index+14);
}

exports.sendMessageToUser = function(req,res){
    var target = req.targetUser;
    req.targetUser=undefined;
    var creator = req.user;
    var content = req.body.content;
    var message = new Message({
        user:target,
        creator:creator,
        content:content
    });
    message.save(function(err) {
        if(err) {
            return res.status(500).send({
                success:false,
                message: getErrorMessage(err)
            });
        } else {
            res.json({
                success:true,
                message:'发送消息成功'
                });
        }
    });
};

exports.getMessages = function(req,res){
     Message.find({user:req.user._id}).sort('-created').populate('user','firstName lastName fullName').populate('creator', 'firstName lastName fullName').
    exec(function(err, messages) {
        if(err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            res.json({
                success:true,
                message:messages
                });
        }
    });
};

exports.messageAuthorization = function(req,res,next){
    if(req.message.user._id!=req.user._id){
     return res.status(403).send({
            success:false,
            message: '用户未授权'
        });
    }
    next();
};

exports.deleteMessage = function(req,res){
    var message = req.message;
    message.remove(function(err) {
        if(err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            res.json({
                success:true,
                });
        }
    });
};

exports.messageByID = function(req,res,next,id){
     Message.findById(id).populate('creator', 'firstName lastName fullName').exec(function(err, message) {
        if (err) return next(err);
        if (!message) return next(new Error('载入信息失败' + id));
        req.message = message;
        next();
    });
};

exports.readMessage = function(req,res){
    res.json(req.message);
};