const persistence = require("../persistence/book.db");
const {saveCoverImage, daysToRelease} = require("../utils/utils");


function getAllBooks() {
    return persistence.getAllBooks()
}

function getEmptyBook(){
    return { name: "", year: "", genre: "", country: "" , description: "", author: "", length: "", publisher: "", illustrator: "" ,header_space: 0};
}

function createBook(data){
    const book = {
        name: data.name,
        year: Number(data.year),
        genre: data.genre,
        country: data.country,
        description: data.description,
        date_added: new Date().toISOString(),
        status: 'open',
        header_space: data.header_space,
        author: data.author,
        length: data.length,
        publisher: data.publisher,
        illustrator: data.illustrator,
        upcoming: data.upcoming,
    }
    persistence.createBook(book)
}

function saveBookImage(name, cover) {
    if(cover){
        saveCoverImage(name, "book", cover)
    }
}

function getAllBookInfoById(id){
    const book = persistence.getBookById(id)
    return {
        book: book,
        valuation: persistence.getBookValuationById(id),
        lists: persistence.getListsForBookById(id),
        days: daysToRelease(book.upcoming),
    }
}

function getBookById(id){
    return persistence.getBookById(id);
}

function getBookValuationById(id){
    return persistence.getBookValuationById(id);
}

function updateBook(id, data){
    const book = {
        name: data.name,
        year: Number(data.year),
        genre: data.genre,
        country: data.country,
        description: data.description,
        author: data.author,
        length: data.length,
        publisher: data.publisher,
        illustrator: data.illustrator,
        header_space: data.header_space,
        upcoming: data.upcoming,
    }
    persistence.updateBook(id, book)
}

function startBook(id){
    persistence.startBook(id);
}

function getEmptyValuation(id){
    return {rating: "", valuation: "", like: false, id: id};
}

function readBookAgain(id){
    persistence.readBookAgain(id);
}

function finishedBook(id, data){
    const valuation = {
        id: id,
        date: new Date().toISOString(),
        rating: data.rating,
        valuation: data.valuation,
        like: data.like,
    }
    persistence.finishedBook(id, valuation)
}

function updateValuation(id, data){
    const valuation = {
        rating: data.rating,
        valuation: data.valuation,
        like: data.like,
    }
    persistence.updateValuation(id, valuation)
}

module.exports = {
    getAllBooks,
    getEmptyBook,
    createBook,
    saveBookImage,
    getAllBookInfoById,
    getBookById,
    updateBook,
    startBook,
    getBookValuationById,
    getEmptyValuation,
    readBookAgain,
    finishedBook,
    updateValuation
}
