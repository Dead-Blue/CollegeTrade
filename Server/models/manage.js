var mongoose = require('mongoose');
var crypto = require('crypto');
var Schema = mongoose.Schema;

var ManageSchema = new Schema({
	fullName: String,
	username: {
		type:String,
		trim: true,
		unique: true,
		required: true
	},
	password: {
	type: String,
	validate: [  
		function(password) {
			return password && password.length >6;
		},
	'Password should be longer'
	]},
	salt: {
		type: String
	},
	created: {   //定义默认值
		type: Date,
		default: Date.now
	},
	college: {
		type: String,
		required: '需要填写学校信息'
	},
    phone:{
        type:Number,
        validate: [  
		function(password) {
			return password && password.length ==11;
		},
	'请输入正确长度的手机号码'
	]},
    email: {
		type: String,
		match: [/.+\@.+\..+/, "Please fill a valid e-mail address"]   
	},
    role: {
		type: String,
		required: '需要填写管理员身份',
        enum:{
            values:'admin root others'.split(' '),
            message:'管理员身份错误'
        }
	}
});


ManageSchema.pre('save', function(next) {
	if(this.password) {
		this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
		this.password = this.hashPassword(this.password);
	} 
	next();
});

ManageSchema.methods.hashPassword = function(password) {
	return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
};

ManageSchema.methods.authenticate = function(password) {
	return this.password === this.hashPassword(password);
};

ManageSchema.statics.findOneByUsername = function (username, callback) {
	this.findOne({ username: new RegExp(username, 'i')},callback);
};

ManageSchema.statics.findUniqueUsername = function (username, suffix, callback) {
	var _this = this;
	var possibleUsername = username + (suffix || '');

	_this.findOne({
		username: possibleUsername
	}, function (err, user) {
		if (!err) {
			if (!user) {
				callback(possibleUsername);
			} else {
				return _this.findUniqueUsername(username(suffix || 0) + 1, callback);
			}
		} else {
			callback(null);
		}
	});
};
ManageSchema.set('toJSON', {
	getters:true, 
	virtuals:true
	});
mongoose.model('Manage', ManageSchema);