var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3');

/* GET home page. */
router.get('/', function(req, res, next) {
    const db = new sqlite3.Database('backlog.db');

    var query = "SELECT id, name, status FROM series ORDER BY name ASC";
    db.all(query, function (err, rows) {
        if(err){
            console.log(err);
        }else{
            res.render('media-list', { title: 'Series', route: 'series', list: rows});
        }
    });
});

router.get('/add', function(req, res, next) {
    const media = { name: "", year: "", year_end: "", genre: "", country: "" , description: "", idea: "", studio: "", cast: "", episodes: "" ,header_space: 0};
    res.render('media-form', { title: 'Series', route: 'series' , media: media });
});

router.post('/add', function(req, res, next) {
    const db = new sqlite3.Database('backlog.db');

    console.log(req.body);

    var name = req.body.name;
    var year = Number(req.body.year);
    var year_end = Number(req.body.year_end);
    var genre = req.body.genre;
    var country = req.body.country;
    var description = req.body.description;
    var date_added = new Date();
    var header_space = req.body.header_space;
    var status = 'open';
    var idea = req.body.idea;
    var studio = req.body.studio;
    var cast = req.body.cast;
    var episodes = req.body.episodes;
    var score = req.body.score;

    var path = './public/images/series/'+ name.toLowerCase().replaceAll(" ", "_").replaceAll(":", "") +'.jpg'
    let picture = req.files.foo;
    picture.mv(path, function(err) {
        if(err){
            console.log(err)
        }
        console.log("Succ")
    });

    var path2 = './public/images/series/header/'+ name.toLowerCase().replaceAll(" ", "_").replaceAll(":", "") +'.jpg'
    let picture2 = req.files.foo2;
    picture2.mv(path2, function(err) {
        if(err){
            console.log(err)
        }
        console.log("Succ")
    });

    const sql = "INSERT INTO series (name, year, year_end, genre, country, description, status, added, idea, studio, cast, episodes, header_space, score)" +
        "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    db.run(sql, [name, year, year_end, genre, country, description, status, date_added, idea, studio, cast, episodes, header_space, score]);

    res.redirect('/series')
})

router.get('/detail/:id', function(req, res, next) {
    const db = new sqlite3.Database('backlog.db');

    var query = "SELECT * FROM series WHERE id = ?;";
    db.all(query, [req.params.id], function (err, rows) {
        if(err){
            console.log(err);
        }else{
            var query = "SELECT * FROM series_finished WHERE id = ?";
            db.all(query, [req.params.id], function (err, rows2) {
                if(err){
                    console.log(err);
                }else{
                    res.render('media', { media: rows[0], route: 'series', finish: rows2[0]});
                }
            });
        }
    });
});

router.get('/edit/:id', function(req, res, next) {
    const db = new sqlite3.Database('backlog.db');

    var query = "SELECT * FROM series WHERE id = ?;";
    db.all(query, [req.params.id], function (err, rows) {
        if(err){
            console.log(err);
        }else{
            res.render('media-form', { title: 'Series', route: 'series', media: rows[0] });
        }
    });
});

router.post('/edit/:id', function(req, res, next) {
    const db = new sqlite3.Database('backlog.db');

    var name = req.body.name;
    var year = Number(req.body.year);
    var year_end = Number(req.body.year_end);
    var genre = req.body.genre;
    var country = req.body.country;
    var description = req.body.description;
    var header_space = req.body.header_space;
    var idea = req.body.idea;
    var studio = req.body.studio;
    var cast = req.body.cast;
    var episodes = req.body.episodes;
    var score = req.body.score;
    var cancelled;
    if(req.body.cancelled === "1") {
        cancelled = 1;
    } else {
        cancelled = 0;
    }
    console.log(req.body.cancelled)
    console.log(cancelled)

    if(req.files != null){
        const path = './public/images/series/' + name.toLowerCase().replaceAll(" ", "_").replaceAll(":", "")  + '.jpg';

        if (req.files.foo != null){
            let picture = req.files.foo;
            picture.mv(path, function(err) {
                if(err){
                    console.log(err)
                }
                console.log("Succ")
            });

        }
        var path2 = './public/images/series/header/'+ name.toLowerCase().replaceAll(" ", "_").replaceAll(":", "") +'.jpg'

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

    const sql = "Update series SET " +
        "name=?, year=?, year_end=?, genre=?, country=?, description=?, idea=?, studio=?, cast=?, episodes=?, header_space=?, cancelled=?, score=?" +
        "WHERE id = ?"
    db.run(sql, [name, year, year_end, genre, country, description, idea, studio, cast, episodes, header_space, cancelled, score, req.params.id]);

    res.redirect('/series/detail/'+req.params.id);
});

router.get('/start/:id', function(req, res, next) {
    const db = new sqlite3.Database('backlog.db');

    const id = req.params.id;
    const sql2 = "UPDATE series SET status = ? WHERE id = ?";
    db.run(sql2, ["started", id]);

    res.redirect('/series/detail/' + id);
})

router.get('/finish/:id', function(req, res, next) {
    res.render('media-finish', { route: 'series' });
})

router.post('/finish/:id', function(req, res, next) {
    const db = new sqlite3.Database('backlog.db');

    const id = req.params.id;
    const date = new Date();
    const rating = req.body.rating;
    const valuation = req.body.valuation;
    const like = req.body.like;

    const sql = "INSERT INTO series_finished (id, date, rating, valuation, like)" +
        "VALUES (?, ?, ?, ?, ?)";
    db.run(sql, [id, date, rating, valuation, like]);

    const sql2 = "UPDATE series SET status = ? WHERE id = ?";
    db.run(sql2, ["finished", id]);

    res.redirect('/series/detail/' + id);
})

router.get('/new/:id', function(req, res, next) {
    const db = new sqlite3.Database('backlog.db');

    const id = req.params.id;
    const sql2 = "UPDATE series SET status = ? WHERE id = ?";
    db.run(sql2, ["open", id]);

    res.redirect('/series/detail/' + id);
})

module.exports = router;