const persistence = require('../persistence/game.db');

function getAllGames() {
    return persistence.getAllGames()
}

module.exports = {
    getAllGames
}
