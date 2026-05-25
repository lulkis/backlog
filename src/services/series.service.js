const persistence = require("../persistence/series.db");
const {saveCoverImage, daysToRelease, saveHeaderImage, toDatabaseDate} = require("../utils/utils");

function saveSeriesImages(name, cover, header) {
    if(cover){
        saveCoverImage(name, "series", cover)
    }

    if(header){
        saveHeaderImage(name, "series", header)
    }
}

function getAllSeries() {
    return persistence.getAllSeries()
}

function getEmptySeries(){
    return { name: "", year: "", year_end: "", genre: "", country: "" , description: "", idea: "", studio: "", cast: "", episodes: "" ,header_space: 0};
}

function createSeries(data){
    const series = {
        name: data.name,
        year: Number(data.year),
        year_end: Number(data.year_end),
        genre: data.genre,
        country: data.country,
        description: data.description,
        date_added: new Date().toISOString(),
        header_space: data.header_space,
        status: 'open',
        idea: data.idea,
        studio: data.studio,
        cast: data.cast,
        episodes: data.episodes,
        score: data.score,
        upcoming: toDatabaseDate(data.upcoming),
        owned: data.owned,
    }
    persistence.createSeries(series)
}

function getAllSeriesInformation(id){
    const series = persistence.getSeriesById(id)
    return {
        series: series,
        valuation: persistence.getSeriesValuation(id),
        days: daysToRelease(series.upcoming),
        inlist: persistence.getListsWithSeries(id)
    }
}

function getSeriesById(id){
    return persistence.getSeriesById(id)
}

function newSeason(id) {
    persistence.newSeason(id)
}

function startSeries(id){
    persistence.startSeries(id)
}

function finishGame(id, data){
    const valuation = {
        date: new Date().toISOString(),
        rating: data.rating,
        valuation: data.valuation,
        like: data.like,
    }
    persistence.finishGame(id, valuation)
}

function watchedSeriesAgain(id){
    persistence.watchedSeriesAgain(id)
}

function getSeriesValuationById(id){
    return persistence.getSeriesValuation(id)
}

function updateValuation(id, data){
    const valuation = {
        rating: data.rating,
        valuation: data.valuation,
        like: data.like,
    }
    persistence.updateValuation(id, valuation)
}

function updateSeries(id, data){
    const series = {
        name: data.name,
        year: Number(data.year),
        year_end: Number(data.year_end),
        genre: data.genre,
        country: data.country,
        description: data.description,
        header_space: data.header_space,
        idea: data.idea,
        studio: data.studio,
        cast: data.cast,
        episodes: data.episodes,
        score: data.score,
        upcoming: toDatabaseDate(data.upcoming),
        cancelled: parseInt(data.cancelled),
        owned: data.owned,
    }
    persistence.updateSeries(id, series)
}

function getEmptyValuation(id){
    return {rating: "", valuation: "", like: false, id: id}
}

module.exports = {
    saveSeriesImages,
    getAllSeries,
    getEmptySeries,
    createSeries,
    getAllSeriesInformation,
    getSeriesById,
    newSeason,
    startSeries,
    finishGame,
    watchedSeriesAgain,
    getSeriesValuationById,
    updateValuation,
    updateSeries,
    getEmptyValuation
}
