const {db} = require("../utils/db");

function getAllGames() {
    try {
        return db.prepare("SELECT id, name, status FROM game ORDER BY name ASC").all()
    } catch (err) {
        console.log("Database Error: " + err.message);
    }
}

module.exports = {
    getAllGames
}
