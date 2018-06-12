var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// User Schema
var UserSchema = mongoose.Schema({
	username: {
		type: String,
		index:true
	},
	password: {
		type: String
	},
	email: {
		type: String
	},
	name: {
		type: String
	},

	school:{
		type: String
	},

	major:{
		type: String		
	},

	interests:{
		type: Array
	},

	languages:{
		type: Array
	},

	graduationYear:{
		type: Number 
	},

	educationLevel:{
		type: String
	},
	
	
	numOfHacks: {
		type: String
	},

//optional fields
	github:{
		type:String
	},

	devpost:{
		type:String
	},

	linkedin:{
		type:String
	},

	website:{
		type:String
	},
	
	profileimg:{
		data: Buffer,
		contentType: String
	}
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password = hash;
	        newUser.save(callback);
	    });
	});
}

module.exports.getUserByUsername = function(username, callback){
	var query = {username: username};
	User.findOne(query, callback);
}

module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}


//TODO: when editing specific fields, create a new user with new params 
module.exports.editUsername = function(ctnusername, newUsername, callback){
	var conditions = {username: ctnusername};
	User.findOneAndUpdate(conditions, {$set:{username: newUsername}}, callback);
}



