var app = require('../../../Server');
var request = require('supertest')(app);
var should = require('should');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Item = mongoose.model('Item');
var Order = mongoose.model('Order');
var login = require('./login');
var user, item, seller, customer, order;
describe('订单Controller单元测试', function () {
    beforeEach(function (done) {
        seller = new User({
            firstName: 'Full',
            lastName: 'Name',
            displayName: 'Full Name',
            email: 'test@test.com',
            username: 'username',
            password: 'password',
            college: 'njust'
        });
        customer = new User({
            firstName: 'Full2',
            lastName: 'Name2',
            displayName: 'Full2 Name',
            email: 'test2@test.com',
            username: 'username2',
            password: 'password2',
            college: 'njust'
        });
        seller.provider = 'local';
        customer.provider = 'local';
        customer.save(function () {
        });
        seller.save(function () {
        });
        item = new Item({
            seller: seller,
            itemname: 'test',
            description: 'test',
            stock: 10,
            unitPrice: 2,
            itemType:'生活用品'
        });
        item.save(function (err) {
            done();
        });

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
        it('创建订单', function (done) {
            var req = request
                .post('/api/order');
            agent.attachCookies(req);
            req.send({ customer: customer, item: item, unitPrice: '2', quantity: 10, state: "trading" })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function (err, res) {
                    res.body.should.be.an.Object.and.have.property('state', 'trading');
                    res.body.should.be.an.Object.and.have.property('unitPrice', 2);
                    res.body.should.be.an.Object.and.have.property('quantity', 10);
                    done();
                });
        });
        it('创建订单(库存不足)', function (done) {
            var req = request
                .post('/api/order');
            agent.attachCookies(req);
            req.send({ customer: customer, item: item, unitPrice: 2, quantity: 11, state: "trading" })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function (err, res) {
                    res.body.should.be.an.Object.and.have.property('message', '商品库存不足');
                    done();
                });
        });
    });

    describe('测试GET方法', function () {
        var agent;
        beforeEach(function (done) {
            order = new Order({
                seller: seller,
                customer: customer,
                item: item,
                unitPrice: 2,
                quantity: 1,
                state: 'trading'
            });
            order.save(function (err) {
            });
            login.login(request, function (loginAgent) {
                agent = loginAgent;
                done();
            });
        });
        it('获得订单列表', function (done) {
            var req = request.get('/api/orders')
            agent.attachCookies(req);
            req.set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function (err, res) {
                    res.body.should.be.an.Array.and.have.lengthOf(1);
                    res.body[0].should.have.property('seller');
                    res.body[0].should.have.property('unitPrice', 2);
                    done();
                });
        });

        it('获得一个特定的商品', function (done) {
            var req = request.get('/api/orders/' + order.id)
            agent.attachCookies(req);
            req.set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function (err, res) {
                    res.body.should.be.an.Object.and.have.property('unitPrice', 2);
                    res.body.should.have.property('quantity', 1);
                    res.body.seller.should.have.property('_id', order.seller.toString());
                    res.body.customer.should.have.property('_id', order.customer.toString());
                    res.body.item.should.have.property('_id', order.item.toString());
                    done();
                });
        });
    });
     describe('测试PUT方法', function () {
        var agent;
        beforeEach(function (done) {
            order = new Order({
                seller: seller,
                customer: customer,
                item: item,
                unitPrice: 2,
                quantity: 1,
                state: 'trading'
            });
            order.save(function (err) {
            });
            login.login(request, function (loginAgent) {
                agent = loginAgent;
                done();
            });
        });
        it('修改一个特定的商品的状态', function (done) {
            var req = request.put('/api/orders/' + order.id)
            agent.attachCookies(req);
            req.send({state:'evaluating'})
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function (err, res) {
                    res.body.should.have.property('state','evaluating')
                    done();
                });
        });
    });
    afterEach(function (done) {
        Order.remove().exec();
        Item.remove().exec();
        User.remove().exec();
        done();
    });
});
