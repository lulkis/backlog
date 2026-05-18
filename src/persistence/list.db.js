const {db} = require("../utils/db");

function createList(list){
    try {
        db.prepare("INSERT INTO lists (name, description, color) VALUES (?, ?, ?)")
            .run(list.name,
                list.description,
                '#' + list.color
            )
    } catch (err) {
        console.log("Database Error: " + err.message);
    }
}

function getListDetailById(id){
    try {
        return db.prepare("SELECT * FROM lists WHERE id = ?").get(id)
    } catch (err) {
        console.log("Database Error: " + err.message);
    }
}

function getListContentById(id){
    try {
        return db.prepare("SELECT lc.id, lc.type, m.id, m.name, m.year, m.status, m.genre " +
            "FROM list_content lc " +
            "JOIN movie m ON lc.media = m.id " +
            "WHERE lc.type = 'movie' AND lc.list = ?" +

            "UNION ALL " +

            "SELECT lc.id, lc.type, g.id, g.name, g.year, g.status, g.genre\n" +
            "FROM list_content lc\n" +
            "JOIN game g ON lc.media = g.id\n" +
            "WHERE lc.type = 'game' AND lc.list = ?" +

            "UNION ALL " +

            "SELECT lc.id, lc.type, b.id, b.name, b.year, b.status, b.genre\n" +
            "FROM list_content lc\n" +
            "JOIN book b ON lc.media = b.id\n" +
            "WHERE lc.type = 'book' AND lc.list = ?" +

            "UNION ALL " +

            "SELECT lc.id, lc.type, s.id, s.name, s.year, s.status, s.genre\n" +
            "FROM list_content lc\n" +
            "JOIN series s ON lc.media = s.id\n" +
            "WHERE lc.type = 'series' AND lc.list = ?").all(id, id, id, id)
    } catch (err) {
        console.log("Database Error: " + err.message);
    }
}

function updateListDetails(list){
    try {
        db.prepare("UPDATE lists SET name=?, description=?, color=? WHERE id = ?")
            .run(list.name, list.description, '#' + list.color, list.id)
    } catch (err) {
        console.log("Database Error: " + err.message);
    }
}

function getAllLists(){
    try {
        return db.prepare("SELECT id, name, color FROM lists").all()
    } catch (err) {
        console.log("Database Error: " + err.message);
    }
}

function getAllLists_Minimum() {
    try {
        return db.prepare("SELECT id, name FROM lists").all();
    } catch (err) {
        console.log("Database Error: " + err.message);
    }
}

function insertMovieIntoList(list, media){
    try {
        db.prepare("INSERT INTO list_content (list, media, type)" +
            "VALUES (?, ?, ?)")
            .run(list,
                media.media,
                media.type)
    } catch (err) {
        console.log("Database Error: " + err.message);
    }
}

function deleteList(id){
    try {
        db.prepare("DELETE FROM list_content WHERE list = ?").run(id)
        db.prepare("DELETE FROM lists WHERE id = ?").run(id)
    } catch (err) {
        console.log("Database Error: " + err.message);
    }
}

function deleteMediaFromList(id, media){
    try {
        db.prepare("DELETE FROM list_content WHERE list = ? AND media = ?").run(id, media)
    } catch (err) {
        console.log("Database Error: " + err.message);
    }
}

module.exports = {
    createList,
    getListDetailById,
    getListContentById,
    updateListDetails,
    getAllLists,
    getAllLists_Minimum,
    insertMovieIntoList,
    deleteList,
    deleteMediaFromList
};
