var express = require('express');
const Database = require('better-sqlite3');
const { access } = require("fs/promises");
const { constants } = require("fs");
var router = express.Router();
const path = require("path");

/* GET home page. */
router.get('/', function(req, res, next) {
    const db = new Database('./backlog.db');

    const row = db.prepare("SELECT movie.id, movie.name, movie.added, 'movie' AS route FROM movie WHERE movie.status = 'open'\n" +
        "UNION\n" +
        "SELECT series.id, series.name, series.added, 'series' AS route FROM series WHERE series.status = 'open' OR series.status = 'started'\n" +
        "UNION\n" +
        "SELECT book.id, book.name, book.added, 'book' AS route FROM book WHERE book.status = 'open' OR book.status = 'started'\n" +
        "UNION\n" +
        "SELECT game.id, game.name, game.added, 'game' AS route FROM game WHERE game.status = 'open' OR game.status = 'started'\n" +
        "ORDER BY added DESC LIMIT 5").all();

    const row2 = db.prepare("SELECT movie.name, movie.id, movie_finished.date, 'movie' AS route FROM movie\n" +
        "INNER JOIN movie_finished ON movie.id = movie_finished.id\n" +
        "UNION\n" +
        "SELECT series.name, series.id, series_finished.date, 'series' AS route FROM series\n" +
        "INNER JOIN series_finished ON series.id = series_finished.id\n" +
        "UNION\n" +
        "SELECT book.name, book.id, book_finished.date, 'book' AS route FROM book\n" +
        "INNER JOIN book_finished ON book.id = book_finished.id\n" +
        "UNION\n" +
        "SELECT game.name, game.id, game_finished.date, 'game' AS route FROM game\n" +
        "INNER JOIN game_finished ON game.id = game_finished.id\n" +
        "ORDER BY date DESC LIMIT 5").all()

    const row3 = db.prepare("SELECT status, COUNT(*) as count\n" +
        "FROM (\n" +
        "         SELECT status FROM movie\n" +
        "         UNION ALL\n" +
        "         SELECT status FROM series\n" +
        "         UNION ALL\n" +
        "         SELECT status FROM book\n" +
        "         UNION ALL\n" +
        "         SELECT status FROM game\n" +
        "     ) AS Alle_Daten\n" +
        "GROUP BY status;").all()

    const row4 = db.prepare("SELECT id, name FROM lists;").all()

    res.render('index', { title: 'Express',
        recent: row,
        finish: row2,
        counts: row3,
        listy: row4
    });
});

router.get('/get/:name', function(req, res, next) {
    //SELECT * FROM movie WHERE movie_cast LIKE $1
    const db = new Database('./backlog.db');

    const rows = db.prepare("SELECT * FROM movie " +
        "WHERE CONCAT(movie.name, movie.director, movie.cast, movie.studio, movie.score) " +
        "LIKE ? " +
        "ORDER BY movie.year DESC ")
        .run('%'+req.params.name+'%')

    const rows2 = db.prepare("SELECT * FROM series " +
        "WHERE CONCAT(series.name, series.idea, series.cast, series.studio, series.score) " +
        "LIKE ? " +
        "ORDER BY series.year")
        .run('%'+req.params.name+'%')

    const rows3 = db.prepare("SELECT * FROM game " +
        "WHERE CONCAT(game.name, game.publisher, game.developer, game.score) " +
        "LIKE ? " +
        "ORDER BY game.year")
        .run('%'+req.params.name+'%')

    const rows4 = db.prepare("SELECT * FROM book " +
        "WHERE CONCAT(book.name, book.author) " +
        "LIKE ? " +
        "ORDER BY book.year")
        .run('%'+req.params.name+'%')

    res.render('search', { name: req.params.name,
        list: rows, list2: rows2, list3: rows3, list4: rows4, search_type: "general"});
})

router.get('/search/:name', async function (req, res, next) {
    //SELECT * FROM movie WHERE movie_cast LIKE $1
    const db = new Database('./backlog.db');

    const rows = db.prepare("SELECT * FROM movie WHERE movie.cast LIKE ? ORDER BY movie.year DESC ")
        .run('%' + req.params.name + '%')

    const rows2 = db.prepare("SELECT * FROM series WHERE series.cast LIKE ? ORDER BY series.year")
        .run('%' + req.params.name + '%')

    const rows3 = db.prepare("SELECT * FROM game WHERE game.cast LIKE ? ORDER BY game.year")
        .run('%' + req.params.name + '%')

    var search = "general"
    const pth = path.join(__dirname, "../public/images/actors/" + req.params.name.replaceAll(".", "") + ".jpg");
    console.log(pth);
    if (await fileExists(pth)) {
        console.log("Datei existiert");
        search = "actor";
    }

    res.render('search', {
        name: req.params.name,
        list: rows,
        list2: rows2,
        list3: rows3,
        list4: [],
        search_type: search
    });
})

router.get('/director/:name', function(req, res, next) {
    //SELECT * FROM movie WHERE movie_cast LIKE $1
    const db = new Database('backlog.db');
    const rows = db.prepare("SELECT * FROM movie WHERE movie.director LIKE ?").all('%'+req.params.name+'%')
    const rows2 = db.prepare("SELECT * FROM series WHERE series.idea LIKE ?").all('%'+req.params.name+'%')
    res.render('search', { name: req.params.name, list: rows, list2: rows2, list3: [], list4: [], search_type: "director"});
})


//From here on Lists
router.get('/createlist', function(req, res, next) {
    res.render('list-form', {});
})

router.post('/createlist', function(req, res, next) {
    const db = new Database('backlog.db');

    const name = req.body.name
    const description = req.body.description

    db.prepare("INSERT INTO lists (name, description) VALUES (?, ?)").run(name, description)

    res.redirect('/');
})

router.get('/list/:id', function(req, res, next) {
    const db = new Database('backlog.db');
    const rows = db.prepare("SELECT * FROM lists WHERE id = ?").get(req.params.id)

    const rows2 = db.prepare("SELECT lc.id, lc.type, m.name, m.year, m.status, m.genre " +
        "FROM list_content lc " +
        "JOIN movie m ON lc.media = m.id " +
        "WHERE lc.type = 'movie' AND lc.list = ?").all(rows.id)

    console.log(rows2);
    res.render('list-detail', { list: rows });
})

async function fileExists(path) {
    try {
        await access(path, constants.F_OK);
        return true;
    } catch {
        return false;
    }
}

module.exports = router;
