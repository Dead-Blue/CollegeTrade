var app = require('../../../Server');
var request = require('supertest')(app);;
var should = require('should');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Item = mongoose.model('Item');
var login = require('./login');
var user, item;
describe('商品Controller测试', function () {
    beforeEach(function (done) {
        user = new User({
            firstName: 'Full',
            lastName: 'Name',
            displayName: 'Full Name',
            email: 'test@test.com',
            username: 'username',
            password: 'password',
            college: 'njust'
        });
        user.provider = 'local';
        user.save(function () {

        });

        done();

    });
    describe('测试POST方法', function () {
        var agent;
        beforeEach(function (done) {
            login.login(request, function (loginAgent) {
                agent = loginAgent;
                done();
            });
        });

        //     it('login',  function(done) {
        //     request
        //         .post('/api/authentication')
        //         .send({ username: 'username2', password: 'password2' })
        //         .end(function (err, res) {
        //        if (err) return done(err);
        //      res.body.should.be.an.Object.and.have.property('success',true)
        //        return done();
        //     });
        
        // });
        it('创建商品', function (done) {
            var req = request
                .post('/api/item');
            agent.attachCookies(req);
            req.send({ itemname: 'test', description: 'test', unitPrice: 2, stock: 10 })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function (err, res) {
                    res.body.should.be.an.Object.and.have.property('state', 'selling');
                    res.body.should.have.property('unitPrice', 2);
                    res.body.should.have.property('stock', 10);
                    res.body.should.have.property('itemname', 'test');
                    res.body.should.have.property('description', 'test');
                    done();
                });
        });
        it('创建订单(没有商品名)', function (done) {
            var req = request
                .post('/api/item');
            agent.attachCookies(req);
            req.send({  itemname: '', description: 'test', unitPrice: 2, stock: 10 })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function (err, res) {
                    res.body.should.be.an.Object.and.have.property('message', '必须填写商品名称');
                    done();
                });
        });
    });
    describe('测试GET方法', function () {
        beforeEach(function (done) {
            item = new Item({
                seller: user,
                itemname: 'test',
                description: 'test',
                stock: 1,
                unitPrice: 2,
                state: "selling"
            });
            item.save(function (err) {
                done();
            });
        })
        it('获得商品列表信息', function (done) {
            request.get('/api/items')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function (err, res) {
                    res.body.should.be.an.Array.and.have.lengthOf(1);
                    res.body[0].should.have.property('itemname');
                    res.body[0].should.have.property('description', item.description);
                    done();
                });
        });

        it('获得特定的商品信息', function (done) {
            request.get('/api/items/' + item.id)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function (err, res) {
                    res.body.should.be.an.Object.and.have.property('itemname', item.itemname);
                    res.body.should.have.property('description', item.description);
                    res.body.seller.should.have.property('_id', item.seller.toString());
                    done();
                });
        });
    });
    afterEach(function (done) {
        Item.remove().exec();
        User.remove().exec();
        done();
    });
});