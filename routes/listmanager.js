const Database = require('better-sqlite3');
const express = require("express");
const router = express.Router();

router.get('/lists', function(req, res) {
    const db = new Database('./backlog.db');
    const thing = db.prepare("SELECT id, name FROM lists").all();
    res.json(thing);
});

router.post('/add', async (req, res) => {
    const db = new Database('./backlog.db');

    const list = req.body.list;
    const media = req.body.media;
    const type = req.body.type;

    console.log(list);
    console.log(media);
    console.log(type);

    db.prepare("INSERT INTO list_content (list, media, type)" +
        "VALUES (?, ?, ?)").run(parseInt(list), parseInt(media), type)

    res.json({ success: true });
});

router.post('/remove', async (req, res) => {
    const db = new Database('./backlog.db');

    const list = req.body.list;

    db.prepare("DELETE FROM list_content WHERE list = ?").run(parseInt(list))
    db.prepare("DELETE FROM lists WHERE id = ?").run(parseInt(list))

    res.json({ success: true });
});

module.exports = router;
