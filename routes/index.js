var express = require('express');
var router = express.Router();
var expressValidator = require('express-validator');

router.use(expressValidator());

router.get('/',function(req,res)
{
    //res.send('INDEX');
    res.render('index');
});

module.exports = router;