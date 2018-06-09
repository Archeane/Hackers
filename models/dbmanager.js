var mongo = require('mongodb');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/loginapp');
var db = mongoose.connection;

var unis = ["hola"];


module.exports.getInterestsConstants = function(callback){
	db.collection('universities').find().forEach(function(docs){
		unis.push(docs.institution);
		callback(unis);
	});

}

module.exports.universities = unis;
/*
module.exports.getInterestsConstants = getInterestConstants(function(result){
	console.log(result);
});
*/	
/*
	console.log("in dbmanager");
	var uniToFind = { institution : "Auburn University"};
	db.collection('universities').find(function(err, docs){
		console.log(docs);
	});
	*/


var manager = module.exports;