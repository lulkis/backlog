const express = require("express");
const router = express.Router();

const service = require("../services/list.service");

router.get('/lists', function(req, res) {
    res.json(service.getAllLists_Minimum());
});

router.post('/add', async (req, res) => {
    try {
        service.insertMovieIntoList(req.body);
        res.json({ success: true });
    } catch (err) {
        res.json({ success: false });
    }
});

router.post('/remove', async (req, res) => {
    try {
        service.deleteList(req.body);
        res.json({ success: true });
    } catch (err) {
        res.json({ success: false });
    }
});

router.get('/remove/:list/:element',  (req, res) => {
    try {
        service.deleteMediaFromList(req.body)
        res.redirect("/list/" + req.body.list.toString());
    } catch (err) {
        console.log("Database Error: " + err.message);
    }
});

module.exports = router;
