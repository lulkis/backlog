var express = require('express');
const {cleanPath} = require("../utils/utils.js");
var router = express.Router();

const service = require("../services/book.service");

router.get('/', function(req, res, next) {
    res.render('media-list', { title: 'Books', route: 'book', list: service.getAllBooks() });
});

router.get('/add', function(req, res, next) {
    res.render('media-form', { title: 'Books', route: 'book' , media: service.getEmptyBook() });
});

router.post('/add', function(req, res, next) {
    const clean_name = cleanPath(req.body.name);
    service.createBook(req.body)
    service.saveBookImage(clean_name, req.files?.foo)
    res.redirect('/book')
})

router.get('/detail/:id', function(req, res, next) {
    const id = parseInt(req.params.id);
    const full_details = service.getAllBookInfoById(id);
    res.render('media', {
        media: full_details.book,
        route: 'book',
        finish: full_details.valuation,
        days: full_details.days,
        inlist: full_details.lists,
    });
});

router.get('/edit/:id', function(req, res, next) {
    const id = parseInt(req.params.id);
    res.render('media-form', { title: 'Book', route: 'book', media: service.getBookById(id) });
});

router.post('/edit/:id', function(req, res, next) {
    const id = parseInt(req.params.id);
    service.saveBookImage(cleanPath(req.body.name), req.files?.foo)
    service.updateBook(id, req.body)
    res.redirect('/book/detail/' + id);
});

router.get('/start/:id', function(req, res, next) {
    const id = parseInt(req.params.id);
    service.startBook(id);
    res.redirect('/book/detail/' + id);
})

router.get('/finish/:id', function(req, res, next) {
    res.render('media-finish', { route: 'book', vals: service.getEmptyValuation(parseInt(req.params.id)) });
})

router.post('/finish/:id', function(req, res, next) {
    const id = parseInt(req.params.id);
    service.finishedBook(id, req.body)
    res.redirect('/book/detail/' + id);
})

router.get('/repeat/:id', function(req, res, next) {
    const id = parseInt(req.params.id);
    service.readBookAgain(id);
    res.redirect('/book/detail/' + id);
})

router.get('/editval/:id', function(req, res, next) {
    const id = parseInt(req.params.id);
    res.render('media-finish', { route: 'book', vals: service.getBookValuationById(id), id: id });
})

router.post('/editval/:id', function(req, res, next) {
    const id = parseInt(req.params.id);
    service.updateValuation(id, req.body)
    res.redirect('/book/detail/' + req.params.id);
})

module.exports = router;
