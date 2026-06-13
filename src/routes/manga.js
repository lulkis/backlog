const express = require('express');
const {cleanPath} = require("../utils/utils.js");
const router = express.Router();

const service = require("../services/manga.service");

router.get('/', function(req, res, next) {
    res.render('media-list', { title: 'Mangas', route: 'manga', list: service.getAllMangas() });
});

router.get('/add', function(req, res, next) {
    res.render('media-form', { title: 'Manga', route: 'manga' , media: service.getEmptyManga() });
});

router.post('/add', function(req, res, next) {
    const clean_name = cleanPath(req.body.name);
    service.createManga(req.body)
    service.saveMangaImage(clean_name, req.files?.cover)
    res.redirect('/manga')
})

router.get('/detail/:id', function(req, res, next) {
    const id = parseInt(req.params.id);
    const full_details = service.getAllMangaInfoById(id);
    console.log(full_details.progress);
    res.render('media', {
        media: full_details.manga,
        route: 'manga',
        finish: full_details.valuation,
        days: full_details.days,
        inlist: full_details.lists,
        progress: full_details.progress,
    });
});

router.get('/edit/:id', function(req, res, next) {
    const id = parseInt(req.params.id);
    res.render('media-form', { title: 'Manga', route: 'manga', media: service.getMangaById(id) });
});

router.post('/edit/:id', function(req, res, next) {
    const id = parseInt(req.params.id);
    service.saveMangaImage(cleanPath(req.body.name), req.files?.cover)
    service.updateManga(id, req.body)
    res.redirect('/manga/detail/' + id);
});

router.get('/start/:id', function(req, res, next) {
    const id = parseInt(req.params.id);
    service.startManga(id);
    res.redirect('/manga/detail/' + id);
})

router.get('/finish/:id', function(req, res, next) {
    res.render('media-finish', { route: 'manga', vals: service.getEmptyValuation(parseInt(req.params.id)) });
})

router.post('/finish/:id', function(req, res, next) {
    const id = parseInt(req.params.id);
    service.finishedManga(id, req.body)
    res.redirect('/manga/detail/' + id);
})

router.get('/repeat/:id', function(req, res, next) {
    const id = parseInt(req.params.id);
    service.readMangaAgain(id);
    res.redirect('/manga/detail/' + id);
})

router.get('/editval/:id', function(req, res, next) {
    const id = parseInt(req.params.id);
    res.render('media-finish', { route: 'manga', vals: service.getMangaValuationById(id), id: id });
})

router.post('/editval/:id', function(req, res, next) {
    const id = parseInt(req.params.id);
    service.updateValuation(id, req.body)
    res.redirect('/manga/detail/' + req.params.id);
})

router.get('/progress/:id/:pages', function(req, res, next) {
    const id = parseInt(req.params.id);
    const pages = parseInt(req.params.pages);

    const data = {
        manga: id,
        pages: pages,
    }
    service.addMangaProgress(data)
    res.redirect('/manga/detail/' + id);
})

module.exports = router;

