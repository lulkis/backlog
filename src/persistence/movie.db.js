const {db} = require("../utils/db");

function saveMovie(movie) {
    try {
        db.prepare("INSERT INTO movie (name, year, genre, country, description, status, added, studio, director, length, cast, header_space, score)" +
            "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
            .run(
                movie.name,
                movie.year,
                movie.genre,
                movie.country,
                movie.description,
                movie.status,
                movie.date_added,
                movie.studio,
                movie.director,
                movie.length,
                movie.cast,
                movie.header_space,
                movie.score
            )
    } catch (err) {
        console.log("Database Error: " + err.message);
    }
}

function getAllMovies() {
    try {
        return db.prepare("SELECT id, name, status FROM movie ORDER BY name ASC").all()
    } catch (err) {
        console.log("Database Error: " + err.message);
    }
}

function getMovieById(id){
    try {
        return db.prepare("SELECT * FROM movie WHERE movie.id = ?").get(id)
    } catch (err) {
        console.log("Database Error: " + err.message);
    }
}

function getMovieValuationById(id){
    try {
        return db.prepare("SELECT * FROM movie_finished WHERE id = ?").get(id)
    } catch (err) {
        console.log("Database Error: " + err.message);
    }
}

function getListInfoByMovieId(id){
    try {
        return db.prepare("SELECT l.id, l.name, l.color FROM lists l " +
            "JOIN list_content lc ON l.id = lc.list WHERE lc.type = 'movie' AND lc.media=?").all(id)
    } catch (err) {
        console.log("Database Error: " + err.message);
    }
}

function seenMovieAgain(id){
    try {
        db.prepare("UPDATE movie_finished SET finishcount = finishcount + 1 WHERE id = ?").run(id);
    } catch (err) {
        console.log("Database Error: " + err.message);
    }
}

function updateMovie(id, movie) {
    try {
        db.prepare("Update movie SET " +
            "name=?, year=?, genre=?, country=?, description=?, studio=?, director=?, length=?, cast=?, header_space=?, score=?, upcoming=?" +
            "WHERE id = ?")
            .run(movie.name,
                movie.year,
                movie.genre,
                movie.country,
                movie.description,
                movie.studio,
                movie.director,
                movie.length,
                movie.cast,
                movie.header_space,
                movie.score,
                movie.upcoming, id
            )
    } catch (err) {
        console.log("Database Error: " + err.message);
    }
}

function finishMovie(valuation){
    try {
        db.prepare("INSERT INTO movie_finished (id, date, rating, valuation, like, medium)" +
            "VALUES (?, ?, ?, ?, ?, ?)")
            .run(valuation.id, valuation.date, valuation.rating, valuation.valuation, valuation.like, valuation.medium)
        db.prepare("UPDATE movie SET status = ? WHERE id = ?").run("finished", valuation.id)
    } catch (err) {
        console.log("Database Error: " + err.message);
    }
}

function updateValuation(valuation){
    try {
        db.prepare("Update movie_finished SET " +
            "rating=?, valuation=?, like=?, medium=?" +
            "WHERE id = ?")
            .run(valuation.rating, valuation.valuation, valuation.like, valuation.medium, valuation.id)
    } catch (err) {
        console.log("Database Error: " + err.message);
    }
}

function getMovieCount(){
    try {
        return db.prepare("SELECT COUNT(*) as count FROM movie").get().count
    } catch (err) {
        console.log("Database Error: " + err.message);
    }
}

module.exports = {
    saveMovie,
    getAllMovies,
    getMovieById,
    getMovieValuationById,
    getListInfoByMovieId,
    seenMovieAgain,
    updateMovie,
    finishMovie,
    updateValuation,
    getMovieCount
};
