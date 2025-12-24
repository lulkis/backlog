var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3');
var dotenv = require('dotenv').config()
const { getSettings, updateSetting } = require("../settings");

/* GET home page. */
router.get('/', function(req, res, next) {
    const db = new sqlite3.Database('backlog.db');

    var query = "SELECT id, name, status FROM movie ORDER BY name ASC";
    db.all(query, function (err, rows) {
        if(err){
            console.log(err);
        }else{
            res.render('media-list', { title: 'Movies', route: 'movie' , list: rows});
        }
    });
});

router.get('/add', function(req, res, next) {
    const media = { name: "", year: "", genre: "", country: "" , description: "", studio: "", director: "", length: "", cast: "", header_space: 0 };
    res.render('media-form', { title: 'Movies', route: 'movie', media: media });
});

router.post('/add', function(req, res, next) {
    const db = new sqlite3.Database('backlog.db');

    console.log(req.body);

    var name = req.body.name;
    var year = Number(req.body.year);
    var genre = req.body.genre;
    var country = req.body.country;
    var description = req.body.description;
    var date_added = new Date();
    var status = 'open';
    var studio = req.body.studio;
    var director = req.body.director;
    var length = req.body.length;
    var cast = req.body.cast;
    var header_space = req.body.header_space;
    var score = req.body.score;

    console.log(req.files);

    var path = './public/images/movie/'+ name.toLowerCase().replaceAll(" ", "_").replaceAll(":", "") +'.jpg'
    let picture = req.files.foo;
    picture.mv(path, function(err) {
        if(err){
            console.log(err)
        }
        console.log("Succ")
    });

    var path2 = './public/images/movie/header/'+ name.toLowerCase().replaceAll(" ", "_").replaceAll(":", "") +'.jpg'
    let picture2 = req.files.foo2;
    picture2.mv(path2, function(err) {
        if(err){
            console.log(err)
        }
        console.log("Succ")
    });

    const sql = "INSERT INTO movie (name, year, genre, country, description, status, added, studio, director, length, cast, header_space, score)" +
        "   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    db.get(sql, [name, year, genre, country, description, status, date_added, studio, director, length, cast, header_space, score]), (err, row) => {
        if (err) return console.error(err.message)
        console.log("value id is:",row.id)
    }

    res.redirect('/movie')
})

router.get('/detail/:id', function(req, res, next) {
    const db = new sqlite3.Database('backlog.db');

    var query = "SELECT * FROM movie WHERE movie.id = ?";
    db.all(query, [req.params.id], function (err, rows) {
        if(err){
            console.log(err);
        }else{
            var query = "SELECT * FROM movie_finished WHERE id = ?";
            db.all(query, [req.params.id], async function (err, rows2) {
                if (err) {
                    console.log(err);
                } else {
                    const API_KEY = process.env.API_KEY;
                    const query = rows[0].name;
                    const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=de-DE`;

                    const searchRes = await fetch(searchUrl);
                    const searchData = await searchRes.json()

                    const movieId = searchData.results[0].id;
                    console.log(movieId);

                    const providersUrl = `https://api.themoviedb.org/3/movie/${movieId}/watch/providers?api_key=${API_KEY}`;

                    const provRes = await fetch(providersUrl);
                    const provData = await provRes.json();
                    const germany = provData.results.DE;

                    if (!germany) {
                        res.render('media', {media: rows[0], route: 'movie', finish: rows2[0], stream: [], settings: getSettings()});
                    } else {
                        console.log(germany.flatrate)
                        res.render('media', {media: rows[0], route: 'movie', finish: rows2[0], stream: germany.flatrate, settings: getSettings()});
                    }
                }
            });
        }
    });
});

router.get('/edit/:id', function(req, res, next) {
    const db = new sqlite3.Database('backlog.db');

    var query = "SELECT * FROM movie WHERE id = ?;";
    db.all(query, [req.params.id], function (err, rows) {
        if(err){
            console.log(err);
        }else{
            res.render('media-form', { title: 'Movies', route: 'movie', media: rows[0] });
        }
    });
});

router.post('/edit/:id', function(req, res, next) {
    const db = new sqlite3.Database('backlog.db');

    var name = req.body.name;
    var year = Number(req.body.year);
    var genre = req.body.genre;
    var country = req.body.country;
    var description = req.body.description;
    var studio = req.body.studio;
    var director = req.body.director;
    var length = req.body.length;
    var cast = req.body.cast;
    var header_space = req.body.header_space;
    var score = req.body.score;

    if(req.files != null){
        const path = './public/images/movies/' + name.toLowerCase().replaceAll(" ", "_").replaceAll(":", "")  + '.jpg';

        if (req.files.foo != null){
            let picture = req.files.foo;
            picture.mv(path, function(err) {
                if(err){
                    console.log(err)
                }
                console.log("Succ")
            });

        }
        var path2 = './public/images/movies/header/'+ name.toLowerCase().replaceAll(" ", "_").replaceAll(":", "") +'.jpg'

        if (req.files.foo2 != null){
            let picture2 = req.files.foo2;
            picture2.mv(path2, function(err) {
                if(err){
                    console.log(err)
                }
                console.log("Succ")
            });
        }
    }

    const sql = "Update movie SET " +
        "name=?, year=?, genre=?, country=?, description=?, studio=?, director=?, length=?, cast=?, header_space=?, score=?" +
        "WHERE id = ?"
    db.run(sql, [name, year, genre, country, description, studio, director, length, cast, header_space, score, req.params.id]);

    res.redirect('/movie/detail/'+req.params.id);
});

router.get('/finish/:id', function(req, res, next) {
    res.render('media-finish', { route: 'movie' });
})

router.post('/finish/:id', function(req, res, next) {
    const db = new sqlite3.Database('backlog.db');

    const id = req.params.id;
    const date = new Date();
    const rating = req.body.rating;
    const valuation = req.body.valuation;
    const like = req.body.like;

    const sql = "INSERT INTO movie_finished (id, date, rating, valuation, like)" +
        "VALUES (?, ?, ?, ?, ?)";
    db.run(sql, [id, date, rating, valuation, like]);

    const sql2 = "UPDATE movie SET status = ? WHERE id = ?";
    db.run(sql2, ["finished", id]);

    res.redirect('/movie/detail/' + id);
})

router.get('/repeat/:id', function(req, res, next) {
    const db = new sqlite3.Database('backlog.db');

    const id = req.params.id;
    const sql2 = "UPDATE movie_finished SET finishcount = finishcount + 1 WHERE id = ?";
    db.run(sql2, [id]);

    res.redirect('/movie/detail/' + id);
})

module.exports = router;