var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('passportapp', ['users']);
var bcrypt = require('bcryptjs');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;

const { check } = require('express-validator/check');

// login page - GET
router.get('/login', function (req, res) {
    //res.send('LOGIN');
    res.render('login');
});

// register - GET
router.get('/register', function (req, res) {
    //res.send('REGISTER');
    res.render('register');
});

// register - POST
router.post('/register', function (req, res) {
    //get form values
    console.log(req.body);
    var name = req.body.name;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;

    // validation    
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email field is required').notEmpty();
    req.checkBody('email', 'Please use valid email').isEmail();    
    req.checkBody('username', 'username field is required').notEmpty();
    req.checkBody('password', 'password field is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(password);

    // check for errors
    var errors = req.validationErrors();

    if (errors) {
        console.log('Form has errors...');
        res.render('register', {
            errors: errors,
            name: name,
            email: email,
            username: username,
            password: password,
            password2: password2
        });
    }
    else {
        console.log('Success');
        var newUser = {
            name: name,
            email: email,
            username: username,
            password: password,
            password2: password2
        }

        db.users.insert(newUser, function(err,doc) {
            if(err){
                res.send(err);
            } else {
                console.log('user added...');

                //success message
                req.flash('success','You are registered and can now log in');

                // redirect after register
                res.location('/');
                res.redirect('/')
            }
        })
    }

});

module.exports = router;