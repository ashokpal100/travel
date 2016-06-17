var express        = require('express');
var app            = express();
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var mysql 		   = require('mysql');

var jade		   = require('jade');
var passport       = require('passport');
var morgan         = require('morgan');
var cookieParser   = require('cookie-parser');
var session        = require('express-session');
var flash          = require('connect-flash');


app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)


app.use(session({secret: '2C44-4D44-WppQ38S',resave: true,saveUninitialized: true}));
var sessionInfo;
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

app.set('view engine', 'jade');
app.set('views', __dirname + './views');
app.set('views', __dirname + './views/templates');

 app.use(bodyParser.json()); 
 app.use(bodyParser.json({ type: 'application/vnd.api+json' })); 
 app.use(bodyParser.urlencoded({ extended: true })); 
 app.use(methodOverride('X-HTTP-Method-Override')); 
 app.use(express.static(__dirname + '/public')); 

//ashok

require('./config/db')(mysql);
require('./app/routes/route')(app,session,sessionInfo);
//require('./config/passport')(mysql,passport);

app.listen(9000, '0.0.0.0', function() {
    console.log('Listening to port:  ' + 9000);
});
