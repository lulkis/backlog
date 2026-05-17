var express = require('express');
var router = express.Router();
const {db} = require("../db.js");

/* GET home page. */
router.get('/', function(req, res, next) {
    try {
        const rows = db.prepare("SELECT id, name, status FROM series ORDER BY name ASC").all()
        res.render('media-list', { title: 'Series', route: 'series', list: rows});
    } catch (err) {
        console.log("Database Error: " + err.message);
        next(err);
    }
});

router.get('/add', function(req, res, next) {
    const media = { name: "", year: "", year_end: "", genre: "", country: "" , description: "", idea: "", studio: "", cast: "", episodes: "" ,header_space: 0};
    res.render('media-form', { title: 'Series', route: 'series' , media: media });
});

router.post('/add', function(req, res, next) {
    var name = req.body.name;
    var year = Number(req.body.year);
    var year_end = Number(req.body.year_end);
    var genre = req.body.genre;
    var country = req.body.country;
    var description = req.body.description;
    var date_added = new Date().toISOString();
    var header_space = req.body.header_space;
    var status = 'open';
    var idea = req.body.idea;
    var studio = req.body.studio;
    var cast = req.body.cast;
    var episodes = req.body.episodes;
    var score = req.body.score;
    var upcoming = req.body.upcoming;

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

    try {
        db.prepare("INSERT INTO series (name, year, year_end, genre, country, description, status, added, idea, studio, cast, episodes, header_space, score, upcoming)" +
            "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
            .run(name, year, year_end, genre, country, description, status, date_added, idea, studio, cast, episodes, header_space, score, upcoming)

        res.redirect('/series')
    } catch (err) {
        console.log("Database Error: " + err.message);
        next(err);
    }
})

router.get('/detail/:id', function(req, res, next) {
    try {
        const row1 = db.prepare("SELECT * FROM series WHERE id = ?").get(req.params.id);
        const row2 = db.prepare("SELECT * FROM series_finished WHERE id = ?").get(req.params.id);
        const inlist = db.prepare("SELECT l.id, l.name, l.color FROM lists l " +
            "JOIN list_content lc ON l.id = lc.list WHERE lc.type = 'series' AND lc.media=?").all(req.params.id)

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

        res.render('media', { media: row1, route: 'series', finish: row2, days: diffDays, inlist: inlist});
    } catch (err) {
        console.log("Database Error: " + err.message);
        next(err);
    }
});

router.get('/edit/:id', function(req, res, next) {
    try {
        const rows = db.prepare("SELECT * FROM series WHERE id = ?").get(req.params.id);
        res.render('media-form', { title: 'Series', route: 'series', media: rows });
    } catch (err) {
        console.log("Database Error: " + err.message);
        next(err);
    }
});

router.post('/edit/:id', function(req, res, next) {
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
    var upcoming = req.body.upcoming;
    if(req.body.cancelled === "1") {
        cancelled = 1;
    } else {
        cancelled = 0;
    }

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

    try {
        db.prepare("Update series SET " +
            "name=?, year=?, year_end=?, genre=?, country=?, description=?, idea=?, studio=?, cast=?, episodes=?, header_space=?, cancelled=?, score=?, upcoming=?" +
            "WHERE id = ?")
            .run(name, year, year_end, genre, country, description, idea, studio, cast, episodes, header_space, cancelled, score, upcoming, req.params.id)

        res.redirect('/series/detail/'+req.params.id);
    } catch (err) {
        console.log("Database Error: " + err.message);
        next(err);
    }
});

router.get('/start/:id', function(req, res, next) {
    try {
        const id = req.params.id;
        db.prepare("UPDATE series SET status = ? WHERE id = ?").run("started", id)
        res.redirect('/series/detail/' + id);
    } catch (err) {
        console.log("Database Error: " + err.message);
        next(err);
    }
})

router.get('/finish/:id', function(req, res, next) {
    res.render('media-finish', { route: 'series', vals: {rating: "", valuation: "", like: false, id: req.params.id}, id: req.body.id });
})

router.post('/finish/:id', function(req, res, next) {
    const id = req.params.id;
    const date = new Date().toISOString();
    const rating = req.body.rating;
    const valuation = req.body.valuation;
    const like = req.body.like;

    try {
        db.prepare("INSERT INTO series_finished (id, date, rating, valuation, like)" +
            "VALUES (?, ?, ?, ?, ?)").run(id, date, rating, valuation, like)
        db.prepare("UPDATE series SET status = ? WHERE id = ?").run("finished", id)

        res.redirect('/series/detail/' + id);
    } catch (err) {
        console.log("Database Error: " + err.message);
        next(err);
    }
})

router.get('/new/:id', function(req, res, next) {
    try {
        const id = req.params.id;
        db.prepare("UPDATE series SET status = ? WHERE id = ?").run("open", id)
        res.redirect('/series/detail/' + id);
    } catch (err) {
        console.log("Database Error: " + err.message);
        next(err);
    }
})

router.get('/repeat/:id', function(req, res, next) {
    try {
        const id = req.params.id;
        db.prepare("UPDATE series_finished SET finishcount = finishcount + 1 WHERE id = ?").run("open", id)
        res.redirect('/series/detail/' + id);
    } catch (err) {
        console.log("Database Error: " + err.message);
        next(err);
    }
})

router.get('/editval/:id', function(req, res, next) {
    try {
        const rows = db.prepare("SELECT * FROM series_finished WHERE id = ?").get(req.params.id);
        res.render('media-finish', { route: 'series', vals: rows, id: req.body.id });
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
        db.prepare("Update series_finished SET " +
            "rating=?, valuation=?, like=?" +
            "WHERE id = ?").run(rating, valuation, like, req.params.id)
        res.redirect('/series/detail/' + req.params.id);
    } catch (err) {
        console.log("Database Error: " + err.message);
        next(err);
    }
})

module.exports = router;
