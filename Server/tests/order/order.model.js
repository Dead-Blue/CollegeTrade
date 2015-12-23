var app =require('../../../Server');
var should = require('should');
var mongoose = require('mongoose');
var User=mongoose.model('User');
var Item = mongoose.model('Item');
var Order = mongoose.model('Order');

var user1,user2,item,order;
describe('订单模型单元测试', function(){
	beforeEach(function(done){
		user1=new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName:'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password',
			college: 'njust'
		});
		user2=new User({
			firstName: 'Full2',
			lastName: 'Name2',
			displayName:'Full2 Name',
			email: 'test2@test.com',
			username: 'username2',
			password: 'password2',
			college: 'njust'
		});
		user1.provider='local'
		user2.provider='local'
		user2.save(function(){			
		});
		user1.save(function(){			
		});
		item=new Item({
				seller:user1,
				itemname:'test',
				description:'test',
				stock:1,
				unitPrice:2	
			});
			item.save(function(err){
				order=new Order({
					seller:user1,
					customer:user2,
					item:item,
                    unitPrice:2,
                    quantity:1,
					state:'trading'
				});
              done();
			});

	});
	describe('测试订单存储', function() {
		it('正常存储订单', function(){
        order.save(function(err){
          should.not.exist(err);
        });
		});
        
		 it('购买商品数量为0时应当存储失败',function(){
		 	order.quantity=0;
		 	order.save(function(err){
		 		should.exist(err);
		 	});
		 });
	});
	afterEach(function(done){
        Order.remove(function(){
		Item.remove(function(){
			User.remove(function(){
				done();
			});
		});
        })
	});
});