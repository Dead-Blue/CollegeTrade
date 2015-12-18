var app =require('../../../Server');
var should = require('should');
var mongoose = require('mongoose');
var User=mongoose.model('User');
var Item = mongoose.model('Item');
var Order = mongoose.model('Order');

var user1,user2,item,order;
describe('Item Model Unit Tests:', function(){
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
			displayName:'Full1 Name',
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
				quantity:1,
				unitPrice:2
				
			});
			item.save(function(err){
				order=new Order({
					seller:user1,
					customer:user2,
					item:item,
					state:'trading'
				})
			});
	});
	describe('Testting the save method', function() {
		it('Should be able to save without problems', function(){
			item.save(function(err){
				should.not.exist(err);
			});
		});
		it('Should not be able to save an item without an item name',function(){
			item.itemname='';
			item.save(function(err){
				should.exist(err);
			});
		});
		it('Should not be able to save an item that have seller',function(){
			item.save(function(err){
				should.exist(item.seller);
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