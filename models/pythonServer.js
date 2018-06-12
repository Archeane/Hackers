//Connect with python
var express = require('express');
var router = express.Router();
var zerorpc = require('zerorpc');
var manager = require('../models/dbmanager');

var User = require('../models/user');
var Hackathon = require('../models/hackathon');



var hack = null;
console.log("in pythonServer.js")
manager.loadTestHackathonData("ShellHacks", function(err, hackathon){
	console.log("in pythonServer.loadTestHackathonData");
	//if(err) throw err;
	//if(!hackathon) throw "Hackathon not found";
	hack = hackathon;
	console.log(hack);
});

/*
var server = new zerorpc.Server({
	hello: function(name, reply){
		reply(null, "Hello" + name);
	}
});

server.bind("tcp://0.0.0.0:4242");

*/

module.exports = router;