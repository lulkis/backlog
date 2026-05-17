const {db} = require("../db.js");
const express = require("express");
const router = express.Router();

router.get('/lists', function(req, res) {
    try {
        const thing = db.prepare("SELECT id, name FROM lists").all();
        res.json(thing);
    } catch (err) {
        console.log("Database Error: " + err.message);
    }
});

router.post('/add', async (req, res) => {
    const list = req.body.list;
    const media = req.body.media;
    const type = req.body.type;

    try {
        db.prepare("INSERT INTO list_content (list, media, type)" +
            "VALUES (?, ?, ?)").run(parseInt(list), parseInt(media), type)

        res.json({ success: true });
    } catch (err) {
        console.log("Database Error: " + err.message);
    }
});

router.post('/remove', async (req, res) => {
    const list = req.body.list;

    try {
        db.prepare("DELETE FROM list_content WHERE list = ?").run(parseInt(list))
        db.prepare("DELETE FROM lists WHERE id = ?").run(parseInt(list))

        res.json({ success: true });
    } catch (err) {
        console.log("Database Error: " + err.message);
    }
});

router.get('/remove/:list/:element', async (req, res) => {
    const list = req.params.list
    const element = req.params.element

    try {
        await db.prepare("DELETE FROM list_content WHERE list = ? AND media = ?").run(parseInt(list), parseInt(element))

        res.redirect("/list/" + list.toString());
    } catch (err) {
        console.log("Database Error: " + err.message);
    }
});

module.exports = router;
