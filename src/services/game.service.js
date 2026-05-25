const persistence = require('../persistence/game.db');
const {saveCoverImage, saveHeaderImage, toDatabaseDate} = require("../utils/utils");
const { daysToRelease } = require('../utils/utils')

function getAllGames() {
    return persistence.getAllGames()
}

function getEmptyGame(){
    return { name: "", year: "", genre: "", country: "" , description: "", publisher: "", developer: "",header_space: 0}
}

function saveGameImages(name, cover, header) {
    if(cover){
        saveCoverImage(name, "game", cover)
    }

    if(header){
        saveHeaderImage(name, "game", header)
    }
}

function createGame(data) {
    const game = {
        name: data.name,
        year: Number(data.year),
        genre: data.genre,
        country: data.country,
        header_space: data.header_space,
        description: data.description,
        date_added: new Date().toISOString(),
        status: 'open',
        developer: data.developer,
        publisher: data.publisher,
        score: data.score,
        cast: data.cast,
        upcoming: toDatabaseDate(data.upcoming),
        owned: data.owned,
    }
    persistence.createGame(game)
}

function getFullGameInformationById(id){
    const game = persistence.getGameById(id)
    return {
        game: game,
        valuation: persistence.getGameValuationById(id),
        hltb: persistence.getHLTBStatsForGame(game.name, game.year),
        inlist: persistence.getListsWithGame(id),
        days: daysToRelease(game.upcoming)
    }
}

function getGameById(id){
    return persistence.getGameById(id)
}

function getGameValuationById(id){
    return persistence.getGameValuationById(id)
}

function updateGame(id, data){
    const game = {
        name: data.name,
        year: Number(data.year),
        genre: data.genre,
        country: data.country,
        description: data.description,
        developer: data.developer,
        publisher: data.publisher,
        header_space: data.header_space,
        score: data.score,
        cast: data.cast,
        upcoming: toDatabaseDate(data.upcoming),
        owned: data.owned,
    }
    persistence.updateGame(id, game)
}

function playedGameAgain(id) {
    persistence.playedGameAgain(id)
}

function finishGame(id, data) {
    const valuation = {
        date: new Date().toISOString(),
        rating: data.rating,
        valuation: data.valuation,
        like: data.like,
    }
    persistence.finishGame(id, valuation)
}

function startGame(id) {
    persistence.startGame(id)
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
    getAllGames,
    getEmptyGame,
    saveGameImages,
    createGame,
    getFullGameInformationById,
    getGameById,
    updateGame,
    playedGameAgain,
    finishGame,
    startGame,
    getGameValuationById,
    updateValuation
}
