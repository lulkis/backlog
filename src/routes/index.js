const express = require('express');
const router = express.Router();

const listService = require("../services/list.service");
const indexService = require("../services/index.service");
const settingsService = require("../services/settings.service");

router.get('/', function(req, res, next) {
    try {
        const homepage = indexService.getHomepageComponents();
        indexService.getMediaOfTheDay()
        res.render('index', { title: 'Backlog',
            recent: homepage.recent_added,
            finish: homepage.recent_finished,
            counts: homepage.backlog_stats,
            listy: listService.getAllLists(),
            motd: homepage.media_of_the_day,
            next: homepage.next_upcoming,
        });
    } catch (err) {
        next(err);
    }
});

router.get('/get/:name', function(req, res, next) {
    res.render('search', { name: req.params.name,
        list: indexService.getBasicSearchQueryAll(req.params.name),
        search_type: "general"
    });
})

router.get('/search/:name', async function (req, res, next) {
    const items = indexService.getActorSearchQueryAll(req.params.name);
    res.render('search', {
        name: req.params.name,
        list: items,
        search_type: await indexService.actorImageTest(req.params.name)
    });
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
    res.render('settings', {settings: settingsService.getSettings()});
})

router.post('/settings', function(req, res, next) {
    settingsService.getSettingById(req.body)
    res.redirect("/");
})

module.exports = router;
