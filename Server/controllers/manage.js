/* global res */
/* global _this */
var Manage = require('mongoose').model('Manage');
var User = require('mongoose').model('User');
var Item = require('mongoose').model('Item');
var Order = require('mongoose').model('Order');
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

exports.renderSignin = function (req, res) {
	if (!req.session.manage) {
	return 	res.render('manage/Login', {
		});
	} else {
		req.session.error= '用户已登录'
       return res.redirect('/manage/manageIndex');
	}
};

exports.renderAddmanage = function(req, res, next) {
	if (req.session.manage) {
		return 	res.render('manage/addManage');
	} else {
		return res.redirect('/');
	}
};

exports.renderIndex=function(req,res){
    console.log(req.session.error);
    if(req.session.manage){
      return res.render('manage/index',{
          manage:JSON.stringify(req.session.manage)
      });
    } else {
            req.session.error='用户未登录！';
            return  res.status(403).redirect('/manage/login');    
    }
}

exports.addManager = function(req, res) {
	if(req.session.manage) {
		var manage = new Manage(req.body);
        manage.username=manage.username.toLowerCase() ;
		var message = null;
		
	manage.save(function(err,manage) {
		if(err) {
			var message = getErrorMessage(err);
			req.flash('error', message);
			req.session.error = '服务器错误'
            return    res.status(500).redirect('/manage/login')
		}
        manage.passowrd="";
        manage.salt="";
        req.session.manage= manage;
       return res.redirect('/manage/manageIndex')
		// req.login(manage, function(err) {
		// 	if (err) return next(err);
		// 	return res.send({
		// 	message: '登录成功',
        //     success: true,
        //     user:manage
		// });
		// });
	});
	} else {
        req.session.error='用户未授权';
        return res.redirect('/manage/manageIndex');
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
	if (!req.session.manage) {
		req.session.error='用户未登录';
        return res.redirect('/manage/login');
	}
	next();
};
exports.signin=function(req, res) {
//   passport.authenticate('local', function(err, user, info) {
//     if (err) { return next(err); }
//     if (!user) { return res.status(401).send({
// 			message: '登陆失败',
//             info:info,
//             success: false
// 		}); }
//     req.logIn(user, function(err) {
//       if (err) { return next(err); }
//       return res.send({
// 			message: '登陆成功',
//             user:user,
// 			id:user._id,
//             success: true
// 		});
//     });
//   })(req, res, next);
if(req.session.manage)
   return function(){
       res.session.error= '用户已登录'
       res.redirect('/manage/manageIndex');
   }
Manage.findOne({
    username:req.body.username
}, function(err,manage){
    if(err){
     
            req.session.error = '服务器错误'
         return    res.status(500).redirect('/manage/login')

    }
    if(!manage)
    {
         req.session.error = '用户不存在！'
        return   res.status(403).redirect('/manage/login')
     }
     if(!manage.authenticate(req.body.password)){
          return res.status(403).redirect('/manage/login')
     }
     manage.password="";
     manage.salt="";
     req.session.manage=manage;
     return res.redirect('/manage/manageIndex');
})
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
exports.changePassword=function(req,res){
    if (!req.isAuthenticated()) { return res.status(403).send({
			message: '用户未登陆！',
            success: false
		}); }
	    Manage.findOne({
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

exports.getSellData=function(req,res){
    var usernumbers=0;
    var life=0, study=0, book=0, computer=0 , electronic =0,others=0;
    var trading=0;var successCompleted =0; 
    User.count({}, function (err, usercounts) {
        if (err) {
            req.session.error = '服务器错误'
            return res.status(500).redirect('/manage/login')
        }
        usernumbers = usercounts;
        Item.count({
            itemType: '生活用品'
        }, function (err, lifecounts) {
            if (err) {
                req.session.error = '服务器错误'
                return res.status(500).redirect('/manage/login')
            }
            life = lifecounts;
            Item.count({
                itemType: '电子产品'
            }, function (err, electroniccounts) {
                if (err) {
                    req.session.error = '服务器错误'
                    return res.status(500).redirect('/manage/login')
                }
                electronic = electroniccounts;
                Item.count({
                    itemType: '学习用品'
                }, function (err, studycounts) {
                    if (err) {
                        req.session.error = '服务器错误'
                        return res.status(500).redirect('/manage/login')
                    }
                    study = studycounts;
                    Item.count({
                        itemType: '图书'
                    }, function (err, bookcounts) {
                        if (err) {
                            req.session.error = '服务器错误'
                            return res.status(500).redirect('/manage/login')
                        }
                        book = bookcounts;
                        Item.count({
                            itemType: '电脑配件'
                        }, function (err, computercounts) {
                            if (err) {
                                req.session.error = '服务器错误'
                                return res.status(500).redirect('/manage/login')
                            }
                            computer = computercounts;
                            Item.count({
                                itemType: '其它'
                            }, function (err, otherscounts) {
                                if (err) {
                                    req.session.error = '服务器错误'
                                    return res.status(500).redirect('/manage/login')
                                }
                                others = otherscounts;
                                Order.count({
                                    state: 'trading'
                                }, function (err, tradingcounts) {
                                    if (err) {
                                        req.session.error = '服务器错误'
                                        return res.status(500).redirect('/manage/login')
                                    }
                                    trading = tradingcounts;
                                    Order.count({
                                        state: 'successCompleted'
                                    }, function (err, successCompletedcounts) {
                                        if (err) {
                                            req.session.error = '服务器错误'
                                            return res.status(500).redirect('/manage/login')
                                        }
                                        successCompleted = successCompletedcounts;
                                        var data={
                                            usernumbers:usernumbers,
                                            life:life,
                                            electronic:electronic,
                                            study:study,
                                            book:book,
                                            computer:computer,
                                            others:others,
                                            trading:trading,
                                            successCompleted:successCompleted
                                        };
                                        return res.send({
                                            selldata:data
                                        });
                                    });//successCompleted
                                });//trading
                            });//others
                        });//computer
                    });//book
                });//study
            });//electronic
        });//life
    });//user
};

exports.renderGetSellData=function(req,res){
    res.render('manage/sellData', {
        manage: JSON.stringify(req.session.manage),
    });
};
exports.renderDataTable = function(req,res){
    res.render('manage/dataTable',{
       manage:JSON.stringify(req.session.manage) 
    });
};

exports.getOrderList = function(req,res){
	Order.find({}).sort('-created')
    .populate('customer','firstName lastName fullName')
    .populate('seller','firstName lastName fullName')
    .populate('item','itemname description unitPrice')
    .exec(function (err, orders) {
		if (err) {
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			res.json(orders);
		}
	});
};
