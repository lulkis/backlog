const {db} = require("../utils/db");

function getAllGames() {
    try {
        return db.prepare("SELECT id, name, status FROM game ORDER BY name ASC").all()
    } catch (err) {
        console.log("Database Error: " + err.message);
    }
}

function getGameById(id) {
    try {
        return db.prepare("SELECT * FROM game WHERE id = ?").get(id)
    } catch (err) {
        console.log("Database Error: " + err.message);
    }
}

function getGameCount(){
    try {
        return db.prepare("SELECT COUNT(*) as count FROM game").get().count
    } catch (err) {
        console.log("Database Error: " + err.message);
    }
}

module.exports = {
    getAllGames,
    getGameById,
    getGameCount
}
