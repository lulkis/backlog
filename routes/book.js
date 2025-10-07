var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('media-list', { title: 'Books' });
});

router.get('/add', function(req, res, next) {
    res.render('media-form', { title: 'Books' });
});

module.exports = router;