var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');

var currentUser = new User({
	name: "",
	username: "",
	email: "",
	password: "",
	school: ""
});

// Login
router.get('/', function (req, res) {
	res.render('home', {layout: false});
});

passport.use(new LocalStrategy(
	function (loginusername, loginpassword, done) {
		User.getUserByUsername(loginusername, function (err, user) {
			console.log(user);
			if (err) throw err;
			if (!user) {
				return done(null, false, { message: 'Unknown Username' });
			}

			User.comparePassword(loginpassword, user.password, function (err, isMatch) {
				if (err) throw err;
				if (isMatch) {
					return done(null, user);
				} else {
					return done(null, false, { message: 'Invalid password' });
				}
			});
/TODO: set all fields for currentuser here/			
			currentUser.name = user.name;
			currentUser.username = user.username;
			console.log(user);

		});
	}
));


passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	User.getUserById(id, function (err, user) {
		done(err, user);
	});
});

router.post('/login', 
	passport.authenticate('local', { successRedirect: '/dashboard', failureRedirect: '/', failureFlash: true }), 
	function (req, res) {
		res.redirect('/dashboard');  //the top statement is the one that redirects
	});

var createdUser = new User({
	name:'', email:'', username: '', password: '', school: '', major: '', 
	github:'', devpost:'', website:'', numOfHack:'', interests: null, skills: null
});

router.post('/register', function(req,res){
	var name = req.body.reg_firstName+" "+req.body.reg_lastName;
	var email = req.body.reg_email;
	var username = req.body.reg_username;
	var password = req.body.reg_password;
	var password2 = req.body.reg_password2;

	console.log(name, email, username);
	//  Validation
	req.checkBody('reg_firstName', 'Name is required').notEmpty();
	req.checkBody('reg_email', 'Email is required').notEmpty();
//	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('reg_username', 'Username is required').notEmpty();
	req.checkBody('reg_password', 'Password is required').notEmpty();
//	req.checkBody('password', 'Password does not satisify requirements').len(6,20);
	req.checkBody('reg_password2', 'Passwords do not match').equals(req.body.reg_password);


	var errors = req.validationErrors();
	if (errors) {
		console.log(errors);
		res.send({success: true, message: '<li>New list item number 1</li><li>New list item number 2</li>'});
		res.render('home', {
			
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
					res.render('home', {
						user: user,
						mail: mail
					});
				}
				else {  //email and username both valid
					createdUser.name = name;
					createdUser.email = email;
					createdUser.username = username;
					createdUser.password = password;
					console.log(createdUser);
					res.redirect('/newacc/register2');
				}
			});
		});
	}
});

/TODO: move logout to dashboard/
router.get('/logout', function (req, res) {
	req.logout();
	req.flash('success_msg', 'You are logged out');
	res.redirect('/users/login');
});

module.exports = router;
module.exports.globalUser = currentUser;