const persistence = require('../persistence/movie.db.js');
const { getSettings } = require('../utils/settings');
const { daysToRelease, saveImage, saveCoverImage, saveHeaderImage} = require('../utils/utils');
const { validateMovie } = require('../validators/movie.validator')

function createMovie(data){
    const movie = {
        name: data.name,
        year:  Number(data.year),
        genre: data.genre,
        country: data.country,
        description: data.description,
        date_added: new Date().toISOString(),
        status: 'open',
        studio: data.studio,
        director: data.director,
        length: Number(data.length),
        cast: data.cast,
        header_space: parseFloat(data.header_space),
        score: data.score,
    }
    validateMovie(movie);
    persistence.saveMovie(movie);
}

function getAllMovies(){
    return persistence.getAllMovies();
}

function getEmptyMovie(){
    return { name: "", year: "", genre: "", country: "" , description: "", studio: "", director: "", length: "", cast: "", header_space: 0 };
}

async function getAllMovieInfoById(id){
    const movie = persistence.getMovieById(id);

    const settings = getSettings();
    let streaming = [];
    if(settings["streaming"]) {
        streaming = await getStreamingInfo(movie.name)
    }

    return {
        movie: movie,
        valuation: persistence.getMovieValuationById(id),
        lists: persistence.getListInfoByMovieId(id),
        streaming_info: streaming,
        days: daysToRelease(movie.upcoming),
    }
}

function getMovieById(id){
    return persistence.getMovieById(id);
}

function getMovieValuationById(id){
    return persistence.getMovieValuationById(id);
}

function seenMovieAgain(id){
    persistence.seenMovieAgain(id);
}

function getEmptyValuation(id) {
    return {rating: "", valuation: "", like: false, id: id, medium: 'streaming'}
}

function saveMovieImages(name, cover, header) {
    if(cover){
        saveCoverImage(name, "movie", cover)
    }

    if(header){
        saveHeaderImage(name, "movie", header)
    }
}

function updateMovie(id, data){
    console.log(data);
    const movie = {
        name: data.name,
        year: Number(data.year),
        genre: data.genre,
        country: data.country,
        description: data.description,
        studio: data.studio,
        director: data.director,
        length: data.length,
        cast: data.cast,
        header_space: data.header_space,
        score: data.score,
        upcoming: data.upcoming,
    }

    persistence.updateMovie(id, movie)
}

function finishMovie(id, data){
    const valuation = {
        id: id,
        date: new Date().toISOString(),
        rating: data.rating,
        valuation: data.valuation,
        like: data.like,
        medium: data.medium
    }
    persistence.finishMovie(valuation)
}

function updateValuation(id, data){
    const valuation = {
        id: id,
        rating: data.rating,
        valuation: data.valuation,
        like: data.like,
        medium: data.medium
    }
    persistence.updateValuation(valuation)
}

//Private Functions
async function getStreamingInfo(name){
    let streaming_info = [];
    let movieId = null;
    try {
        const API_KEY = process.env.API_KEY;
        const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(name)}&language=de-DE`;
        const searchRes = await fetch(searchUrl);
        const searchData = await searchRes.json();

        movieId = searchData.results[0].id;

        const providersUrl = `https://api.themoviedb.org/3/movie/${movieId}/watch/providers?api_key=${API_KEY}`;
        const provRes = await fetch(providersUrl);
        const provData = await provRes.json();
        const germany = provData.results.DE;

        if (germany) {
            streaming_info = germany.flatrate;
        }
    } catch (err) {
        console.log("Streaming API Fehler:", err.message);
    }

    return streaming_info;
}

module.exports = {
    createMovie,
    getAllMovies,
    getEmptyMovie,
    getAllMovieInfoById,
    getMovieById,
    seenMovieAgain,
    getMovieValuationById,
    getEmptyValuation,
    saveMovieImages,
    updateMovie,
    finishMovie,
    updateValuation
};
