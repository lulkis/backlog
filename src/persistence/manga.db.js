const {db} = require("../utils/db");

function getAllMangas() {
    try {
        return db.prepare("SELECT id, name, status FROM manga ORDER BY name ASC").all();
    } catch (err) {
        console.log("Database Error: " + err.message);
    }
}

function createManga(manga) {
    try {
        db.prepare("INSERT INTO manga (name, year, genre, country, description, status, added, mangaka, length, publisher, header_space, upcoming, owned, year_end)" +
            "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
            .run(manga.name,
                manga.year,
                manga.genre,
                manga.country,
                manga.description,
                manga.status,
                manga.date_added,
                manga.mangaka,
                manga.length,
                manga.publisher,
                manga.header_space,
                manga.upcoming,
                manga.owned,
                manga.year_end,
            )
    } catch (err) {
        console.log("Database Error: " + err.message);
    }
}

function getMangaById(id) {
    try {
        return db.prepare("SELECT * FROM manga WHERE id = ?").get(id)
    } catch (err) {
        console.log("Database Error: " + err.message);
    }
}

function getMangaValuationById(id) {
    try {
        return db.prepare("SELECT * FROM manga_finished WHERE id = ?").get(id)
    } catch (err) {
        console.log("Database Error: " + err.message);
    }
}

function getListsForMangaById(id) {
    try {
        return db.prepare("SELECT l.id, l.name, l.color FROM lists l " +
            "JOIN list_content lc ON l.id = lc.list WHERE lc.type = 'manga' AND lc.media=?").all(id)
    } catch (err) {
        console.log("Database Error: " + err.message);
    }
}

function updateManga(id, manga) {
    try {
        db.prepare("Update manga SET " +
            "name=?, year=?, genre=?, country=?, description=?, mangaka=?, length=?, publisher=?, header_space=?, upcoming=?, owned=?, year_end=? " +
            "WHERE id = ?")
            .run(manga.name,
                manga.year,
                manga.genre,
                manga.country,
                manga.description,
                manga.mangaka,
                manga.length,
                manga.publisher,
                manga.header_space,
                manga.upcoming,
                manga.owned,
                manga.year_end,
                id)
    } catch (err) {
        console.log("Database Error: " + err.message);
    }
}

function startManga(id) {
    try {
        db.prepare("UPDATE manga SET status = ? WHERE id = ?").run("started", id)

    } catch (err) {
        console.log("Database Error: " + err.message);
    }
}

function readMangaAgain(id){
    try {
        db.prepare("UPDATE manga_finished SET finishcount = finishcount + 1 WHERE id = ?").run(id)
    } catch (err) {
        console.log("Database Error: " + err.message);
    }
}

function finishedManga(id, valuation){
    try {
        db.prepare("INSERT INTO manga_finished (id, date, rating, valuation, like)" +
            "VALUES (?, ?, ?, ?, ?)")
            .run(id, valuation.date, valuation.rating, valuation.valuation, valuation.like)
        db.prepare("UPDATE manga SET status = ? WHERE id = ?").run("finished", id)
    } catch (err) {
        console.log("Database Error: " + err.message);
    }
}

function updateValuation(id, valuation){
    try {
        db.prepare("Update manga_finished SET " +
            "rating=?, valuation=?, like=?" +
            "WHERE id = ?").run(valuation.rating, valuation.valuation, valuation.like, id)
    } catch (err) {
        console.log("Database Error: " + err.message);
    }
}

function getMangaCount(){
    try {
        return db.prepare("SELECT COUNT(*) as count FROM manga").get().count
    } catch (err) {
        console.log("Database Error: " + err.message);
    }
}

function addMangaProgress(progress){
    try {
        return db.prepare("" +
            "INSERT INTO manga_progress (mangaid, date, chapter) " +
            "VALUES (?, ?, ?)")
            .run(progress.manga, new Date().toISOString(), progress.chapter)
    } catch (err) {
        console.log("Database Error: " + err.message);
    }
}

function getCurrentProgress(id){
    try {
        const row = db.prepare(
            "SELECT chapter FROM manga_progress WHERE mangaid = ? ORDER BY date DESC LIMIT 1"
        ).get(id);

        return row ? row.chapter : 1;
    } catch (err) {
        console.log("Database Error: " + err.message);
    }
}

module.exports = {
    getAllMangas,
    createManga,
    getMangaById,
    getMangaValuationById,
    getListsForMangaById,
    updateManga,
    startManga,
    readMangaAgain,
    finishedManga,
    updateValuation,
    getMangaCount,
    addMangaProgress,
    getCurrentProgress
}
