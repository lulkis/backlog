const express = require('express');
const router = express.Router();
const {cleanPath} = require("../utils/utils");

const service = require("../services/series.service");

router.get('/', function(req, res, next) {
    res.render('media-list', { title: 'Series', route: 'series', list: service.getAllSeries()});
});

router.get('/add', function(req, res, next) {
    res.render('media-form', { title: 'Series', route: 'series' , media: service.getEmptySeries() });
});

router.post('/add', function(req, res, next) {
    service.createSeries(req.body)
    service.saveSeriesImages(cleanPath(req.body.name), req.files?.cover, req.files?.header)
    res.redirect('/series')
})

router.get('/detail/:id', function(req, res, next) {
    const id = parseInt(req.params.id);
    const info = service.getAllSeriesInformation(id);
    res.render('media', {
        media: info.series,
        route: 'series',
        finish: info.valuation,
        days: info.days,
        inlist: info.inlist
    });
});

router.get('/edit/:id', function(req, res, next) {
    const id = parseInt(req.params.id);
    res.render('media-form', { title: 'Series', route: 'series', media: service.getSeriesById(id) });
});

router.post('/edit/:id', function(req, res, next) {
    const id = parseInt(req.params.id);
    service.saveSeriesImages(cleanPath(req.body.name), req.files?.cover, req.files?.header)
    service.updateSeries(id, req.body)
    res.redirect('/series/detail/' + id);
});

router.get('/start/:id', function(req, res, next) {
    const id = req.params.id;
    service.startSeries(id)
    res.redirect('/series/detail/' + id);
})

router.get('/finish/:id', function(req, res, next) {
    const id = parseInt(req.params.id);
    res.render('media-finish', { route: 'series', vals: service.getEmptyValuation(id), id: id });
})

router.post('/finish/:id', function(req, res, next) {
    const id = parseInt(req.params.id);
    service.finishGame(id, req.body)
    res.redirect('/series/detail/' + id);
})

router.get('/new/:id', function(req, res, next) {
    const id = parseInt(req.params.id);
    service.newSeason(id)
    res.redirect('/series/detail/' + id);
})

router.get('/repeat/:id', function(req, res, next) {
    const id = parseInt(req.params.id);
    service.watchedSeriesAgain(id)
    res.redirect('/series/detail/' + id);
})

router.get('/editval/:id', function(req, res, next) {
    const id = parseInt(req.params.id);
    res.render('media-finish', { route: 'series', vals: service.getSeriesValuationById(id), id: id });
})

router.post('/editval/:id', function(req, res, next) {
    const id = parseInt(req.params.id);
    service.updateValuation(id, req.body)
    res.redirect('/series/detail/' + id);
})

module.exports = router;
