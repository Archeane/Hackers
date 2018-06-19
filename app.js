var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');

//require('./config/passport');



mongoose.connect('mongodb://localhost/loginapp');
var db = mongoose.connection;

var home = require('./routes/home');
var dashboard = require('./routes/index');
//var users = require('./routes/users');
//var register = require('./routes/register');
var visual = require('./routes/visual');

/Test routes/
//var testaddusers = require('./test/adduserstodb');
//var testPyConnect = require('./test/connectPython')

// Init App
var app = express();




// View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout:'layout'}));
app.set('view engine', 'handlebars');

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Connect Flash
app.use(flash());

// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});



app.use('/dashboard', dashboard);
app.use('/', home);
//app.use('/newacc', register);
app.use('/visual', visual);

/Test uses/
//app.use('/test', testaddusers);
//app.use('/connect', testPyConnect);


// Set Port
app.set('port', (process.env.PORT || 3000));

/*
app.listen(app.get('port'), function(){
	console.log('Server started on port '+app.get('port'));
});
*/


//Server
var http = require("http");
var http_server = http.createServer(app).listen(3000, function(){
  console.log("listening on port 3000");
});
var http_io = require("socket.io")(http_server);

http_io.on('connection', function(httpsocket){
  console.log("connection established on port 3000");
  httpsocket.on('python-message', function(fromPython){
    httpsocket.broadcast.emit('message', fromPython);
  });
});
  

module.exports.io = http_io;

/*
var server = app.listen(app.get('port'), function(){
  console.log('listening for requests on port ' + app.get('port'))
})
var io = socket(server);
io.on('connection', function(socket){
  console.log("connection established ", server.id);

  socket.on('event', function(data){
    console.log("data from client event: ",data);
  });

  socket.on('disconnect', function(){
    console.log(client.id, " disonnected on "+app.get('port'));
  });
});
//server.listen(app.get('port'));

*/