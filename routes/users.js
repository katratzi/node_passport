var express = require('express');
var router = express.Router();

// login page - GET
router.get('/login',function(req,res)
{
    res.send('LOGIN');
});

// register - GET
router.get('/register',function(req,res)
{
    res.send('REGISTER');
});

module.exports = router;