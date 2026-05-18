const {db} = require("../utils/db");

function getFiveRecentAdded() {
    try {
        return db.prepare("SELECT movie.id, movie.name, movie.added, 'movie' AS route FROM movie WHERE movie.status = 'open'\n" +
            "UNION\n" +
            "SELECT series.id, series.name, series.added, 'series' AS route FROM series WHERE series.status = 'open' OR series.status = 'started'\n" +
            "UNION\n" +
            "SELECT book.id, book.name, book.added, 'book' AS route FROM book WHERE book.status = 'open' OR book.status = 'started'\n" +
            "UNION\n" +
            "SELECT game.id, game.name, game.added, 'game' AS route FROM game WHERE game.status = 'open' OR game.status = 'started'\n" +
            "ORDER BY added DESC LIMIT 5").all();
    } catch (err) {
        console.log("Database Error: " + err.message);
    }
}

function getFiveRecentFinished() {
    try {
        return db.prepare("SELECT movie.name, movie.id, movie_finished.date, 'movie' AS route FROM movie\n" +
            "INNER JOIN movie_finished ON movie.id = movie_finished.id\n" +
            "UNION\n" +
            "SELECT series.name, series.id, series_finished.date, 'series' AS route FROM series\n" +
            "INNER JOIN series_finished ON series.id = series_finished.id\n" +
            "UNION\n" +
            "SELECT book.name, book.id, book_finished.date, 'book' AS route FROM book\n" +
            "INNER JOIN book_finished ON book.id = book_finished.id\n" +
            "UNION\n" +
            "SELECT game.name, game.id, game_finished.date, 'game' AS route FROM game\n" +
            "INNER JOIN game_finished ON game.id = game_finished.id\n" +
            "ORDER BY date DESC LIMIT 5").all()
    } catch (err) {
        console.log("Database Error: " + err.message);
    }
}

function getBacklogStats() {
    try {
        return db.prepare("SELECT status, COUNT(*) as count\n" +
            "FROM (\n" +
            "         SELECT status FROM movie\n" +
            "         UNION ALL\n" +
            "         SELECT status FROM series\n" +
            "         UNION ALL\n" +
            "         SELECT status FROM book\n" +
            "         UNION ALL\n" +
            "         SELECT status FROM game\n" +
            "     ) AS Alle_Daten\n" +
            "GROUP BY status;").all()
    } catch (err) {
        console.log("Database Error: " + err.message);
    }
}

function getMediaOfTheDay(date){
    try {
        return db.prepare("SELECT * FROM daily_media WHERE date = ?").get(date)
    } catch (err) {
        console.log("Database Error: " + err.message);
    }
}

function addMediaOfTheDay(motd){
    try {
        db.prepare("INSERT INTO daily_media (date, name, description, route, path)" +
            "VALUES (?, ?, ?, ?, ?)")
            .run(
                motd.date,
                motd.name,
                motd.description,
                motd.route,
                motd.path,
            )
    } catch (err) {
        console.log("Database Error: " + err.message);
    }
}

function getGeneralGetResultMovie(search){
    try {
        return db.prepare("SELECT id, name, year, status, director as maker, 'movie' AS route FROM movie " +
            "WHERE CONCAT(movie.name, movie.director, movie.cast, movie.studio, movie.score) " +
            "LIKE ? " +
            "ORDER BY movie.year DESC ")
            .all('%'+search+'%')
    } catch (err) {
        console.log("Database Error: " + err.message);
    }
}

function getGeneralGetResultSeries(search){
    try {
        return db.prepare("SELECT id, name, year, status, idea as maker, 'series' AS route FROM series " +
            "WHERE CONCAT(series.name, series.idea, series.cast, series.studio, series.score) " +
            "LIKE ? " +
            "ORDER BY series.year")
            .all('%'+search+'%')
    } catch (err) {
        console.log("Database Error: " + err.message);
    }
}

function getGeneralGetResultGame(search){
    try {
        return db.prepare("SELECT id, name, year, status, developer as maker, 'game' AS route FROM game " +
            "WHERE CONCAT(game.name, game.publisher, game.developer, game.score) " +
            "LIKE ? " +
            "ORDER BY game.year")
            .all('%'+search+'%')
    } catch (err) {
        console.log("Database Error: " + err.message);
    }
}

function getGeneralGetResultBook(search){
    try {
        return db.prepare("SELECT id, name, year, status, author as maker, 'book' AS route FROM book " +
            "WHERE CONCAT(book.name, book.author) " +
            "LIKE ? " +
            "ORDER BY book.year")
            .all('%'+search+'%')
    } catch (err) {
        console.log("Database Error: " + err.message);
    }
}


function getActorGetResultMovie(search){
    try {
        return db.prepare("SELECT id, name, year, status, director as maker, 'movie' AS route FROM movie " +
            "WHERE movie.cast LIKE ? ORDER BY movie.year DESC ")
            .all('%' + search + '%')
    } catch (err) {
        console.log("Database Error: " + err.message);
    }
}

function getActorGetResultSeries(search){
    try {
        return db.prepare("SELECT id, name, year, status, idea as maker, 'series' AS route FROM series " +
            "WHERE series.cast LIKE ? ORDER BY series.year")
            .all('%' + search + '%')
    } catch (err) {
        console.log("Database Error: " + err.message);
    }
}

function getActorGetResultGame(search){
    try {
        return db.prepare("SELECT id, name, year, status, developer as maker, 'game' AS route FROM game " +
            "WHERE game.cast LIKE ? ORDER BY game.year")
            .all('%' + search + '%')
    } catch (err) {
        console.log("Database Error: " + err.message);
    }
}


module.exports = {
    getFiveRecentAdded,
    getFiveRecentFinished,
    getBacklogStats,
    getMediaOfTheDay,
    addMediaOfTheDay,
    getGeneralGetResultMovie,
    getGeneralGetResultSeries,
    getGeneralGetResultGame,
    getGeneralGetResultBook,
    getActorGetResultMovie,
    getActorGetResultSeries,
    getActorGetResultGame
}
