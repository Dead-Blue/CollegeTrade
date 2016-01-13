var app = require('../../../Server');
var request = require('supertest')(app);;
var should = require('should');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var login = require('./login');
var user;
describe('用户Controller测试', function () {
    beforeEach(function (done) {
        done();
    });
    describe('测试POST方法', function () {
        it('用户注册', function (done) {
           request
                .post('/api/user')
                .send({username:'test',
                password:'1234567',
                email:'test@test.com',
                firstName:'Full',
                lastName:'Name',
                college:'Name',
                phont:'18751973677'})
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function (err, res) {
                    res.body.user.should.be.an.Object.and.have.property('username', 'test');
                    res.body.user.should.have.property('email', 'test@test.com');
                    done();
                });
        });
        it('创建用户密码小于7位会出错', function (done) {
             request
                .post('/api/user')
                .send({username:'test',
                password:'123456',
                email:'test@test.com',
                firstName:'Full',
                lastName:'Name',
                college:'Name',
                phont:'18751973677'})
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function (err, res) {
                    res.body.should.be.an.Object.and.have.property('message', '注册失败密码必须大于等于7位');
                    done();
                });
        });
    });
    describe('测试GET方法', function () {
        var agent;
        beforeEach(function (done) {
                   user = new User({
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
        user.provider = 'local';
        user.save(function () {
            login.login(request, function (loginAgent) {
                agent = loginAgent;
                done();
            });
        });
        })
        it('获得用户信息', function (done) {
             var req =request.get('/api/user/')
            agent.attachCookies(req);
                req.set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function (err, res) {
                    res.body.user.should.be.an.Object.and.have.property('fullName', user.firstName+user.lastName);
                    done();
                });
        });
    });
    afterEach(function (done) {
        User.remove().exec();
        done();
    });
});