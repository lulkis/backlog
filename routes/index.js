var express = require('express');
const sqlite3 = require("sqlite3");
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    const db = new sqlite3.Database('backlog.db');
    var query = "SELECT movie.name, movie.added, 'movie' AS route FROM movie\n" +
        "UNION\n" +
        "SELECT series.name, series.added, 'series' AS route FROM series\n" +
        "UNION\n" +
        "SELECT book.name, book.added, 'book' AS route FROM book\n" +
        "UNION\n" +
        "SELECT game.name, game.added, 'book' AS route FROM game\n" +
        "ORDER BY added DESC LIMIT 5"
    db.all(query, function (err, row) {
        if(err){
            console.log(err);
        }else{
            res.render('index', { title: 'Express', recent: row});
        }
    });
});

router.get('/search/:name', function(req, res, next) {
    //SELECT * FROM movie WHERE movie_cast LIKE $1
    const db = new sqlite3.Database('backlog.db');

    var query = "SELECT * FROM movie WHERE movie.cast LIKE ?";
    db.all(query,['%'+req.params.name+'%'], function (err, rows) {
        if(err){
            console.log(err);
        }else{
            var query = "SELECT * FROM series WHERE series.cast LIKE ?";
            db.all(query,['%'+req.params.name+'%'], function (err, rows2) {
                if(err){
                    console.log(err);
                }else{
                    res.render('search', { name: req.params.name, list: rows, list2: rows2 });
                }
            });
        }
    });
})

router.get('/director/:name', function(req, res, next) {
    //SELECT * FROM movie WHERE movie_cast LIKE $1
    const db = new sqlite3.Database('backlog.db');

    var query = "SELECT * FROM movie WHERE movie.director LIKE ?";
    db.all(query,['%'+req.params.name+'%'], function (err, rows) {
        if(err){
            console.log(err);
        }else{
            res.render('search', { name: req.params.name, list: rows, list2: [] });
        }
    });
})

module.exports = router;