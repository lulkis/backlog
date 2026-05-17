var express = require('express');
const {db, db2} = require("../utils/db.js");
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    try {
        const rows = db.prepare("SELECT id, name, status FROM game ORDER BY name ASC").all()
        res.render('media-list', { title: 'Games', route: 'game', list: rows});
    } catch (err) {
        console.log("Database Error: " + err.message);
        next(err);
    }
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
    var name = req.body.name;
    var year = Number(req.body.year);
    var genre = req.body.genre;
    var country = req.body.country;
    var header_space = req.body.header_space;
    var description = req.body.description;
    var date_added = new Date().toISOString();
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
