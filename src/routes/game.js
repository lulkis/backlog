const express = require('express');
const {cleanPath} = require("../utils/utils");
const router = express.Router();
const service = require('../services/game.service')

router.get('/', function(req, res, next) {
    res.render('media-list', { title: 'Games', route: 'game', list: service.getAllGames()});
});

router.get('/add', function(req, res, next) {
    res.render('media-form', { title: 'Games', route: 'game' , media: service.getEmptyGame() });
});

router.post('/add', function(req, res, next) {
    service.createGame(req.body)
    service.saveGameImages(cleanPath(req.body.name), req.files?.cover, req.files?.header)
    res.redirect('/game')
})

router.get('/detail/:id', function(req, res, next) {
    const id = parseInt(req.params.id)
    const info = service.getFullGameInformationById(id)
    res.render('media', {
        media: info.game,
        route: 'game',
        finish: info.valuation,
        hltb: info.hltb,
        days: info.days,
        inlist: info.inlist,
    });
});

router.get('/edit/:id', function(req, res, next) {
    const id = parseInt(req.params.id)
    res.render('media-form', { title: 'Game', route: 'game', media: service.getGameById(id) });
});

router.post('/edit/:id', function(req, res, next) {
    const id = parseInt(req.params.id)
    service.saveGameImages(cleanPath(req.body.name), req.files?.cover, req.files?.header)
    service.updateGame(id, req.body)
    res.redirect('/game/detail/' + id);
});

router.get('/start/:id', function(req, res, next) {
    const id = parseInt(req.params.id);
    service.startGame(id)
    res.redirect('/game/detail/' + id);
})

router.get('/finish/:id', function(req, res, next) {
    res.render('media-finish', { route: 'game', vals: {rating: "", valuation: "", like: false, id: req.params.id}});
})

router.post('/finish/:id', function(req, res, next) {
    const id = parseInt(req.params.id);
    service.finishGame(id, req.body)
    res.redirect('/game/detail/' + id);
})

router.get('/repeat/:id', function(req, res, next) {
    const id = parseInt(req.params.id);
    service.playedGameAgain(id)
    res.redirect('/game/detail/' + id);
})

router.get('/editval/:id', function(req, res, next) {
    const id = parseInt(req.params.id);
    res.render('media-finish', { route: 'game', vals: service.getGameValuationById(id), id: id });
})

router.post('/editval/:id', function(req, res, next) {
    const id = parseInt(req.params.id);
    service.updateValuation(id, req.body)
    res.redirect('/game/detail/' + id);
})

module.exports = router;
