const sqlite3 = require("sqlite3");
const express = require("express");
const router = express.Router();

router.get('/lists', function(req, res) {
    const db = new sqlite3.Database('backlog.db');
    var query = "SELECT id, name FROM lists";
    db.all(query, function(err, rows) {
        if(err) {
            res.status(500).json({ error: err });
        } else {
            res.json(rows);
        }
    });
});

router.post('/add', async (req, res) => {
    const db = new sqlite3.Database('backlog.db');

    const list = req.body.list;
    const media = req.body.media;
    const type = req.body.type;

    console.log(list);
    console.log(media);
    console.log(type);

    const sql = "INSERT INTO list_content (list, media, type)" +
        "VALUES (?, ?, ?)";
    db.run(sql, [parseInt(list), parseInt(media), type]);

    res.json({ success: true });
});

module.exports = router;
