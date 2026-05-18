const {db} = require("../utils/db");

function getAllBooks() {
    try {
        return db.prepare("SELECT id, name, status FROM book ORDER BY name ASC").all();
    } catch (err) {
        console.log("Database Error: " + err.message);
    }
}

function createBook(book) {
    try {
        db.prepare("INSERT INTO book (name, year, genre, country, description, status, added, author, length, publisher, illustrator, header_space, upcoming)" +
            "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
            .run(book.name,
                book.year,
                book.genre,
                book.country,
                book.description,
                book.status,
                book.date_added,
                book.author,
                book.length,
                book.publisher,
                book.illustrator,
                book.header_space,
                book.upcoming
            )
    } catch (err) {
        console.log("Database Error: " + err.message);
    }
}

function getBookById(id) {
    try {
        return db.prepare("SELECT * FROM book WHERE id = ?").get(id)
    } catch (err) {
        console.log("Database Error: " + err.message);
    }
}

function getBookValuationById(id) {
    try {
        return db.prepare("SELECT * FROM book_finished WHERE id = ?").get(id)
    } catch (err) {
        console.log("Database Error: " + err.message);
    }
}

function getListsForBookById(id) {
    try {
        return db.prepare("SELECT l.id, l.name, l.color FROM lists l " +
            "JOIN list_content lc ON l.id = lc.list WHERE lc.type = 'book' AND lc.media=?").all(id)
    } catch (err) {
        console.log("Database Error: " + err.message);
    }
}

function updateBook(id, book) {
    try {
        db.prepare("Update book SET " +
            "name=?, year=?, genre=?, country=?, description=?, author=?, length=?, publisher=?, illustrator=?, header_space=?, upcoming=?" +
            "WHERE id = ?")
            .run(book.name,
                book.year,
                book.genre,
                book.country,
                book.description,
                book.author,
                book.length,
                book.publisher,
                book.illustrator,
                book.header_space,
                book.upcoming,
                id)
    } catch (err) {
        console.log("Database Error: " + err.message);
    }
}

function startBook(id) {
    try {
        db.prepare("UPDATE book SET status = ? WHERE id = ?").run("started", id)

    } catch (err) {
        console.log("Database Error: " + err.message);
    }
}

function readBookAgain(id){
    try {
        db.prepare("UPDATE book_finished SET finishcount = finishcount + 1 WHERE id = ?").run(id)
    } catch (err) {
        console.log("Database Error: " + err.message);
    }
}

function finishedBook(id, valuation){
    try {
        db.prepare("INSERT INTO book_finished (id, date, rating, valuation, like)" +
            "VALUES (?, ?, ?, ?, ?)")
            .run(id, valuation.date, valuation.rating, valuation.valuation, valuation.like)
        db.prepare("UPDATE book SET status = ? WHERE id = ?").run("finished", id)
    } catch (err) {
        console.log("Database Error: " + err.message);
    }
}

function updateValuation(id, valuation){
    try {
        db.prepare("Update book_finished SET " +
            "rating=?, valuation=?, like=?" +
            "WHERE id = ?").run(valuation.rating, valuation.valuation, valuation.like, id)
    } catch (err) {
        console.log("Database Error: " + err.message);
    }
}

function getBookCount(){
    try {
        return db.prepare("SELECT COUNT(*) as count FROM book").get().count
    } catch (err) {
        console.log("Database Error: " + err.message);
    }
}

module.exports = {
    getAllBooks,
    createBook,
    getBookById,
    getBookValuationById,
    getListsForBookById,
    updateBook,
    startBook,
    readBookAgain,
    finishedBook,
    updateValuation,
    getBookCount
}
