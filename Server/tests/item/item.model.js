var app =require('../../../Server');
var should = require('should');
var mongoose = require('mongoose');
var User=mongoose.model('User');
var Item = mongoose.model('Item');

var user,item;
describe('Item Model Unit Tests:', function(){
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
				quantity:1,
				unitPrice:2
				
			});
			done();
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