var express = require('express');
const sqlite3 = require("sqlite3");
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    const db = new sqlite3.Database('backlog.db');

    var query = "SELECT id, name, status FROM game ORDER BY name ASC";
    db.all(query, function (err, rows) {
        if(err){
            console.log(err);
        }else{
            res.render('media-list', { title: 'Games', route: 'game', list: rows});
        }
    });
});

router.get('/add', function(req, res, next) {
    const media = { name: "", year: "", genre: "", country: "" , description: "", publisher: "", developer: "",header_space: 0};
    res.render('media-form', { title: 'Games', route: 'game' , media: media });
});

router.post('/add', function(req, res, next) {
    const db = new sqlite3.Database('backlog.db');

    var name = req.body.name;
    var year = Number(req.body.year);
    var genre = req.body.genre;
    var country = req.body.country;
    var header_space = req.body.header_space;
    var description = req.body.description;
    var date_added = new Date();
    var status = 'open';
    var developer = req.body.developer;
    var publisher = req.body.publisher;
    var score = req.body.score;
    var cast = req.body.cast;
    var upcoming = req.body.upcoming;

    var path = './public/images/game/'+ name.toLowerCase().replaceAll(" ", "_").replaceAll(":", "") +'.jpg'
    let picture = req.files.foo;
    picture.mv(path, function(err) {
        if(err){
            console.log(err)
        }
        console.log("Succ")
    });

    var path2 = './public/images/game/header/'+ name.toLowerCase().replaceAll(" ", "_").replaceAll(":", "") +'.jpg'
    let picture2 = req.files.foo2;
    picture2.mv(path2, function(err) {
        if(err){
            console.log(err)
        }
        console.log("Succ")
    });

    const sql = "INSERT INTO game (name, year, genre, country, description, status, added, developer, publisher, header_space, score, cast, upcoming)" +
        "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    db.run(sql, [name, year, genre, country, description, status, date_added, developer, publisher, header_space, score, cast, upcoming]);

    res.redirect('/game')
})

router.get('/detail/:id', function(req, res, next) {
    const db = new sqlite3.Database('backlog.db');
    const db2 = new sqlite3.Database('hltb.db');

    var query = "SELECT * FROM game WHERE id = ?;";
    db.all(query, [req.params.id], function (err, rows) {
        if(err){
            console.log(err);
        }else{
            var query = "SELECT * FROM game_finished WHERE id = ?";
            db.all(query, [req.params.id], function (err, rows2) {
                if(err){
                    console.log(err);
                }else{

                    var query2 = "SELECT * FROM games WHERE title = ? OR title = ?;";
                    db2.all(query2, [rows[0].name, rows[0].name+'('+rows[0].year+')'], function (err, hltb) {
                        if(err){
                            console.log(err);
                        }else{
                            console.log(hltb);
                            const input = rows[0].upcoming;
                            var diffDays = 0
                            if(input){
                                const [day, month, year] = input.split(".");
                                const date = new Date(year, month - 1, day);
                                const current_date = new Date();
                                if(current_date < date){
                                    const oneDay = 24 * 60 * 60 * 1000;
                                    diffDays = Math.round(Math.abs((current_date - date) / oneDay));
                                }
                            }

                            res.render('media', { media: rows[0], route: 'game', finish: rows2[0], hltb: hltb[0], days: diffDays});
                        }
                    });
                }
            });
        }
    });
});

router.get('/edit/:id', function(req, res, next) {
    const db = new sqlite3.Database('backlog.db');

    var query = "SELECT * FROM game WHERE id = ?;";
    db.all(query, [req.params.id], function (err, rows) {
        if(err){
            console.log(err);
        }else{
            res.render('media-form', { title: 'Game', route: 'game', media: rows[0] });
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
    var developer = req.body.developer;
    var publisher = req.body.publisher;
    var header_space = req.body.header_space;
    var score = req.body.score;
    var cast = req.body.cast;
    var upcoming = req.body.upcoming;

    if(req.files != null){
        const path = './public/images/game/' + name.toLowerCase().replaceAll(" ", "_").replaceAll(":", "")  + '.jpg';

        if (req.files.foo != null){
            let picture = req.files.foo;
            picture.mv(path, function(err) {
                if(err){
                    console.log(err)
                }
                console.log("Succ")
            });

        }
        var path2 = './public/images/series/game/'+ name.toLowerCase().replaceAll(" ", "_").replaceAll(":", "") +'.jpg'

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

    const sql = "Update game SET " +
        "name=?, year=?, genre=?, country=?, description=?, developer=?, publisher=?, header_space=?, score=?, cast=?, upcoming=?" +
        "WHERE id = ?"
    db.run(sql, [name, year, genre, country, description, developer, publisher, header_space, score, cast, upcoming, req.params.id]);

    res.redirect('/game/detail/'+req.params.id);
});

router.get('/start/:id', function(req, res, next) {
    const db = new sqlite3.Database('backlog.db');

    const id = req.params.id;
    const sql2 = "UPDATE game SET status = ? WHERE id = ?";
    db.run(sql2, ["started", id]);

    res.redirect('/game/detail/' + id);
})

router.get('/finish/:id', function(req, res, next) {
    res.render('media-finish', { route: 'game', vals: {rating: "", valuation: "", like: false, id: req.params.id}});
})

router.post('/finish/:id', function(req, res, next) {
    const db = new sqlite3.Database('backlog.db');

    const id = req.params.id;
    const date = new Date();
    const rating = req.body.rating;
    const valuation = req.body.valuation;
    const like = req.body.like;

    const sql = "INSERT INTO game_finished (id, date, rating, valuation, like)" +
        "VALUES (?, ?, ?, ?, ?)";
    db.run(sql, [id, date, rating, valuation, like]);

    const sql2 = "UPDATE game SET status = ? WHERE id = ?";
    db.run(sql2, ["finished", id]);

    res.redirect('/game/detail/' + id);
})

router.get('/repeat/:id', function(req, res, next) {
    const db = new sqlite3.Database('backlog.db');

    const id = req.params.id;
    const sql2 = "UPDATE game_finished SET finishcount = finishcount + 1 WHERE id = ?";
    db.run(sql2, [id]);

    res.redirect('/game/detail/' + id);
})

router.get('/editval/:id', function(req, res, next) {
    const db = new sqlite3.Database('backlog.db');

    var query = "SELECT * FROM game_finished WHERE id = ?;";
    db.all(query, [req.params.id], function (err, rows) {
        if(err){
            console.log(err);
        }else{
            res.render('media-finish', { route: 'game', vals: rows[0], id: req.body.id });
        }
    });
})

router.post('/editval/:id', function(req, res, next) {
    const db = new sqlite3.Database('backlog.db');

    const rating = req.body.rating;
    const valuation = req.body.valuation;
    const like = req.body.like;

    const sql = "Update game_finished SET " +
        "rating=?, valuation=?, like=?" +
        "WHERE id = ?"
    db.run(sql, [rating, valuation, like, req.params.id]);

    res.redirect('/game/detail/' + req.params.id);
})

module.exports = router;