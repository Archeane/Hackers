var mongo = require('mongodb');
var mongoose = require('mongoose');
var db = mongoose.connection;

//The sole pupose of this file is to load data from mongodb and export it to other files
//Needed data:
//UI register: unis, interests, skills, fields, technologies
//Algorithmn: all current hackathons, all users in selected hackathon
//Visualization: individual user data /


//Loading constants from DB
module.exports.loadUniversitiesConstants = function(callback){
	var unis = ["hola"];
	db.collection('universities').find().forEach(function(docs){
		unis.push(docs.institution);
		if(docs.institution == "Massachusetts Institute of Technology"){
			callback(unis);
		}
	});
}

module.exports.loadInterestsConstants = function(callback){
	var ints = ['ints array'];
	db.collection('interests').find().forEach(function(docs){
		ints.push(docs.Interests);
		if(docs.Interests == "Web Technologies"){
			callback(ints);
		}
	});

}

module.exports.loadLangaugesConstants = function(callback){
	var lans = ['lans array'];
	db.collection('languages').find().forEach(function(docs){
		lans.push(docs.Languages);
		if(docs.Languages == "Mechanical Engineering"){
			callback(lans);
		}
	});
}

module.exports.loadMajorsConstants = function(callback){
	var majs = ['majors array'];
	db.collection('majors').find().forEach(function(docs){
		majs.push(docs.majors);
		if(docs.majors == "telecommunications"){
			callback(majs);
		}
	});
}

module.exports.loadHackathonsConstants = function(callback){
	var hacks = ['hackathons array'];
	db.collection('hackathonNames').find().forEach(function(docs){
		hacks.push(docs.hackathons);
		if(docs.hackathons == "HackNYU"){
			callback(hacks);
		}
	})
}

module.exports.loadTestHackathonData = function(hackathonName,callback){
	/TODO: only execute this function after data was populated by addusertodb, then call connect with python/
	console.log("in loadTestHackathonData");
	var query = {name: hackathonName};
	db.collection('Hackathons').findOne(query, callback);
	
}


var manager = module.exports;
