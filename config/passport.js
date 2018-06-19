const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

passport.use('local',new LocalStrategy(
	function (username, password, done) {
	    User.getUserByUsername(username, function (err, user) {
	        //check if username exist in database
	        if (err) throw err;
	        if (!user) {
	            return done(null, false, { message: 'Unknown Username' });
	        }

	        User.comparePassword(password, user.password, function (err, isMatch) {
	            if (err) throw err;
	            if (isMatch) {
	                if (!user.active) {
	                    return done(null, false, { message: 'Please activate your account' });
	                }
	                return done(null, user);
	            } else {
	                return done(null, false, { message: 'Invalid password' });
	            }
	        });

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
