var express = require('express');
var router = express.Router();
var expressValidator = require('express-validator');

router.use(expressValidator());

router.get('/', ensureAuthenticated, function(req,res)
{
    //res.send('INDEX');
    res.render('index');
});

function ensureAuthenticated(req,res,next){
    if(req.isAuthenticated())
    {
        return next();
    }
    res.redirect('/users/login');
}


module.exports = router;