var mongoose = require('mongoose');
var crypto = require('crypto');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	firstName: String,
	lastName: String,
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
	'密码必须大于等于7位'
	]},
	salt: {
		type: String
	},
	provider: {
		type: String,
		required: 'Provider is required'		
	},
	providerId: String,
	providerData: {},
	created: {   //定义默认值
		type: Date,
		default: Date.now
	},
	email: {
		type: String,
		match: [/.+\@.+\..+/, "Please fill a valid e-mail address"]   
	},
    phone:{
        type:String,
        validate: [  
		function(phone) {
			return phone && phone.length ==11;
		},
	'请输入正确长度的手机号码'
	]},
    avatar:{
		type:String,
		default:'/views/Images/user_avatar.png'
	},
	college: {
		type: String,
		required: '需要填写学校信息'
	}
});

UserSchema.virtual('fullName').get(function() {
	return this.firstName + '' + this.lastName;
}).set(function(fullName){   
	var splitName = fullName.split(' ');
	this.firstName = splitName[0] || '';
	this.lastName = splitName[1] || '';
});



UserSchema.pre('save', function(next) {
	if(this.password) {
		this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
		this.password = this.hashPassword(this.password);
	} 
	next();
});

UserSchema.methods.hashPassword = function(password) {
	return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
};

UserSchema.methods.authenticate = function(password) {
	return this.password === this.hashPassword(password);
};

UserSchema.statics.findOneByUsername = function (username, callback) {
	this.findOne({ username: new RegExp(username, 'i')},callback);
};

UserSchema.statics.findUniqueUsername = function (username, suffix, callback) {
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
UserSchema.set('toJSON', {
	getters:true, 
	virtuals:true
	});
mongoose.model('User', UserSchema);