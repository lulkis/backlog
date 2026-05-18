const {db} = require("../utils/db");

function getSeriesById(id) {
    try {
        return db.prepare("SELECT * FROM series WHERE id = ?").get(id)
    } catch (err) {
        console.log("Database Error: " + err.message);
    }
}

function getSeriesCount(){
    try {
        return db.prepare("SELECT COUNT(*) as count FROM series").get().count
    } catch (err) {
        console.log("Database Error: " + err.message);
    }
}

module.exports = {
    getSeriesById,
    getSeriesCount
}
