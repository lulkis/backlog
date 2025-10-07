var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3');

/* GET home page. */
router.get('/', function(req, res, next) {
    const db = new sqlite3.Database('backlog.db');

    var query = "SELECT id, name FROM series";
    db.all(query, function (err, rows) {
        if(err){
            console.log(err);
        }else{
            res.render('media-list', { title: 'Series', route: 'series', list: rows});
        }
    });
});

router.get('/add', function(req, res, next) {
    res.render('media-form', { title: 'Series', route: 'series' });
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
    var idea = req.body.idea;
    var studio = req.body.studio;
    var cast = req.body.cast;
    var episodes = req.body.episodes;

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

    const sql = "INSERT INTO series (name, year, genre, country, description, status, added, idea, studio, cast, episodes)" +
        "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    db.run(sql, [name, year, genre, country, description, status, date_added, idea, studio, cast, episodes]);

    res.redirect('/series')
})

router.get('/detail/:id', function(req, res, next) {
    const db = new sqlite3.Database('backlog.db');

    var query = "SELECT * FROM series WHERE id = ?;";
    db.all(query, [req.params.id], function (err, rows) {
        if(err){
            console.log(err);
        }else{
            console.log(rows[0]);
            res.render('media', { media: rows[0], route: 'series' });
        }
    });
});

module.exports = router;