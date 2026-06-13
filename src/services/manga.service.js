const persistence = require("../persistence/manga.db");
const {saveCoverImage, daysToRelease, toDatabaseDate} = require("../utils/utils");


function getAllMangas() {
    return persistence.getAllMangas()
}

function getEmptyManga(){
    return { name: "", year: "", genre: "", country: "" , description: "", mangaka: "", length: "", publisher: "", header_space: 0};
}

function createManga(data){
    const manga = {
        name: data.name,
        year: Number(data.year),
        genre: data.genre,
        country: data.country,
        description: data.description,
        date_added: new Date().toISOString(),
        status: 'open',
        header_space: data.header_space,
        mangaka: data.mangaka,
        length: data.length,
        publisher: data.publisher,
        upcoming: toDatabaseDate(data.upcoming),
        owned: data.owned,
        year_end: data.year_end,
    }
    persistence.createManga(manga)
}

function saveMangaImage(name, cover) {
    if(cover){
        saveCoverImage(name, "manga", cover)
    }
}

function getAllMangaInfoById(id){
    const manga = persistence.getMangaById(id)
    return {
        manga: manga,
        valuation: persistence.getMangaValuationById(id),
        lists: persistence.getListsForMangaById(id),
        days: daysToRelease(manga.upcoming),
        progress: getCurrentProgress(id),
    }
}

function getMangaById(id){
    return persistence.getMangaById(id);
}

function getMangaValuationById(id){
    return persistence.getMangaValuationById(id);
}

function updateManga(id, data){
    const manga = {
        name: data.name,
        year: Number(data.year),
        genre: data.genre,
        country: data.country,
        description: data.description,
        mangaka: data.mangaka,
        length: data.length,
        publisher: data.publisher,
        header_space: data.header_space,
        upcoming: toDatabaseDate(data.upcoming),
        owned: data.owned,
        year_end: data.year_end,
    }
    persistence.updateManga(id, manga)
}

function startManga(id){
    persistence.startManga(id);
}

function getEmptyValuation(id){
    return {rating: "", valuation: "", like: false, id: id};
}

function readMangaAgain(id){
    persistence.readMangaAgain(id);
}

function finishedManga(id, data){
    const valuation = {
        id: id,
        date: new Date().toISOString(),
        rating: data.rating,
        valuation: data.valuation,
        like: data.like,
    }
    persistence.finishedManga(id, valuation)
}

function updateValuation(id, data){
    const valuation = {
        rating: data.rating,
        valuation: data.valuation,
        like: data.like,
    }
    persistence.updateValuation(id, valuation)
}

function addMangaProgress(data){
    const progress = {
        manga: data.manga,
        chapter: data.pages,
    }
    persistence.addMangaProgress(progress)
}

function getCurrentProgress(id){
    return persistence.getCurrentProgress(id);
}

module.exports = {
    getAllMangas,
    getEmptyManga,
    createManga,
    saveMangaImage,
    getAllMangaInfoById,
    getMangaById,
    updateManga,
    startManga,
    getMangaValuationById,
    getEmptyValuation,
    finishedManga,
    readMangaAgain,
    updateValuation,
    addMangaProgress,
    getCurrentProgress
}
