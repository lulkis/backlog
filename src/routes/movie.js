var express = require('express');
var router = express.Router();
const {db} = require("../utils/db.js");
const { getSettings } = require("../utils/settings");
const { cleanPath, daysToRelease } = require("../utils/utils");
const service = require("../services/movie.service");

router.get('/', function(req, res, next) {
    res.render('media-list', { title: 'Movies', route: 'movie' , list: service.getAllMovies()});
});

router.get('/add', function(req, res, next) {
    res.render('media-form', { title: 'Movies', route: 'movie', media: service.getEmptyMovie() });
});

router.post('/add', async function(req, res, next) {
    service.saveMovieImages(cleanPath(req.body.name), req.files.foo, req.files.foo2);
    service.createMovie(req.body)
    res.redirect('/movie')
})

router.get('/detail/:id', async function (req, res, next) {
    const data = service.getAllMovieInfoById(parseInt(req.params.id));
    console.log(data.finish)
    res.render('media', {
        media: data.movie,
        route: 'movie',
        finish: data.valuation,
        stream: data.stream,
        settings: getSettings(),
        days: data.days,
        inlist: data.lists
    });
});

router.get('/edit/:id', function(req, res, next) {
    res.render('media-form', { title: 'Movies', route: 'movie', media: service.getMovieById(parseInt(req.params.id)) });
});

router.post('/edit/:id', function(req, res, next) {
    service.saveMovieImages(cleanPath(req.body.name), req.files?.foo, req.files?.foo2);
    service.updateMovie(parseInt(req.params.id), req.body)
    res.redirect('/movie/detail/'+req.params.id);
});

router.get('/finish/:id', function(req, res, next) {
    res.render('media-finish', { route: 'movie', vals: service.getEmptyValuation(req.params.id) });
})

router.post('/finish/:id', function(req, res, next) {
    service.finishMovie(parseInt(req.params.id), req.body);
    res.redirect('/movie/detail/' + req.params.id);
})

router.get('/repeat/:id', function(req, res, next) {
    const id = req.params.id;
    service.seenMovieAgain(id)
    res.redirect('/movie/detail/' + id);
})

router.get('/editval/:id', function(req, res, next) {
    res.render('media-finish', { route: 'movie', vals: service.getMovieValuationById(req.body.id), id: req.body.id });
})

router.post('/editval/:id', function(req, res, next) {

    res.redirect('/movie/detail/' + req.params.id);
})

module.exports = router;
