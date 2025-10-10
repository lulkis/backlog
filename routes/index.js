var express = require('express');
const sqlite3 = require("sqlite3");
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/search/:name', function(req, res, next) {
    //SELECT * FROM movie WHERE movie_cast LIKE $1
    const db = new sqlite3.Database('backlog.db');

    var query = "SELECT * FROM movie WHERE movie.cast LIKE ?";
    db.all(query,['%'+req.params.name+'%'], function (err, rows) {
        if(err){
            console.log(err);
        }else{
            var query = "SELECT * FROM series WHERE series.cast LIKE ?";
            db.all(query,['%'+req.params.name+'%'], function (err, rows2) {
                if(err){
                    console.log(err);
                }else{
                    res.render('search', { name: req.params.name, list: rows, list2: rows2 });
                }
            });
        }
    });
})

module.exports = router;