function validateMovie(movie) {
    if (!movie.name || movie.name.trim() === "") {
        throw new Error("Movie needs a name");
    }
}

function validateMovieValidation(validation){
    if (!validation.rating || isNaN(validation.rating) || validation.rating <= 0 || validation.rating >= 10) {
        throw new Error("Rating has to be a Number from 1 to 10 ");
    }
}

module.exports = {
    validateMovie,
    validateMovieValidation
}
