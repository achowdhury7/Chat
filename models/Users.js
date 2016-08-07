var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
	username: {type:String, unique:true, dropdups:true}
});

var User = mongoose.model('User', UserSchema);

module.exports = User;