var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('media-list', { title: 'Games', route: 'game' });
});

router.get('/add', function(req, res, next) {
    res.render('media-form', { title: 'Games' });
});

module.exports = router;