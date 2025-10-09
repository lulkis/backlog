var express = require('express');
const sqlite3 = require("sqlite3");
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    const db = new sqlite3.Database('backlog.db');

    var query = "SELECT id, name, status FROM book";
    db.all(query, function (err, rows) {
        if(err){
            console.log(err);
        }else{
            res.render('media-list', { title: 'Books', route: 'book', list: rows});
        }
    });
});

router.get('/add', function(req, res, next) {
    res.render('media-form', { title: 'Books', route: 'book' });
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

    var author = req.body.author;
    var length = req.body.length;
    var publisher = req.body.publisher;
    var illustrator = req.body.illustrator;

    var path = './public/images/book/'+ name.toLowerCase().replaceAll(" ", "_").replaceAll(":", "") +'.jpg'
    let picture = req.files.foo;
    picture.mv(path, function(err) {
        if(err){
            console.log(err)
        }
        console.log("Succ")
    });

    const sql = "INSERT INTO book (name, year, genre, country, description, status, added, author, length, publisher, illustrator)" +
        "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    db.run(sql, [name, year, genre, country, description, status, date_added, author, length, publisher, illustrator]);

    res.redirect('/book')
})

router.get('/detail/:id', function(req, res, next) {
    const db = new sqlite3.Database('backlog.db');

    var query = "SELECT * FROM book WHERE id = ?;";
    db.all(query, [req.params.id], function (err, rows) {
        if(err){
            console.log(err);
        }else{
            console.log(rows[0]);
            res.render('media', { media: rows[0], route: 'book' });
        }
    });
});

router.get('/start/:id', function(req, res, next) {
    const db = new sqlite3.Database('backlog.db');

    const id = req.params.id;
    const sql2 = "UPDATE book SET status = ? WHERE id = ?";
    db.run(sql2, ["started", id]);

    res.redirect('/book/detail/' + id);
})

router.get('/finish/:id', function(req, res, next) {
    res.render('media-finish', { route: 'book' });
})

router.post('/finish/:id', function(req, res, next) {
    const db = new sqlite3.Database('backlog.db');

    const id = req.params.id;
    const date = new Date();
    const rating = req.body.rating;
    const valuation = req.body.valuation;

    const sql = "INSERT INTO book_finished (id, date, rating, valuation)" +
        "VALUES (?, ?, ?, ?)";
    db.run(sql, [id, date, rating, valuation]);

    const sql2 = "UPDATE book SET status = ? WHERE id = ?";
    db.run(sql2, ["finished", id]);

    res.redirect('/book/detail/' + id);
})

module.exports = router;