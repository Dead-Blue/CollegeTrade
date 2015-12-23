var app =require('../../../Server');
var should = require('should');
var mongoose = require('mongoose');
var User=mongoose.model('User');
var Item = mongoose.model('Item');

var user,item;
describe('商品Model单元测试', function(){
	beforeEach(function(done){
		user=new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName:'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password',
			college: 'njust'
		});
		user.save(function(){
			item=new Item({
				seller:user,
				itemname:'test',
				description:'test',
				stock:3,
				unitPrice:2
				
			});
			done();
		});
	});
	describe('测试商品的数据库存储操作', function() {
		it('正确存储商品', function(){
			item.save(function(err){
				should.not.exist(err);
			});
		});
		it('没有商品名称时商品存储应当出错',function(){
			item.itemname='';
			item.save(function(err){
				should.exist(err);
			});
		});
		it('存储的商品中应当包含卖家信息',function(){
			item.save(function(err){
				should.exist(item.seller);
			});
		});
	});
    describe('测试商品的数据库更新操作', function() {
        it('正确更新商品库存', function(){
            item.stock=item.stock-1;
            item.save(function(err,item){
                item.should.have.property('stock',2);
			});
		});
	});
	afterEach(function(done){
		Item.remove(function(){
			User.remove(function(){
				done();
			});
		});
	});
});