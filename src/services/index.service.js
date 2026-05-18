const persistence = require("../persistence/index.db");
const moviePersistence = require("../persistence/movie.db");
const bookPersistence = require("../persistence/book.db");
const gamePersistence = require("../persistence/game.db");
const seriesPersistence = require("../persistence/series.db");

const utils = require("../utils/utils");
const path = require("path");
const {fileExists} = require("../utils/utils");

function getHomepageComponents(){
    return {
        recent_added: persistence.getFiveRecentAdded(),
        recent_finished: persistence.getFiveRecentFinished(),
        backlog_stats: persistence.getBacklogStats(),
        media_of_the_day: getMediaOfTheDay()
    }
}

function getMediaOfTheDay() {
    const time = new Date().toISOString().split("T")[0]

    const motd = persistence.getMediaOfTheDay(time)
    if(motd != null) {
        return motd;
    }

    let mediaId = 0;
    let media = 0;
    let route;

    const seed = Math.random();
    const category = Math.floor(seed * 4);
    switch (category) {
        case 0: //movie
            mediaId = Math.floor(seed * parseInt(moviePersistence.getMovieCount()));
            media = moviePersistence.getMovieById(mediaId);
            route = 'movie'
            break;
        case 1: //book
            mediaId = Math.floor(seed * parseInt(bookPersistence.getBookCount()));
            media = bookPersistence.getBookById(mediaId);
            route = 'book'
            break;
        case 2: //game
            mediaId = Math.floor(seed * parseInt(gamePersistence.getGameCount()));
            media = gamePersistence.getGameById(mediaId);
            route = 'game'
            break;
        case 3: //series
            mediaId = Math.floor(seed * parseInt(seriesPersistence.getSeriesCount()));
            media = seriesPersistence.getSeriesById(mediaId);
            route = 'series'
            break;
    }

    const m = {
        name: media.name,
        date: time,
        description: media.description,
        route: route,
        path: utils.cleanPath(media.name),
    }

    persistence.addMediaOfTheDay(m)
    return m;
}

function getBasicSearchQueryAll(search){
    return {
        movie: persistence.getGeneralGetResultMovie(search),
        series: persistence.getGeneralGetResultSeries(search),
        game: persistence.getGeneralGetResultGame(search),
        book: persistence.getGeneralGetResultBook(search),
    }
}

function getActorSearchQueryAll(search){
    return {
        movie: persistence.getActorGetResultMovie(search),
        series: persistence.getActorGetResultSeries(search),
        game: persistence.getActorGetResultGame(search),
        book: [],
    }
}

async function actorImageTest(search){
    const pth = path.join(__dirname, "../../public/images/actors/" + search.replaceAll(".", "") + ".jpg");
    if (await fileExists(pth)) {
        return "actor";
    }
    return "general"
}

module.exports = {
    getHomepageComponents,
    getMediaOfTheDay,
    getBasicSearchQueryAll,
    getActorSearchQueryAll,
    actorImageTest
}
