var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('media-list', { title: 'Movies', route: 'movie' });
});

router.get('/add', function(req, res, next) {
    res.render('media-form', { title: 'Movies' });
});

router.post('/add', function(req, res) {
    console.log(req.body);

    var name = req.body.name;
    var year = Number(req.body.year);
    var genre = req.body.genre;
    var country = req.body.country;
    var description = req.body.description;
    var date_added = new Date();
    var status = 'open';

    res.redirect('/media/books')
})

module.exports = router;