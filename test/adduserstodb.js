var express = require('express');
var router = express.Router();
var manager = require('../models/dbmanager');

var Promise = require('promise');
var User = require('../models/user');
var Hackathon = require('../models/hackathon');

//This is a file to test algorithmn and visualization. 
//imports from db for constants
//generate random users and add to db/

var universities = [];
var interests = [];
var languages = [];
var majors = [];
var profileimgs = [];

var hackathons = [];

router.get('/', function(req, res){
	res.send("in adduserstodb");

	Promise.all([loadUniConsts(), loadIntConsts(), loadLanConsts(), loadMajConsts(), loadHacksConsts()]).then(function(){
		console.log("finished loading constants");
		console.log(createHackathon());
		
	});
});


let createHackathon = function(){
	return new Promise(function(resolve, reject){
		
		var numOfHackers = Math.floor(Math.random() * 100+50);
		var hackers = [];
		for(var i = 0; i < numOfHackers; i++){
			hackers.push(randomUser());
		}
		var hackathonNameIndex = Math.floor(Math.random()*hackathons.length);

		var newHackathon = new Hackathon({
			name: hackathons[hackathonNameIndex],
			location: '',
			sponsors: '',
			website: '',
			hackers: hackers
		})
		
		Hackathon.createHackathon(newHackathon, function(err, hackathon){
			if(err) throw err;
		});
		return newHackathon;
	});
} 

let loadHacksConsts = function(){
	return new Promise(function(resolve, reject){
		manager.loadHackathonsConstants(function(result){
			hackathons = result;
			console.log(hackathons);
			resolve();
		});
	});
}

let loadUniConsts = function(){
	return new Promise(function(resolve, reject){
		manager.loadUniversitiesConstants(function(result){
			universities = result;
			resolve();
		});
	});
}
let loadIntConsts = function(){
	return new Promise(function(resolve, reject){
		manager.loadInterestsConstants(function(result){
			interests = result;
			resolve();
		});
	});
}
let loadLanConsts = function(){
	return new Promise(function(resolve, reject){
		manager.loadLangaugesConstants(function(result){
			languages = result;
			resolve();
		});
	});
}
let loadMajConsts = function(){
	return new Promise(function(resolve, reject){
		manager.loadMajorsConstants(function(result){
			majors = result;
			resolve();
		});
	})
}

randomUser = function(){
	
	var createdUser = new User({
	name:'', email:'', username: '', password: '', school: '', major: '', 
		github:'', devpost:'', website:'', numOfHack:'', interests: null, languages: null
	});

	var randomUni = universities[Math.floor(Math.random() * universities.length)];
	var randomMaj = majors[Math.floor(Math.random() * majors.length)];
	
	var randomInts = [];
	var max = (Math.floor(Math.random()*10));
	var includedIndexes = [];
	for(var i = 0; i < max; i++){
		var ints = Math.floor(Math.random() * (interests.length-1));
		while(includedIndexes.includes(ints)){
			ints = Math.floor(Math.random() * (interests.length-1));
		}
		includedIndexes.push(ints);
		var score = Math.floor(Math.random()*10+1);
		var ctnInt = [interests[ints], score];
		randomInts.push(ctnInt);
	}
	
	var randomLans = [];
	max = (Math.floor(Math.random()*10));
	includedIndexes = [];
	for(var i = 0; i < max; i++){
		var ints = Math.floor(Math.random() * languages.length);
		while(includedIndexes.includes(ints)){
			ints = Math.floor(Math.random() * languages.length);
		}
		includedIndexes.push(ints);
		var score = Math.floor(Math.random()*10+1);
		var ctnInt = [languages[ints], score];
		randomLans.push(ctnInt);
	}

	var name = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
	
	createdUser.name = name;
	createdUser.username = name;
	createdUser.major = randomMaj;
	createdUser.school = randomUni;
	createdUser.interests = randomInts;
	createdUser.languages = randomLans;
	
	//console.log(createdUser);
	User.createUser(createdUser, function (err, user) {
		if (err) throw err;
		console.log("user created");
		console.log(createdUser);

	});
	return createdUser;
	
}


module.exports = router;
