//var express = require('express');
var zerorpc = require("zerorpc");
//var router = express.Router();
var client = new zerorpc.Client();
client.connect("tcp://127.0.0.1:4242");
client.invoke("hello", "RPC", function(error, res, more){
	if(error) throw error;
	
	console.log(res);
});

/*
router.get('/', function(req, res){
	res.send("in connectPython");
	var client = new zerorpc.Client();
	client.connect("tcp://127.0.0.1:4242");
	client.invoke("hello", "RPC", function(error, res,more){
		console.log(res);
	});
	
});
*/
