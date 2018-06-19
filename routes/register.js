var express = require('express');
var router = express.Router();
var User = require('../models/user');
var manager = require('../models/dbmanager');

router.get('/email', function(req,res){
	res.render('email');
});
