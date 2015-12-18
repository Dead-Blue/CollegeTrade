var app = require('../../../Server');
var request= require('supertest');
var should = require('should');
var mongoose=require('mongoose');
var User=mongoose.model('User');
var Item = mongoose.model('Item');

var user,item;
describe('Item Controller Unit Tests:',function(){
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
		user.provider = 'local';
		user.save(function(){
			item=new Item({
				seller:user,
				itemname:'test',
				description:'test',
				quantity:1,
				unitPrice:2,
				state:"selling"
				
			});
			item.save(function(err){
			done();
			});
		});
		
	});
	describe('Testing the GET methods',function(){
		it('shuuld be able to get the list of items', function(done){
			request(app).get('/items')
			.set('Accept','application/json')
			.expect('Content-Type',/json/)
			.expect(200)
			.end(function(err,res){
				res.body.should.be.an.Array.and.have.lengthOf(1);
				res.body[0].should.have.property('itemname');
				res.body[0].should.have.property('description',item.description);
				done();
			});
		});
		
		it('should be able to get the specific item',function(done) {
			request(app).get('/items/'+item.id)
			.set('Accept','application/json')
			.expect('Content-Type',/json/)
			.expect(200)
			.end(function(err,res){
				res.body.should.be.an.Object.and.have.property('itemname',item.itemname);
				res.body.should.have.property('description',item.description);
				res.body.should.have.property('seller',item.user);
				done();
			});
		});
	});
	afterEach(function(done){
		Item.remove().exec();
		Item.remove().exec();
		done();
	});
});