const {db,db2} = require("../utils/db");

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

function getGameValuationById(id){
    try {
        return db.prepare("SELECT * FROM game_finished WHERE id = ?").get(id);
    } catch (err) {
        console.log("Database Error: " + err.message);
    }
}

function getHLTBStatsForGame(name, year){
    try {
        return db2.prepare("SELECT * FROM games WHERE title = ? OR title = ?").get(name, name + '(' + year + ')')
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

function createGame(game) {
    try {
        db.prepare("INSERT INTO game (name, year, genre, country, description, status, added, developer, publisher, header_space, score, cast, upcoming, owned)" +
            "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
            .run(game.name,
                game.year,
                game.genre,
                game.country,
                game.description,
                game.status,
                game.date_added,
                game.developer,
                game.publisher,
                game.header_space,
                game.score,
                game.cast,
                game.upcoming,
                game.owned,)

    } catch (err) {
        console.log("Database Error: " + err.message);
    }
}

function getListsWithGame(id){
    try {
        return db.prepare("SELECT l.id, l.name, l.color FROM lists l " +
            "JOIN list_content lc ON l.id = lc.list WHERE lc.type = 'game' AND lc.media=?").all(id)
    } catch (err) {
        console.log("Database Error: " + err.message);
    }
}

function updateGame(id, game) {
    try {
        db.prepare("Update game SET " +
            "name=?, year=?, genre=?, country=?, description=?, developer=?, publisher=?, header_space=?, score=?, cast=?, upcoming=?, owned=?" +
            "WHERE id = ?")
            .run(game.name,
                game.year,
                game.genre,
                game.country,
                game.description,
                game.developer,
                game.publisher,
                game.header_space,
                game.score,
                game.cast,
                game.upcoming,
                game.owned,
                id)
    } catch (err) {
        console.log("Database Error: " + err.message);
    }
}

function playedGameAgain(id){
    try {
        db.prepare("UPDATE game_finished SET finishcount = finishcount + 1 WHERE id = ?").run(id);
    } catch (err) {
        console.log("Database Error: " + err.message);
    }
}

function finishGame(id, valuation) {
    try {
        db.prepare("INSERT INTO game_finished (id, date, rating, valuation, like)" +
            "VALUES (?, ?, ?, ?, ?)")
            .run(id,
                valuation.date, valuation.rating, valuation.valuation, valuation.like)

        db.prepare("UPDATE game SET status = ? WHERE id = ?").run("finished", id)
    } catch (err) {
        console.log("Database Error: " + err.message);
    }
}

function startGame(id) {
    try {
        db.prepare("UPDATE game SET status = ? WHERE id = ?").run("started", id)
    } catch (err) {
        console.log("Database Error: " + err.message);
    }
}

function updateValuation(id, valuation) {
    try {
        db.prepare("Update game_finished SET " +
            "rating=?, valuation=?, like=?" +
            "WHERE id = ?").run(valuation.rating, valuation.valuation, valuation.like, id)
    } catch (err) {
        console.log("Database Error: " + err.message);
    }
}

module.exports = {
    getAllGames,
    getGameById,
    getGameCount,
    createGame,
    getGameValuationById,
    getHLTBStatsForGame,
    getListsWithGame,
    updateGame,
    playedGameAgain,
    finishGame,
    startGame,
    updateValuation
}
