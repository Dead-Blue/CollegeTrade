var express = require('express');
var config = require('./config');
var morgan = require('morgan'),
compress = require('compression'),
bodyParser = require('body-parser'),
session = require('express-session'),
methodOverride = require('method-override'),
passport = require('passport'),
flash = require('connect-flash'),
http = require('http'),
socketio= require('socket.io');
var MongoStore = require('connect-mongo')({session: session});
module.exports = function(db){
	var app =express();
	var server = http.createServer(app);
    var io = socketio.listen(server);
	if (process.env.NODE_ENV==='development'){
		app.use(morgan('dev'));
	} else if (process.env.NODE_ENV==='production') {
		app.use(compress());
	}
	app.use(bodyParser.urlencoded({
		extended:true
	}));
	app.use(bodyParser.json());
	app.use(methodOverride());
	
    var mongoStore = new MongoStore({
		db: db.connection.db,
		collection: 'sessions'
	});
	app.use(session({
		saveUninitialized: true,
		resave: true,
		secret: config.sessionSecret,
		store: mongoStore
	}));
	app.set('views', './Client/views');
	app.engine('.html', require('ejs').__express);
	app.set('view engine', 'html');
	app.use(flash());
	app.use(passport.initialize());
	app.use(passport.session());
	require('../Server/routes/index.js')(app);
	require('../Server/routes/users.js')(app);
	require('../Server/routes/items.js')(app);
    require('../Server/routes/orders.js')(app);
	require('./socketio')(server,io,mongoStore);
	app.use(express.static('./Client'));
	return server;
}
