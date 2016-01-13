var app =require('../../../Server');
var should = require('should');
var mongoose = require('mongoose');
var User=mongoose.model('User');

var user
describe('用户模型单元测试', function(){
	beforeEach(function(done){
		user=new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName:'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password',
			college: 'njust',
            phone:'18751973677',
            avatar:'/uploadAvatars/upload_88a1267746300c1b290170f1dbc1e8a9.jpg'
		});
		user.provider='local'
        done();
	});
	describe('测试用户注册', function() {
		it('正常注册用户', function(){
        user.save(function(err){
          should.not.exist(err);
        });
		});
        
		 it('密码小于7位时应当存储失败',function(){
		 	user.password='abcdef';
		 	user.save(function(err){
		 		should.exist(err);
		 	});
		 });
	});
	afterEach(function(done){
			User.remove(function(){
				done();
			});
	});
});