var express = require('express');
const sqlite3 = require("sqlite3");
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    const db = new sqlite3.Database('backlog.db');

    var query = "SELECT id, name FROM game";
    db.all(query, function (err, rows) {
        if(err){
            console.log(err);
        }else{
            res.render('media-list', { title: 'Games', route: 'game', list: rows});
        }
    });
});

router.get('/add', function(req, res, next) {
    res.render('media-form', { title: 'Games', route: 'game' });
});

router.post('/add', function(req, res, next) {
    const db = new sqlite3.Database('backlog.db');

    var name = req.body.name;
    var year = Number(req.body.year);
    var genre = req.body.genre;
    var country = req.body.country;
    var description = req.body.description;
    var date_added = new Date();
    var status = 'open';
    var developer = req.body.developer;
    var publisher = req.body.publisher;

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

    const sql = "INSERT INTO game (name, year, genre, country, description, status, added, developer, publisher)" +
        "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    db.run(sql, [name, year, genre, country, description, status, date_added, developer, publisher]);

    res.redirect('/game')
})

router.get('/detail/:id', function(req, res, next) {
    const db = new sqlite3.Database('backlog.db');

    var query = "SELECT * FROM game WHERE id = ?;";
    db.all(query, [req.params.id], function (err, rows) {
        if(err){
            console.log(err);
        }else{
            console.log(rows[0]);
            res.render('media', { media: rows[0], route: 'game' });
        }
    });
});

module.exports = router;