var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var UserSchema = new mongoose.Schema({
	username: {type: String, lowercase: true, unique: true},
	email: {type: String, lowercase: true, unique: true},
	phone: String,
	hash: String,
	salt: String,
	role: { type: String, default: 'client' },
	extemDepartamento: String,
  exteMunicipio: String,
	//recomendaciontecnica: String,
	nickname: String,
	image: String,
	units: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Unit' }]
});

UserSchema.methods.setPassword = function(password){
  this.salt = crypto.randomBytes(16).toString('hex');

  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64,'sha1').toString('hex');
};

UserSchema.methods.validPassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64,'sha1').toString('hex');

  return this.hash === hash;
};

UserSchema.methods.generateJWT = function() {

  // set expiration to 60 days
  var today = new Date();
  var exp = new Date(today);
  exp.setDate(today.getDate() + 60);

  return jwt.sign({
    _id: this._id,
    username: this.username,
    role:this.role,
    exp: parseInt(exp.getTime() / 1000),
  }, 'SECRET');
};

mongoose.model('User', UserSchema);