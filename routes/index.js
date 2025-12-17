var express = require('express');
const sqlite3 = require("sqlite3");
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    const db = new sqlite3.Database('backlog.db');
    var query = "SELECT movie.id, movie.name, movie.added, 'movie' AS route FROM movie WHERE movie.status = 'open'\n" +
        "UNION\n" +
        "SELECT series.id, series.name, series.added, 'series' AS route FROM series WHERE series.status = 'open' OR series.status = 'started'\n" +
        "UNION\n" +
        "SELECT book.id, book.name, book.added, 'book' AS route FROM book WHERE book.status = 'open' OR book.status = 'started'\n" +
        "UNION\n" +
        "SELECT game.id, game.name, game.added, 'game' AS route FROM game WHERE game.status = 'open' OR game.status = 'started'\n" +
        "ORDER BY added DESC LIMIT 5"
    db.all(query, function (err, row) {
        if(err){
            console.log(err);
        }else{
            var query = "SELECT movie.name, movie.id, movie_finished.date, 'movie' AS route FROM movie\n" +
                "INNER JOIN movie_finished ON movie.id = movie_finished.id\n" +
                "UNION\n" +
                "SELECT series.name, series.id, series_finished.date, 'series' AS route FROM series\n" +
                "INNER JOIN series_finished ON series.id = series_finished.id\n" +
                "UNION\n" +
                "SELECT book.name, book.id, book_finished.date, 'book' AS route FROM book\n" +
                "INNER JOIN book_finished ON book.id = book_finished.id\n" +
                "UNION\n" +
                "SELECT game.name, game.id, game_finished.date, 'game' AS route FROM game\n" +
                "INNER JOIN game_finished ON game.id = game_finished.id\n" +
                "ORDER BY date DESC LIMIT 5"

            db.all(query, function (err, row2) {
                if(err){
                    console.log(err);
                }else{
                    var query = "SELECT status, COUNT(*) as count\n" +
                        "FROM (\n" +
                        "         SELECT status FROM movie\n" +
                        "         UNION ALL\n" +
                        "         SELECT status FROM series\n" +
                        "         UNION ALL\n" +
                        "         SELECT status FROM book\n" +
                        "         UNION ALL\n" +
                        "         SELECT status FROM game\n" +
                        "     ) AS Alle_Daten\n" +
                        "GROUP BY status;"

                    db.all(query, function (err, row3) {
                        if(err){
                            console.log(err);
                        }else{
                            res.render('index', { title: 'Express', recent: row, finish: row2, counts: row3 });
                        }
                    });
                }
            });
        }
    });
});

router.get('/get/:name', function(req, res, next) {
    //SELECT * FROM movie WHERE movie_cast LIKE $1
    const db = new sqlite3.Database('backlog.db');

    var query = "SELECT * FROM movie WHERE CONCAT(movie.name, movie.director, movie.cast, movie.studio, movie.score) LIKE ? ORDER BY movie.year DESC ";
    db.all(query,['%'+req.params.name+'%'], function (err, rows) {
        if(err){
            console.log(err);
        }else{
            var query = "SELECT * FROM series WHERE CONCAT(series.name, series.idea, series.cast, series.studio, series.score) LIKE ? ORDER BY series.year";
            db.all(query,['%'+req.params.name+'%'], function (err, rows2) {
                if(err){
                    console.log(err);
                }else{
                    var query = "SELECT * FROM game WHERE CONCAT(game.name, game.publisher, game.developer, game.score) LIKE ? ORDER BY game.year";
                    db.all(query,['%'+req.params.name+'%'], function (err, rows3) {
                        if(err){
                            console.log(err);
                        }else{
                            var query = "SELECT * FROM book WHERE CONCAT(book.name, book.author) LIKE ? ORDER BY book.year";
                            db.all(query,['%'+req.params.name+'%'], function (err, rows4) {
                                if(err){
                                    console.log(err);
                                }else{
                                    res.render('search', { name: req.params.name, list: rows, list2: rows2, list3: rows3, list4: rows4 });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
})

router.get('/search/:name', function(req, res, next) {
    //SELECT * FROM movie WHERE movie_cast LIKE $1
    const db = new sqlite3.Database('backlog.db');

    var query = "SELECT * FROM movie WHERE movie.cast LIKE ? ORDER BY movie.year DESC ";
    db.all(query,['%'+req.params.name+'%'], function (err, rows) {
        if(err){
            console.log(err);
        }else{
            var query = "SELECT * FROM series WHERE series.cast LIKE ? ORDER BY series.year";
            db.all(query,['%'+req.params.name+'%'], function (err, rows2) {
                if(err){
                    console.log(err);
                }else{
                    res.render('search', { name: req.params.name, list: rows, list2: rows2, list3: [], list4: [] });
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
            var query = "SELECT * FROM series WHERE series.idea LIKE ?";
            db.all(query,['%'+req.params.name+'%'], function (err, rows2) {
                if(err){
                    console.log(err);
                }else{
                    res.render('search', { name: req.params.name, list: rows, list2: rows2, list3: [], list4: [] });
                }
            });
        }
    });
})

module.exports = router;