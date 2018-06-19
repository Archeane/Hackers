var express = require('express');
var router = express.Router();

var ctnUser = require('./home');

var User = require('../models/user');


// Get Homepage
router.get('/', ensureAuthenticated, function(req, res){
	res.render('index', ctnUser.globalUser);
});


function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/dashboard');
	}
}

router.post('/', function(req, res){
	res.redirect('editprofile');
});

router.get('/editprofile', function(req, res){
	res.render('editprofile');
});


router.post('/editprofile', function(req,res){
	var action = req.body.request;
	if(action == "save"){
/TODO: connect to database manager here/
		User.editUsername(ctnUser.globalUser.username, req.body.username, function(err, user){
			if (err) throw err;
		});
		ctnUser.globalUser.username = req.body.username;
		res.redirect('/');
	}else{
		res.redirect('/');
	}
});



module.exports = router;