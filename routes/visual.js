var express = require('express');
var router = express.Router();

router.get('/', function(req, res){
	res.render('visual', {layout: false});
});

module.exports = router;