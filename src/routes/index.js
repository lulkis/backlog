const express = require('express');
const {db} = require("../utils/db.js");
const router = express.Router();
const path = require("path");
const {getSettings, updateSetting} = require("../utils/settings");

const listService = require("../services/list.service");
const indexService = require("../services/index.service");

router.get('/', function(req, res, next) {
    try {
        const homepage = indexService.getHomepageComponents();
        res.render('index', { title: 'Backlog',
            recent: homepage.recent_added,
            finish: homepage.recent_finished,
            counts: homepage.backlog_stats,
            listy: listService.getAllLists()
        });
    } catch (err) {
        next(err);
    }
});

router.get('/get/:name', function(req, res, next) {
    try {
        const rows = db.prepare("SELECT id, name, year, status, director as maker, 'movie' AS route FROM movie " +
            "WHERE CONCAT(movie.name, movie.director, movie.cast, movie.studio, movie.score) " +
            "LIKE ? " +
            "ORDER BY movie.year DESC ")
            .all('%'+req.params.name+'%')

        const rows2 = db.prepare("SELECT id, name, year, status, idea as maker, 'series' AS route FROM series " +
            "WHERE CONCAT(series.name, series.idea, series.cast, series.studio, series.score) " +
            "LIKE ? " +
            "ORDER BY series.year")
            .all('%'+req.params.name+'%')

        const rows3 = db.prepare("SELECT id, name, year, status, developer as maker, 'game' AS route FROM game " +
            "WHERE CONCAT(game.name, game.publisher, game.developer, game.score) " +
            "LIKE ? " +
            "ORDER BY game.year")
            .all('%'+req.params.name+'%')

        const rows4 = db.prepare("SELECT id, name, year, status, author as maker, 'book' AS route FROM book " +
            "WHERE CONCAT(book.name, book.author) " +
            "LIKE ? " +
            "ORDER BY book.year")
            .all('%'+req.params.name+'%')

        const items = {
            movie: rows,
            series: rows2,
            game: rows3,
            book: rows4
        }

        res.render('search', { name: req.params.name,
            list: items, search_type: "general"});
    } catch (err) {
        console.log("Database Error: " + err.message);
        next(err);
    }
})

router.get('/search/:name', async function (req, res, next) {
    try {
        const rows = db.prepare("SELECT id, name, year, status, director as maker, 'movie' AS route FROM movie " +
            "WHERE movie.cast LIKE ? ORDER BY movie.year DESC ")
            .all('%' + req.params.name + '%')

        const rows2 = db.prepare("SELECT id, name, year, status, idea as maker, 'series' AS route FROM series " +
            "WHERE series.cast LIKE ? ORDER BY series.year")
            .all('%' + req.params.name + '%')

        const rows3 = db.prepare("SELECT id, name, year, status, developer as maker, 'game' AS route FROM game " +
            "WHERE game.cast LIKE ? ORDER BY game.year")
            .all('%' + req.params.name + '%')

        const items = {
            movie: rows,
            series: rows2,
            game: rows3,
            book: []
        }

        let search = "general"
        const pth = path.join(__dirname, "../../public/images/actors/" + req.params.name.replaceAll(".", "") + ".jpg");
        if (await fileExists(pth)) {
            search = "actor";
        }

        res.render('search', {
            name: req.params.name,
            list: items,
            search_type: search
        });
    } catch (err) {
        console.log("Database Error: " + err.message);
        next(err);
    }
})

router.get('/director/:name', function(req, res, next) {
    try {
        const rows = db.prepare("SELECT id, name, year, status, director as maker, 'movie' AS route FROM movie " +
            "WHERE movie.director LIKE ?").all('%'+req.params.name+'%')
        const rows2 = db.prepare("SELECT id, name, year, status, idea as maker, 'series' AS route FROM series " +
            "WHERE series.idea LIKE ?").all('%'+req.params.name+'%')

        const items = {
            movie: rows,
            series: rows2,
            game: [],
            book: []
        }

        res.render('search', { name: req.params.name, list: items, search_type: "director"});
    } catch (err) {
        console.log("Database Error: " + err.message);
        next(err);
    }
})


//From here on Lists
router.get('/createlist', function(req, res, next) {
    try {
        res.render('list-form', {list: {name: "", description: ""}});
    } catch (err) {
        next(err);
    }
})

router.post('/createlist', function(req, res, next) {
    try {
        listService.createList(req.body);
        res.redirect('/');
    } catch (err) {
        next(err);
    }
})

router.get('/editlist/:id', function(req, res, next) {
    try {
        const id = parseInt(req.params.id);
        res.render('list-form', {list: listService.getListDetailById(id)});
    } catch (err) {
        next(err);
    }
})

router.post('/editlist/:id', function(req, res, next) {
    try {
        const id = parseInt(req.params.id);
        listService.updateListDetails(id, req.body);
        res.redirect('/');
    } catch (err) {
        next(err);
    }
})

router.get('/list/:id', function(req, res, next) {
    try {
        const id = parseInt(req.params.id);
        const full_list = listService.getFullListById(id);
        res.render('list-detail', {
            list: full_list.detail,
            content: full_list.content,
        });
    } catch (err) {
        next(err);
    }
})

router.get('/settings', function(req, res, next) {
    res.render('settings', {settings: getSettings()});
})

router.post('/settings', function(req, res, next) {
    updateSetting("time_in_minutes", req.body.m_in_min === "on")
    updateSetting("streaming", req.body.streaming === "on")
    res.redirect("/");
})

module.exports = router;
