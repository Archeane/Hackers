/*
var express = require('express');
var router = express.Router();

var User = require('../models/user');

var createdUser = new User({
	name:'', email:'', username: '', password: '', school: '', major: '', 
	github:'', devpost:'', website:'', numOfHack:'', interests: null, skills: null
});

// Register
router.get('/register', function (req, res) {
	res.render('register');
});

router.get('/register2',function(req,res){
	res.render('register2');
});

router.get('/register3', function(req, res){
	res.render('register3');
});


/** Register User
1. Get inputs from html
2. Validate inputs
3. calls User model to create a new user and add to database
*/
/*
/TODO:Optional: consider creating a valdiator when inserting into mongodb collection/
router.post('/register', function (req, res) {
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;

/TODO: add options in html from an array, connect the array with mongoDB/
	var school = req.body.school;
	var major = req.body.major;
	var graduationYear = req.body.graduationYear;
	var educationLevel = req.body.educationLevel;
	
//  Validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
//	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
//	req.checkBody('password', 'Password does not satisify requirements').len(6,20);
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
/TODO: Properly do the check for if selected options equals 0/
/*
	if(school == 0 || major == 0 || graduationYear == 0 || educationLevel == 0){
		req.checkBody('school', 'Please fill in all required fields').equals(0);
	}
*/
/*
	var errors = req.validationErrors();
	if (errors) {
		res.render('register', {
			errors: errors
		});
	}
	else {
//		checking for email and username are already taken
		User.findOne({ username: { 
			"$regex": "^" + username + "\\b", "$options": "i"
			}}, function (err, user) {
			User.findOne({ email: { 
				"$regex": "^" + email + "\\b", "$options": "i"
			}}, function (err, mail) {
				if (user || mail) {
					res.render('register', {
						user: user,
						mail: mail
					});
				}
				else {  //email and username both valid
					createdUser.name = name;
					createdUser.email = email;
					createdUser.username = username;
					createdUser.password = password;
					res.redirect('/newacc/register2');
				}
			});
		});
	}
});

/TODO: 1. create tags input for interest  2. show & hide interest bars on change/


router.post('/register2', function(req, res){
	var github = req.body.github;
	var devpost = req.body.devpost;
	var linkedin = req.body.linkedin;
	var website = req.body.website;
	var numOfHacks = req.body.numOfHacks;

	req.checkBody('numOfHacks', 'Number of hackathons attended is required').notEmpty();
	
	var errors = req.validationErrors();

	if (errors) {
		res.render('register', {
			errors: errors
		});
	}
	else {
		if(github){
			createdUser.github = github;
		}
		if(devpost){
			createdUser.devpost = devpost;
		}
		if(linkedin){
			createdUser.linkedin = linkedin;
		}
		if(website){
			createdUser.website = website;
		}
		if(numOfHacks){
			createdUser.numOfHacks = numOfHacks;
		}
		console.log(createdUser);
	}
	User.createUser(createdUser, function (err, user) {
		if (err) throw err;
	});
	req.flash('success_msg', 'You are registered and can now login');
	res.redirect('/users/login');
});

router.post('/register3', function(req, res){
	
});


module.exports = router;