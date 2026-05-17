var express = require('express');
var router = express.Router();
const {db} = require("../db.js");
const { getSettings, updateSetting } = require("../settings");

/* GET home page. */
router.get('/', function(req, res, next) {
    const rows = db.prepare("SELECT id, name, status FROM movie ORDER BY name ASC").all()
    res.render('media-list', { title: 'Movies', route: 'movie' , list: rows});
});

router.get('/add', function(req, res, next) {
    const media = { name: "", year: "", genre: "", country: "" , description: "", studio: "", director: "", length: "", cast: "", header_space: 0 };
    res.render('media-form', { title: 'Movies', route: 'movie', media: media });
});

router.post('/add', function(req, res, next) {
    var name = req.body.name;
    var year = Number(req.body.year);
    var genre = req.body.genre;
    var country = req.body.country;
    var description = req.body.description;
    var date_added = new Date().toISOString();
    var status = 'open';
    var studio = req.body.studio;
    var director = req.body.director;
    var length = Number(req.body.length);
    var cast = req.body.cast;
    var header_space = parseFloat(req.body.header_space);
    var score = req.body.score;

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

    db.prepare("INSERT INTO movie (name, year, genre, country, description, status, added, studio, director, length, cast, header_space, score)" +
        "   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)").run(name, year, genre, country, description, status, date_added, studio, director, length, cast, header_space, score)

    res.redirect('/movie')
})

router.get('/detail/:id', async function (req, res, next) {
    const row1 = db.prepare("SELECT * FROM movie WHERE movie.id = ?").get(req.params.id)
    const row2 = db.prepare("SELECT * FROM movie_finished WHERE id = ?").get(req.params.id)
    const inlist = db.prepare("SELECT l.id, l.name, l.color FROM lists l " +
        "JOIN list_content lc ON l.id = lc.list WHERE lc.type = 'movie' AND lc.media=?").all(req.params.id)

    let straming_info = [];
    console.log(inlist)

    const settings = getSettings();

    if(settings["streaming"] === true) {
        const API_KEY = process.env.API_KEY;
        const query = row1.name;
        const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=de-DE`;

        const searchRes = await fetch(searchUrl);
        const searchData = await searchRes.json()

        var movieId = 10
        try {
            movieId = searchData.results[0].id;
        } catch (err) {
        }

        const providersUrl = `https://api.themoviedb.org/3/movie/${movieId}/watch/providers?api_key=${API_KEY}`;

        const provRes = await fetch(providersUrl);
        const provData = await provRes.json();
        var germany = provData.results.DE;

        const input = row1.upcoming;
        var diffDays = 0
        if (input) {
            const [day, month, year] = input.split(".");
            const date = new Date(year, month - 1, day);
            const current_date = new Date();
            if (current_date < date) {
                const oneDay = 24 * 60 * 60 * 1000;
                diffDays = Math.round(Math.abs((current_date - date) / oneDay));
            }
        }

        if(germany){
            straming_info = germany.flatrate
        }
    }

    res.render('media', {
        media: row1,
        route: 'movie',
        finish: row2,
        stream: straming_info,
        settings: settings,
        days: diffDays,
        inlist: inlist
    });
});

router.get('/edit/:id', function(req, res, next) {
    const row = db.prepare("SELECT * FROM movie WHERE id = ?").get(req.params.id);
    res.render('media-form', { title: 'Movies', route: 'movie', media: row });
});

router.post('/edit/:id', function(req, res, next) {
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
    var upcoming = req.body.upcoming;

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

    db.prepare("Update movie SET " +
        "name=?, year=?, genre=?, country=?, description=?, studio=?, director=?, length=?, cast=?, header_space=?, score=?, upcoming=?" +
        "WHERE id = ?").run(name, year, genre, country, description, studio, director, length, cast, header_space, score, upcoming, req.params.id)

    res.redirect('/movie/detail/'+req.params.id);
});

router.get('/finish/:id', function(req, res, next) {
    res.render('media-finish', { route: 'movie', vals: {rating: "", valuation: "", like: false, id: req.params.id, medium: 'streaming'} });
})

router.post('/finish/:id', function(req, res, next) {
    const id = req.params.id;
    const date = new Date().toISOString();
    const rating = req.body.rating;
    const valuation = req.body.valuation;
    const like = req.body.like;
    const medium = req.body.medium;

    db.prepare("INSERT INTO movie_finished (id, date, rating, valuation, like, medium)" +
        "VALUES (?, ?, ?, ?, ?, ?)").run(id, date, rating, valuation, like, medium)
    db.prepare("UPDATE movie SET status = ? WHERE id = ?").run("finished", id)

    res.redirect('/movie/detail/' + id);
})

router.get('/repeat/:id', function(req, res, next) {
    const id = req.params.id;
    db.prepare("UPDATE movie_finished SET finishcount = finishcount + 1 WHERE id = ?").run(id);
    res.redirect('/movie/detail/' + id);
})

router.get('/editval/:id', function(req, res, next) {
    const val = db.prepare("SELECT * FROM movie_finished WHERE id = ?").get(req.params.id)
    res.render('media-finish', { route: 'movie', vals: val, id: req.body.id });
})

router.post('/editval/:id', function(req, res, next) {
    const rating = req.body.rating;
    const valuation = req.body.valuation;
    const like = req.body.like;
    const medium = req.body.medium;

    db.prepare("Update movie_finished SET " +
        "rating=?, valuation=?, like=?, medium=?" +
        "WHERE id = ?").run(rating, valuation, like, medium, req.params.id)

    res.redirect('/movie/detail/' + req.params.id);
})

module.exports = router;
