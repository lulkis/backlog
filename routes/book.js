var express = require('express');
const {db} = require("../utils/db.js");
const {cleanPath} = require("../utils/utils.js");
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    try {
        const rows = db.prepare("SELECT id, name, status FROM book ORDER BY name ASC").all();
        res.render('media-list', { title: 'Books', route: 'book', list: rows });
    } catch (err) {
        console.log("Database Error: " + err.message);
        next(err);
    }
});

router.get('/add', function(req, res, next) {
    const media = { name: "", year: "", genre: "", country: "" , description: "", author: "", length: "", publisher: "", illustrator: "" ,header_space: 0};
    res.render('media-form', { title: 'Books', route: 'book' , media: media });
});

router.post('/add', function(req, res, next) {
    const name = req.body.name;
    const year = Number(req.body.year);
    const genre = req.body.genre;
    const country = req.body.country;
    const description = req.body.description;
    const date_added = new Date().toISOString();
    const status = 'open';
    const header_space = req.body.header_space;

    const author = req.body.author;
    const length = req.body.length;
    const publisher = req.body.publisher;
    const illustrator = req.body.illustrator;
    const upcoming = req.body.upcoming;

    const clean_name = cleanPath(name);
    const path = './public/images/book/'+ clean_name +'.jpg'
    let picture = req.files.foo;
    picture.mv(path, function(err) {
        if(err){
            console.log(err)
        }
        console.log("Succ")
    });

    try {
        db.prepare("INSERT INTO book (name, year, genre, country, description, status, added, author, length, publisher, illustrator, header_space, upcoming)" +
            "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
            .run(name, year, genre, country, description, status, date_added, author, length, publisher, illustrator, header_space, upcoming)

        res.redirect('/book')
    } catch (err) {
        console.log("Database Error: " + err.message);
        next(err);
    }
})

router.get('/detail/:id', function(req, res, next) {
    try {
        const row1 = db.prepare("SELECT * FROM book WHERE id = ?").get(req.params.id)
        const row2 = db.prepare("SELECT * FROM book_finished WHERE id = ?").get(req.params.id)
        const inlist = db.prepare("SELECT l.id, l.name, l.color FROM lists l " +
            "JOIN list_content lc ON l.id = lc.list WHERE lc.type = 'book' AND lc.media=?").all(req.params.id)

        const input = row1.upcoming;
        let diffDays = 0
        if(input){
            const [day, month, year] = input.split(".");
            const date = new Date(year, month - 1, day);
            const current_date = new Date();
            if(current_date < date){
                const oneDay = 24 * 60 * 60 * 1000;
                diffDays = Math.round(Math.abs((current_date - date) / oneDay));
            }
        }

        res.render('media', { media: row1, route: 'book', finish: row2, days: diffDays, inlist: inlist });
    } catch (err) {
        console.log("Database Error: " + err.message);
        next(err);
    }
});

router.get('/edit/:id', function(req, res, next) {
    try {
        const rows = db.prepare("SELECT * FROM book WHERE id = ?").get(req.params.id);
        res.render('media-form', { title: 'Book', route: 'book', media: rows });
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
    const author = req.body.author;
    const length = req.body.length;
    const publisher = req.body.publisher;
    const illustrator = req.body.illustrator;
    const header_space = req.body.header_space;
    const upcoming = req.body.upcoming;

    if(req.files != null){
        const clean_name = cleanPath(name);
        const path = './public/images/book/' + clean_name  + '.jpg';

        if (req.files.foo != null){
            let picture = req.files.foo;
            picture.mv(path, function(err) {
                if(err){
                    console.log(err)
                }
                console.log("Succ")
            });

        }
        const path2 = './public/images/book/game/'+ clean_name +'.jpg'

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
        db.prepare("Update book SET " +
            "name=?, year=?, genre=?, country=?, description=?, author=?, length=?, publisher=?, illustrator=?, header_space=?, upcoming=?" +
            "WHERE id = ?")
            .run(name, year, genre, country, description, author, length, publisher, illustrator, header_space, upcoming, req.params.id)

        res.redirect('/book/detail/'+req.params.id);
    } catch (err) {
        console.log("Database Error: " + err.message);
        next(err);
    }
});

router.get('/start/:id', function(req, res, next) {
    try {
        const id = req.params.id;
        db.prepare("UPDATE book SET status = ? WHERE id = ?").run("started", id)
        res.redirect('/book/detail/' + id);
    } catch (err) {
        console.log("Database Error: " + err.message);
        next(err);
    }
})

router.get('/finish/:id', function(req, res, next) {
    res.render('media-finish', { route: 'book', vals: {rating: "", valuation: "", like: false, id: req.params.id}});
})

router.post('/finish/:id', function(req, res, next) {
    const id = req.params.id;
    const date = new Date().toISOString();
    const rating = req.body.rating;
    const valuation = req.body.valuation;
    const like = req.body.like;

    try {
        db.prepare("INSERT INTO book_finished (id, date, rating, valuation, like)" +
            "VALUES (?, ?, ?, ?, ?)").run(id, date, rating, valuation, like)
        db.prepare("UPDATE book SET status = ? WHERE id = ?").run("finished", id)

        res.redirect('/book/detail/' + id);
    } catch (err) {
        console.log("Database Error: " + err.message);
        next(err);
    }
})

router.get('/repeat/:id', function(req, res, next) {
    try {
        const id = req.params.id;
        db.prepare("UPDATE book_finished SET finishcount = finishcount + 1 WHERE id = ?").run(id)
        res.redirect('/book/detail/' + id);
    } catch (err) {
        console.log("Database Error: " + err.message);
        next(err);
    }
})

router.get('/editval/:id', function(req, res, next) {
    try {
        const rows = db.prepare("SELECT * FROM book_finished WHERE id = ?").get(req.params.id);
        res.render('media-finish', { route: 'book', vals: rows, id: req.body.id });
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
        db.prepare("Update book_finished SET " +
            "rating=?, valuation=?, like=?" +
            "WHERE id = ?").run(rating, valuation, like, req.params.id)
        res.redirect('/book/detail/' + req.params.id);
    } catch (err) {
        console.log("Database Error: " + err.message);
        next(err);
    }
})

module.exports = router;
