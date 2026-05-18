const persistence = require("../persistence/index.db");

function getHomepageComponents(){
    return {
        recent_added: persistence.getFiveRecentAdded(),
        recent_finished: persistence.getFiveRecentFinished(),
        backlog_stats: persistence.getBacklogStats()
    }
}

function getMediaOfTheDay() {
    const number = new Date().toISOString().slice(0, 10);
    console.log(number.replaceAll("-", ""))
}

module.exports = {
    getHomepageComponents,
    getMediaOfTheDay
}
