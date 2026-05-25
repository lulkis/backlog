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

function getAllSeries(){
    try {
        return db.prepare("SELECT id, name, status FROM series ORDER BY name ASC").all()
    } catch (err) {
        console.log("Database Error: " + err.message);
    }
}

function createSeries(series){
    try {
        db.prepare("INSERT INTO series (name, year, year_end, genre, country, description, status, added, idea, studio, cast, episodes, header_space, score, upcoming, owned)" +
            "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
            .run(series.name,
                series.year,
                series.year_end,
                series.genre,
                series.country,
                series.description,
                series.status,
                series.date_added,
                series.idea,
                series.studio,
                series.cast,
                series.episodes,
                series.header_space,
                series.score,
                series.upcoming,
                series.owned)
    } catch (err) {
        console.log("Database Error: " + err.message);
    }
}

function getSeriesValuation(id){
    try {
        return db.prepare("SELECT * FROM series_finished WHERE id = ?").get(id);
    } catch (err) {
        console.log("Database Error: " + err.message);
    }
}

function getListsWithSeries(id){
    try {
        return db.prepare("SELECT l.id, l.name, l.color FROM lists l " +
            "JOIN list_content lc ON l.id = lc.list WHERE lc.type = 'series' AND lc.media=?").all(id)
    } catch (err) {
        console.log("Database Error: " + err.message);
    }
}

function newSeason(id){
    try {
        db.prepare("UPDATE series SET status = ? WHERE id = ?").run("open", id)
    } catch (err) {
        console.log("Database Error: " + err.message);
    }
}

function startSeries(id){
    try {
        db.prepare("UPDATE series SET status = ? WHERE id = ?").run("started", id)
    } catch (err) {
        console.log("Database Error: " + err.message);
    }
}

function finishGame(id, valuation){
    try {
        db.prepare("INSERT INTO series_finished (id, date, rating, valuation, like)" +
            "VALUES (?, ?, ?, ?, ?)").run(id, valuation.date, valuation.rating, valuation.valuation, valuation.like)
        db.prepare("UPDATE series SET status = ? WHERE id = ?").run("finished", id)
    } catch (err) {
        console.log("Database Error: " + err.message);
    }
}

function watchedSeriesAgain(id){
    try {
        db.prepare("UPDATE series_finished SET finishcount = finishcount + 1 WHERE id = ?").run("open", id)
    } catch (err) {
        console.log("Database Error: " + err.message);
    }
}

function updateValuation(id, valuation){
    try {
        db.prepare("Update series_finished SET " +
            "rating=?, valuation=?, like=?" +
            "WHERE id = ?").run(valuation.rating, valuation.valuation, valuation.like, id)
    } catch (err) {
        console.log("Database Error: " + err.message);
    }
}

function updateSeries(id, series){
    try {
        db.prepare("Update series SET " +
            "name=?, year=?, year_end=?, genre=?, country=?, description=?, idea=?, studio=?, cast=?, episodes=?, header_space=?, cancelled=?, score=?, upcoming=?, owned=?" +
            "WHERE id = ?")
            .run(series.name,
                series.year,
                series.year_end,
                series.genre,
                series.country,
                series.description,
                series.idea,
                series.studio,
                series.cast,
                series.episodes,
                series.header_space,
                series.cancelled,
                series.score,
                series.upcoming,
                series.owned,
                id)

    } catch (err) {
        console.log("Database Error: " + err.message);
    }
}

module.exports = {
    getSeriesById,
    getSeriesCount,
    getAllSeries,
    createSeries,
    getSeriesValuation,
    getListsWithSeries,
    newSeason,
    startSeries,
    finishGame,
    watchedSeriesAgain,
    updateValuation,
    updateSeries
}
