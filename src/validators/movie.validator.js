function validateMovie(movie) {
    if (!movie.name || movie.name.trim() === "") {
        throw new Error("Movie needs a name");
    }
}

module.exports = {
    validateMovie,
}
