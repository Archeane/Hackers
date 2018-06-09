var express = require('express');
var router = express.Router();
var manager = require('../models/dbmanager');

//This is a file to test algorithmn and visualization. 
//imports from db for constants
//generate random users and add to db/

router.get('/', function(req, res){
	res.send("in adduserstodb");
	registerUserBackend(10);
});

function registerUserBackend(numUser){
	manager.getInterestsConstants(function(result){
		console.log(result);
	});
}



module.exports = router;

