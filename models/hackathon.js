var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// Hackathon Schema
var HackathonSchema = mongoose.Schema({
	name: {
		type: String,
		index:true
	},
	location: {
		type: String
	},
	host: {
		type: String
	},
	hackers:{
		type: Array
	},
	sponsors:{
		type: Array
	},
	website:{
		type: String
	}
});

var Hackathon = module.exports = mongoose.model('Hackathon', HackathonSchema);

module.exports.createHackathon = function(newHackathon, callback){
	/TODO: create a file that generates ID for documents inserted into mongoDB/
	Hackathon.db.collection("Hackathons").insert(newHackathon);
}

module.exports.getHackathonByName = function(name, callback){
	var query = {name: name};
	Hackathon.findOne(query, callback);
}

module.exports.getHackathonById = function(id, callback){
	Hackathon.findById(id, callback);
}

//TODO: when editing specific fields, create a new user with new params 




