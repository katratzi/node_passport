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
            password2: password2 // store second password as plain text just for debug
        }

        // salt and hash password
        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(newUser.password, salt, function (err, hash) {
                newUser.password = hash;

                db.users.insert(newUser, function (err, doc) {
                    if (err) {
                        res.send(err);
                    } else {
                        console.log('user added...');

                        //success message
                        req.flash('success', 'You are registered and can now log in');

                        // redirect after register
                        res.location('/');
                        res.redirect('/')
                    }
                });
            });
        });


    }

});

// mental note - mongo db uses _id
passport.serializeUser(function (user, done) {
    console.log("serialise");
    done(null, user._id);
});

passport.deserializeUser(function (id, done) {
    console.log("deserialise");
    db.users.findOne({ _id: mongojs.ObjectID(id) }, function (err, user) {
        done(err, user);
    })
});

// define our local strategy
passport.use(new localStrategy(
    function (username, password, done) {
        db.users.findOne({ username: username }, function (err, user) {            
            // error
            if (err) {                
                console.log("passport error");
                return done(err);
            }
            // no matching use
            if (!user) {
                console.log("no user");
                return done(null, false, { message: 'incorrect username' });
            }

            // found use, check passwork hash matching
            bcrypt.compare(password, user.password, function (err, isMatch) {
                if (err) {
                    return done(err);
                }
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'incorrect password' });
                }
            });

        });
    }
));

// login - POST
router.post('/login',
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: 'Invalid username or password'
    }),
    function (req, res) {
        console.log('Authentication successful');
        res.redirect('/');
    });

module.exports = router;