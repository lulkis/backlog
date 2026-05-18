var express = require('express');
const {db, db2} = require("../utils/db.js");
const {cleanPath, daysToRelease} = require("../utils/utils");
var router = express.Router();

const service = require('../services/game.service')

router.get('/', function(req, res, next) {
    res.render('media-list', { title: 'Games', route: 'game', list: service.getAllGames()});
});

router.get('/add', function(req, res, next) {
    try {
        const media = { name: "", year: "", genre: "", country: "" , description: "", publisher: "", developer: "",header_space: 0};
        res.render('media-form', { title: 'Games', route: 'game' , media: media });
    } catch (err) {
        console.log("Database Error: " + err.message);
        next(err);
    }
});

router.post('/add', function(req, res, next) {
    const name = req.body.name;
    const year = Number(req.body.year);
    const genre = req.body.genre;
    const country = req.body.country;
    const header_space = req.body.header_space;
    const description = req.body.description;
    const date_added = new Date().toISOString();
    const status = 'open';
    const developer = req.body.developer;
    const publisher = req.body.publisher;
    const score = req.body.score;
    const cast = req.body.cast;
    const upcoming = req.body.upcoming;

    const clean_name = cleanPath(name);
    const path = './public/images/game/'+ clean_name +'.jpg'
    let picture = req.files.foo;
    picture.mv(path, function(err) {
        if(err){
            console.log(err)
        }
        console.log("Succ")
    });

    const path2 = './public/images/game/header/'+ clean_name +'.jpg'
    let picture2 = req.files.foo2;
    picture2.mv(path2, function(err) {
        if(err){
            console.log(err)
        }
        console.log("Succ")
    });

    try {
        db.prepare("INSERT INTO game (name, year, genre, country, description, status, added, developer, publisher, header_space, score, cast, upcoming)" +
            "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)").run(name, year, genre, country, description, status, date_added, developer, publisher, header_space, score, cast, upcoming)
        res.redirect('/game')
    } catch (err) {
        console.log("Database Error: " + err.message);
        next(err);
    }
})

router.get('/detail/:id', function(req, res, next) {
    try {
        const row1 = db.prepare("SELECT * FROM game WHERE id = ?").get(req.params.id);
        const row2 = db.prepare("SELECT * FROM game_finished WHERE id = ?").get(req.params.id);
        const hltb2 = db2.prepare("SELECT * FROM games WHERE title = ? OR title = ?").get(row1.name, row1.name+'('+row1.year+')')
        const inlist = db.prepare("SELECT l.id, l.name, l.color FROM lists l " +
            "JOIN list_content lc ON l.id = lc.list WHERE lc.type = 'game' AND lc.media=?").all(req.params.id)

        const input = row1.upcoming;
        const diffDays = daysToRelease(input);

        res.render('media', { media: row1, route: 'game', finish: row2, hltb: hltb2, days: diffDays, inlist: inlist });
    } catch (err) {
        console.log("Database Error: " + err.message);
        next(err);
    }
});

router.get('/edit/:id', function(req, res, next) {
    try {
        const rows = db.prepare("SELECT * FROM game WHERE id = ?").get(req.params.id);
        res.render('media-form', { title: 'Game', route: 'game', media: rows });
    } catch (err) {
        console.log("Database Error: " + err.message);
        next(err);
    }
});

router.post('/edit/:id', function(req, res, next) {
    const name = req.body.name;
    const year = Number(req.body.year);
    const genre = req.body.genre;
    const country = req.body.country;
    const description = req.body.description;
    const developer = req.body.developer;
    const publisher = req.body.publisher;
    const header_space = req.body.header_space;
    const score = req.body.score;
    const cast = req.body.cast;
    const upcoming = req.body.upcoming;

    if(req.files != null){
        const clean_name = cleanPath(name);
        const path = './public/images/game/' + clean_name  + '.jpg';

        if (req.files.foo != null){
            let picture = req.files.foo;
            picture.mv(path, function(err) {
                if(err){
                    console.log(err)
                }
                console.log("Succ")
            });

        }
        const path2 = './public/images/series/game/'+ clean_name +'.jpg'

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

    try {
        db.prepare("Update game SET " +
            "name=?, year=?, genre=?, country=?, description=?, developer=?, publisher=?, header_space=?, score=?, cast=?, upcoming=?" +
            "WHERE id = ?").run(name, year, genre, country, description, developer, publisher, header_space, score, cast, upcoming, req.params.id)

        res.redirect('/game/detail/'+req.params.id);
    } catch (err) {
        console.log("Database Error: " + err.message);
        next(err);
    }
});

router.get('/start/:id', function(req, res, next) {
    try {
        const id = req.params.id;
        db.prepare("UPDATE game SET status = ? WHERE id = ?").run("started", id)
        res.redirect('/game/detail/' + id);
    } catch (err) {
        console.log("Database Error: " + err.message);
        next(err);
    }
})

router.get('/finish/:id', function(req, res, next) {
    res.render('media-finish', { route: 'game', vals: {rating: "", valuation: "", like: false, id: req.params.id}});
})

router.post('/finish/:id', function(req, res, next) {
    const id = req.params.id;
    const date = new Date().toISOString();
    const rating = req.body.rating;
    const valuation = req.body.valuation;
    const like = req.body.like;

    try {
        db.prepare("INSERT INTO game_finished (id, date, rating, valuation, like)" +
            "VALUES (?, ?, ?, ?, ?)").run(id, date, rating, valuation, like)

        db.prepare("UPDATE game SET status = ? WHERE id = ?").run("finished", id)

        res.redirect('/game/detail/' + id);
    } catch (err) {
        console.log("Database Error: " + err.message);
        next(err);
    }
})

router.get('/repeat/:id', function(req, res, next) {
    try {
        const id = req.params.id;
        db.prepare("UPDATE game_finished SET finishcount = finishcount + 1 WHERE id = ?").run(id);
        res.redirect('/game/detail/' + id);
    } catch (err) {
        console.log("Database Error: " + err.message);
        next(err);
    }
})

router.get('/editval/:id', function(req, res, next) {
    try {
        const rows = db.prepare("SELECT * FROM game_finished WHERE id = ?").get(req.params.id);
        res.render('media-finish', { route: 'game', vals: rows, id: req.body.id });
    } catch (err) {
        console.log("Database Error: " + err.message);
        next(err);
    }
})

router.post('/editval/:id', function(req, res, next) {
    const rating = req.body.rating;
    const valuation = req.body.valuation;
    const like = req.body.like;

    try {
        db.prepare("Update game_finished SET " +
            "rating=?, valuation=?, like=?" +
            "WHERE id = ?").run(rating, valuation, like, req.params.id)

        res.redirect('/game/detail/' + req.params.id);
    } catch (err) {
        console.log("Database Error: " + err.message);
        next(err);
    }
})

module.exports = router;
