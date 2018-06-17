var express = require('express');
var router = express.Router();
var manager = require('../models/dbmanager');

var Promise = require('promise');
var User = require('../models/user');
var Hackathon = require('../models/hackathon');


//jsonify
var convert = require('mongoose_schema-json');

var newHackathon = new Hackathon({
			name: 'hackMIT',
			location: '',
			sponsors: '',
			website: '',
			hackers: ''
		});

//child process
var spawn = require("child_process").spawn;
/TODO: printing hacker.interests and hacker.languages as Array ?need to fix?/
manager.loadTestHackathonData("CEWIT", function(err, hackathon){
	if(err) throw err;
	if(!hackathon) throw "Hackathon not found";
	hack = hackathon;


	var jsonStr = convert.schema2json(hack);
	//console.log(jsonStr);


	var process = spawn('python',["./algorithmn/process.py",
                         jsonStr] );
	
	process.stdout.on('data', function(data) {
		console.log(data.toString());
		var arr = eval(data.toString());
		console.log(arr[0][0]);
	});
});



//This is a file to test algorithmn and visualization. 
//imports from db for constants
//generate random users and add to db/

var universities = [];
var interests = [];
var languages = [];
var majors = [];
var profileimgs = [];

var hackathons = [];
var hack = null;



router.get('/', function(req, res){
	res.send("in adduserstodb");
	
	console.log("in adduserstodb");
	//parameters passed in spawn: 1) type_of_script  2) list containing Path of the script and arguments for the script
	
	
	//TODO:Move this junk to pythonServer.js. For some reason loadTestHackathonData doens't execute there/
	
	
/*
	var server = new zerorpc.Server({
		sendTestHackathon: function(reply){
			console.log("in sendTestHacakthon");
			reply(null, hack);
			server.close();


			var client = new zerorpc.Client();
			client.connect("tcp://127.0.0.1:4242");

			client.invoke("hello", "RPC", function(error, res, more) {
			    console.log(res);
			});
		}

	});


	server.bind("tcp://0.0.0.0:4242");
	console.log("server binded");
*/
	
	
/*	

	Promise.all([loadUniConsts(), loadIntConsts(), loadLanConsts(), loadMajConsts(), loadHacksConsts()]).then(function(){
		console.log("finished loading constants");
		console.log(createHackathon());
		
	});

*/	
});


let createHackathon = function(){
	return new Promise(function(resolve, reject){
		
		var numOfHackers = Math.floor(Math.random() * 50+25);
		var hackers = [];
		for(var i = 0; i < numOfHackers; i++){
			hackers.push(randomUser());
		}
		console.log(hackers);
		var hackathonNameIndex = Math.floor(Math.random()*hackathons.length);

		var newHackathon = new Hackathon({
			name: hackathons[hackathonNameIndex],
			location: '',
			sponsors: '',
			website: '',
			hackers: hackers
		})
		console.log(newHackathon);
		Hackathon.createHackathon(newHackathon, function(err, hackathon){
			if(err) throw err;
		});
		console.log(newHackathon.name);
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
	console.log("in randomUser");
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

	console.log(createdUser);
	var name = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
	
	createdUser.name = name;
	createdUser.username = name;
	createdUser.major = randomMaj;
	createdUser.school = randomUni;
	createdUser.interests = randomInts;
	createdUser.languages = randomLans;
	
	console.log(createdUser);
	User.createUser(createdUser, function (err, user) {
		if (err) throw err;
		console.log(createdUser);
	});

	return createdUser;
	
}


module.exports = router;

var app = require('C:/Projects/HackerMatcher/loginapp-master/app');
var io = app.io;

console.log(io);
/*
io.on('connection', function(socket){
  console.log("connection established ", server.id);

  socket.on('event', function(data){
    console.log("data from client event: ",data);
  });

  socket.on('disconnect', function(){
    console.log(client.id, " disonnected on "+app.get('port'));
  });
});
/*
//export to server
exports = module.exports = function(io){
	io.sockets.on('connection', function(socekt){
		socket.on('fileevent', function(){
			console.log('adduserstodb event triggered');
		});
	});
}
*/