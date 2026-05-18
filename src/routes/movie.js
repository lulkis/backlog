var express = require('express');
var router = express.Router();
const { getSettings } = require("../utils/settings");
const { cleanPath } = require("../utils/utils");
const service = require("../services/movie.service");

router.get('/', function(req, res, next) {
    try {
        res.render('media-list', { title: 'Movies', route: 'movie' , list: service.getAllMovies()});
    } catch (err) {
        next(err);
    }
});

router.get('/add',  function(req, res, next) {
    try {
        res.render('media-form', { title: 'Movies', route: 'movie', media: service.getEmptyMovie() });
    } catch (err) {
        next(err);
    }
});

router.post('/add',  function(req, res, next) {
    try {
        service.saveMovieImages(cleanPath(req.body.name), req.files?.cover, req.files?.header);
        service.createMovie(req.body)
        res.redirect('/movie')
    } catch (err) {
        next(err);
    }
})

router.get('/detail/:id', async function (req, res, next) {
    try {
        const id = parseInt(req.params.id);
        const data = await service.getAllMovieInfoById(id);
        res.render('media', {
            media: data.movie,
            route: 'movie',
            finish: data.valuation,
            stream: data.stream,
            settings: getSettings(),
            days: data.days,
            inlist: data.lists
        });
    } catch (err) {
        next(err);
    }
});

router.get('/edit/:id', function(req, res, next) {
    try {
        const id = parseInt(req.params.id);
        res.render('media-form', { title: 'Movies', route: 'movie', media: service.getMovieById(id) });
    } catch (err) {
        next(err);
    }
});

router.post('/edit/:id', function(req, res, next) {
    try {
        const id = parseInt(req.params.id);
        service.saveMovieImages(cleanPath(req.body.name), req.files?.cover, req.files?.header);
        service.updateMovie(id, req.body)
        res.redirect('/movie/detail/'+id);
    } catch (err) {
        next(err);
    }
});

router.get('/finish/:id', function(req, res, next) {
    try {
        const id = parseInt(req.params.id);
        res.render('media-finish', { route: 'movie', vals: service.getEmptyValuation(id) });
    } catch (err) {
        next(err);
    }
})

router.post('/finish/:id', function(req, res, next) {
    try {
        const id = parseInt(req.params.id);
        service.finishMovie(id, req.body);
        res.redirect('/movie/detail/' + id);
    } catch (err) {
        next(err);
    }
})

router.get('/repeat/:id', function(req, res, next) {
    try {
        const id = parseInt(req.params.id);
        service.seenMovieAgain(id)
        res.redirect('/movie/detail/' + id);
    } catch (err) {
        next(err);
    }
})

router.get('/editval/:id', function(req, res, next) {
    try {
        const id = parseInt(req.params.id);
        res.render('media-finish', { route: 'movie', vals: service.getMovieValuationById(id), id: id });
    } catch (err) {
        next(err);
    }
})

router.post('/editval/:id', function(req, res, next) {
    try {
        const id = parseInt(req.params.id);
        service.updateValuation(id, req.body)
        res.redirect('/movie/detail/' + id);
    } catch (err) {
        next(err);
    }
})

module.exports = router;
