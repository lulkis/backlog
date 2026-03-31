var express = require('express');
const Database = require('better-sqlite3');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    const db = new Database('./backlog.db');
    const rows = db.prepare("SELECT id, name, status FROM book ORDER BY name ASC").all();
    res.render('media-list', { title: 'Books', route: 'book', list: rows });
});

router.get('/add', function(req, res, next) {
    const media = { name: "", year: "", genre: "", country: "" , description: "", author: "", length: "", publisher: "", illustrator: "" ,header_space: 0};
    res.render('media-form', { title: 'Books', route: 'book' , media: media });
});

router.post('/add', function(req, res, next) {
    const db = new Database('./backlog.db');

    var name = req.body.name;
    var year = Number(req.body.year);
    var genre = req.body.genre;
    var country = req.body.country;
    var description = req.body.description;
    var date_added = new Date().toISOString();
    var status = 'open';
    var header_space = req.body.header_space;

    var author = req.body.author;
    var length = req.body.length;
    var publisher = req.body.publisher;
    var illustrator = req.body.illustrator;
    var upcoming = req.body.upcoming;

    var path = './public/images/book/'+ name.toLowerCase().replaceAll(" ", "_").replaceAll(":", "") +'.jpg'
    let picture = req.files.foo;
    picture.mv(path, function(err) {
        if(err){
            console.log(err)
        }
        console.log("Succ")
    });

    db.prepare("INSERT INTO book (name, year, genre, country, description, status, added, author, length, publisher, illustrator, header_space, upcoming)" +
        "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
        .run(name, year, genre, country, description, status, date_added, author, length, publisher, illustrator, header_space, upcoming)

    res.redirect('/book')
})

router.get('/detail/:id', function(req, res, next) {
    const db = new Database('./backlog.db');

    const row1 = db.prepare("SELECT * FROM book WHERE id = ?").get(req.params.id)
    const row2 = db.prepare("SELECT * FROM book_finished WHERE id = ?").run(req.params.id)

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

    res.render('media', { media: row1, route: 'book', finish: row2, days: diffDays });
});

router.get('/edit/:id', function(req, res, next) {
    const db = new Database('./backlog.db');
    const rows = db.prepare("SELECT * FROM book WHERE id = ?").get(req.params.id);
    res.render('media-form', { title: 'Book', route: 'book', media: rows });
});

router.post('/edit/:id', function(req, res, next) {
    const db = new Database('./backlog.db');

    var name = req.body.name;
    var year = Number(req.body.year);
    var genre = req.body.genre;
    var country = req.body.country;
    var description = req.body.description;
    var author = req.body.author;
    var length = req.body.length;
    var publisher = req.body.publisher;
    var illustrator = req.body.illustrator;
    var header_space = req.body.header_space;
    var upcoming = req.body.upcoming;

    if(req.files != null){
        const path = './public/images/book/' + name.toLowerCase().replaceAll(" ", "_").replaceAll(":", "")  + '.jpg';

        if (req.files.foo != null){
            let picture = req.files.foo;
            picture.mv(path, function(err) {
                if(err){
                    console.log(err)
                }
                console.log("Succ")
            });

        }
        var path2 = './public/images/book/game/'+ name.toLowerCase().replaceAll(" ", "_").replaceAll(":", "") +'.jpg'

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

    db.prepare("Update book SET " +
        "name=?, year=?, genre=?, country=?, description=?, author=?, length=?, publisher=?, illustrator=?, header_space=?, upcoming=?" +
        "WHERE id = ?")
        .run(name, year, genre, country, description, author, length, publisher, illustrator, header_space, upcoming, req.params.id)

    res.redirect('/book/detail/'+req.params.id);
});

router.get('/start/:id', function(req, res, next) {
    const db = new Database('./backlog.db');
    const id = req.params.id;
    db.prepare("UPDATE book SET status = ? WHERE id = ?").run("started", id)
    res.redirect('/book/detail/' + id);
})

router.get('/finish/:id', function(req, res, next) {
    res.render('media-finish', { route: 'book', vals: {rating: "", valuation: "", like: false, id: req.params.id}});
})

router.post('/finish/:id', function(req, res, next) {
    const db = new Database('./backlog.db');

    const id = req.params.id;
    const date = new Date().toISOString();
    const rating = req.body.rating;
    const valuation = req.body.valuation;
    const like = req.body.like;

    db.prepare("INSERT INTO book_finished (id, date, rating, valuation, like)" +
        "VALUES (?, ?, ?, ?, ?)").run(id, date, rating, valuation, like)
    db.prepare("UPDATE book SET status = ? WHERE id = ?").run("finished", id)

    res.redirect('/book/detail/' + id);
})

router.get('/repeat/:id', function(req, res, next) {
    const db = new Database('./backlog.db');
    const id = req.params.id;
    db.prepare("UPDATE book_finished SET finishcount = finishcount + 1 WHERE id = ?").run(id)
    res.redirect('/book/detail/' + id);
})

router.get('/editval/:id', function(req, res, next) {
    const db = new Database('./backlog.db');
    const rows = db.prepare("SELECT * FROM book_finished WHERE id = ?").get(req.params.id);
    res.render('media-finish', { route: 'book', vals: rows, id: req.body.id });
})

router.post('/editval/:id', function(req, res, next) {
    const db = new Database('./backlog.db');

    const rating = req.body.rating;
    const valuation = req.body.valuation;
    const like = req.body.like;

    db.prepare("Update book_finished SET " +
        "rating=?, valuation=?, like=?" +
        "WHERE id = ?").run(rating, valuation, like, req.params.id)
    res.redirect('/book/detail/' + req.params.id);
})

module.exports = router;
