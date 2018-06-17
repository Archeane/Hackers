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
router.get('/login', function (req, res) {
	res.render('login');
});

passport.use(new LocalStrategy(
	function (username, password, done) {
		User.getUserByUsername(username, function (err, user) {
			if (err) throw err;
			if (!user) {
				return done(null, false, { message: 'Unknown User' });
			}

			User.comparePassword(password, user.password, function (err, isMatch) {
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
	passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login', failureFlash: true }), 
	function (req, res) {
		res.redirect('/');  //the top statement is the one that redirects
	});

router.get('/logout', function (req, res) {
	req.logout();
	req.flash('success_msg', 'You are logged out');
	res.redirect('/users/login');
});

module.exports = router;
module.exports.globalUser = currentUser;