var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('media-list', { title: 'Series', route: 'series' });
});

router.get('/add', function(req, res, next) {
    res.render('media-form', { title: 'Series' });
});

module.exports = router;