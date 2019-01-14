var express = require("express");
var path = require("path");
var expressValidator = require("express-validator");
var session = require("express-session");
var passport = require("passport");
var localStrategy = require("passport-local").Strategy;
var bodyParser = require("body-parser");
var flash = require("connect-flash");

var routes = require("./routes/index");
var users = require("./routes/users");

var app = express();

// view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// set static folder
app.use(express.static(path.join(__dirname, "public")));

// body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// express session middleware
app.use(
    session({
        secret: "secret",
        saveUninitialized: true,
        resave: true
    })
);

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// express validator
app.use(express.json());

// connect flash middleware
app.use(flash());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

// define routes
app.use('/',routes);
app.use('/users',users);

app.listen(3000);
console.log('server starter on port 3000');